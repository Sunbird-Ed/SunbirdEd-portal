import { TestBed } from '@angular/core/testing';

import { UploadCertificateService } from './upload-certificate.service';

describe('UploadCertificateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadCertificateService = TestBed.get(UploadCertificateService);
    expect(service).toBeTruthy();
  });
});
