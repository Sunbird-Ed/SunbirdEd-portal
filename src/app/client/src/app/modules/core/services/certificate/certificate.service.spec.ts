import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { DataService } from "..";
import { ConfigService } from '../../../shared/services/config/config.service';
import { CertificateService } from "./certificate.service";
import { LearnerService } from './../learner/learner.service';

describe('CertificateService', () => {
  let certificateService: CertificateService;
  const mockConfigService: Partial<ConfigService> = {
      urlConFig: {
          URLS: {
            USER: {
              VALIDATE_CERTIFICATE: 'certreg/v1/certs/validate'
            },
            TENANT_PREFERENCE:{
              READ: 'org/v2/preferences/read'
            },
            BATCH:{
              GET_DETAILS: 'course/v1/batch/read'
            }
          }
      }
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn().mockImplementation(() => { })
  };
  beforeAll(() => {
    certificateService = new CertificateService(
      mockLearnerService as LearnerService,
      mockConfigService as ConfigService
    );
  });

  beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
  });

  it('should create a instance of certificateService', () => {
      expect(certificateService).toBeTruthy();
  });

  describe('should validate certificate', () => {
    const data = {
      certificateId: '123QWE'
    }
    it('should call the validateCertificate method with data object', (done) => {
      jest.spyOn(certificateService.learnerService, 'post').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      certificateService.validateCertificate(data).subscribe(() => {
        done();
      });
      const obj = {
        url : mockConfigService.urlConFig.URLS.USER.VALIDATE_CERTIFICATE,
        data: data
      }
      expect(certificateService.learnerService.post).toHaveBeenCalledWith(obj);
    });

    it('should call the validateCertificate method with data object and should throw error', () => {
      // arrange
      jest.spyOn(certificateService.learnerService, 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      certificateService.validateCertificate(data).subscribe(() => {
      });
      const obj = {
        url : mockConfigService.urlConFig.URLS.USER.VALIDATE_CERTIFICATE,
        data: data
      }
      expect(certificateService.learnerService.post).toHaveBeenCalledWith(obj);
      expect(certificateService.learnerService.post).toHaveBeenCalled();
    });
  });

  describe('should fetch certificate preferences', () => {
    const data = {
      certificateId: '123QWE'
    }
    it('should call the fetchCertificatePreferences method with data object', (done) => {
      jest.spyOn(certificateService.learnerService, 'post').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      certificateService.fetchCertificatePreferences(data).subscribe(() => {
        done();
      });
      const obj = {
        url : mockConfigService.urlConFig.URLS.TENANT_PREFERENCE.READ,
        data: data
      }
      expect(certificateService.learnerService.post).toHaveBeenCalledWith(obj);
    });

    it('should call the validateCertificate method with data object and should throw error', () => {
      // arrange
      jest.spyOn(certificateService.learnerService, 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      certificateService.fetchCertificatePreferences(data).subscribe(() => {
      });
      const obj = {
        url : mockConfigService.urlConFig.URLS.TENANT_PREFERENCE.READ,
        data: data
      }
      expect(certificateService.learnerService.post).toHaveBeenCalledWith(obj);
      expect(certificateService.learnerService.post).toHaveBeenCalled();
    });
  });

  describe('should fetch batch details', () => {
    const batchId = '123456789'
    it('should call the getBatchDetails method with batchId', (done) => {
      jest.spyOn(certificateService.learnerService, 'get').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      certificateService.getBatchDetails(batchId).subscribe(() => {
        done();
      });
      const obj = {
        url : `${mockConfigService.urlConFig.URLS.BATCH.GET_DETAILS}/${batchId}`, 
      }
      expect(certificateService.learnerService.get).toHaveBeenCalledWith(obj);
    });

    it('should call the validateCertificate method with data object and should throw error', () => {
      // arrange
      jest.spyOn(certificateService.learnerService, 'get').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      certificateService.getBatchDetails(batchId).subscribe(() => {
      });
      const obj = {
        url : `${mockConfigService.urlConFig.URLS.BATCH.GET_DETAILS}/${batchId}`,
      }
      expect(certificateService.learnerService.get).toHaveBeenCalledWith(obj);
      expect(certificateService.learnerService.get).toHaveBeenCalled();
    });
  });
});
