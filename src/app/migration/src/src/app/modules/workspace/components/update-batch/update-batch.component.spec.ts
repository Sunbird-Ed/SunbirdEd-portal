import { UpdateBatchComponent } from './update-batch.component';

// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
// Import services
import { SharedModule, PaginationService, ToasterService, ResourceService, RouterNavigationService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService, BatchService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Response } from './update-batch.component.spec.data';
describe('UpdateBatchComponent', () => {
  let component: UpdateBatchComponent;
  let fixture: ComponentFixture<UpdateBatchComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0054': 'Fetching batch list  failed, please try again',
        'm0055': 'Updating batchlist is failed',
        'm0056' : 'Fetching user list  failed, please try again'
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
      declarations: [UpdateBatchComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, SharedModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        RouterNavigationService, BatchService,
        { provide: ResourceService, useValue: resourceBundle }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBatchComponent);
    component = fixture.componentInstance;
  });
  it('should call  batch search api with id and returns result count more than 1', inject([BatchService], (batchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    spyOn(batchService, 'getBatchDetailsById').and.callFake(() => Observable.of(Response.batchlistSucessData));
    fixture.detectChanges();
    expect(component.batchData).toBeDefined();
  }));
  it('should throw error', inject([BatchService], (batchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    spyOn(batchService, 'getBatchDetailsById').and.callFake(() => Observable.throw({}));
    fixture.detectChanges();
    expect(component.batchData).toBeUndefined();
  }));

  it('Should load user list', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    spyOn(searchService, 'getUserList').and.callFake(() => Observable.of(Response.uselistSucessData));
    fixture.detectChanges();
  }));
  it('Should clear form on clearForm call', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    component.ngOnInit();
    component.batchAddUserForm.reset();
  }));
});


