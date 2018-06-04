import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from './learner.service';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LearnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TelemetryModule],
      providers: [LearnerService, ConfigService, TelemetryService]
    });
  });

  it('should be created', inject([LearnerService], (service: LearnerService) => {
    expect(service).toBeTruthy();
  }));
});
