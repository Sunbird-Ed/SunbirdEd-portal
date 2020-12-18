import { LibrarySearchComponent } from './library-search.component';

import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { SearchService, CoreModule, UserService, CoursesService, PlayerService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './library-search.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';

describe('LibrarySearchComponent', () => {
  let component: LibrarySearchComponent;
  let fixture: ComponentFixture<LibrarySearchComponent>;
  let toasterService, userService, searchService, activatedRoute;
  const mockSearchData: any = Response.successData;
  let sendSearchResult = true;
  let sendFormResult = true;
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
    frmelmnts: {
      lbl: {}
    },
    languageSelected$: of({})
  };
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    paramsMock = new BehaviorSubject<any>({ pageNumber: '1' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {slug: 'ap'},
      data: {
        telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate'}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeParams(params) { this.paramsMock.next(params); }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [LibrarySearchComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarySearchComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    userService = TestBed.get(UserService);
    searchService = TestBed.get(SearchService);
    activatedRoute = TestBed.get(ActivatedRoute);
    sendSearchResult = true;
    sendFormResult = true;
    spyOn(searchService, 'getContentTypes').and.callFake((options) => {
      if (sendFormResult) {
        return of(Response.formData);
      }
      return throwError({});
    });
    spyOn(searchService, 'contentSearch').and.callFake((options) => {
      if (sendSearchResult) {
        return of(mockSearchData);
      }
      return throwError({});
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
  it('should fetch filter details from data driven filter component', () => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
  });
  it('should fetch content after getting filter data and set carouselData if api returns data', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(2);
  }));
  it('should fetch content only once for when component displays content for the first time', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
  }));
  it('should fetch content once when queryParam changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({board: ['NCRT']});
    tick(100);
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when param changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeParams({pageNumber: 2});
    tick(100);
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when both queryParam and params changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({board: ['NCRT']});
    activatedRoute.changeParams({pageNumber: 2});
    tick(100);
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should trow error when fetching content fails even after getting hashTagId and filter data', fakeAsync(() => {
    sendSearchResult = false;
    spyOn(toasterService, 'error').and.callFake(() => {});
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  }));
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('getOrderedData() should return empty[]', () => {
    const contents: [] = component.getOrderedData([]);
    expect(contents.length).toEqual(0);
   });

   it('getOrderedData() should return ordered empty[]', () => {
    component.frameworkData = {board: ['Test 2']};
    const contents: object[] = component.getOrderedData(Response.successData.result.content);
    expect(contents.length).toEqual(2);
    expect(contents[0]['board']).toEqual('Test 2');
    expect(contents[1]['board']).toEqual('Test 1');
   });

  it('Should call searchservice -contenttypes and get error', fakeAsync(() => {
    sendFormResult = false;
    spyOn(toasterService, 'error').and.callFake(() => { });
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT' });
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(2);
    expect(toasterService.error).toHaveBeenCalled();
  }));

  it('should play content and not show the batch popup', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService)
    const playContentSpy = spyOn(playerService, 'playContent')
    spyOn(courseService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 0,
      expiredBatchCount: 0
    });
    component.playContent({ data: {} });
    expect(playContentSpy).toHaveBeenCalled();
    expect(component.showBatchInfo).toBeFalsy();
  });

  it('should play content and not show the batch popup when ongoing batch count is 1', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const playContentSpy = spyOn(playerService, 'playContent');
    spyOn(courseService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 1,
      expiredBatchCount: 0
    });
    component.playContent({ data: {} });
    expect(playContentSpy).toHaveBeenCalled();
    expect(component.showBatchInfo).toBeFalsy();
  });

  it('should show the batch details popup', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const playContentSpy = spyOn(playerService, 'playContent');
    spyOn(courseService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 2,
      expiredBatchCount: 0
    });
    component.playContent({ data: {} });
    expect(playContentSpy).not.toHaveBeenCalled();
    expect(component.showBatchInfo).toBeTruthy();
  });
});
