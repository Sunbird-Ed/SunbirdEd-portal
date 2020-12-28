import { TestBed } from '@angular/core/testing';

import { DiscussionTelemetryService } from './discussion-telemetry.service';

describe('DiscussionTelemetryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscussionTelemetryService = TestBed.get(DiscussionTelemetryService);
    expect(service).toBeTruthy();
  });
});
