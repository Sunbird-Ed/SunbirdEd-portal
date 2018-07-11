
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { BatchCardComponent } from './../batch-card/batch-card.component';
import { BatchListComponent } from './batch-list.component';
// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
// Import services
import { SharedModule, PaginationService, ToasterService, ResourceService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService, BatchService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Ibatch } from './../../interfaces/batch';
// import batch card comoponet

// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './batch-list.component.spec.data';
const testData = mockData.mockRes;
import * as _ from 'lodash';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
describe('BatchListComponent', () => {
  let component: BatchListComponent;
  let fixture: ComponentFixture<BatchListComponent>;
  let childcomponent: BatchCardComponent;
  let childfixture: ComponentFixture<BatchCardComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0056': 'Fetching draft content failed, please try again',
        'm0004': ''
      },
      'stmsg': {
        'm0108': 'We are fetching batchlist...',
        'm0008': 'no-results',
        'm0020': 'You dont have any batch list...'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
  };

  const roleOrgMap = {

    'ORG_MODERATOR': ['01232002070124134414'],
    'COURSE_MENTOR': ['01232002070124134414'],
    'CONTENT_CREATOR': ['01232002070124134414'],
    'COURSE_CREATOR': ['01232002070124134414'],
    'ANNOUNCEMENT_SENDER': ['01232002070124134414'],
    'CONTENT_REVIEWER': ['01232002070124134414']
  };
  const fakeActivatedRoute = {
    'params': observableOf({ 'pageNumber': 1 }),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-course-batch', subtype: 'scroll', type: 'list',
          object: { type: 'batch', ver: '1.0' }
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BatchListComponent, BatchCardComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule,
         Ng2IziToastModule, RouterTestingModule, SharedModule.forRoot(),
        TelemetryModule.forRoot(), NgInviewModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService, BatchService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchListComponent);
    childfixture = TestBed.createComponent(BatchCardComponent);
    component = fixture.componentInstance;
    childcomponent = childfixture.componentInstance;
  });
  it('should call  batch search api and returns result count more than 1', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userSuccess.success));
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    spyOn(searchService, 'batchSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    fixture.detectChanges();
    component.fetchBatchList();
    expect(component.batchList).toBeDefined();
    expect(component.batchList.length).toBeGreaterThan(1);
    expect(component.showLoader).toBeFalsy();
  }));


  it('should call  batch search api and returns result count 0', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userSuccess.success));
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    spyOn(searchService, 'batchSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountZero));
    fixture.detectChanges();
    component.fetchBatchList();
    expect(component.batchList).toBeDefined();
    expect(component.batchList.length).toBe(0);
  }));
  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userSuccess.success));
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    spyOn(searchService, 'batchSearch').and.callFake(() => observableThrowError({}));
    fixture.detectChanges();
    component.fetchBatchList();
    expect(component.batchList.length).toBeLessThanOrEqual(0);
    expect(component.batchList.length).toEqual(0);
  }));

  it('should call setpage method and set proper page number', inject([Router],
    (route) => {
      const userService = TestBed.get(UserService);
      const learnerService = TestBed.get(LearnerService);
      spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userSuccess.success));
      userService._userProfile = testData.userSuccess.success;
      userService._userProfile.roleOrgMap = roleOrgMap;
      component.pager = testData.pager;
      component.pager.totalPages = 8;
      component.navigateToPage(1);
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/batches', component.pageNumber]);
    }));

  it('should call  user search api and returns result count more than 1', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userlist));
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    spyOn(searchService, 'batchSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    component.fetchBatchList();
    expect(component.batchList).toBeDefined();
    expect(component.batchList.length).toBeGreaterThan(1);
    spyOn(component, 'updateBatch').and.callThrough();
    spyOn(searchService, 'getUserList').and.callFake(() => observableOf(testData.userlist));
    component.updateBatch();
    spyOn(component, 'UserList').and.callThrough();
    const req = {
      'filters': {
        'identifier': [
          '6d4da241-a31b-4041-bbdb-dd3a898b3f8'
        ]
      }
    };
    component.UserList(req);
    expect(component.showLoader).toBeFalsy();
    expect(component.batchList).toEqual(testData.updateBatchlist);
  }));

   it('should call  user search api and throws error ', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userlist));
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    spyOn(searchService, 'batchSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    component.fetchBatchList();
    expect(component.batchList).toBeDefined();
    expect(component.batchList.length).toBeGreaterThan(1);
    spyOn(component, 'updateBatch').and.callThrough();
    spyOn(searchService, 'getUserList').and.callFake(() => observableThrowError({}));
    component.updateBatch();
    spyOn(component, 'UserList').and.callThrough();
    const req = {
      'filters': {
        'identifier': [
          '6d4da241-a31b-4041-bbdb-dd3a898b3f8'
        ]
      }
    };
    component.UserList(req);
    expect(component.showError).toBeTruthy();
    expect(component.noResult).toBeFalsy();
    expect(component.showLoader).toBeFalsy();
  }));


  it('should call  user search api and returns result count zero', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userlist));
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    spyOn(searchService, 'batchSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    component.fetchBatchList();
    expect(component.batchList).toBeDefined();
    expect(component.batchList.length).toBeGreaterThan(1);
    fixture.detectChanges();
    spyOn(component, 'updateBatch').and.callThrough();
    spyOn(searchService, 'getUserList').and.callFake(() => observableOf(testData.searchUserlistWithZero));
    component.updateBatch();
    spyOn(component, 'UserList').and.callThrough();
    spyOn(toasterService, 'error').and.callThrough();
    const req = {
      'filters': {
        'identifier': [
          '6d4da241-a31b-4041-bbdb-dd3a898b3f8'
        ]
      }
    };
    component.UserList(req);
  }));
  it('should call inview method for visits data', () => {
    const userService = TestBed.get(UserService);
    component.telemetryImpression = testData.telemetryData;
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(testData.userlist));
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    spyOn(component, 'inview').and.callThrough();
    component.inview(testData.event);
    fixture.detectChanges();
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
});


