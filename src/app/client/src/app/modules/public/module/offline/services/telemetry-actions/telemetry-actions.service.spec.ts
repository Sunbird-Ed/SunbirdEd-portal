import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { of, throwError } from 'rxjs';
import { TelemetryActionsService } from './telemetry-actions.service';
import { telemetry } from './telemetry-actions.service.spec.data';

describe('TelemetryActionsService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule],
    providers: []
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
  it('should be call exportTelemetry', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of(telemetry.exportSuccess));
    service.exportTelemetry();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.EXPORT_TELEMETRY,
    }).subscribe(data => {
      expect(data).toEqual(telemetry.exportSuccess);
    });
  });
  it('should be call telemetryImportList', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service.publicDataService, 'post').and.returnValue(of(telemetry.importList));
    service.getTelemetryInfo();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.IMPORT_TELEMETRY_LIST,
    }).subscribe(data => {
      expect(data).toEqual(telemetry.importList);
    });
  });


  it('should be call reTryTelemetryImport and success', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of(telemetry.retrySuccess));
    service.reTryTelemetryImport(telemetry.retryData);
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMETRY_IMPORT_RETRY,
    }).subscribe(data => {
      expect(data).toEqual(telemetry.retrySuccess);
    });
  });
  it('should be call reTryTelemetryImport and error case', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of(telemetry.retrySuccess));
    service.reTryTelemetryImport({});
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMETRY_IMPORT_RETRY,
    }).subscribe(data => {
    }, error => {
      expect(error).toEqual(telemetry.retryError);
    });
  });
  it('should call getSyncTelemetryStatus', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    expect(service).toBeTruthy();
    spyOn(service['publicDataService'], 'get').and.returnValue(of(telemetry.syncStatusInfo));
    service.getSyncTelemetryStatus();
    expect(service.publicDataService.get).toHaveBeenCalled();
    service['publicDataService'].get({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO + '?syncConfig=true',
    }).subscribe(data => {
      expect(data).toEqual(telemetry.syncStatusInfo);
    });
  });
  it('should be call updateSyncStatus', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of(telemetry.updateSyncStatus));
    const requestBody = {
      'request': {
        'enable': true
      }
    };
    service.updateSyncStatus(requestBody);
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMTRY_CONFIG,
    }).subscribe(data => {
      expect(data).toEqual(telemetry.updateSyncStatus);
    });
  });
  it('should be call syncTelemtry and success', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(of(telemetry.syncTelemetry.success));
    const data  = {
      'request': {
        'type': ['TELEMETRY']
      }
    };
    service.syncTelemtry(data);
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMTRY_CONFIG,
    }).subscribe(response => {
      expect(response).toEqual(telemetry.syncTelemetry.success);
    });
  });
  it('should be call syncTelemtry and error', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(service['publicDataService'], 'post').and.returnValue(throwError(telemetry.syncTelemetry.error));
    const data  = {
      'request': {
        'type': ['TELEMETRY']
      }
    };
    service.syncTelemtry(data);
    expect(service.publicDataService.post).toHaveBeenCalled();
    service['publicDataService'].post({
      url: service.configService.urlConFig.URLS.OFFLINE.TELEMTRY_CONFIG,
    }).subscribe(response => {
    }, error => {
      expect(error).toEqual(telemetry.syncTelemetry.error);
    });
  });
});
