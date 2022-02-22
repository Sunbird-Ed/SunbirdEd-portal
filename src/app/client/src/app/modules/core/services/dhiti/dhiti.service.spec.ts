import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { DhitiService } from './dhiti.service';

describe('DhitiService', () => {
  let service: DhitiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DhitiService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([DhitiService], (service: DhitiService) => {
    expect(service).toBeTruthy();
  }));
});
