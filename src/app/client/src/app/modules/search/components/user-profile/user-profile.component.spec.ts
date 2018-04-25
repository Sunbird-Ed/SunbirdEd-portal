import { UserSearchService } from './../../services/user-search/user-search.service';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, INoResultMessage, RouterNavigationService} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService, BadgesService} from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable } from 'rxjs/Observable';
import { UserProfileComponent } from './user-profile.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Response} from './user-profile.component.spec.data';


describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, Ng2IziToastModule, RouterTestingModule],
      declarations: [ UserProfileComponent ],
      providers: [ ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService, UserSearchService, RouterNavigationService, BadgesService,
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    component.userDetails = Response.successData;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call search api', () => {
    const searchService = TestBed.get(UserSearchService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    spyOn(searchService, 'getUserById').and.callFake(() => Observable.of(Response.successData));
    component.populateUserProfile();
    fixture.detectChanges();
    expect(component.userDetails).toBeDefined();
    expect(component.showLoader).toBeFalsy();
  });
});
