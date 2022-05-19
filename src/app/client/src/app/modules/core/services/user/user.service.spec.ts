
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { CoreModule, LearnerService, PublicDataService, UserService } from '@sunbird/core';
import { ConfigService, SharedModule } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { of as observableOf, of, throwError as observableThrowError } from 'rxjs';
import { mockUserData } from './user.mock.spec.data';
// NEW xdescribe
xdescribe('userService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [UserService, ConfigService, LearnerService]
    });
  });
  it('should fetch user profile details', inject([UserService], (service: UserService) => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    expect(userService._userProfile).toBeDefined();
  }));
  it('should emit user profile data on success', inject([UserService], (service: UserService) => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.userProfile).toBeDefined();
    });
  }));
  it('should emit error on api failure', inject([UserService], (service: UserService) => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableThrowError(mockUserData.error));
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.err).toBeDefined();
    });
  }));
  it('should return userProfile when userProfile get method is called', inject([UserService], (service: UserService) => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    const userProfile = userService.userProfile;
    expect(userProfile).toBeDefined();
  }));
  it('should set rootOrgAdmin to true', inject([UserService], (service: UserService) => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.rootOrgSuccess));
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeTruthy();
  }));
  it('should set rootOrgAdmin to false', inject([UserService], (service: UserService) => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeFalsy();
  }));

  it('should call registerUser method', () => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(of(mockUserData.registerSuccess));
    const reqData = { 'request': { 'firstName': 'test', 'managedBy': '5488df8f-2090-4735-a767-ad0588bf7659', 'locationIds': [] } };
    spyOn(userService.createManagedUser, 'emit').and.returnValue('0008ccab-2103-46c9-adba-6cdf84d37f06');
    userService.registerUser(reqData).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
      expect(userService.createManagedUser.emit).toHaveBeenCalledWith('0008ccab-2103-46c9-adba-6cdf84d37f06');
    });
  });
  it('should migrate custodian user', () => {
    const userService:any = TestBed.inject(UserService);
    const learnerService = TestBed.inject(LearnerService);
    const params = {
      'request': {
        'userId': '12345',
        'action': 'accept',
        'userExtId': 'bt240',
        'channel': 'TN',
        'feedId': '32145669877'
      }
    };
    spyOn(learnerService, 'post').and.returnValue(mockUserData.migrateSuccessResponse);
    userService.userMigrate(params);
    const options = { url: 'user/v1/migrate', data: params };
    expect(learnerService.post).toHaveBeenCalledWith(options);
  });

  it('should call getAnonymousUserPreference', () => {
    const userService:any = TestBed.inject(UserService);
    const publicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of({ result: { board: 'CBSE' } }));
    userService.getAnonymousUserPreference();
    expect(publicDataService.get).toHaveBeenCalled();
  });
  it('should call updateAnonymousUserDetails', () => {
    const userService:any = TestBed.inject(UserService);
    const publicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({ result: { board: 'CBSE' } }));
    userService.updateAnonymousUserDetails();
    expect(publicDataService.post).toHaveBeenCalled();
  });
  it('should call createAnonymousUser', () => {
    const userService:any = TestBed.inject(UserService);
    const publicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({ result: { board: 'CBSE' } }));
    userService.createAnonymousUser();
    expect(publicDataService.post).toHaveBeenCalled();
  });
  it('should call createGuestUser', () => {
    const userService:any = TestBed.inject(UserService);
    userService.isDesktopApp = true;
    spyOn(userService, 'createAnonymousUser').and.returnValue(of({}));
    userService.createGuestUser();
    expect(userService.createAnonymousUser).toHaveBeenCalled();
  });
  it('should call createGuestUser for portal', () => {
    const userService:any = TestBed.inject(UserService);
    userService.isDesktopApp = false;
    spyOn(userService, 'getGuestUser').and.returnValue(of({}));
    const resp = userService.createGuestUser({});
    expect(userService.getGuestUser).toHaveBeenCalled();
  });
  it('should call updateGuestUser for desktop', () => {
    const userService:any = TestBed.inject(UserService);
    userService.isDesktopApp = true;
    spyOn(userService, 'updateAnonymousUserDetails');
    userService.updateGuestUser({ _id: 'abcd', name: 'Guest' });
    expect(userService.updateAnonymousUserDetails).toHaveBeenCalled();
  });
  it('should call updateGuestUser for portal', () => {
    const userService:any = TestBed.inject(UserService);
    userService.isDesktopApp = false;
    spyOn(userService, 'getGuestUser').and.returnValue(of({}));
    userService.updateGuestUser({ _id: 'abcd', name: 'Guest' });
    expect(userService.getGuestUser).toHaveBeenCalled();
  });

});
