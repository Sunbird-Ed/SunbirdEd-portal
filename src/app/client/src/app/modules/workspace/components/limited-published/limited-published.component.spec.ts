
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { DeleteComponent } from './../../../announcement/components/delete/delete.component';
// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { LimitedPublishedComponent } from './limited-published.component';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import {
  SuiModalService, TemplateModalConfig, ModalTemplate
} from 'ng2-semantic-ui';
import { mockUserData } from './../../../core/services/user/user.mock.spec.data';
// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './limited-published.component.spec.data';
const testData = mockData.mockRes;
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';

describe('LimitedPublishedComponent', () => {
  let component: LimitedPublishedComponent;
  let fixture: ComponentFixture<LimitedPublishedComponent>;
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
          env: 'workspace', pageid: 'workspace-content-unlisted', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0064': 'Fetching limited published content failed, please try again later...',
        'm0022': 'Deleting content failed, please try again later..'
      },
      'stmsg': {
        'm0082': 'We are fetching limited published content...',
        'm0008': 'no-results',
        'm0034': 'We are deleting the content...',
        'm0083': 'You don\'t have any limited publish content...'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LimitedPublishedComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, SharedModule.forRoot(),
        TelemetryModule.forRoot(), NgInviewModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitedPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    component.fetchLimitedPublished(9, 1);
    fixture.detectChanges();
    expect(component.limitedPublishList).toBeDefined();
    expect(component.limitedPublishList.length).toBeGreaterThan(1);
    expect(component.showLoader).toBeFalsy();
  }));

  it('should check offset is passing for search api ', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockUserData.success));
    userService._userData$.next({ err: null, userProfile: mockUserData.success });
    userService._userProfile = mockUserData.success;
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    spyOn(component, 'search').and.callThrough();
    component.pageNumber = 1;
    component.pageLimit = 1;
    const searchParams = {
    'filters': {
    'status': [
      'Unlisted'
    ],
    'createdBy': userService._userProfile.userid,
    'contentType': [
      'Collection',
      'TextBook',
      'Course',
      'LessonPlan',
      'Resource'
    ],
    'objectType': 'Content'
    },
    'offset': 0,
    'limit': 1,
    'sort_by': {
    'lastUpdatedOn': 'desc'
    }
    };
    component.fetchLimitedPublished(1, 1);
    expect(component.search).toHaveBeenCalledWith(searchParams);
    expect(component.limitedPublishList).toBeDefined();
    expect(component.showLoader).toBeFalsy();
  }));

  it('should call search api and returns result count 0', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountZero));
    component.fetchLimitedPublished(9, 1);
    fixture.detectChanges();
    expect(component.limitedPublishList).toBeDefined();
    expect(component.limitedPublishList.length).toBe(0);
    expect(component.showLoader).toBeFalsy();
  }));

  it('should call delete api and get success response', inject([WorkSpaceService, ActivatedRoute],
    (workSpaceService, activatedRoute, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => observableOf(testData.deleteSuccess));
      spyOn(component, 'contentClick').and.callThrough();
      const params = {
        action: {
          class: 'trash large icon', displayType: 'icon',
          eventName: 'delete'
        }, data: { metaData: { identifier: 'do_2124341006465925121871' } }
      };
      component.contentClick(params);
      const DeleteParam = {
        contentIds: ['do_2124645735080755201259']
      };
      workSpaceService.deleteContent(DeleteParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
      component.deleteConfirmModal('do_2124645735080755201259');
      expect(component.showLoader).toBeTruthy();
      fixture.detectChanges();
    }));

  it('should generate sharelink ', inject([WorkSpaceService, ActivatedRoute],
    (workSpaceService, activatedRoute, http) => {
      spyOn(component, 'contentClick').and.callThrough();
      const params = {
        action: {
          class: 'linkify large icon float-ContentLeft limitedPublishingLinkIcon', displayType: 'icon',
          eventName: 'share'
        }, data: {
          metaData: {
            identifier: 'do_2124341006465925121871', type: '',
            mimeType: 'application/vnd.ekstep.content-collection'
          }
        }
      };
      component.contentClick(params);
      expect(component.sharelinkModal).toBeTruthy();
      fixture.detectChanges();
    }));

  it('should open collection edition on card action  ', inject([WorkSpaceService, Router],
    (workSpaceService, route, http) => {
      spyOn(component, 'contentClick').and.callThrough();
      const params = {
        action: {
          eventName: 'onImage'
        }, data: {
          metaData: {
            identifier: 'do_2124341006465925121871',
            mimeType: 'application/vnd.ekstep.content-collection',
            contentType: 'TextBook',
            framework: 'NCF'
          }
        }
      };
      component.contentClick(params);
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/collection',
        'do_2124341006465925121871', 'TextBook', 'limited-publish', 'NCF']);
      fixture.detectChanges();
    }));
  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    component.fetchLimitedPublished(9, 1);
    fixture.detectChanges();
    expect(component.limitedPublishList.length).toBeLessThanOrEqual(0);
    expect(component.limitedPublishList.length).toEqual(0);
  }));

  it('should call setpage method and set proper page number', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 8;
      component.navigateToPage(1);
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/limited-publish', component.pageNumber]);
    }));

  it('should call setpage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
    }));
  it('should call inview method for visits data', () => {
    spyOn(component, 'inview').and.callThrough();
    component.inview(testData.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
});
