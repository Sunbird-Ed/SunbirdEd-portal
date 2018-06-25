import { TestBed, inject } from '@angular/core/testing';
import { ProfileService } from '@sunbird/profile';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, LearnerService } from '@sunbird/core';
import { mockRes } from './profile.service.spec.data';
import { Observable } from 'rxjs/Observable';
describe('ProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [ProfileService]
    });
  });
  it('should call getSkills method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockRes.successData));
    spyOn(profileService, 'getSkills').and.callThrough();
    profileService.getSkills();
    expect(profileService.getSkills).toHaveBeenCalled();
  });
  it('should call add method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'post').and.returnValue(Observable.of(mockRes.successData));
    const request = {
      'skillName': ['skills'],
      'endorsedUserId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
    };
    spyOn(profileService, 'add').and.callThrough();
    profileService.add(request).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
    });
    expect(profileService.add).toHaveBeenCalled();
  });
  it('should call uploadMedia method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'post').and.returnValue(Observable.of(mockRes.successData));
    const request = new FormData;
    spyOn(profileService, 'uploadMedia').and.callThrough();
    profileService.uploadMedia(request);
    expect(profileService.uploadMedia).toHaveBeenCalled();
  });
  it('should call formatRequest method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    const request = {
      'skillName': ['skills'],
      'endorsedUserId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
    };
    spyOn(profileService, 'formatRequest').and.callThrough();
    profileService.formatRequest(request);
    expect(profileService.formatRequest).toHaveBeenCalled();
  });
  it('should call updateAvatar method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'post').and.returnValue(Observable.of(mockRes.successData));
    const request = new FormData;
    spyOn(profileService, 'updateAvatar').and.callThrough();
    profileService.updateAvatar(request).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
    });
    expect(profileService.updateAvatar).toHaveBeenCalled();
  });
  it('should call updateProfile method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'patch').and.returnValue(Observable.of(mockRes.successData));
    const request = {
      profileSummary: 'summary'
    };
    spyOn(profileService, 'updateProfile').and.callThrough();
    profileService.updateProfile(request).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
    });
    expect(profileService.updateProfile).toHaveBeenCalled();
  });
  it('should call updateProfileFieldVisibility method', () => {
    const learnerService = TestBed.get(LearnerService);
    const profileService = TestBed.get(ProfileService);
    spyOn(learnerService, 'post').and.returnValue(Observable.of(mockRes.successData));
    const request = {
      private: ['address'],
      userId: '159e93d1-da0c-4231-be94-e75b0c226d7c'
    };
    spyOn(profileService, 'updateProfileFieldVisibility').and.callThrough();
    profileService.updateProfileFieldVisibility(request);
    expect(profileService.updateProfileFieldVisibility).toHaveBeenCalled();
  });
});
