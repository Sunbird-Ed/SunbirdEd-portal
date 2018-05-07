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

  it('should call learner service and return response', () => {
    const learnerService = TestBed.get(LearnerService);
    const signupService = TestBed.get(SignupService);
    spyOn(learnerService, 'post').and.callFake(() => Observable.of(mockSignupApiResponse.successResponse));
    signupService.signup(mockSignupApiResponse.returnValue.request).subscribe((apiResponse) => {
    expect(apiResponse.responseCode).toBe('OK');
    });
  });
  it('should call formatRequest method', () => {
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'formatRequest').and.returnValue(mockSignupApiResponse.returnValue);
    signupService.formatRequest(mockSignupApiResponse.returnValue.request);
    expect(signupService.formatRequest).toHaveBeenCalled();
  });
});
