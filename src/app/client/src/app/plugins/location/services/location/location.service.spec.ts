import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF } from '@angular/common';

import { BrowserCacheTtlService } from '../../../../modules/shared/services/browser-cache-ttl/browser-cache-ttl.service';

import { ConfigService } from '../../../../modules/shared/services/config/config.service';
import { LocationService } from './location.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('LocationService', () => {
  configureTestSuite();

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [CacheService, ConfigService, BrowserCacheTtlService, { provide: APP_BASE_HREF, useValue: 'test' }],
    schemas: [NO_ERRORS_SCHEMA]
  }));

  it('should be created', () => {
    const service: LocationService = TestBed.get(LocationService);
    expect(service).toBeTruthy();
  });
});
