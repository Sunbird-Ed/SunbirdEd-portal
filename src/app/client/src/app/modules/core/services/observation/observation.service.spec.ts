import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { ObservationService } from './observation.service';

describe('ObservationService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ObservationService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([ObservationService], (service: ObservationService) => {
    expect(service).toBeTruthy();
  }));
});

