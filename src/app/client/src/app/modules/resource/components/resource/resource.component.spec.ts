import { BehaviorSubject, throwError, of} from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { SearchService, OrgDetailsService, CoreModule, UserService, PlayerService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { ResourceComponent } from './resource.component';
import { Response } from './resource.component.spec.data';
import { ContentSearchService } from '@sunbird/content-search';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;
  let toasterService, userService, pageApiService, orgDetailsService;
  const mockPageSection = Response.searchResult;
  let sendOrgDetails = true;
  let sendPageApi = true;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0027': 'Something went wrong',
        'm0090': 'Could not download. Try again later',
        'm0091': 'Could not copy content. Try again later',
        'm0004': 'Could not fetch date, try again later...'
      },
      'stmsg': {
        'm0009': 'error',
        'm0140': 'DOWNLOADING',
        'm0138': 'FAILED',
        'm0139': 'DOWNLOADED',
      },
      'emsg': {},
    },
    frmelmnts: {
      lbl: {}
    }
  };
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    params = of({});
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {slug: 'ap'},
      data: {
        telemetry: { env: 'resource', pageid: 'resource', type: 'view', subtype: 'paginate'}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [ResourceComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    userService = TestBed.get(UserService);
    pageApiService = TestBed.get(SearchService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    sendOrgDetails = true;
    sendPageApi = true;
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake((options) => {
      if (sendOrgDetails) {
        return of({result: { response: { value: '123' } }});
      }
      return throwError({});
    });
    spyOn(pageApiService, 'contentSearch').and.callFake((options) => {
      if (sendPageApi) {
        return of({mockPageSection});
      }
      return throwError({});
    });
  });
  it('should get channel id if user is from custodian org.', () => {
    const contentSearchService = TestBed.get(ContentSearchService);
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ framework: Response.mockFrameworkData});
    spyOnProperty(userService, 'hashTagId', 'get').and.returnValue('123');
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    spyOn<any>(component, 'setNoResultMessage');
    component.ngOnInit();
    expect(component.initFilter).toBe(true);
    expect(component['setNoResultMessage']).toHaveBeenCalled();
  });

  it('should get channel id if user is not from custodian org.', () => {
    const contentSearchService = TestBed.get(ContentSearchService);
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ framework: Response.mockFrameworkData});
    spyOnProperty(userService, 'hashTagId', 'get').and.returnValue('123456789');
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    spyOn<any>(component, 'setNoResultMessage');
    component.ngOnInit();
    expect(component.initFilter).toBe(true);
    expect(component['setNoResultMessage']).toHaveBeenCalled();
  });

  it('should throw error when channel id could not be fetched and user is from custodian org.', fakeAsync(() => {
    const contentSearchService = TestBed.get(ContentSearchService);
    const router = TestBed.get(Router);
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ framework: Response.mockFrameworkData});
    spyOnProperty(userService, 'hashTagId', 'get').and.returnValue('123');
    spyOn<any>(contentSearchService, 'initialize').and.callFake(() => throwError({}));
    spyOn(toasterService, 'error');
    component.ngOnInit();
    tick(5000);
    expect(toasterService.error).toHaveBeenCalledWith('Fetching content failed. Please try again later.');
    expect(router.navigate).toHaveBeenCalledWith(['']);
  }));

  it('should throw error when channel id could not be fetched and user is from custodian org.', fakeAsync(() => {
    const contentSearchService = TestBed.get(ContentSearchService);
    const router = TestBed.get(Router);
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ framework: Response.mockFrameworkData});
    spyOnProperty(userService, 'hashTagId', 'get').and.returnValue('123456789');
    spyOn<any>(contentSearchService, 'initialize').and.callFake(() => throwError({}));
    spyOn(toasterService, 'error');
    component.ngOnInit();
    tick(5000);
    expect(toasterService.error).toHaveBeenCalledWith('Fetching content failed. Please try again later.');
    expect(router.navigate).toHaveBeenCalledWith(['']);
  }));

  it('should fetch the filters and set to default values', () => {
    spyOn<any>(component, 'fetchContents');
    component.getFilters(Response.selectedFilters);
    expect(component.showLoader).toBe(true);
    expect(component.apiContentList).toEqual([]);
    expect(component.pageSections).toEqual([]);
    expect(component['fetchContents']).toHaveBeenCalled();
  });

  it('should fetch contents and disable loader if content search is successful', () => {
    sendPageApi = true;
    spyOn<any>(component, 'logTelemetryEvent');
    component.getFilters(Response.selectedFilters);
    expect(component.showLoader).toBe(false);
    expect(component.logTelemetryEvent).toHaveBeenCalledWith(true);
  });

  it('should not fetch contents, disable the loader and set values to default if content search is failed', () => {
    sendPageApi = false;
    spyOn<any>(component, 'logTelemetryEvent');
    spyOn<any>(toasterService, 'error');
    component.getFilters(Response.selectedFilters);
    expect(component.showLoader).toBe(false);
    expect(component.pageSections).toEqual([]);
    expect(component.apiContentList).toEqual([]);
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
    expect(component.logTelemetryEvent).toHaveBeenCalledWith(false);
  });

  it('log success telemetry event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn<any>(telemetryService, 'log');
    const mockLogObject = {
      context: {
        env: 'resource',
        cdata: []
      },
      edata: {
        type: 'content-search',
        level: 'SUCCESS',
        message: 'content search successful',
        pageid: 'resource'
      }
    };
    component.logTelemetryEvent(true);
    expect(telemetryService.log).toHaveBeenCalledWith(mockLogObject);
  });

  it('log error telemetry event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn<any>(telemetryService, 'log');
    const mockLogObject = {
      context: {
        env: 'resource',
        cdata: []
      },
      edata: {
        type: 'content-search',
        level: 'ERROR',
        message: 'content search failed',
        pageid: 'resource'
      }
    };
    component.logTelemetryEvent(false);
    expect(telemetryService.log).toHaveBeenCalledWith(mockLogObject);
  });

  it('should play content', () => {
    const playerService = TestBed.get(PlayerService);
    spyOn<any>(playerService, 'playContent');
    component.playContent(Response.playContentEvent);
    expect(playerService.playContent).toHaveBeenCalledWith(Response.playContentEvent.data);
  });

  it('should navigate to search page', () => {
    component.selectedFilters = Response.selectedFilters;
    const router = TestBed.get(Router);
    component.navigateToExploreContent();
    expect(router.navigate).toHaveBeenCalledWith(['search/Library', 1], {
      queryParams: {
        ...component.selectedFilters,
        appliedFilters: false,
        softConstraints: JSON.stringify({ badgeAssertions: 100, channel: 99, gradeLevel: 98, medium: 97, board: 96 })
      }
    });
  });

  it('should generate interact event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    const mockEventData = {
      context: {
        cdata: [{ type: 'section', id: 'English' }],
        env: 'resource',
      },
      edata: {
        id: 'content-card',
        type: 'click',
        pageid: 'resource'
      },
      object: {
        id: 'do_123456',
        type: 'textbook',
        ver: '1'
      }
    };
    component.getInteractEdata(Response.eventForSection, 'English');
    expect(telemetryService.interact).toHaveBeenCalledWith(mockEventData);
  });

  it('should call telemetry data', fakeAsync(() => {
    spyOn<any>(component, 'setTelemetryData');
    component.ngAfterViewInit();
    tick(200);
    expect(component['setTelemetryData']).toHaveBeenCalled();
  }));

  it('set messages', () => {
    component['setTelemetryData']();
  });

  it('set messages', () => {
    component['setNoResultMessage']();
  });
});
