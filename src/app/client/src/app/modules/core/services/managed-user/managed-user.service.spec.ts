import {inject, TestBed} from '@angular/core/testing';
import {ConfigService, InterpolatePipe} from '@sunbird/shared';
import {LearnerService, UserService} from '@sunbird/core';
import {ManagedUserService} from './managed-user.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of as observableOf, throwError as observableThrowError} from 'rxjs';
import {CacheService} from 'ng2-cache-service';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import {APP_BASE_HREF} from '@angular/common';
import {managedUserServiceMockData} from './managed-user.service.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

describe('ManagedUserService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, TelemetryModule.forRoot()],
    declarations: [InterpolatePipe],
    providers: [LearnerService, ManagedUserService, ConfigService, CacheService, UserService,
      {provide: APP_BASE_HREF, useValue: 'test'}]
  }));

  it('should be created', () => {
    const service: ManagedUserService = TestBed.get(ManagedUserService);
    expect(service).toBeTruthy();
  });

  it('should fetch managed user list', inject([ManagedUserService], (service: ManagedUserService) => {
    const mockData = {success: 'success'};
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(managedUserServiceMockData.userReadApiResponse));
    userService.initialize(true);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData));
    service.fetchManagedUserList();
    service.managedUserList$.subscribe((data: any) => {
      expect(data).toBe(mockData);
    });
  }));

  it('should not fetch managed user list', inject([ManagedUserService], (service: ManagedUserService) => {
    const mockError = {'error': 'error'};
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(managedUserServiceMockData.userReadApiResponse));
    userService.initialize(true);
    spyOn(learnerService, 'get').and.returnValue(observableThrowError(mockError));
    service.fetchManagedUserList();
    service.managedUserList$.subscribe((data: any) => {
      expect(data).toBe(true);
    });
  }));


  it('should return error message', inject([ManagedUserService], (service: ManagedUserService) => {
    service.instance = 'sunbird';
    const message = 'Now using {instance} as {userName} You can update your preferences from the page';
    const data = service.getMessage(message, 'mockname');
    expect(data).toBe('Now using sunbird as mockname You can update your preferences from the page');
  }));

  it('should return userId of parent', inject([ManagedUserService], (service: ManagedUserService) => {
    const userService = TestBed.get(UserService);
    const mockUserId = 'mockUserId';
    userService._userProfile = {};
    userService.setUserId(mockUserId);
    const data = service.getUserId();
    expect(data).toBe(mockUserId);
  }));

  it('should return userId of child', inject([ManagedUserService], (service: ManagedUserService) => {
    const userService = TestBed.get(UserService);
    const mockUserId = 'mockUserId';
    userService._userProfile = {managedBy: mockUserId};
    const data = service.getUserId();
    expect(data).toBe(mockUserId);
  }));

  it('should process user list to display', inject([ManagedUserService], (service: ManagedUserService) => {
    const data = service.processUserList([managedUserServiceMockData.dataToProcess], 'asd');
    expect(data).toEqual(managedUserServiceMockData.processedData);
  }));


  it('should getParentProfile from cached', inject([ManagedUserService], (service: ManagedUserService) => {
    const userObject = {managedBy: 'mockUserID'};
    const cacheService = TestBed.get(CacheService);
    spyOn(cacheService, 'get').and.returnValue(userObject);
    service.getParentProfile().subscribe((data: any) => {
      expect(data).toEqual(userObject);
    });
  }));

  it('should getParentProfile from APi as data not present', inject([ManagedUserService], (service: ManagedUserService) => {
    const userObject = {result: {response: {managedBy: 'mockUserID'}}};
    const cacheService = TestBed.get(CacheService);
    const userService = TestBed.get(UserService);
    userService._userProfile = userObject;
    spyOn(cacheService, 'get').and.returnValue(null);
    spyOn(userService, 'getUserData').and.returnValue(observableOf(userObject));
    service.getParentProfile().subscribe((data: any) => {
      expect(data).toEqual(userObject.result.response);
    });
  }));


  it('should set switch user data', inject([ManagedUserService], (service: ManagedUserService) => {
    const userid = 'userid';
    const userSid = 'userSid';
    spyOn(document, 'getElementById').and.callFake((id) => {
      if (id === 'userId') {
        return {value: '1.1.12.0'};
      }
      if (id === 'userSid') {
        return {value: 'device'};
      }
    });
    const telemetryService = TestBed.get(TelemetryService);
    const userService = TestBed.get(UserService);
    spyOn(telemetryService, 'setSessionIdentifier');
    spyOn(userService, 'setUserId');
    spyOn(userService, 'initialize');
    service.setSwitchUserData(userid, userSid);
    expect(userService.initialize).toHaveBeenCalledWith(true);
    expect(userService.setUserId).toHaveBeenCalledWith(userid);
    expect(telemetryService.setSessionIdentifier).toHaveBeenCalledWith(userSid);
  }));

});
