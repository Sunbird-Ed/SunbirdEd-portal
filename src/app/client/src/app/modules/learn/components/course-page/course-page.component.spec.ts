import { CoursePageComponent } from '././course-page.component
import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { PageApiService, OrgDetailsService, CoreModule, UserService, FormService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicPlayerService } from './../../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './course-page.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';

describe('CoursePageComponent', () => {
  let component: CoursePageComponent;
  let fixture: ComponentFixture<CoursePageComponent>;
  let toasterService, formService, pageApiService, orgDetailsService, cacheService, utilService;
  const mockPageSection: Array<any> = Response.successData.result.response.sections;
  let sendOrgDetails = true;
  let sendPageApi = true;
  let sendFormApi = true;
  let sendMenuConfig = true;
  let activatedRouteStub;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {},
      'emsg': {},
      'stmsg': {}
    }
  };
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    params = of({});
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {slug: 'ap'},
      data: {
        telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate'}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [CoursePageComponent],
      providers: [PublicPlayerService, { provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePageComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    formService = TestBed.get(FormService);
    pageApiService = TestBed.get(PageApiService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    utilService = TestBed.get(UtilService);
    cacheService = TestBed.get(CacheService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
    sendOrgDetails = true;
    sendPageApi = true;
    sendFormApi = true;
    sendMenuConfig = true;
    activatedRouteStub.snapshot.queryParams = {};
    const responseToForm = [
      { 'index': 0, 'contentType': 'course', 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['course'] } },
      { 'index': 1, 'contentType': 'textbook', 'title': 'ACTIVITY_TEXTBOOK_TITLE', 'desc': 'ACTIVITY_TEXTBOOK_DESC', 'activityType': 'Content', 'isEnabled': false, 'filters': { 'contentType': ['TextBook'] } }
    ];
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
      if (sendOrgDetails) {
        return of({hashTagId: '123'});
      }
      return throwError({});
    });
    spyOn(pageApiService, 'getPageData').and.callFake((options) => {
      if (sendPageApi) {
        return of({sections: mockPageSection});
      }
      return throwError({});
    });
    spyOn(formService, 'getFormConfig').and.callFake((options) => {
      if (sendFormApi) {
        return of([{framework: 'TPD'}]);
      } else {
        return of(responseToForm);
      }
      //return throwError({});
    });
    spyOn(cacheService, 'get').and.callFake((options) => {
      return undefined;
    });
  });
  it('should emit filter data when getFilters is called with data', () => {
    component.facets = Response.facets;
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT'});
  });
  it('should set selected tab filters', () => {
    component.facets = Response.facets;
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters({
      'status': 'FETCHED', 'filters': {
        'selectedTab': 'course', 'channel': [
          'Chhattisgarh']
      }
    });
    expect(component.selectedFilters).toEqual({
      'selectedTab': 'course',
      'channel': [
        'Chhattisgarh'
      ]
    });
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalled();
  });
  it('should emit filter data when getFilters is called with no data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters({filters: []});
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({});
  });
  it('should fetch hashTagId from API and filter details from data driven filter component', () => {
    component.ngOnInit();
    // component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.hashTagId).toEqual('123');
    expect(component.frameWorkName).toEqual('TPD');
    // expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
  });
  it('should navigate to landing page if fetching org details fails and data driven filter dint returned data', () => {
    sendOrgDetails = false;
    component.ngOnInit();
    expect(component.router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should navigate to landing page if fetching org details fails and data driven filter returns data', () => {
    sendOrgDetails = false;
    component.ngOnInit();
    // component.getFilters([]);
    expect(component.router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should fetch content after getting hashTagId and filter data and set carouselData if api returns data', () => {
    spyOn(orgDetailsService, 'searchOrgDetails').and.callFake((options) => {
      return of(Response.orgSearch);
    });
    component.ngOnInit();
    // component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.hashTagId).toEqual('123');
    expect(component.frameWorkName).toEqual('TPD');
    // expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(1);
  });
  it('should not navigate to landing page if fetching frameWork from form service fails and data driven filter returns data', () => {
    sendFormApi = false;
    spyOn(orgDetailsService, 'searchOrgDetails').and.callFake((options) => {
      return of(Response.orgSearch);
    });
    component.ngOnInit();
    // component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.hashTagId).toEqual('123');
    expect(component.frameWorkName).toEqual(undefined);
    // expect(component.dataDrivenFilters).toEqual({});
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(1);
  });
  it('should fetch content after getting hashTagId and filter data and throw error if page api fails', () => {
    sendPageApi = false;
    spyOn(toasterService, 'error').and.callFake(() => {});
    component.ngOnInit();
    // component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.hashTagId).toEqual('123');
    expect(component.frameWorkName).toEqual('TPD');
    // expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.ngOnInit();
    component.redoLayout();
  });
  it('should getFormData', () => {
    sendFormApi = false;
    component.ngOnInit();
    formService = TestBed.get(FormService);
    component['getFormData']();
  });
  it('should getFormData', () => {
    activatedRouteStub.snapshot.queryParams.selectedTab = 'course';
    fixture.detectChanges();
    sendFormApi = false;
    component.ngOnInit();
    formService = TestBed.get(FormService);
    component['getFormData']();
  });

  it('should redirect to viewall page with queryparams', () => {
    const router = TestBed.get(Router);
    const searchQuery = '{"request":{"query":"","filters":{"status":"1"},"limit":10,"sort_by":{"createdDate":"desc"}}}';
    spyOn(component, 'viewAll').and.callThrough();
    spyOn(cacheService, 'set').and.stub();
    router.url = '/explore-course?selectedTab=course';
    component.viewAll({searchQuery: searchQuery, name: 'Featured-courses'});
    expect(router.navigate).toHaveBeenCalledWith(['/explore-course/view-all/Featured-courses', 1],
    {queryParams: { 'status': '1', 'defaultSortBy': '{"createdDate":"desc"}', 'exists': undefined }});
    expect(cacheService.set).toHaveBeenCalled();
  });

  it('should call play content method', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn(publicPlayerService, 'playContent').and.callThrough();
    const event = {
      data: {
        metaData: {
          identifier: 'do_21307528604532736012398'
        }
      }
    };
    component.playContent(event);
    expect(publicPlayerService.playContent).toHaveBeenCalled();
  });

  it('should generate visit telemetry impression event', () => {
    const event = {
      data: {
        metaData: {
          identifier: 'do_21307528604532736012398',
          contentType: 'Course'
        },
        section: 'Featured courses'
      }
    };
    component.prepareVisits(event);
    expect(component.telemetryImpression).toBeDefined();
  });


  it('should add audience type in fetch page data request body', () => {
    spyOn(localStorage, 'getItem').and.returnValue('teacher');
    component.queryParams = {sort_by: 'name', sortType: 'desc'};
    component['fetchPageData']();
    const option = {
      source: 'web', name: 'Course', organisationId: '*',
      filters: { sort_by: 'name', sortType: 'desc', audience: [ 'Teacher' ] },
      fields: [ 'name', 'appIcon', 'medium', 'subject', 'resourceType', 'contentType', 'organisation', 'topic', 'mimeType', 'trackable' ],
      params: { orgdetails: 'orgName,email' },
      facets: [ 'channel', 'gradeLevel', 'subject', 'medium' ]
    };
    expect(pageApiService.getPageData).toHaveBeenCalledWith(option);
  });

});
