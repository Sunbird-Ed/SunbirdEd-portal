
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { DeleteComponent } from './../../../announcement/components/delete/delete.component';
// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
// Import services
import { DraftComponent } from './draft.component';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './draft.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
const testData = mockData.mockRes;
describe('DraftComponent', () => {
  let component: DraftComponent;
  let fixture: ComponentFixture<DraftComponent>;
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
          env: 'workspace', pageid: 'workspace-content-draft', subtype: 'scroll', type: 'list',
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
        'm0006': 'Fetching draft content failed, please try again',
        'm0022': 'Deleting content failed, please try again later..'
      },
      'stmsg': {
        'm0011': 'We are fetching draft content...',
        'm0008': 'no-results',
        'm0125': 'No content to display. Start Creating Now'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    },
    languageSelected$: observableOf({})
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DraftComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule.forRoot(),
        TelemetryModule.forRoot(), NgInviewModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService, SuiModalService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call search api and returns result count more than 1', inject([SearchService, WorkSpaceService],
    (searchService, workSpaceService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    spyOn(workSpaceService, 'getContentLockList').and.callFake(() => observableOf({result: {count: 0}}));
    component.fetchDrafts(9, 1);
    fixture.detectChanges();
    expect(component.draftList).toBeDefined();
    expect(component.draftList.length).toBeGreaterThan(1);
  }));

  it('should call delete api and get success response', inject([SuiModalService, WorkSpaceService, ActivatedRoute],
    (modalService, workSpaceService, activatedRoute, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => observableOf(testData.deleteSuccess));
      spyOn(component, 'contentClick').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'delete').and.callThrough();
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
      fixture.detectChanges();
    }));

  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    component.fetchDrafts(9, 1);
    fixture.detectChanges();
    expect(component.draftList.length).toBeLessThanOrEqual(0);
    expect(component.draftList.length).toEqual(0);
  }));

  it('should call setpage method and set proper page number', inject([Router],
    (route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 8;
      component.navigateToPage(1);
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/draft', component.pageNumber]);
    }));

  it('should call deleteConfirmModal method to delte the content', inject([],
    () => {
      component.deleteConfirmModal('do_2124339707713126401772');
      spyOn(component, 'removeContent').and.callThrough();
      component.removeContent(testData.localContentData, 'do_112523105235623936168');
      expect(component.removeContent).toHaveBeenCalled();
      expect(component.draftList.length).toBeLessThanOrEqual(1);
      expect(component.showLoader).toBeTruthy();
    }));

  it('should call setpage method and set proper page number 1', inject([Router],
    (route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
    }));

  it('should call search api and returns result count 0', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountZero));
    component.fetchDrafts(9, 1);
    fixture.detectChanges();
    expect(component.draftList).toBeDefined();
    expect(component.draftList.length).toBe(0);
    expect(component.showLoader).toBeFalsy();
  }));

  it('should call navigateToContent to open content player when action type is onImage', inject([Router],
    (route) => {
      const params = {
        action: {
          class: 'trash large icon', displayType: 'icon',
          eventName: 'onImage'
        }, data: { metaData: { identifier: 'do_2124341006465925121871' } }
      };
      const userService = TestBed.get(UserService);
      userService._userProfile = {};
      component.contentClick(params);
      expect(component.pageNumber).toEqual(1);
    }));
  it('should call inview method for visits data', fakeAsync(() => {
    spyOn(component, 'inview').and.callThrough();
    component.ngAfterViewInit();
    tick(100);
    component.inview(testData.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  }));
  it('should call setpage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
    }));
  it('should call setpage method and set proper page number', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 8;
      component.navigateToPage(1);
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/draft', component.pageNumber]);
    }));
  xit('should fetch drafts list freshly if all contents are deleted from single page',
    inject([SuiModalService, ConfigService, Router, SearchService],
    (modalService, configService, route) => {
      spyOn(component, 'fetchDrafts').and.callThrough();
      spyOn(component, 'delete').and.callFake(() => observableOf({}));
      spyOn(modalService, 'open').and.callFake(() => observableOf({}));
      spyOn(modalService, 'approve').and.callFake(() => observableOf({}));
      component.draftList = testData.localSingleContentData;
      component.deleteConfirmModal('do_112523105235623936168');
      expect(component.fetchDrafts).toHaveBeenCalled();
    }));
});


