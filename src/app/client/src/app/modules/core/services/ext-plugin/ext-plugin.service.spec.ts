import { TestBed, inject } from '@angular/core/testing';
import { ExtPluginService } from './ext-plugin.service';
import { DataService } from '../data/data.service';
import { ConfigService } from '@sunbird/shared';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('ExtPlugin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ExtPluginService, ConfigService, HttpClient, DataService]
    });
  });

  it('should be created', inject([ExtPluginService], (service: ExtPluginService) => {
    expect(service).toBeTruthy();
  }));

  it('should set config object and baseUrl', inject([ExtPluginService], (service: ExtPluginService) => {
    expect(service.config).toBeDefined();
    expect(service.config).toEqual(jasmine.any(Object));
    expect(service.baseUrl).toEqual('/plugin/');
  }));
});
