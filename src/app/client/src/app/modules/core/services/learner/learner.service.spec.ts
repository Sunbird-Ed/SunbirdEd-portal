import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from './learner.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('LearnerService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LearnerService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([LearnerService], (service: LearnerService) => {
    expect(service).toBeTruthy();
  }));
});
