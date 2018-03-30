import { mockUserData } from './user.mock.spec.data';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable } from 'rxjs/Observable';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LearnerService, UserService, PermissionService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('userService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule],
      providers: [UserService, ConfigService, LearnerService]
    });
  });
  it('should fetch user profile details', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    userService.initialize();
    expect(userService._userProfile).toBeDefined();
  }));
  it('should emit user profile data on success', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    userService.initialize();
    userService.userData$.subscribe(userData => {
      expect(userData.userProfile).toBeDefined();
    });
  }));
  it('should emit error on api failure', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.throw(mockUserData.error));
    userService.initialize();
    userService.userData$.subscribe(userData => {
      expect(userData.err).toBeDefined();
    });
  }));
  it('should return userId when userId get method is called', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    userService.initialize();
    const userId = userService.userid;
    expect(userId).toBeDefined();
  }));
  it('should return userProfile when userProfile get method is called', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    userService.initialize();
    const userProfile = userService.userProfile;
    expect(userProfile).toBeDefined();
  }));
  it('should set rootOrgAdmin to true', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.rootOrgSuccess));
    userService.initialize();
    expect(userService._userProfile.rootOrgAdmin).toBeTruthy();
  }));
  it('should set rootOrgAdmin to false', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    userService.initialize();
    expect(userService._userProfile.rootOrgAdmin).toBeFalsy();
  }));
});
