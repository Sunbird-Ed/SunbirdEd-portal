import { LearnPageComponent } from './learn-page.component';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { FrameworkService, PageApiService, CoursesService, CoreModule, PlayerService, FormService, LearnerService, OrgDetailsService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response, custOrgDetails } from './learn-page.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';


describe('LearnPageComponent', () => {
  let component: LearnPageComponent;
  let fixture: ComponentFixture<LearnPageComponent>;
  let toasterService, formService, pageApiService, learnerService, cacheService, coursesService, frameworkService, orgDetailsService;
  const mockPageSection: Array<any> = Response.successData.result.response.sections;
  let sendEnrolledCourses = true;
  let sendPageApi = true;
  let sendFormApi = true;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {},
      'emsg': {},
      'stmsg': {}
    },
    'frmelmnts': {
      'lbl': {
        'mytrainings': 'My Trainings'
      }
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [LearnPageComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
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
    coursesService = TestBed.get(CoursesService);
    frameworkService = TestBed.get(FrameworkService);
    sendEnrolledCourses = true;
    sendPageApi = true;
    sendFormApi = true;
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
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.enrolledSection.name).toEqual(resourceBundle.frmelmnts.lbl.mytrainings);
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
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.enrolledSection.contents.length).toEqual(1);
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(1);
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
});
