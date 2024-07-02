import { of, throwError } from 'rxjs';
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from '@angular/common/http';
import { OtpService } from './otp.service';
import { LearnerService } from '../../../core';

describe('OtpService', () => {
  let otpService: OtpService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        OTP: {
          GENERATE: 'otp/v1/generate',
          VERIFY: 'otp/v1/verify',
          ANONYMOUS:{
            GENERATE_USERDELETE:'anonymous/delete/otp/v1/generate'
          }
        }
      }
    }
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { })
  };
  beforeAll(() => {
    otpService = new OtpService(
      mockLearnerService as LearnerService,
      mockConfigService as ConfigService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of OtpService', () => {
    expect(otpService).toBeTruthy();
  });

  describe('should call the generate otp method with data object', () => {
    const data = {
      userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
    }
    it('should return otp for a user', (done) => {
      jest.spyOn(otpService['learnerService'], 'post').mockReturnValue(of({
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
      otpService.generateOTP(data).subscribe(() => {
        done();
      });
      expect(otpService['learnerService'].post).toHaveBeenCalled();
    });

    it('should call the generate otp method with data object with error', () => {
      // arrange
      jest.spyOn(otpService['learnerService'], 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      otpService.generateOTP(data).subscribe(() => {
      });
      expect(otpService['learnerService'].post).toHaveBeenCalled();
    });
  });


  describe('should call the anonymous generate otp method with data object', () => {
    const data = {
      userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
    }
    it('should return otp for a user', (done) => {
      jest.spyOn(otpService['learnerService'], 'post').mockReturnValue(of({
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
      otpService.generateAnonymousOTP(data).subscribe(() => {
        done();
      });
      expect(otpService['learnerService'].post).toHaveBeenCalled();
    });

    it('should call the generate anonymous otp method with data object with error', () => {
      // arrange
      jest.spyOn(otpService['learnerService'], 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      otpService.generateAnonymousOTP(data).subscribe(() => {
      });
      expect(otpService['learnerService'].post).toHaveBeenCalled();
    });
  });

  describe('should call the verify otp method with data object', () => {
    const data = {
      userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
    }
    it('should return verify otp for a user', (done) => {
      jest.spyOn(otpService['learnerService'], 'post').mockReturnValue(of({
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
      otpService.verifyOTP(data).subscribe(() => {
        done();
      });
      expect(otpService['learnerService'].post).toHaveBeenCalled();
    });

    it('should call the verify otp method with data object with error', () => {
      // arrange
      jest.spyOn(otpService['learnerService'], 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      otpService.verifyOTP(data).subscribe(() => {
      });
      expect(otpService['learnerService'].post).toHaveBeenCalled();
    });
  });
});