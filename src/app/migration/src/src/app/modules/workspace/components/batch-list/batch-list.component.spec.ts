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
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { Ibatch } from './../../interfaces/batch';
// import batch card comoponet

// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './batch-list.component.spec.data';
const testData = mockData.mockRes;
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

  const mockroleOrgMap = {
      'ORG_MODERATOR': ['01232002070124134414'],
      'COURSE_MENTOR': ['01232002070124134414'],
      'CONTENT_CREATOR': ['01232002070124134414'],
       'COURSE_CREATOR': ['01232002070124134414'],
      'ANNOUNCEMENT_SENDER': ['01232002070124134414'],
      'CONTENT_REVIEWER': ['01232002070124134414']
    };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BatchListComponent, BatchCardComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, SharedModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle }
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
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess.success));
    userService._userProfile = mockroleOrgMap ;
    spyOn(searchService, 'batchSearch').and.callFake(() => Observable.of(testData.searchSuccessWithCountTwo));
    fixture.detectChanges();
    component.fetchBatchList();
    expect(component.batchList).toBeDefined();
    expect(component.batchList.length).toBeGreaterThan(1);
  }));
  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    spyOn(searchService, 'batchSearch').and.callFake(() => Observable.throw({}));
    fixture.detectChanges();
    component.fetchBatchList();
    expect(component.batchList.length).toBeLessThanOrEqual(0);
    expect(component.batchList.length).toEqual(0);
  }));
});


