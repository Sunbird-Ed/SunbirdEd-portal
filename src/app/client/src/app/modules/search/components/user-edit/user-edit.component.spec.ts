import { UserSearchService } from './../../services/user-search/user-search.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, INoResultMessage, RouterNavigationService
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService, PermissionService, RolesAndPermissions  } from '@sunbird/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable } from 'rxjs/Observable';
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
        'm0029': 'deleted sucessfully'
      }
    }
  };
  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'use-search', type: 'view', subtype: 'paginate'
        }
      }
    },
    'url': Observable.of([{ 'path': 'search/Users/1' }]),
    'params': Observable.from([{ 'userId': '6d4da241-a31b-4041-bbdb-dd3a898b3f85' }])
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, Ng2IziToastModule, RouterTestingModule],
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
    const learnerService = TestBed.get(LearnerService);
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
    const learnerService = TestBed.get(LearnerService);
    spyOn(searchService, 'getUserById').and.returnValue(Observable.of(Response.successData));
    component.populateUserDetails();
    component.selectedOrgId = Response.successData.result.response.organisations[0].organisationId;
    component.selectedOrgUserRoles = Response.successData.result.response.organisations[0].roles;
    fixture.detectChanges();
    expect(component.userDetails).toBeDefined();
  });
  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(UserSearchService);
    spyOn(searchService, 'getUserById').and.callFake(() => Observable.throw({}));
    component.populateUserDetails();
    fixture.detectChanges();
    expect(component.userDetails).toBeUndefined();
  });
  it('should call UserSearchService api for deleteUser', () => {
    const searchService = TestBed.get(UserSearchService);
    const learnerService = TestBed.get(LearnerService);
    const option = { userId: '6d4da241-a31b-4041-bbdb-dd3a898b3f85'};
    searchService.deleteUser(option.userId).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
    );
    fixture.detectChanges();
  });
});
