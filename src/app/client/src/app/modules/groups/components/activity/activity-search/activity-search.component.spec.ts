import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, FrameworkService, SearchService, FormService } from '@sunbird/core';
import { SharedModule, ConfigService, ResourceService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ActivitySearchComponent } from './activity-search.component';
import { activitySearchMockData } from './activity-search.component.data.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupsService } from '../../../services/groups/groups.service';
import { CourseConsumptionService } from '@sunbird/learn';

describe('ActivitySearchComponent', () => {
  let component: ActivitySearchComponent;
  let fixture: ComponentFixture<ActivitySearchComponent>;
  let formService, sendFormApi;

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0051': 'Something went wrong, try again later',
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  const frameWorkServiceStub = {
    initialize() {
      return null;
    },
    channelData$: of({ err: null, channelData: activitySearchMockData.channelData })
  };

  class GroupsServiceMock {
    getGroupById() {
      return of();
    }
    getImpressionObject() {
      return { 'context': { 'channel': '0124784842112040965', 'pdata': { 'id': 'dev.sunbird.portal', 'ver': '3.1.0', 'pid': 'sunbird-portal' }, 'env': 'groups', 'sid': 'tzXa1UyXEs7dFrheulrtwzxjOaRAHNtT', 'did': '9ee98766c121536bd11264f8f7801676', 'cdata': [{ 'id': 'tzXa1UyXEs7dFrheulrtwzxjOaRAHNtT', 'type': 'UserSession' }, { 'id': 'Desktop', 'type': 'Device' }], 'rollup': { 'l1': '0124784842112040965' }, 'uid': 'd6eae4e4-3ed1-47e2-8b73-96a5f5ea3d73' }, 'object': { 'id': '04925160-23c0-4b9d-b515-7b7f16a533cb', 'type': 'Group', 'ver': '1.0', 'rollup': {} }, 'edata': { 'type': 'view', 'pageid': 'add-activity-to-group', 'subtype': 'paginate', 'uri': '/my-groups/group-details/04925160-23c0-4b9d-b515-7b7f16a533cb/add-activity-to-group/courses/1', 'duration': 0.602 } };
    }
  }

  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({});
    paramsMock = new BehaviorSubject<any>({ groupId: 'abcd12322', activityId: 'do_34534' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {},
      data: {
        telemetry: {}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeParams(params) { this.paramsMock.next(params); }
  }
  class RouterStub {
    url: '';
    navigate = jasmine.createSpy('navigate');
  }

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitySearchComponent],
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(),
        SlickModule, TelemetryModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: FrameworkService, useValue: frameWorkServiceStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: GroupsService, useClass: GroupsServiceMock },
        TelemetryService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySearchComponent);
    component = fixture.componentInstance;
    formService = TestBed.get(FormService);
    sendFormApi = true;
    spyOn(formService, 'getFormConfig').and.callFake((options) => {
      if (sendFormApi) {
        return of([{ framework: 'TPD' }]);
      }
      return throwError({});
    });
    spyOn(component['frameworkService'], 'channelData$').and.returnValue(of({ channelData: { defaultFramework: '123456' } }));
    fixture.detectChanges();
    component['csGroupAddableBloc'] = CsGroupAddableBloc.instance;
    component.groupAddableBlocData = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getFrameworkId');
    spyOn(component['csGroupAddableBloc'], 'init');
    component.ngOnInit();
    expect(component.getFrameworkId).toHaveBeenCalled();
    expect(component['csGroupAddableBloc'] instanceof CsGroupAddableBloc).toBeTruthy();
    expect(component['csGroupAddableBloc'].init).not.toHaveBeenCalled();
  });

  it('should call toggleFilter', () => {
    component.showFilters = false;
    component.toggleFilter();
    expect(component.showFilters).toBe(true);
  });

  it('should call getFrameworkId', () => {
    component.getFrameworkId();
    expect(component['frameworkId']).toBeDefined();
  });

  it('should call getFrameWork', () => {
    component['getFrameWork']();
    sendFormApi = false;
    component['getFrameWork']().subscribe((data) => { }, error => {
      expect(error).toBe(false);
    });
  });

  it('should fetch Contents on success', () => {
    component.showLoader = true;
    component.frameworkId = 'abcd1234cd';
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.returnValue(of({ result: { content: [] } }));
    component['fetchContents']();
    expect(component.showLoader).toBe(false);
    expect(component.contentList).toEqual([]);
  });

  it('should fetch Contents on error', () => {
    component.showLoader = true;
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.returnValue(throwError({}));
    component['fetchContents']();
    expect(component.showLoader).toBe(false);
    expect(component.contentList).toEqual([]);
  });

  it('should call navigateToPage method', () => {
    component.paginationDetails.totalPages = 20;
    const router = TestBed.get(Router);
    router.url = 'my-groups/group-details/6085532b-5f7b-4a8a-ae8c-c268fd40c371/add-activity-to-group/courses/1';
    spyOn(window, 'scroll');
    component.navigateToPage(2);
    expect(router.navigate).toHaveBeenCalled();
    expect(window.scroll).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
  });

  it('should set No result message', () => {
    component['setNoResultMessage']();
    expect(component.noResultMessage).toEqual({
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    });
  });

  it('should emit filter data when getFilters is called with data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT' });
  });
  it('should emit filter data when getFilters is called with no data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({});
  });

  it('should not navigate to new page', () => {
    const router = TestBed.get(Router);
    component['navigateToPage'](1);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should search the courses if the search is not blank string', () => {
    const router = TestBed.get(Router);
    router.url = 'http://localhost:3000/my-groups/group-details/3cccc4b6-e6f0-4c15-9883-02ddf361fd4a/add-activity-to-group/courses/1';
    component.searchQuery = 'english';
    spyOn(component, 'addTelemetry');
    component.search();
    expect(router.navigate).toHaveBeenCalled();
    expect(component.addTelemetry).toHaveBeenCalled();
  });

  it('should not search the courses if the search is blank string', () => {
    const router = TestBed.get(Router);
    router.url = 'http://localhost:3000/my-groups/group-details/3cccc4b6-e6f0-4c15-9883-02ddf361fd4a/add-activity-to-group/courses/1';
    component.searchQuery = '';
    component.search();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should navigate to resource page if contentType is non-trackable and mime type is not collection', () => {
    spyOn(component, 'addTelemetry');
    const router = TestBed.get(Router);
    const event = activitySearchMockData.eventDataForResource;
    component.groupData = { id: 'adfddf-sdsds-wewew-sds' };
    component.addActivity(event);
    expect(component.addTelemetry).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/content', event.identifier],
    {queryParams: {groupId: 'adfddf-sdsds-wewew-sds'}});
  });

  it('should navigate to resource page if contentType is trackable and mime type is collection', () => {
    spyOn(component, 'addTelemetry');
    spyOn(component['csGroupAddableBloc'], 'updateState');
    const router = TestBed.get(Router);
    const event = activitySearchMockData.eventDataForCourse;
    component.groupData = { id: 'adfddf-sdsds-wewew-sds' };
    component.addActivity(event);
    expect(component.addTelemetry).toHaveBeenCalled();
    expect(component['csGroupAddableBloc'].updateState).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course', event.identifier], {queryParams: {
      groupId: component.groupData.id
    }});
  });

  it('should navigate to resource page if contentType is non-trackable and mime type is collection', () => {
    spyOn(component, 'addTelemetry');
    const router = TestBed.get(Router);
    const event = activitySearchMockData.eventDataForTextbook;
    component.groupData = { id: 'adfddf-sdsds-wewew-sds' };
    component.addActivity(event);
    expect(component.addTelemetry).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/collection', event.identifier],
    {queryParams: {groupId: 'adfddf-sdsds-wewew-sds'}});
  });

  it('should navigate to content details page on click of "View activity" from hover card', () => {
    /** Arrange */
    const appAddToGroupElement = document.createElement('div');
    const event = {
      hover: {
        type: 'view'
      },
      content: activitySearchMockData.eventDataForCourse
    };
    spyOn(component, 'addActivity').and.stub();

    /** Act */
    component.hoverActionClicked(event, appAddToGroupElement);

    /** Assert */
    expect(component.addActivity).toHaveBeenCalledWith(activitySearchMockData.eventDataForCourse);
  });

  it('should add activity to group on click of "Add for group" button from hover card', () => {
    /** Arrange */
    const appAddToGroupElement = document.createElement('div');
    const event = {
      hover: {
        type: 'addToGroup'
      },
      content: activitySearchMockData.eventDataForCourse
    };
    spyOn(appAddToGroupElement, 'click').and.stub();

    /** Act */
    component.hoverActionClicked(event, appAddToGroupElement);

    /** Assert */
    expect(appAddToGroupElement.click).toHaveBeenCalled();
  });
});
