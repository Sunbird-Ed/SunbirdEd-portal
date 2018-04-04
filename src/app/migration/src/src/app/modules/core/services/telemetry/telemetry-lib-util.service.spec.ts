import { TestBed, inject } from '@angular/core/testing';

import { TelemetryLibUtilService } from './telemetry-lib-util.service';

describe('TelemetryLibUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TelemetryLibUtilService]
    });
  });

  it('should be created', inject([TelemetryLibUtilService], (service: TelemetryLibUtilService) => {
    expect(service).toBeTruthy();
  }));
});
