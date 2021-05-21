
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { ProfileService } from '@sunbird/profile';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, LearnerService, UserService, FormService } from '@sunbird/core';
import { mockRes } from './profile.service.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
describe('ProfileService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [ProfileService]
    });
  });
  it('should call getSkills method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockRes.successData));
    profileService.getSkills().subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });
  it('should call add method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'post').and.returnValue(observableOf(mockRes.successData));
    const request = {
      'skillName': ['skills'],
      'endorsedUserId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
    };
    profileService.add(request).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });
  it('should call updateProfile method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'patch').and.returnValue(observableOf(mockRes.successData));
    const request = {
      profileSummary: 'summary'
    };
    profileService.updateProfile(request).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });
  it('should call updateProfileFieldVisibility method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'post').and.returnValue(observableOf(mockRes.successData));
    const request = {
      private: ['address'],
      userId: '159e93d1-da0c-4231-be94-e75b0c226d7c'
    };
    profileService.updateProfileFieldVisibility(request).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });
  it('should call declarations method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    const userService = TestBed.get(UserService);
    spyOn(learnerService, 'patch').and.returnValue(observableOf(mockRes.successData));
    spyOn(userService, 'getUserProfile').and.callThrough();
    const request = {
      profileSummary: 'summary'
    };
    profileService.declarations(request).subscribe(apiResponse => {
      userService.getUserProfile();
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });

  it('should call getPersonas method', () => {
    const formService = TestBed.get(FormService);
    const profileService = TestBed.get(ProfileService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockRes.successData));
    profileService.getPersonas().subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });

  it('should call getPersonaTenantForm method', () => {
    const formService = TestBed.get(FormService);
    const profileService = TestBed.get(ProfileService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockRes.successData));
    profileService.getPersonaTenantForm().subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });

  it('should call getSelfDeclarationForm method', () => {
    const formService = TestBed.get(FormService);
    const profileService = TestBed.get(ProfileService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockRes.successData));
    profileService.getSelfDeclarationForm('submit').subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
    });
  });

});
