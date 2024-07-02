import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResourceService } from '../../services';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import * as _ from 'lodash-es';
import { OfflineApplicationDownloadComponent } from './offline-application-download.component'

describe('OfflineApplicationDownloadComponent', () => {
  let component: OfflineApplicationDownloadComponent;
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      btn: {
        downloadAppForWindows64: 'Download for Windows (64-bit)',
        downloadAppForWindows32: 'Download for Windows (32-bit)',
        downloadAppForLinux: 'Download for Ubuntu'
      }
    }
  };
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn(),
    url: 'sample-urls'
  };
  const mockDeviceDetectorService: Partial<DeviceDetectorService> = {
    getDeviceInfo: jest.fn().mockReturnValue({
      browser: "chrome",
      browser_version: "1",
      os_version: "1",
      os: "mac",
      userAgent: "agent"
    })
  };
  beforeAll(() => {
    component = new OfflineApplicationDownloadComponent(
      mockResourceService as ResourceService,
      mockRouter as Router,
      mockDeviceDetectorService as DeviceDetectorService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create component of OfflineApplicationDownloadComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should create component and call ngOnInit method', () => {
    mockDeviceDetectorService.getDeviceInfo = jest.fn().mockReturnValue({
      browser: "chrome",
      browser_version: "1",
      os_version: "1",
      os: "mac",
      userAgent: "agent"
    }) as any;
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.recomanded_download).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows32);
    expect(component.otherOption1).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows64);
    expect(component.otherOption2).toEqual(mockResourceService.frmelmnts.btn.downloadAppForLinux);
    jest.clearAllMocks();
  });
  it('should create component and call ngOnInit method with win32', () => {
    mockDeviceDetectorService.getDeviceInfo = jest.fn().mockReturnValue({
      browser: "chrome",
      browser_version: "1",
      os_version: "1",
      os: "windows",
      userAgent: "win32"
    }) as any;
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.recomanded_download).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows32);
    expect(component.otherOption1).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows64);
    expect(component.otherOption2).toEqual(mockResourceService.frmelmnts.btn.downloadAppForLinux);
    jest.clearAllMocks();
  });
  it('should create component and call ngOnInit method with win64', () => {
    mockDeviceDetectorService.getDeviceInfo = jest.fn().mockReturnValue({
      browser: "chrome",
      browser_version: "1",
      os_version: "1",
      os: "windows",
      userAgent: "win64"
    }) as any;
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.recomanded_download).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows64);
    expect(component.otherOption1).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows32);
    expect(component.otherOption2).toEqual(mockResourceService.frmelmnts.btn.downloadAppForLinux);
    jest.clearAllMocks();
  });
  it('should create component and call ngOnInit method with linux', () => {
    mockDeviceDetectorService.getDeviceInfo = jest.fn().mockReturnValue({
      browser: "chrome",
      browser_version: "1",
      os_version: "1",
      os: "linux",
      userAgent: "agent"
    }) as any;
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.recomanded_download).toEqual(mockResourceService.frmelmnts.btn.downloadAppForLinux);
    expect(component.otherOption1).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows32);
    expect(component.otherOption2).toEqual(mockResourceService.frmelmnts.btn.downloadAppForWindows64);
    jest.clearAllMocks();
  });
  it('should call setTelemetryData method', () => {
    const obj = {
      context: { env: 'download-app' },
      edata: {
        type: 'view',
        pageid: 'offline-application-download',
        uri: 'sample-urls'
      }
    }
    component.setTelemetryData();
    expect(component.telemetryImpression).toEqual(obj);
  });
  it('should call downloadApp method for win32', () => {
    component.appDownloadUrl='windows_win32';
    component.instance='sunbird';
    component.desktopAppVersion='1.0.0';
    window.open = jest.fn();
    component.downloadApp(mockResourceService.frmelmnts.btn.downloadAppForWindows32);
    expect(window.open).toBeCalledWith('windows_win32/desktop/latest/sunbird_1.0.0_windows32bit.exe')
  });
  it('should call downloadApp method for win64', () => {
    component.appDownloadUrl='windows_win64';
    component.instance='sunbird';
    component.desktopAppVersion='1.0.0';
    window.open = jest.fn();
    component.downloadApp(mockResourceService.frmelmnts.btn.downloadAppForWindows64);
    expect(window.open).toBeCalledWith('windows_win64/desktop/latest/sunbird_1.0.0_windows64bit.exe')
  });
  it('should call downloadApp method for linux', () => {
    component.appDownloadUrl='ubuntu';
    component.instance='sunbird';
    component.desktopAppVersion='1.0.0';
    window.open = jest.fn();
    component.downloadApp(mockResourceService.frmelmnts.btn.downloadAppForLinux);
    expect(window.open).toBeCalledWith('ubuntu/desktop/latest/sunbird_1.0.0_linux64bit.deb')
  });
  describe("ngAfterViewInit", () => {
    it('should set ngAfterViewInit', () => {
      component.ngAfterViewInit();
      setTimeout(() => {
        expect(component.setTelemetryData).toBeCalled();
      }, 1)
    });
  });
});