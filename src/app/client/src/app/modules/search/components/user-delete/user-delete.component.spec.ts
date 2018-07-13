
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';

import { UserSearchService } from './../../services/user-search/user-search.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, INoResultMessage, RouterNavigationService
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { UserDeleteComponent } from './user-delete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './user-delete.component.spec.data';



describe('UserDeleteComponent', () => {
  let component: UserDeleteComponent;
  let fixture: ComponentFixture<UserDeleteComponent>;
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
    'url': observableOf({ 'path': 'search/Users/1' }),
    'params': observableOf({ 'userId': '6d4da241-a31b-4041-bbdb-dd3a898b3f85' })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule, RouterTestingModule],
      declarations: [UserDeleteComponent],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService, UserSearchService,
        RouterNavigationService,
        { provide: ResourceService, useValue: resourceBundle },
        {
          provide: ActivatedRoute, useValue: {
            params: {
              subscribe: (fn: (value: Params) => void) => fn({
                userId: '6d4da241-a31b-4041-bbdb-dd3a898b3f85',
              }),
            },
            snapshot: {
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
              }
            },
          }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeleteComponent);
    component = fixture.componentInstance;
    component.userDetails = Response.successData;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(UserSearchService);
    spyOn(searchService, 'getUserById').and.callFake(() => observableThrowError({}));
    fixture.detectChanges();
  });
  it('should call UserSearchService api for deleteUser', () => {
    const searchService = TestBed.get(UserSearchService);
    const learnerService = TestBed.get(LearnerService);
    const option = { userId: '6d4da241-a31b-4041-bbdb-dd3a898b3f85'};
    component.deleteUser();
    searchService.deleteUser(option.userId).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
    );
    fixture.detectChanges();
  });
});
