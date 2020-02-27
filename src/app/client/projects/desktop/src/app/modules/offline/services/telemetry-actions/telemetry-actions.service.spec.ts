import { telemetry } from './telemetry-actions.service.spec.data';
import { of } from 'rxjs';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, PublicDataService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TestBed } from '@angular/core/testing';

import { TelemetryActionsService } from './telemetry-actions.service';

describe('TelemetryActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule]
  }));

  it('should be created', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    expect(service).toBeTruthy();
    spyOn(service['publicDataService'], 'get').and.returnValue(of(telemetry.info));

    service.getTelemetryInfo();
    expect(service.publicDataService.get).toHaveBeenCalled();
    service['publicDataService'].get({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO,
    }).subscribe(data => {
      expect(data).toEqual(telemetry.info);
    });
  });
  it('should be call telemetryImportList', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'get').and.returnValue(of(telemetry.importList));
    service.getTelemetryInfo();
    expect(service.publicDataService.get).toHaveBeenCalled();
    service['publicDataService'].get({
      url: service.configService.urlConFig.URLS.OFFLINE.IMPORT_TELEMETRY_LIST,
    }).subscribe(data => {
      expect(data).toEqual(telemetry.importList);
    });
  });
  it('should be call telemetrySyncStatus', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of('true'));
    service.telemetrySyncStatus('true');
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMETRY_SYNC_STATUS,
    }).subscribe(data => {
    });
  });
  it('should be call syncTelemtry', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of('true'));
    service.syncTelemtry(telemetry.info.result.response);
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMETRY_SYNC,
    }).subscribe(data => {
    });
  });
  it('should be call reyTryTelemetryImport', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of('true'));
    service.reyTryTelemetryImport(telemetry.info.result.response);
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMETRY_IMPORT_RETRY,
    }).subscribe(data => {
    });
  });
});
