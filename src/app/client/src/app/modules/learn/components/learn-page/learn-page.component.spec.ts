import { LearnPageComponent } from './learn-page.component';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService,
  LayoutService } from '@sunbird/shared';
import { FrameworkService, PageApiService, UserService, CoursesService, CoreModule, FormService, LearnerService, OrgDetailsService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response, custOrgDetails } from './learn-page.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';

describe('LearnPageComponent', () => {
  let component: LearnPageComponent;
  let fixture: ComponentFixture<LearnPageComponent>;
  let toasterService, formService, pageApiService, learnerService, cacheService, utilService, coursesService,
    frameworkService, orgDetailsService;
  const mockPageSection: Array<any> = Response.successData.result.response.sections;
  let sendEnrolledCourses = true;
  let sendPageApi = true;
  let sendFormApi = true;
  let activatedRouteStub;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = '/learn';
  }

  const resourceBundle = {
    messages: {
      fmsg: {},
      emsg: {},
      stmsg: {}
    },
    frmelmnts: {
      lbl: {
        mytrainings: 'My Trainings',
        boards: 'boards',
        selectBoard: 'selectBoard',
        medium: 'medium',
        selectMedium: 'selectMedium',
        class: 'class',
        selectClass: 'selectClass',
        subject: 'subject',
        selectSubject: 'selectSubject',
        publisher: 'publisher',
        selectPublisher: 'selectPublisher',
        contentType: 'contentType',
        selectContentType: 'selectContentType',
        orgname: 'orgname'
      }
    },
    languageSelected$: of({})
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
      declarations: [LearnPageComponent],
      providers: [LayoutService, { provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnPageComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    formService = TestBed.get(FormService);
    pageApiService = TestBed.get(PageApiService);
    learnerService = TestBed.get(LearnerService);
    cacheService = TestBed.get(CacheService);
    utilService = TestBed.get(UtilService);
    coursesService = TestBed.get(CoursesService);
    frameworkService = TestBed.get(FrameworkService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
    sendEnrolledCourses = true;
    sendPageApi = true;
    sendFormApi = true;
    activatedRouteStub.snapshot.queryParams = {};
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of(custOrgDetails));
    spyOn(learnerService, 'get').and.callFake((options) => {
      if (sendEnrolledCourses) {
        return of({result: {courses: Response.enrolledCourses}});
      }
      return throwError({});
    });
    spyOn(pageApiService, 'getPageData').and.callFake((options) => {
      if (sendPageApi) {
        return of({sections: mockPageSection});
      }
      return throwError({});
    });
    spyOn(frameworkService, 'getDefaultCourseFramework').and.callFake((options) => {
      if (sendFormApi) {
        return of('cbse-tpd');
      }
      return throwError({});
    });
    spyOn(cacheService, 'get').and.callFake((options) => {
      return undefined;
    });
    spyOn(toasterService, 'error').and.callFake(() => {});
  });
  it('should emit filter data when getFilters is called with data', () => {
    component.facets = Response.facets;
    coursesService.initialize();
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT'});
  });
  it('should emit filter data when getFilters is called with no data', () => {
    coursesService.initialize();
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({});
  });
  it('should fetch enrolledSection from API and name must be My Trainings', () => {
    coursesService.initialize();
    spyOn<any>(component, 'getLanguageChange');
    component.ngOnInit();
    component.layoutConfiguration = null;
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.enrolledSection.name).toEqual(resourceBundle.frmelmnts.lbl.mytrainings);
    expect(component['getLanguageChange']).toHaveBeenCalled();
  });
  it('should change the title for My-training on language change', () => {
    component.enrolledSection = { name: 'My Courses' };
    component.layoutConfiguration = null;
    component['getLanguageChange']();
    expect(component.enrolledSection.name).toBeDefined();
  });
  it('should fetch hashTagId from API and filter details from data driven filter component', () => {
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.enrolledSection.contents.length).toEqual(1);
    expect(component.frameWorkName).toEqual('cbse-tpd');
  });
  it('should not throw error if fetching enrolled course fails', () => {
    sendEnrolledCourses = false;
    coursesService.initialize();
    component.ngOnInit();
    expect(toasterService.error).not.toHaveBeenCalled();
    expect(component.enrolledSection.contents.length).toEqual(0);
  });
  it('should fetch content after getting hashTagId and filter data and set carouselData if api returns data', fakeAsync(() => {
    spyOn(orgDetailsService, 'searchOrgDetails').and.callFake((options) => {
      return of(Response.orgSearch);
    });
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.enrolledSection.contents.length).toEqual(1);
    expect(component.frameWorkName).toEqual('cbse-tpd');
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(1);
  }));
  it('should not throw error if fetching frameWork from form service fails', fakeAsync(() => {
    spyOn(orgDetailsService, 'searchOrgDetails').and.callFake((options) => {
      return of(Response.orgSearch);
    });
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.enrolledSection.contents.length).toEqual(1);
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(1);
  }));

  it('should fetch content after getting hashTagId and filter data and set carouselData if api returns data', fakeAsync(() => {
    spyOn(orgDetailsService, 'searchOrgDetails').and.callFake((options) => {
      return throwError(Response.orgSearch);
    });
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.pageSections).toEqual([]);
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(0);
  }));

  it('should fetch content after getting hashTagId and filter data and throw error if page api fails', fakeAsync(() => {
    sendPageApi = false;
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.enrolledSection.contents.length).toEqual(1);
    expect(component.frameWorkName).toEqual('cbse-tpd');
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  }));
  it('should unsubscribe from all observable subscriptions', () => {
    coursesService.initialize();
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should redirect to view-all page' , () => {
    const userService = TestBed.get(UserService);
    const router = TestBed.get(Router);
    const eventData = Response.viewAllEventData;
    userService._userProfile = Response.userData;
    const searchQueryParams = {
      'contentType': [
        'Course'
      ],
      'objectType': [
        'Content'
      ],
      'status': [
        'Live'
      ],
      'defaultSortBy': '{\"lastPublishedOn\":\"desc\"}',
      'exists': undefined
    };
    component.queryParams = {};
    const queryParams = {...component.queryParams, ...searchQueryParams};
    spyOn(cacheService, 'set').and.stub();
    component.viewAll(eventData);
    expect(router.navigate).toHaveBeenCalledWith(['/learn/view-all/My-courses', 1], {queryParams: queryParams});
    expect(cacheService.set).toHaveBeenCalledWith('viewAllQuery', searchQueryParams, {maxAge: 600});
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
    const response = [
      { 'index': 0, 'contentType': 'course', 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['course'] } },
      { 'index': 1, 'contentType': 'textbook', 'title': 'ACTIVITY_TEXTBOOK_TITLE', 'desc': 'ACTIVITY_TEXTBOOK_DESC', 'activityType': 'Content', 'isEnabled': false, 'filters': { 'contentType': ['TextBook'] } }
    ];
    formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(of(response));
    component['getFormData']();
  });
  it('should getFormData', () => {
    activatedRouteStub.snapshot.queryParams.selectedTab = 'course';
    fixture.detectChanges();
    const response = [
      { 'index': 0, 'contentType': 'course', 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['course'] } },
      { 'index': 1, 'contentType': 'textbook', 'title': 'ACTIVITY_TEXTBOOK_TITLE', 'desc': 'ACTIVITY_TEXTBOOK_DESC', 'activityType': 'Content', 'isEnabled': false, 'filters': { 'contentType': ['TextBook'] } }
    ];
    formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(of(response));
    component['getFormData']();
  });

  it('should fetch enrolledSection from API and name must be My Trainings', () => {
    coursesService.initialize();
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'isLayoutAvailable').and.returnValue(null);
    component.layoutConfiguration = null;
    component.ngOnInit();
    component.redoLayout();
    expect(component.enrolledSection.name).toEqual(resourceBundle.frmelmnts.lbl.mytrainings);
  });

  it('should get processed facets data', () => {
    const facetsData = component.updateFacetsData(Response.facetsList);
    expect(facetsData).toEqual(Response.updatedFacetsList);
  });

  it('should redo layout if config not present', () => {
    component.layoutConfiguration = null;
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'redoLayoutCSS').and.returnValue('redoLayoutCSS');
    component.redoLayout();
    expect(component.FIRST_PANEL_LAYOUT).toEqual('redoLayoutCSS');
    expect(component.SECOND_PANEL_LAYOUT).toEqual('redoLayoutCSS');
  });

  it('should update channels on getting the filters', () => {
    component.facets = Response.facets;
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters(Response.getFiltersInput);
    expect(component.selectedFilters).toEqual(Response.getFiltersOutput);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalled();
  });

});
