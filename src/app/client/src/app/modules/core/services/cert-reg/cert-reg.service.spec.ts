import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { DataService } from "..";
import { ConfigService } from '../../../shared/services/config/config.service';
import { CertRegService } from './cert-reg.service';

describe('certRegService', () => {
  let certRegService: CertRegService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        PUBLIC_PREFIX: {},
        BADGE: {},
        CERT_REG_PREFIX: true,
        CERTIFICATE: {
          FETCH_CERTIFICATES: 'v1/certs/search',
          FETCH_USER: 'v1/user/search'
        }
      }
    }
  };
  const req = {
  };
  const mockHttpClient: Partial<HttpClient> = {
    post: jest.fn().mockImplementation(() => { })
  };
  const mockDataService: Partial<DataService> = {};
  
  beforeAll(() => {
    certRegService = new CertRegService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of appUpdateService', () => {
    expect(certRegService).toBeTruthy();
  });
describe('should fetch all the certificates by calling fetchCertificates', () => {
  const request = {
    userId : '874ed8a5-782e-4f6c-8f36-e0288455901e',
    certType: 'userCert',
    limit: 100
  }
  it('should return certificates for a user', (done) => {
    jest.spyOn(certRegService, 'post').mockReturnValue(of({
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
    certRegService.fetchCertificates(request).subscribe(() => {
        done();
    });
    expect(certRegService.post).toHaveBeenCalled();
});

it('should not return certificates for a user', () => {
    // arrange
    jest.spyOn(certRegService, 'post').mockImplementation(() => {
        return throwError({error: {}});
    });
    // act
    certRegService.fetchCertificates(request).subscribe(() => {
    });
    expect(certRegService.post).toHaveBeenCalled();
});
});
describe('should fetch all the certificates of a user by calling getUserCertList', () => {
 const userName = 'ntptest102';
 const courseId = 'do_21307528604532736012398';
 const loggedInUser = '874ed8a5-782e-4f6c-8f36-e0288455901e';
  it('should return certificates for a user by taking the userName and courseId from loggedInUser', (done) => {
    jest.spyOn(certRegService, 'post').mockReturnValue(of({
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
    certRegService.getUserCertList(userName, courseId, loggedInUser).subscribe(() => {
        done();
    });
});

it('should not return certificates for a user by taking the userName and courseId from loggedInUser', () => {
    // arrange
    jest.spyOn(certRegService, 'post').mockImplementation(() => {
        return throwError({error: {}});
    });
    // act
    certRegService.getUserCertList(userName, courseId, loggedInUser).subscribe(() => {
    });
});
});
  

});