import { TestBed, inject } from '@angular/core/testing';
import { PublicDataService } from './public-data.service';
import { DataService } from './../data/data.service';
import { ConfigService } from '@sunbird/shared';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('PublicDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PublicDataService, ConfigService, HttpClient, DataService]
    });
  });

  it('should be created', inject([PublicDataService], (service: PublicDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should set config object and baseUrl', inject([PublicDataService], (service: PublicDataService) => {
    expect(service.config).toBeDefined();
    expect(service.config).toEqual(jasmine.any(Object));
    expect(service.baseUrl).toEqual('/api/');
  }));
});
