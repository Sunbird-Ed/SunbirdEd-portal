import {TestBed, inject, getTestBed} from '@angular/core/testing';
import {throwError as observableThrowError, of as observableOf, Observable} from 'rxjs';
import {SignupService} from './signup.service';
import {ConfigService, SharedModule} from '@sunbird/shared';
import {LearnerService, UserService} from '@sunbird/core';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('SignupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignupService, ConfigService, LearnerService]
    });
  });

  it('sign up service should be created', inject([SignupService], (service: SignupService) => {
    const signupService = TestBed.get(SignupService);
    const learnerService = TestBed.get(LearnerService);
    expect(service).toBeTruthy();
  }));
});
