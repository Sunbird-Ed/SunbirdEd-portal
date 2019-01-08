import { ConfigService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { LearnerService } from './../learner/learner.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { testData } from './otp.service.spec.data';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, LearnerService]
    });
  });

  it('should call generate API', inject([],
    () => {
      const learnerService = TestBed.get(LearnerService);
      const otpService = TestBed.get(OtpService);
      const params = { 'request': { 'key': '7088283838', 'type': 'phone' } };
      spyOn(learnerService, 'post').and.returnValue(observableOf(testData.generateOtpData));
      otpService.generateOTP(params);
      expect(learnerService.post).toHaveBeenCalled();
    }));

  it('should call verifyOTP API', inject([],
    () => {
      const learnerService = TestBed.get(LearnerService);
      const otpService = TestBed.get(OtpService);
      const params = { 'request': { 'key': '7088283838', 'type': 'phone', 'otp': '238798' } };
      spyOn(learnerService, 'post').and.returnValue(observableOf(testData.verifyOtpData));
      otpService.verifyOTP(params);
      expect(learnerService.post).toHaveBeenCalled();
    }));
});
