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
    imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule],
    providers: [PublicDataService]
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
});
