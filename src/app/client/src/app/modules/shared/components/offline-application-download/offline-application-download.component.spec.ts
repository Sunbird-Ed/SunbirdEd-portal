import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from 'ng2-cache-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService, InterpolatePipe } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineApplicationDownloadComponent } from './offline-application-download.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';

describe('OfflineApplicationDownloadComponent', () => {
  let component: OfflineApplicationDownloadComponent;
  let fixture: ComponentFixture<OfflineApplicationDownloadComponent>;
  let timerCallback;
  class RouterStub {
    navigate = jasmine.createSpy('url');
  }

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'explore', pageid: 'download-offline-app', type: 'view'
        }
      }
    }
  };
  const resourceServiceMockData = {
    instance: 'LOCAL',
    desktopAppVersion: '1.0.3',
    frmelmnts: {
      btn: {
        downloadAppForWindows32: 'Download for Windows (32-bit)',
        downloadAppForWindows64: 'Download for Windows (64-bit)',
        downloadAppForLinux: 'Download for Ubuntu'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [OfflineApplicationDownloadComponent, InterpolatePipe],
      providers: [ ConfigService, CacheService, BrowserCacheTtlService, DeviceDetectorService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceServiceMockData}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineApplicationDownloadComponent);
    component = fixture.componentInstance;
    timerCallback = jasmine.createSpy('timerCallback');
    jasmine.clock().install();
  });
  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should call download app on click of download button', () => {
    spyOn(component , 'downloadApp');
    const buttonEl = fixture.nativeElement.querySelector('button');
    buttonEl.click();
    expect(component.downloadApp).toHaveBeenCalledTimes(1);
  });

  it('should call setTelemetry method on ngAfterViewinit', () => {
   spyOn(component , 'setTelemetryData');
    setTimeout(()  => {
      component.ngAfterViewInit();
    }, 100);
    jasmine.clock().tick(101);
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should be initiate the component', () => {
    component.ngOnInit();
    expect(component.instance).toBe(component.resourceService.instance);
    // expect(component.recomanded_download).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows32);
    // expect(component.otherOption1).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows64);
    // expect(component.otherOption2).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForLinux);
  });
  it('should be initiate the component and see if windows 32bit os', () => {
    const deviceDetectorService = TestBed.get(DeviceDetectorService);
    spyOn(deviceDetectorService, 'getDeviceInfo').and.returnValue({userAgent: 'win32', os: 'windows'});
    component.ngOnInit();
    expect(component.recomanded_download).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows32);
    expect(component.otherOption1).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows64);
    expect(component.otherOption2).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForLinux);
  });
  it('should be initiate the component and see if windows 64bit os', () => {
    const deviceDetectorService = TestBed.get(DeviceDetectorService);
    spyOn(deviceDetectorService, 'getDeviceInfo').and.returnValue({userAgent: 'win64', os: 'windows'});
    component.ngOnInit();
    expect(component.recomanded_download).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows64);
    expect(component.otherOption1).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows32);
    expect(component.otherOption2).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForLinux);
  });
  it('should be initiate the component and see if linux os', () => {
    const deviceDetectorService = TestBed.get(DeviceDetectorService);
    spyOn(deviceDetectorService, 'getDeviceInfo').and.returnValue({userAgent: 'Linux x86_64', os: 'Linux'});
    component.ngOnInit();
    expect(component.recomanded_download).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForLinux);
    expect(component.otherOption1).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows32);
    expect(component.otherOption2).toBe(resourceServiceMockData.frmelmnts.btn.downloadAppForWindows64);
  });
  it('should download the desktop app for windows 32bit', () => {
    spyOn(window, 'open');
    component.appDownloadUrl = 'http://staging.ntp.net.in';
    component.desktopAppVersion = '1.0.3';
    component.instance = 'LOCAL';
    component.downloadApp('Download for Windows (32-bit)');
    expect(window.open).toHaveBeenCalledWith(component.appDownloadUrl +
       '/desktop/latest/' + component.instance + '_'
       + component.desktopAppVersion + '_windows32bit.exe');
  });
  it('should download the desktop app for windows 64bit', () => {
    spyOn(window, 'open');
    component.appDownloadUrl = 'http://staging.ntp.net.in';
    component.desktopAppVersion = '1.0.3';
    component.instance = 'LOCAL';
    component.downloadApp('Download for Windows (64-bit)');
    expect(window.open).toHaveBeenCalledWith(component.appDownloadUrl +
      '/desktop/latest/' + component.instance + '_'
      + component.desktopAppVersion + '_windows64bit.exe');
  });
  it('should download the desktop app for linux ', () => {
    spyOn(window, 'open');
    component.appDownloadUrl = 'http://staging.ntp.net.in';
    component.desktopAppVersion = '1.0.3';
    component.instance = 'LOCAL';
    component.downloadApp('Download for Ubuntu');
    expect(window.open).toHaveBeenCalledWith(component.appDownloadUrl + '/desktop/latest/'
    + component.instance + '_'
    + component.desktopAppVersion + '_linux64bit.deb');
  });
});
