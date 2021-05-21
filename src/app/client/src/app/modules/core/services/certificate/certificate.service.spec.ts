import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockResponseData } from './certificate.service.spec.data';
import { CertificateService } from './certificate.service';
import { of as observableOf, Observable } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('CertificateService', () => {
  configureTestSuite();
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

    it('should call preference read API', inject([],
      () => {
        const certificateService = TestBed.get(CertificateService);
        const learnerService = TestBed.get(LearnerService);
        const params = {'request': { orgId: 'sunbird', key: 'certRules' }};
        spyOn(learnerService, 'post').and.returnValue(observableOf(mockResponseData.preferenceReadAPiResponse));
        certificateService.fetchCertificatePreferences(params);
        const options = { url: 'org/v2/preferences/read', data: params };
        expect(learnerService.post).toHaveBeenCalledWith(options);
    }));

    it('should fetch batch details', inject([],
      () => {
        const certificateService = TestBed.get(CertificateService);
        const learnerService = TestBed.get(LearnerService);
        spyOn(learnerService, 'get').and.returnValue(observableOf(mockResponseData.batchDetailsApiResponse));
        certificateService.getBatchDetails('123456');
        const options = { url: 'course/v1/batch/read/123456' };
        expect(learnerService.get).toHaveBeenCalledWith(options);
    }));

});
