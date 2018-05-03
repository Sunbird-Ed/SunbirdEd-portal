import { TestBed } from '@angular/core/testing';
import { SignupService } from './signup.service';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { mockSignupApiResponse } from './signup.service.spec.data';

describe('SignupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignupService, LearnerService, ConfigService]
    });
  });

  it('should call sign up method', () => {
    const learnerService = TestBed.get(LearnerService);
    const signupService = TestBed.get(SignupService);
    const req = {
      'email': 'va@gm.co',
      'firstName': 'vaish',
      'language': ['English'],
      'lastName': '',
      'password': 'password',
      'phone': '7899918817',
      'userName': 'vaish'
    };
    spyOn(learnerService, 'post').and.callFake(() => Observable.of(mockSignupApiResponse.successResponse));
    signupService.signup(req).subscribe((apiResponse) => {
      expect(apiResponse.responseCode).toBe('OK');
    });
  });
});
