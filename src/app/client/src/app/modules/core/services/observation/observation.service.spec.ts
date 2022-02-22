import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { ObservationService } from './observation.service';
import { SuiModalModule, SuiModalService } from 'ng2-semantic-ui-v9';

describe('ObservationService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, SuiModalModule],
      providers: [ObservationService, ConfigService, HttpClient, SuiModalService]
    });
  });

  it('should be created', inject([ObservationService], (service: ObservationService) => {
    expect(service).toBeTruthy();
  }));
});

