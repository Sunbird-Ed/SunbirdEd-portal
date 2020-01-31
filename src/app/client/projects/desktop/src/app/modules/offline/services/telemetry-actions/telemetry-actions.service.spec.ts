import { TestBed } from '@angular/core/testing';

import { TelemetryActionsService } from './telemetry-actions.service';

describe('TelemetryActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TelemetryActionsService = TestBed.get(TelemetryActionsService);
    expect(service).toBeTruthy();
  });
});
