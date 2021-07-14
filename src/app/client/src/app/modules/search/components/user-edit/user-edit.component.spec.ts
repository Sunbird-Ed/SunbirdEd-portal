import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { UserSearchService } from './../../services';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, RouterNavigationService
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService, PermissionService, RolesAndPermissions } from '@sunbird/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash-es';
import { UserEditComponent } from './user-edit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './user-edit.component.spec.data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, OrgDetailsService, } from '@sunbird/core';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { By } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { configureTestSuite } from '@sunbird/test-util';
import { ProfileService } from '@sunbird/profile';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0008': 'no-results',
        'm0007': 'Please search for something else.'
      },
      'emsg': {
        'm0005': 'deleting user is failed',
        'm0020': 'Updating user failed. Try again later'
      },
      'smsg': {
        'm0028': 'Updated successfully',
        'm0029': 'deleted sucessfully',
        'm0049': 'User updated successfully'
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule, SharedModule.forRoot(), CoreModule,
        TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [UserEditComponent],
      providers: [ResourceService, OrgDetailsService, SearchService, PaginationService, UserService, TelemetryService, FormBuilder,
        LearnerService, ContentService, ConfigService, ToasterService, UserSearchService,
        RouterNavigationService, PermissionService,
        { provide: ResourceService, useValue: resourceBundle },
        {
          provide: ActivatedRoute, useValue: {
            params: {
              subscribe: (fn: (value: Params) => void) => fn({
                userId: '6d4da241-a31b-4041-bbdb-dd3a898b3f85',
              }),
            },
            queryParams: observableOf({ key: 'admin' }),
            snapshot: {
              data: {
                telemetry: {
                  env: 'profile', pageid: 'use-search', type: 'view', subtype: 'paginate'
                }
              },
              parent: {
                url: [
                  {
                    path: 'search',
                  },
                  {
                    path: 'Users',
                  },
                  {
                    path: '1',
                  },
                ],
              },
            },
          }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
  });

  it('should act upon query params change', () => {
    component.ngOnInit();
    expect(component.queryParams).toEqual({ 'key': 'admin' });
  });

  it('should fetch logged in user details on component init', () => {
    const userService = TestBed.get(UserService);
    (userService as any)._userData$.next({ err: null, userProfile: Response.userData.result.response });
    const getLoggedInUserDetailsSpy = spyOn(component, 'getLoggedInUserDetails').and.callThrough();
    const getAllRolesSpy = spyOn(component, 'getAllRoles');
    component.ngOnInit();
    expect(getLoggedInUserDetailsSpy).toHaveBeenCalled();
    expect(getLoggedInUserDetailsSpy).toHaveBeenCalledTimes(1);
    expect(component.userProfile).toEqual(Response.userData.result.response);
    expect(component.stateId).toBe('969dd3c1-4e98-4c17-a994-559f2dc70e18');
    expect(getAllRolesSpy).toHaveBeenCalled();
    expect(getAllRolesSpy).toHaveBeenCalledTimes(1);
  });

  it('should redirect when fetching logged in user details fails', () => {
    const userService = TestBed.get(UserService);
    const toasterService = TestBed.get(ToasterService);
    (userService as any)._userData$.next({ err: 'ok', userProfile: null });
    const getLoggedInUserDetailsSpy = spyOn(component, 'getLoggedInUserDetails').and.callThrough();
    const getAllRolesSpy = spyOn(component, 'getAllRoles');
    const toasterSpy = spyOn(toasterService, 'error').and.callThrough();
    const redirectSpy = spyOn(component, 'redirect');
    component.ngOnInit();
    expect(getLoggedInUserDetailsSpy).toHaveBeenCalled();
    expect(getLoggedInUserDetailsSpy).toHaveBeenCalledTimes(1);
    expect(component.userProfile).toBeFalsy();
    expect(component.stateId).toBeFalsy();
    expect(getAllRolesSpy).not.toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
    expect(redirectSpy).toHaveBeenCalled();
  });

  it('should call ngOnInit method to get all roles', () => {
    const userService = TestBed.get(UserService);
    const searchService = TestBed.get(UserSearchService);
    const searchServiceSpy = spyOn(searchService, 'getUserByIdV5').and.returnValue(observableOf(Response.successData));
    (userService as any)._userData$.next({ err: null, userProfile: Response.userData.result.response });
    component.ngOnInit();
    expect(component.userId).toEqual('6d4da241-a31b-4041-bbdb-dd3a898b3f85');
    expect(searchServiceSpy).toHaveBeenCalled();
    expect(searchServiceSpy).toHaveBeenCalledTimes(1);
    expect(component.userDetails).toBeDefined();
    expect(component.userDetails).toEqual(Response.successData.result.response);
    expect(component.rootOrgRoles).toBeTruthy();
    expect(component.rootOrgRoles).toEqual([
      'ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'BOOK_CREATOR'
    ]);
    expect(component.selectedSchoolId).toBeTruthy();
    expect(component.selectedSchoolId).toBe('0124226794392862720');
  });

  xit('should call search api for populateOrgName', () => {
    const searchService = TestBed.get(SearchService);
    const options = {
      orgid: [
        '0123164136298905609',
        '0123059488965918723',
        '0124226794392862720',
        '0123653943740170242'
      ]
    };
    searchService.getOrganisationDetails(options.orgid).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.params.status).toBe('successful');
      }
    );
    fixture.detectChanges();
  });
  it('should call search api', () => {
    const searchService = TestBed.get(UserSearchService);
    spyOn(searchService, 'getUserByIdV5').and.returnValue(observableOf(Response.successData));
    component.populateUserDetails();
    component.selectedOrgId = Response.successData.result.response.organisations[0].organisationId;
    component.selectedOrgUserRoles = Response.successData.result.response.organisations[0].roles;
    expect(component.userDetails).toBeDefined();
  });
  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(UserSearchService);
    spyOn(searchService, 'getUserByIdV5').and.callFake(() => observableThrowError({}));
    component.populateUserDetails();
    expect(component.userDetails).toBeUndefined();
  });
  it('should call UserSearchService api for deleteUser', () => {
    const searchService = TestBed.get(UserSearchService);
    const option = { userId: '6d4da241-a31b-4041-bbdb-dd3a898b3f85' };
    searchService.deleteUser(option.userId).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.params.status).toBe('successful');
      }
    );
  });
  xit('should call editRoles method', () => {
    component.selectedOrgUserRoles = ['CONTENT_CREATOR', 'BOOK_CREATOR'];
    const roles = ['CONTENT_CREATOR', 'BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    const event = {
      target: { checked: true }
    };
    // component.editRoles('CONTENT_CREATOR', roles, event);
    expect(component.selectedOrgUserRolesNew).not.toBeUndefined();
  });
  xit('should call editRoles method when already assigned role is checked', () => {
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    const event = {
      target: { checked: true }
    };
    // component.editRoles('CONTENT_CREATOR', roles, event);
    expect(component.selectedOrgUserRolesNew).toEqual(['CONTENT_CREATOR']);
  });
  xit('should call editRoles method when event checked is false', () => {
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    const event = {
      target: { checked: false }
    };
    // component.editRoles('CONTENT_CREATOR', roles, event);
    expect(component.selectedOrgUserRolesNew).not.toEqual('CONTENT_CREATOR');
  });
  xit('should call updateRoles and make api call', () => {
    const userSearchService = TestBed.get(UserSearchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(userSearchService, 'updateRoles').and.callFake(() => observableOf(Response.rolesSuccessData));
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    component.allRoles = [];
    spyOn(component, 'redirect');
    spyOn(toasterService, 'success').and.callThrough();
    component.selectedOrgUserRolesNew = ['CONTENT_CREATOR'];
    // component.updateRoles(roles);
    expect(component.redirect).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0028);
  });
  xit('should call updateRoles method and make api call and return error', () => {
    const userSearchService = TestBed.get(UserSearchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(userSearchService, 'updateRoles').and.callFake(() => observableThrowError(Response.rolesFailureData));
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    component.allRoles = [];
    spyOn(component, 'redirect');
    spyOn(toasterService, 'error').and.callThrough();
    component.selectedOrgUserRolesNew = ['CONTENT_CREATOR'];
    // component.updateRoles(roles);
    expect(component.redirect).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });
  it('should not  show user name in modal header', () => {
    const searchService = TestBed.get(UserSearchService);
    const userService = TestBed.get(UserService);
    spyOn(searchService, 'getUserByIdV5').and.returnValue(observableOf(Response.successData));
    component.populateUserDetails();
    component.selectedOrgId = Response.successData.result.response.organisations[0].organisationId;
    component.selectedOrgUserRoles = Response.successData.result.response.organisations[0].roles;
    userService._userData$.next({ err: null, userProfile: Response.userdata });
    component.userDetailsForm.controls['role'].setValue('PUBLIC');
    const modalHeader = fixture.debugElement.query(By.css('.sb-modal-header'));
    expect(modalHeader).toBeNull();
  });

  it('should show roles from all the organizations', () => {
    const searchService = TestBed.get(UserSearchService);
    spyOn(searchService, 'getUserByIdV5').and.returnValue(observableOf(Response.successData));
    component.populateUserDetails();
    expect(component.selectedOrgUserRoles).toContain('REPORT_ADMIN');
    expect(component.selectedOrgUserRoles).toContain('BOOK_CREATOR');
  });

  it('should call getBlock', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => { });
    component.userDetails = Response.userData.result.response;
    component.initializeFormFields();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableOf(Response.getUserLocationResponse));
    component.getBlock('37809706-8f0e-4009-bf67-87bf04f220fa');
    expect(component.blockLoader).toBeFalsy();
  });

  it('should call getBlock error case', () => {
    component.userDetails = Response.userData.result.response;
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => { });
    component.initializeFormFields();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableThrowError('sorry'));
    component.getBlock('37809706-8f0e-4009-bf67-87bf04f220fa');
    expect(toasterService.error).toHaveBeenCalledWith('deleting user is failed');
  });
  it('should call onSubmitForm', () => {
    spyOn(component, 'updateProfile');
    component.onSubmitForm();
    expect(component.updateProfile).toHaveBeenCalled();
  });
  it('should call getSchool', () => {
    component.userDetails = Response.userData.result.response;
    const orgDetailsService = TestBed.get(OrgDetailsService);
    component.initializeFormFields();
    spyOn(orgDetailsService, 'fetchOrgs').and.returnValue(observableOf(Response.orgDetails));
    component.getSchool('37809706-8f0e-4009-bf67-87bf04f220fa');
    expect(component.schoolLoader).toBeFalsy();
  });

  it('should call getSchool error case', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => { });
    spyOn(component, 'redirect');
    component.initializeFormFields();
    spyOn(orgDetailsService, 'fetchOrgs').and.returnValue(observableThrowError('sorry'));
    component.getSchool('37809706-8f0e-4009-bf67-87bf04f220fa');
    expect(toasterService.error).toHaveBeenCalledWith('deleting user is failed');
    expect(component.redirect).toHaveBeenCalled();
  });
  it('should call getDistrict', () => {
    const profileService = TestBed.get(ProfileService);
    component.userDetails = Response.userData.result.response;
    component.stateId = '1';
    component.initializeFormFields();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableOf(Response.getUserLocationResponse));
    component.getDistrict();
    expect(component.showMainLoader).toBeFalsy();
  });
  it('should call getDistrict error case', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => { });
    spyOn(component, 'redirect');
    component.stateId = '1';
    component.userDetails = Response.userData.result.response;
    component.initializeFormFields();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableThrowError('sorry'));
    component.getDistrict();
    expect(toasterService.error).toHaveBeenCalledWith('deleting user is failed');
    expect(component.redirect).toHaveBeenCalled();
  });
  it('should call onDistrictChange', () => {
    component.initializeFormFields();
    component.allDistricts = Response.districtList;
    component.userDetailsForm.patchValue({ district: '2725' });
    component.onDistrictChange();
  });
  it('should call updateProfile', () => {
    const serverResponse = {
      id: '1',
      params: {},
      responseCode: '200',
      result: {},
      ts: '20-01-2020',
      ver: '3'
    };
    const toasterService = TestBed.get(ToasterService);
    const userSearchService = TestBed.get(UserSearchService);
    spyOn(toasterService, 'success').and.callFake(() => { });
    spyOn(userSearchService, 'updateRoles').and.returnValue(observableOf(serverResponse));
    component.userDetails = Response.userData;
    component.selectedOrgUserRoles = ['BOOK_CREATOR'];
    component.initializeFormFields();
    component.updateProfile();
    expect(toasterService.success).toHaveBeenCalledWith('User updated successfully');
  });
  it('should call updateProfile error case', () => {
    const toasterService = TestBed.get(ToasterService);
    const userSearchService = TestBed.get(UserSearchService);
    spyOn(toasterService, 'error').and.callFake(() => { });
    spyOn(userSearchService, 'updateRoles').and.returnValue(observableThrowError('sorry'));
    component.userDetails = Response.userData;
    component.selectedOrgUserRoles = ['BOOK_CREATOR'];
    component.initializeFormFields();
    component.updateProfile();
    expect(toasterService.error).toHaveBeenCalledWith('Updating user failed. Try again later');
  });

  it('should call getRolesReqBody for update user roles', () => {
    const newRoles = ['COURSE_MENTOR'];
    const currentRoles = ['BOOK_REVIEWER'];
    const orgId = '01269878797503692810';
    const reqBody = [
      {
        'role': 'BOOK_REVIEWER',
        'operation': 'remove',
        'scope': [
          {
            'organisationId': '01269878797503692810'
          }
        ]
      },
      {
        'role': 'COURSE_MENTOR',
        'operation': 'add',
        'scope': [
          {
            'organisationId': '01269878797503692810'
          }
        ]
      }
    ];
    spyOn(component, 'getRolesReqBody').and.returnValue(reqBody);
    const res = component.getRolesReqBody(newRoles, currentRoles, orgId);
    expect(component.getRolesReqBody).toHaveBeenCalledWith(newRoles, currentRoles, orgId);
    expect(res.length).toBe(2);
  });
});
