import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { KendraService } from './kendra.service';

describe('ObservationService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KendraService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([KendraService], (service: KendraService) => {
    expect(service).toBeTruthy();
  }));
});

