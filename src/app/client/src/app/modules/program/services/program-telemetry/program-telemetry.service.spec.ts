import { TestBed } from '@angular/core/testing';

import { ProgramTelemetryService } from './program-telemetry.service';

describe('ProgramTelemetryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramTelemetryService = TestBed.get(ProgramTelemetryService);
    expect(service).toBeTruthy();
  });
});
