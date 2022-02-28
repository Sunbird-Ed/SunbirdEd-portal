
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { mockPermissionRes } from './permission.mock.spec.data';
import { mockUserData } from './../user/user.mock.spec.data';
import { TestBed } from '@angular/core/testing';
import { ConfigService, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { PermissionService } from './permission.service';
import { LearnerService, UserService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
const mockUserRoles = {
  userRoles: ['PUBLIC']
};
const mockResource = {
  'emsg': {
   'm0005': 'Something went wrong, please try again later...'
 }
};
// service xdescribe
xdescribe('PermissionService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, TranslateModule.forRoot({
                  loader: {
                    provide: TranslateLoader,
                    useClass: TranslateFakeLoader
                  }
                })],
      providers: [ResourceService, ToasterService, PermissionService, ConfigService, LearnerService, UserService,
        BrowserCacheTtlService]
    });
  });
  //  OLD XIT
 xit('should fetch permission', () => { // removed role read api call
    const permissionService= <any> TestBed.inject(PermissionService);
    const learnerService= <any> TestBed.inject(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockPermissionRes.success));
    permissionService.initialize();
    expect(permissionService.rolesAndPermissions.length).toBeGreaterThan(0);
    expect(permissionService.mainRoles.length).toBeGreaterThan(0);
  });
  it('should subscribe to user service', () => {
    const permissionService= <any> TestBed.inject(PermissionService);
    const userService= <any> TestBed.inject(UserService);
    const learnerService= <any> TestBed.inject(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockPermissionRes.success));
    permissionService.initialize();
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    expect(permissionService.userRoles.length).toBeGreaterThan(0);
    expect(permissionService.userRoles).toContain('PUBLIC');
  });
  it('should set permissionAvailable flag to true when permission and user roles are available', () => {
    const permissionService= <any> TestBed.inject(PermissionService);
    const userService= <any> TestBed.inject(UserService);
    const learnerService= <any> TestBed.inject(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockPermissionRes.success));
    permissionService.initialize();
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    expect(permissionService.permissionAvailable).toBeTruthy();
  });


  //  OLD XIT
 xit('should throw toaster error message when permission api fails', () => { // removed role read api
    const permissionService= <any> TestBed.inject(PermissionService);
    const userService= <any> TestBed.inject(UserService);
    const toasterService= <any> TestBed.inject(ToasterService);
    const learnerService= <any> TestBed.inject(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableThrowError(mockPermissionRes.error));
    spyOn(toasterService, 'error').and.returnValue(true);
    permissionService.initialize();
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later...');
  });

  it('should throw toaster error message when userService api fails', () => {
    const permissionService= <any> TestBed.inject(PermissionService);
    const userService= <any> TestBed.inject(UserService);
    const toasterService= <any> TestBed.inject(ToasterService);
    const learnerService= <any> TestBed.inject(LearnerService);
    const resourceService: ResourceService= <any> TestBed.inject(ResourceService);
    resourceService.messages = mockResource;
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockPermissionRes.success));
    spyOn(toasterService, 'error').and.returnValue(true);
    permissionService.initialize();
    userService._userData$.next({ err: {responseCode: 'CLIENT_ERROR'}, userProfile: mockUserRoles });
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later...');
  });

  it('should validate permission to true', () => {
    const permissionService= <any> TestBed.inject(PermissionService);
    const userService= <any> TestBed.inject(UserService);
    const learnerService= <any> TestBed.inject(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockPermissionRes.success));
    permissionService.initialize();
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    const validPermission = permissionService.checkRolesPermissions(['PUBLIC']);
    expect(validPermission).toBeTruthy();
  });

  it('should validate permission to false', () => {
    const permissionService= <any> TestBed.inject(PermissionService);
    const userService= <any> TestBed.inject(UserService);
    const learnerService= <any> TestBed.inject(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockPermissionRes.success));
    permissionService.initialize();
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    const validPermission = permissionService.checkRolesPermissions(['ADMIN']);
    expect(validPermission).toBeFalsy();
  });
});
