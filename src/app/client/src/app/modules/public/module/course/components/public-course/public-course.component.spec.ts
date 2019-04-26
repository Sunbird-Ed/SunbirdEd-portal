import { PublicCourseComponent } from './public-course.component';
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
import { Response } from './public-course.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';


describe('PublicCourseComponent', () => {
  let component: PublicCourseComponent;
  let fixture: ComponentFixture<PublicCourseComponent>;
  let toasterService, formService, pageApiService, orgDetailsService, cacheService;
  const mockPageSection: Array<any> = Response.successData.result.response.sections;
  let sendOrgDetails = true;
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
      declarations: [PublicCourseComponent],
      providers: [PublicPlayerService, { provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCourseComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    formService = TestBed.get(FormService);
    pageApiService = TestBed.get(PageApiService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    cacheService = TestBed.get(CacheService);
    sendOrgDetails = true;
    sendPageApi = true;
    sendFormApi = true;
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
      }
      return throwError({});
    });
    spyOn(cacheService, 'get').and.callFake((options) => {
      return undefined;
    });
  });
  it('should emit filter data when getFilters is called with data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT'});
  });
  it('should emit filter data when getFilters is called with no data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([]);
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
});
