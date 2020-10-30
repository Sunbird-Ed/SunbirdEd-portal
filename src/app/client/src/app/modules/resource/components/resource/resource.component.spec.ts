import { SlickModule } from 'ngx-slick';
import {BehaviorSubject, of as observableOf, of} from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import {CoreModule, CoursesService, PlayerService, FormService, SearchService, OrgDetailsService, UserService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { ResourceComponent } from './resource.component';
import { configureTestSuite } from '@sunbird/test-util';
import {Response} from './resource.component.spec.data';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;
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
        'm0051': 'Something went wrong, try again later'
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
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'], selectedTab: 'textbook' });
    params = of({});
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: { slug: 'ap' },
      data: {
        telemetry: { env: 'library', pageid: 'library', type: 'view', subtype: 'paginate' }
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
      declarations: [ResourceComponent],
      providers: [OrgDetailsService, SearchService, { provide: ResourceService, useValue: resourceBundle },
        FormService, UserService,
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call telemetry.interact()', () => {
    spyOn(component.telemetryService, 'interact');
    const data = {
      cdata: [{ type: 'card', id: 'course' }],
      edata: { id: 'test' },
      object: {},
    };
    const cardClickInteractData = {
      context: {
        cdata: data.cdata,
        env: 'library',
      },
      edata: {
        id: data.edata.id,
        type: 'click',
        pageid: 'library'
      },
      object: data.object
    };
    component.getInteractEdata(data);
    expect(component.telemetryService.interact).toHaveBeenCalledWith(cardClickInteractData);
  });

  it('should call getInteractEdata() from navigateToCourses', () => {
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    const data = {
      cdata: [{ type: 'library-courses', id: 'test' }],
      edata: { id: 'course-card' },
      object: {},
    };
    spyOn(component, 'getInteractEdata');
    component.navigateToCourses(event);
    expect(component.getInteractEdata).toHaveBeenCalledWith(data);
  });

  it('should call list/curriculum-courses() from navigateToCourses', () => {
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }, { identifier: '23456' }] } };
    component.navigateToCourses(event);
    expect(component['router'].navigate).toHaveBeenCalledWith(['resources/curriculum-courses'], {
      queryParams: { title: 'test' }
    });
    expect(component['searchService'].subjectThemeAndCourse).toEqual(event.data);
  });

  it('should open course-details page with the enrolled batch', () => {
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'playContent');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 1, expiredBatchCount: 0, openBatch: {
        ongoing: [{ batchId: 15332323 }]
      }, inviteOnlyBatch: {}
    });
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    component.navigateToCourses(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });

  it('should open course-details page with the invited batch', () => {
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'playContent');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 1, expiredBatchCount: 0, openBatch: { ongoing: [] }, inviteOnlyBatch: { ongoing: [{ batchId: 15332323 }] }
    });
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    component.navigateToCourses(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });

  it('Should show error message when multiple ongoing batches are present', () => {
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(playerService, 'playContent');
    spyOn(toasterService, 'error');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 2, expiredBatchCount: 0, openBatch: { ongoing: [] }, inviteOnlyBatch: { ongoing: [] }
    });
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    component.navigateToCourses(event);
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });
  it('should redo layout on render', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    component.layoutConfiguration = {};
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.ngOnInit();
    component.redoLayout();
  });
  it('should call the getFilter Method and set the filter', () => {
    const data = {
      filters: {},
      status: 'NotFetching'
    };
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.searchSuccessData));
    component.formData = Response.formData;
    spyOn(component, 'getFilters').and.callThrough();
    component.getFilters(data);
    component.getPageData('textbook');
    expect(component.getFilters).toHaveBeenCalledWith(data);
  });
  it('should call the getPageData Method', () => {
    const data = {
      filters: {},
      status: 'FETCHING'
    };
    component.formData = Response.formData;
    component.getFilters(data);
    spyOn(component, 'getPageData').and.callThrough();
    component.getPageData('textbook');
    expect(component.getPageData).toHaveBeenCalledWith('textbook');
  });
  xit('should call the getFilter Method and set audience type as filters', () => {
    const data = {
      filters: {},
      status: 'NotFetching'
    };
    spyOn(localStorage, 'getItem').and.returnValue('teacher');
    component.formData = Response.formData;
    component.getFilters(data);
    expect(component.selectedFilters).toEqual({audience: [ 'Teacher' ]});
  });

  it('should call getChannelId for non custodian org', () => {
    const userService = TestBed.get(UserService);
    userService._hashTagId = '321';
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() => observableOf({result: {response: {content: 'data'}}}));
    component['getChannelId']().subscribe((result) => {
      expect(result).toEqual({ channelId: '321', custodianOrg: false });
    });
  });

  it('should call getChannelId for custodian org', () => {
    const userService = TestBed.get(UserService);
    userService._hashTagId = '321';
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() => observableOf({result: {response: {value: '321'}}}));
    component['getChannelId']().subscribe((result) => {
      expect(result).toEqual({ channelId: '321', custodianOrg: true });
    });
  });
  it('should generate visit telemetry impression event', () => {
    const event = {
      data: {
        metaData: {
          identifier: 'do_21307528604532736012398',
          contentType: 'textbook'
        },
        section: 'Featured courses'
      }
    };
    component['setTelemetryData']();
    component['prepareVisits'](event);
    expect(component.telemetryImpression).toBeDefined();
  });
  it('should call play content method', () => {
    const plauerService = TestBed.get(PlayerService);
    spyOn(plauerService, 'playContent').and.callThrough();
    const event = {
      data: {
        metaData: {
          identifier: 'do_21307528604532736012398'
        }
      }
    };
    component.playContent(event, 'textbook');
    expect(plauerService.playContent).toHaveBeenCalled();
  });
});
