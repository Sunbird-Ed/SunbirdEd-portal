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

});
