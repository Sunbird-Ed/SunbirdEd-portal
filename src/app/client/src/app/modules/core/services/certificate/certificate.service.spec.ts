import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockResponseData } from './certificate.service.spec.data';
import { CertificateService } from './certificate.service';
import { of as observableOf, Observable } from 'rxjs';

describe('CertificateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ConfigService, LearnerService]
  }));

  it('should be created', () => {
    const service: CertificateService = TestBed.get(CertificateService);
    expect(service).toBeTruthy();
  });

  it('should call validateCertificate API', inject([],
    () => {
      const certificateService = TestBed.get(CertificateService);
      const learnerService = TestBed.get(LearnerService);
      const params = {'request': { 'certId': '123456', 'accessCode': 'QWERTY', 'verifySignature': 'true' }};
      spyOn(learnerService, 'post').and.returnValue(observableOf(mockResponseData.validateCertificateCodeData));
      certificateService.validateCertificate(params);
      const options = { url: 'certreg/v1/certs/validate', data: params };
      expect(learnerService.post).toHaveBeenCalledWith(options);
    }));
});
