import { SlickModule } from 'ngx-slick';
import { BehaviorSubject, throwError, of} from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { SearchService, OrgDetailsService, CoreModule, UserService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicPlayerService } from './../../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RESPONSE } from './explore.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { ExploreComponent } from './explore.component';
import { ContentSearchService } from '@sunbird/content-search';
import { configureTestSuite } from '@sunbird/test-util';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let toasterService, userService, pageApiService, orgDetailsService;
  const mockPageSection: any = RESPONSE.searchResult;
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
        'm0004': 'Could not fetch date, try again later...',
        'm0005': 'Could not fetch data, try again later...'
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
      lbl: {
        fetchingContentFailed: 'Fetching content failed. Please try again later.'
      },

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
        telemetry: { env: 'explore', pageid: 'explore', type: 'view', subtype: 'paginate'}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
      declarations: [ExploreComponent],
      providers: [PublicPlayerService, { provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    userService = TestBed.get(UserService);
    pageApiService = TestBed.get(SearchService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    sendOrgDetails = true;
    sendPageApi = true;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
      if (sendOrgDetails) {
        return of({hashTagId: '123'});
      }
      return throwError({});
    });
    spyOn(pageApiService, 'contentSearch').and.callFake((options) => {
      if (sendPageApi) {
        return of(mockPageSection);
      }
      return throwError({});
    });
  });
  it('should get channel id if slug is not available', () => {
    const contentSearchService = TestBed.get(ContentSearchService);
    component.activatedRoute.snapshot.params.slug = '';
    spyOn<any>(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of(RESPONSE.withoutSlugGetChannelResponse));
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    spyOn<any>(component, 'setNoResultMessage').and.callThrough();
    component.ngOnInit();
    expect(component['setNoResultMessage']).toHaveBeenCalled();
    expect(component.initFilter).toBe(true);
  });

  it('should get channel id if slug is available', () => {
    const contentSearchService = TestBed.get(ContentSearchService);
    component.activatedRoute.snapshot.params.slug = 'tn';
    spyOnProperty(userService, 'slug', 'get').and.returnValue('tn');
    sendOrgDetails = true;
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    spyOn<any>(component, 'setNoResultMessage').and.callThrough();
    component.ngOnInit();
    expect(component['setNoResultMessage']).toHaveBeenCalled();
    expect(component.initFilter).toBe(true);
  });

  it('should show error if contentSearchService is not initialized and slug is not available', fakeAsync(() => {
    const contentSearchService = TestBed.get(ContentSearchService);
    component.activatedRoute.snapshot.params.slug = '';
    spyOn<any>(component, 'getChannelId').and.callFake(() => throwError({}));
    spyOn(component['navigationhelperService'], 'goBack');
    spyOn<any>(toasterService, 'error');
    component.ngOnInit();
    tick(5000);
    expect(toasterService.error).toHaveBeenCalledWith('Fetching content failed. Please try again later.');
    expect(component['navigationhelperService'].goBack).toHaveBeenCalled();
  }));

  it('should show error if contentSearchService is not initialized and slug is available', fakeAsync(() => {
    const contentSearchService = TestBed.get(ContentSearchService);
    spyOnProperty(userService, 'slug', 'get').and.returnValue('ap');
    spyOn(component['navigationhelperService'], 'goBack');
    sendOrgDetails = false;
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    spyOn<any>(component, 'setNoResultMessage').and.callThrough();
    spyOn<any>(toasterService, 'error');
    component.ngOnInit();
    tick(5000);
    expect(toasterService.error).toHaveBeenCalledWith('Fetching content failed. Please try again later.');
    expect(component['navigationhelperService'].goBack).toHaveBeenCalled();
  }));

  it('should fetch the filters and set to default values', () => {
    spyOn<any>(component, 'fetchContents');
    component.getFilters({ filters: RESPONSE.selectedFilters, status: 'FETCHED'});
    expect(component.showLoader).toBe(true);
    expect(component.apiContentList).toEqual([]);
    expect(component.pageSections).toEqual([]);
    expect(component['fetchContents']).toHaveBeenCalled();
  });

  it('should navigate to search page', () => {
    component.selectedFilters = RESPONSE.selectedFilters;
    const router = TestBed.get(Router);
    component.navigateToExploreContent();
    expect(router.navigate).toHaveBeenCalledWith(['explore', 1], {
      queryParams: {
        ...component.selectedFilters,
        appliedFilters: false,
        softConstraints: JSON.stringify({ badgeAssertions: 100, channel: 99, gradeLevel: 98, medium: 97, board: 96 })
      }
    });
  });

  it('should fetch contents and disable loader', () => {
    sendPageApi = true;
    component.getFilters({ filters: RESPONSE.selectedFilters, status: 'FETCHED'});
    expect(component.showLoader).toBe(false);
  });

  it('should fetch contents, disable the loader and set values to default', () => {
    sendPageApi = false;
    spyOn<any>(toasterService, 'error');
    component.getFilters({ filters: RESPONSE.selectedFilters, status: 'FETCHED'});
    expect(component.showLoader).toBe(false);
    expect(component.pageSections).toEqual([]);
    expect(component.apiContentList).toEqual([]);
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0005);
  });

  it('should play content', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn<any>(publicPlayerService, 'playContent');
    spyOn(component, 'getInteractEdata');
    component.playContent(RESPONSE.playContentEvent, 'test');
    expect(publicPlayerService.playContent).toHaveBeenCalledWith(RESPONSE.playContentEvent);
    expect(component.getInteractEdata).toHaveBeenCalled();
  });

  it('should return  data from search', () => {
    component.channelId = '123',
    component['contentSearchService']._frameworkId = '123456';
    const option = {filters: {},
    fields: [ 'name', 'appIcon', 'gradeLevel', 'medium', 'board', 'subject', 'resourceType', 'contentType', 'organisation' ],
    isCustodianOrg: true,
    channelId: '123',
    frameworkId: '123456'
    };
    spyOn(component['searchService'], 'fetchCourses').and.returnValue(of ([{title: 'English', count: 2}, { title: 'Social', count: 1}]
    ));
    component['fetchCourses']();
    expect(component['searchService'].fetchCourses).toHaveBeenCalledWith(option,  ['Course']);
    expect(component.cardData.length).toEqual(2);

  });

  it('should return empty data from search', () => {
    component.channelId = '123',
    component['contentSearchService']._frameworkId = '123456';
    const option = {filters: {},
    fields: [ 'name', 'appIcon', 'gradeLevel', 'medium', 'board', 'subject', 'resourceType', 'contentType', 'organisation' ],
    isCustodianOrg: true,
    channelId: '123',
    frameworkId: '123456'
    };
    spyOn(component['searchService'], 'fetchCourses').and.returnValue(of ([]
    ));
    component['fetchCourses']();
    expect(component['searchService'].fetchCourses).toHaveBeenCalledWith(option,  ['Course']);
    expect(component.cardData.length).toEqual(0);

  });


  it('should call telemetry.interact()', () => {
    spyOn(component.telemetryService, 'interact');
    const data = {
      cdata: [ {type: 'card', id: 'course'}],
      edata: {id: 'test'},
      object: {},
    };
    const cardClickInteractData = {
      context: {
        cdata: data.cdata,
        env: 'explore',
      },
      edata: {
        id: data.edata.id,
        type: 'click',
        pageid: 'explore'
      },
      object: data.object
    };
    component.getInteractEdata(data);
    expect(component.telemetryService.interact).toHaveBeenCalledWith(cardClickInteractData);
  });

  it ('should call getInteractEdata() from navigateToCourses', () => {
    const event  = {data: {title: 'test', contents: [{identifier: '1234'}]}};
    const data = {
      cdata: [ {type: 'library-courses', id: 'test'}],
      edata: {id: 'course-card'},
      object: {},
    };
    spyOn(component, 'getInteractEdata');
    component.navigateToCourses(event);
    expect(component.getInteractEdata).toHaveBeenCalledWith(data);
    expect(component['router'].navigate).toHaveBeenCalledWith(['explore-course/course', '1234']);
  });

  it ('should call list/curriculum-courses() from navigateToCourses', () => {
    const event  = {data: {title: 'test', contents: [{identifier: '1234'}, {identifier: '23456'}]}};
    component.navigateToCourses(event);
    expect(component['router'].navigate).toHaveBeenCalledWith(['explore/list/curriculum-courses'], {
      queryParams: {title: 'test'}
    });
    expect(component['searchService'].subjectThemeAndCourse).toEqual(event.data);
  });
});
