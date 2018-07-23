
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { UserSearchService } from './../../services';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, RouterNavigationService
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService, PermissionService, RolesAndPermissions } from '@sunbird/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { UserEditComponent } from './user-edit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './user-edit.component.spec.data';



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
        'm0005': 'deleting user is failed'
      },
      'smsg': {
        'm0028': 'Updated successfully',
        'm0029': 'deleted sucessfully'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule, RouterTestingModule],
      declarations: [UserEditComponent],
      providers: [ResourceService, SearchService, PaginationService, UserService,
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
  it('should call search api for populateOrgName', () => {
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
    spyOn(searchService, 'getUserById').and.returnValue(observableOf(Response.successData));
    component.populateUserDetails();
    component.selectedOrgId = Response.successData.result.response.organisations[0].organisationId;
    component.selectedOrgUserRoles = Response.successData.result.response.organisations[0].roles;
    expect(component.userDetails).toBeDefined();
  });
  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(UserSearchService);
    spyOn(searchService, 'getUserById').and.callFake(() => observableThrowError({}));
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
  it('should call editRoles method', () => {
    component.selectedOrgUserRoles = ['CONTENT_CREATOR', 'BOOK_CREATOR'];
    const roles = ['CONTENT_CREATOR', 'BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    const event = {
      target: { checked: true }
    };
    component.editRoles('CONTENT_CREATOR', roles, event);
    expect(component.selectedOrgUserRolesNew).not.toBeUndefined();
  });
  it('should call editRoles method when already assigned role is checked', () => {
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    const event = {
      target: { checked: true }
    };
    component.editRoles('CONTENT_CREATOR', roles, event);
    expect(component.selectedOrgUserRolesNew).toEqual(['CONTENT_CREATOR']);
  });
  it('should call editRoles method when event checked is false', () => {
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    const event = {
      target: { checked: false }
    };
    component.editRoles('CONTENT_CREATOR', roles, event);
    expect(component.selectedOrgUserRolesNew).not.toEqual('CONTENT_CREATOR');
  });
  it('should call updateRoles and make api call', () => {
    const userSearchService = TestBed.get(UserSearchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(userSearchService, 'updateRoles').and.callFake(() => observableOf(Response.rolesSuccessData));
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    component.allRoles = [];
    spyOn(component, 'redirect');
    spyOn(toasterService, 'success').and.callThrough();
    component.selectedOrgUserRolesNew = ['CONTENT_CREATOR'];
    component.updateRoles(roles);
    expect(component.redirect).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0028);
  });
  it('should call updateRoles method and make api call and return error', () => {
    const userSearchService = TestBed.get(UserSearchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(userSearchService, 'updateRoles').and.callFake(() => observableThrowError(Response.rolesFailureData));
    const roles = ['BOOK_CREATOR', 'ANNOUNCEMENT_SENDER', 'OFFICIAL_TEXTBOOK_BADGE_ISSUER', 'PUBLIC'];
    component.allRoles = [];
    spyOn(component, 'redirect');
    spyOn(toasterService, 'error').and.callThrough();
    component.selectedOrgUserRolesNew = ['CONTENT_CREATOR'];
    component.updateRoles(roles);
    expect(component.redirect).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });
  it('should call ngOnInit method to get all roles', () => {
    const permissionService = TestBed.get(PermissionService);
    permissionService.permissionAvailable$.next('success');
    component.ngOnInit();
    expect(component.allRoles['role']).not.toContain('PUBLIC');
  });
});
