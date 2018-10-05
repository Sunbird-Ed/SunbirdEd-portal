
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { AllContentComponent } from './all-content.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService , DateFilterXtimeAgoPipe} from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Response } from './all-content.component.spec.data';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
describe('AllContentComponent', () => {
  let component: AllContentComponent;
  let fixture: ComponentFixture<AllContentComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0081': 'Fetching all contnet failed, please try again later...',
        'm0004': ''
      },
      'stmsg': {
        'm0110': 'We are fetching all contnet',
        'm0008': 'no-results',
        'm0033': 'Looks like there is nothing to show here. Please go to “Create” to start creating content'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
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
          env: 'workspace', pageid: 'workspace-content-allcontent', type: 'list',
          object: { type: 'workspace', ver: '1.0' }
        }
      }
    }
  };
  const bothParams = { 'params': { 'pageNumber': '1' }, 'queryParams': { 'sort_by': 'Updated On' } };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllContentComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot()],
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
    fixture = TestBed.createComponent(AllContentComponent);
    component = fixture.componentInstance;
  });
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountTwo));
    component.fecthAllContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.allContent).toBeDefined();
  }));

  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    fixture.detectChanges();
    component.fecthAllContent(9, 1, bothParams);
    expect(component.allContent.length).toBeLessThanOrEqual(0);
    expect(component.allContent.length).toEqual(0);
  }));
  it('should show no results for result count 0', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountZero));
    component.fecthAllContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.allContent).toBeDefined();
  }));

  it('should call fetchall content method and change the route  ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { subject: ['english'] };
      const queryParams = { subject: [] };
      spyOn(component, 'fecthAllContent').and.callThrough();
      component.fecthAllContent(9, 1, bothParams);
      fixture.detectChanges();
      expect(component.fecthAllContent).toHaveBeenCalledWith(9, 1, bothParams);
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
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/allcontent', 1], { queryParams: undefined });
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
  it('should open collection edition on list click   ', inject([WorkSpaceService, Router],
    (workSpaceService, route, http) => {
      spyOn(component, 'contentClick').and.callThrough();
      component.contentClick(Response.searchSuccessWithCountTwo.result.content[1]);
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/collection',
        'do_2124341006465925121871', 'TextBook', 'allcontent', 'NCF']);
      fixture.detectChanges();
  }));
  it('should call delete api and get success response', inject([SuiModalService, WorkSpaceService, ActivatedRoute],
    (modalService, workSpaceService, activatedRoute, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => observableOf(Response.deleteSuccess));
      spyOn(component, 'deleteConfirmModal').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'delete').and.callThrough();
      const DeleteParam = {
        contentIds: ['do_2124645735080755201259']
      };
      component.deleteConfirmModal('do_2124645735080755201259');
      expect(component.deleteConfirmModal).toHaveBeenCalledWith('do_2124645735080755201259');
      workSpaceService.deleteContent(DeleteParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
    }));
  it('should set lastUpdated Date by calling the filter', inject([SearchService], (searchService) => {
    spyOn(searchService , 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountTwo));
    fixture.detectChanges();
    component.fecthAllContent(9, 1, bothParams);
    const  fromnow = new DateFilterXtimeAgoPipe();
    expect(fromnow.transform(Response.searchSuccessWithCountTwo.result.content[0].lastSubmittedOn, null)).toEqual('6 months ago');
  }));
});
