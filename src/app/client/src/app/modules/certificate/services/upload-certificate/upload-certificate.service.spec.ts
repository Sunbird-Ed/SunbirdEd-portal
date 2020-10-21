import { LearnerService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UploadCertificateService } from './upload-certificate.service';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';


describe('UploadCertificateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CoreModule, HttpClientTestingModule],
    providers: [
      ConfigService,
      LearnerService,
      CacheService,

    ]
  }));

  it('should be created', () => {
    const service: UploadCertificateService = TestBed.get(UploadCertificateService);
    expect(service).toBeTruthy();
  });
});
