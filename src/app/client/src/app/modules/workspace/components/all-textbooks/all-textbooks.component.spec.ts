
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { AllTextbooksComponent } from './all-textbooks.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Response } from './all-textbooks.component.spec.data';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { DateFilterXtimeAgoPipe } from './../../pipes';
import { configureTestSuite } from '@sunbird/test-util';

describe('AllTextbooksComponent', () => {
  let component: AllTextbooksComponent;
  let fixture: ComponentFixture<AllTextbooksComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0081': 'Fetching all content failed, please try again later...',
        'm0004': ''
      },
      'stmsg': {
        'm0110': 'We are fetching all content',
        'm0008': 'no-results',
        'm0125': 'No content to display. Start Creating Now'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    },
    languageSelected$: observableOf({})
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ subject: ['english', 'odia'] }),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-alltextbooks', type: 'list',
          object: { type: 'workspace', ver: '1.0' }
        }
      }
    }
  };
  const bothParams = { 'params': { 'pageNumber': '1' }, 'queryParams': { 'sort_by': 'Updated On' } };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllTextbooksComponent, DateFilterXtimeAgoPipe],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTextbooksComponent);
    component = fixture.componentInstance;
  });
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountTwo));
    component.fetchAllTextBooks(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.alltextbooks).toBeDefined();
  }));

  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    fixture.detectChanges();
    component.fetchAllTextBooks(9, 1, bothParams);
    expect(component.alltextbooks.length).toBeLessThanOrEqual(0);
    expect(component.alltextbooks.length).toEqual(0);
  }));
  it('should show no results for result count 0', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountZero));
    component.fetchAllTextBooks(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.alltextbooks).toBeDefined();
  }));

  it('should call fetchall content method and change the route  ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { subject: ['english'] };
      const queryParams = { subject: [] };
      spyOn(component, 'fetchAllTextBooks').and.callThrough();
      component.fetchAllTextBooks(9, 1, bothParams);
      fixture.detectChanges();
      expect(component.fetchAllTextBooks).toHaveBeenCalledWith(9, 1, bothParams);
    }));
  it('should call setpage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = Response.pager;
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
    }));
  it('should call setpage method and set proper page number', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = Response.pager;
      component.pager.totalPages = 8;
      component.navigateToPage(1);
      const sortByOption = 'Created On';
      component.queryParams = { subject: ['english'] };
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/alltextbooks', 1], { queryParams: undefined });
    }));
  it('should call inview method for visits data', () => {
    spyOn(component, 'inview').and.callThrough();
    component.telemetryImpression = {
      context: { env: 'workspace', cdata: [] },
      edata: {
        pageid: 'workspace-content-create',
        type: 'view', uri: '/workspace/content/create'
      }
    };
    component.inview(Response.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should open collection edition on list click', inject([WorkSpaceService, Router],
    (workSpaceService, route, http) => {
      spyOn(component, 'contentClick').and.callThrough();
      component.contentClick(Response.searchSuccessWithCountTwo.result.content[1]);
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/collection',
        'do_2124341006465925121871', 'TextBook', 'alltextbooks', 'NCF', 'Review']);
  }));
  it('should call delete api and get success response', inject([SuiModalService, WorkSpaceService, ActivatedRoute],
    (modalService, workSpaceService, activatedRoute, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => observableOf(Response.deleteSuccess));
      spyOn(component, 'deleteContent').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'delete').and.callThrough();
      const DeleteParam = {
        contentIds: ['do_2124645735080755201259']
      };
      component.deleteContent('do_2124645735080755201259');
      expect(component.deleteContent).toHaveBeenCalledWith('do_2124645735080755201259');
      workSpaceService.deleteContent(DeleteParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
    }));
    it('should call search content and get channel and get success response', inject([SuiModalService, WorkSpaceService],
      (modalService, workSpaceService) => {
        spyOn(workSpaceService, 'searchContent').and.callFake(() => observableOf(Response.searchedCollection));
        spyOn(workSpaceService, 'getChannel').and.callFake(() => observableOf(Response.channelDetail));
        spyOn(component, 'checkLinkedCollections').and.callThrough();
        spyOn(modalService, 'open').and.callThrough();
        component.checkLinkedCollections(undefined);
        expect(component.checkLinkedCollections).toHaveBeenCalledWith(undefined);
      }));
});
