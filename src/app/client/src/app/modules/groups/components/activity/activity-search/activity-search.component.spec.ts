import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, FrameworkService, SearchService, FormService } from '@sunbird/core';
import { SharedModule, ConfigService, ResourceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ActivitySearchComponent } from './activity-search.component';
import { activitySearchMockData } from './activity-search.component.data.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';

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
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: FrameworkService, useValue: frameWorkServiceStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub }
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
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getFrameworkId');
    spyOn<any>(component, 'fetchContents');
    component.ngOnInit();
    expect(component.getFrameworkId).toHaveBeenCalled();
    expect(component['fetchContents']).toHaveBeenCalled();
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
    spyOn(searchService, 'courseSearch').and.returnValue(of({ result: { content: [] } }));
    component['fetchContents']();
    expect(component.showLoader).toBe(false);
    expect(component.contentList).toEqual([]);
  });

  it('should fetch Contents on error', () => {
    component.showLoader = true;
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.returnValue(throwError({}));
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
    component.searchQuery = 'english';
    component.search();
    expect(router.navigate).toHaveBeenCalledWith([], { queryParams: { key: 'english' } });
  });

  it('should not search the courses if the search is blank string', () => {
    const router = TestBed.get(Router);
    component.searchQuery = '';
    component.search();
    expect(router.navigate).toHaveBeenCalledWith([]);
  });
});
