import { LearnerService } from './../../../core/services/learner/learner.service';
import { TestBed, inject } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecoverAccountService } from './recover-account.service';
import { of as observableOf, Observable } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('RecoverAccountService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [RecoverAccountService]
    });
  });
  it('should be created', () => {
    const service: RecoverAccountService = TestBed.get(RecoverAccountService);
    expect(service).toBeTruthy();
  });


  it('should call resetPassword API', inject([],
    () => {
      const certificateService = TestBed.get(RecoverAccountService);
      const learnerService = TestBed.get(LearnerService);
      const params = { 'request': { 'type': 'user', 'key': 'testKey', 'userId': 'testUserId' } };
      spyOn(learnerService, 'post').and.returnValue(observableOf({}));
      certificateService.resetPassword(params);
      const options = { url: 'user/v1/password/reset', data: params };
      expect(learnerService.post).toHaveBeenCalledWith(options);
    }));

  it('should call generateOTP API', inject([],
    () => {
      const certificateService = TestBed.get(RecoverAccountService);
      const learnerService = TestBed.get(LearnerService);
      const params = { 'request': { 'type': 'user', 'key': 'testKey', 'userId': 'testUserId' } };
      spyOn(learnerService, 'post').and.returnValue(observableOf({}));
      certificateService.generateOTP(params);
      const options = { url: 'anonymous/otp/v1/generate?captchaResponse=undefined', data: params };
      expect(learnerService.post).toHaveBeenCalledWith(options);
    }));

  it('should call verifyOTP API', inject([],
    () => {
      const certificateService = TestBed.get(RecoverAccountService);
      const learnerService = TestBed.get(LearnerService);
      const params = { 'request': { 'type': 'user', 'key': 'testKey', 'userId': 'testUserId' } };
      spyOn(learnerService, 'post').and.returnValue(observableOf({}));
      certificateService.verifyOTP(params);
      const options = { url: 'otp/v1/verify', data: params };
      expect(learnerService.post).toHaveBeenCalledWith(options);
    }));

  it('should call fuzzyUserSearch API', inject([],
    () => {
      const certificateService = TestBed.get(RecoverAccountService);
      const learnerService = TestBed.get(LearnerService);
      const params = {
        'request': {
          'filters': {
            'isDeleted' : 'false',
            'fuzzy': {
              'firstName': undefined
            },
            $or: {
              'email': undefined,
              'prevUsedEmail': undefined
            }
          }
        }
      };
      spyOn(learnerService, 'post').and.returnValue(observableOf({}));
      certificateService.fuzzyUserSearch(params);
      const options = { url: 'user/v1/fuzzy/search?captchaResponse=undefined', data: params };
      expect(learnerService.post).toHaveBeenCalledWith(options);
    }));
});
