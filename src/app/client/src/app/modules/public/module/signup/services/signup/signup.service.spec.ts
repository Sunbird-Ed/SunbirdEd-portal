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

  it('should fetch tnc configuration', inject([SignupService], (service: SignupService) => {
    const mockData = {'success': 'success'};
    const signupService = TestBed.get(SignupService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData));
    signupService.getTncConfig().subscribe(data => {
      expect(data).toBe(mockData);
    });
  }));

  it('should not fetch tnc configuration and throw error', inject([SignupService], (service: SignupService) => {
    const mockError = {'error': 'error'};
    const signupService = TestBed.get(SignupService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableThrowError(mockError));
    signupService.getTncConfig().subscribe(null, data => {
      expect(data).toBe(mockError);
    });
  }));


});
