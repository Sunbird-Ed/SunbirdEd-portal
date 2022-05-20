import {TestBed, inject} from '@angular/core/testing';
import { of as observableOf} from 'rxjs';
import {SignupService} from './signup.service';
import {ConfigService} from '@sunbird/shared';
import {LearnerService} from '@sunbird/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';

// NEW xdescribe
xdescribe('SignupService', () => {
  const generateOtpData = {
    'id': 'api.otp.generate',
    'ver': 'v1',
    'ts': '2020-01-08 07:49:17:041+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': 'SUCCESS'
    }
  };
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignupService, ConfigService, LearnerService]
    });
  });

  it('sign up service should be created', inject([SignupService], (service: SignupService) => {
    const signupService = TestBed.inject(SignupService);
    const learnerService = TestBed.inject(LearnerService);
    expect(service).toBeTruthy();
  }));

  it('should call generate API for anonymous', () => {
    const signupService = TestBed.inject(SignupService);
    const learnerService = TestBed.inject(LearnerService);
    const params = { 'request': { 'key': '1242142', 'type': 'phone' } };
    spyOn(learnerService, 'post').and.returnValue(observableOf(generateOtpData));
    signupService.generateOTPforAnonymousUser(params, 'G-cjkdjflsfkja');
    const options = { url: 'anonymous/otp/v1/generate' + '?captchaResponse=' + 'G-cjkdjflsfkja', data: params };
    expect(learnerService.post).toHaveBeenCalledWith(options);
  });

});
