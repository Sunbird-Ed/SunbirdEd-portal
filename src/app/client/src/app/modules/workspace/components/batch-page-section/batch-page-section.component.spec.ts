
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { BatchPageSectionComponent } from './batch-page-section.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, PaginationService, ToasterService, ResourceService, BatchCardComponent } from '@sunbird/shared';
import { UserService, LearnerService, SearchService, CoreModule } from '@sunbird/core';
import { WorkSpaceService, BatchService } from '../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as mockData from './batch-page-section.component.spec.data';
const testData = mockData.mockRes;
import * as _ from 'lodash-es';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { PageApiService } from '@sunbird/core';

describe('BatchPageSectionComponent', () => {
  let component: BatchPageSectionComponent;
  let fixture: ComponentFixture<BatchPageSectionComponent>;
  let childcomponent: BatchCardComponent;
  let childfixture: ComponentFixture<BatchCardComponent>;
  let pageApiService;
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
    'params': observableOf({ 'pageNumber': 1, 'category': 'created' }),
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
      declarations: [BatchPageSectionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        RouterTestingModule, SharedModule.forRoot(), CoreModule,
        TelemetryModule.forRoot(), NgInviewModule],
      providers: [PaginationService, WorkSpaceService, ResourceService, ToasterService, BatchService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchPageSectionComponent);
    childfixture = TestBed.createComponent(BatchCardComponent);
    component = fixture.componentInstance;
    childcomponent = childfixture.componentInstance;
  });

  it('should call get page api and return result', inject([], () => {
    const userService = TestBed.get(UserService);
    pageApiService = TestBed.get(PageApiService);
    const batchService = TestBed.get(BatchService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(batchService, 'updateEvent').and.returnValue(observableOf({}));
    spyOn(component, 'UserList').and.returnValue(observableOf(testData.userlist));
    spyOn(pageApiService, 'getBatchPageData').and.returnValue(observableOf(testData.successData));
    spyOn(component, 'fetchPageData').and.callThrough();
    spyOn(component, 'prepareCarouselData').and.callThrough();
    userService._userProfile = testData.userSuccess.success;
    userService._userProfile.roleOrgMap = roleOrgMap;
    component.ngOnInit();
    expect(component.carouselData.length).toBeGreaterThan(0);
  }));

  it('should redirect to update batch route on click of batch card', inject([], () => {
    const router = TestBed.get(Router);
    const batchData = testData.successData.sections[0].contents[0];
    spyOn(component, 'onCardClick').and.callThrough();
    component.onCardClick({data: batchData});
    expect(router.navigate).toHaveBeenCalledWith(['update/batch', batchData.identifier],
        {queryParamsHandling: 'merge', relativeTo: fakeActivatedRoute});
  }));

  it('should redirect to viewall page with queryparams', inject([], () => {
    const router = TestBed.get(Router);
    const searchQuery = '{"request":{"query":"","filters":{"status":"1"},"limit":10,"sort_by":{"createdDate":"desc"}}}';
    spyOn(component, 'viewAll').and.callThrough();
    component.viewAll({searchQuery: searchQuery, name: 'Ongoingbatches'});
    expect(router.navigate).toHaveBeenCalledWith(['/workspace/batches/view-all/Ongoingbatches', 1],
        {queryParams: { status: '1', defaultSortBy: '{"createdDate":"desc"}', exists: undefined }});
  }));

});


