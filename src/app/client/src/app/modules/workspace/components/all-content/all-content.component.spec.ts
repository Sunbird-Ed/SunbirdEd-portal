import { AllContentComponent } from './all-content.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import {Response} from './all-content.component.spec.data';

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
    'params': Observable.from([{ pageNumber: '1' }]),
    'queryParams': Observable.from([{ subject: ['english', 'odia'] }]),
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
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule],
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
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(Response.searchSuccessWithCountTwo));
    component.fecthAllContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.allContent).toBeDefined();
  }));

  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.throw({}));
    fixture.detectChanges();
    component.fecthAllContent(9, 1, bothParams);
    expect(component.allContent.length).toBeLessThanOrEqual(0);
    expect(component.allContent.length).toEqual(0);
  }));
  it('should show no results for result count 0', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(Response.searchSuccessWithCountZero));
    component.fecthAllContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.allContent).toBeDefined();
  }));

  it('should call fetchall content method and change the route  ', inject([ConfigService, Router],
    (configService, route) => {
    component.queryParams = { subject: ['english'] };
    const queryParams = {subject: [ ]};
    spyOn(component, 'fecthAllContent').and.callThrough();
    component.fecthAllContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.fecthAllContent).toHaveBeenCalledWith(9, 1, bothParams);
  }));
});


