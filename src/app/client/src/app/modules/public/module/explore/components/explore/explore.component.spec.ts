import { BehaviorSubject, throwError, of} from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { PageApiService, OrgDetailsService, CoreModule, UserService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicPlayerService } from './../../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './explore.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { ExploreComponent } from './explore.component';
import { ContentManagerService } from '@sunbird/offline';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let toasterService, userService, pageApiService, orgDetailsService;
  const mockPageSection: Array<any> = Response.successData.result.response.sections;
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
        'm0091': 'Could not copy content. Try again later'
      },
      'stmsg': {
        'm0009': 'error',
        'm0140': 'DOWNLOADING',
        'm0138': 'FAILED',
        'm0139': 'DOWNLOADED',
      },
      'emsg': {},
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
      declarations: [ExploreComponent],
      providers: [PublicPlayerService, ContentManagerService, { provide: ResourceService, useValue: resourceBundle },
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
    pageApiService = TestBed.get(PageApiService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    sendOrgDetails = true;
    sendPageApi = true;
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
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
  });
  it('should navigate to landing page if fetching org details fails and data driven filter dint returned data', () => {
    sendOrgDetails = false;
    component.ngOnInit();
    expect(component.router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should navigate to landing page if fetching org details fails and data driven filter returns data', () => {
    sendOrgDetails = false;
    component.ngOnInit();
    component.getFilters([]);
    expect(component.router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should fetch content after getting hashTagId and filter data and set carouselData if api returns data', () => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData.length).toEqual(1);
  });
  it('should fetch content after getting hashTagId and filter data and throw error if page api fails', () => {
    sendPageApi = false;
    spyOn(toasterService, 'error').and.callFake(() => {});
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
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
  it('should call inview method for visits data', fakeAsync(() => {
    spyOn(component, 'prepareVisits').and.callThrough();
    component.ngOnInit();
    component.ngAfterViewInit();
    tick(100);
    component.prepareVisits(Response.event);
    expect(component.prepareVisits).toHaveBeenCalled();
    expect(component.inViewLogs).toBeDefined();
  }));
  it('should call playcontent when user is not loggedIn and content type is course', () => {
    const event = { data: { contentType : 'Course', metaData: { identifier: '0122838911932661768' } } };
    userService._authenticated = false;
    component.playContent(event);
    expect(component.showLoginModal).toBeTruthy();
    expect(component.baseUrl).toEqual('/learn/course/0122838911932661768');
  });
  it('should call playcontent when user is loggedIn', () => {
    const playerService = TestBed.get(PublicPlayerService);
    const event = { data: { metaData: { batchId: '0122838911932661768' } } };
    spyOn(component, 'playContent').and.callThrough();
    spyOn(playerService, 'playContent').and.callThrough();
    component.playContent(event);
    playerService.playContent(event);
    expect(playerService.playContent).toHaveBeenCalled();
    expect(component.showLoginModal).toBeFalsy();
  });
  it('showDownloadLoader to be true' , () => {
    spyOn(component, 'startDownload');
    component.isOffline = true;
    expect(component.showDownloadLoader).toBeFalsy();
    component.playContent(Response.download_event);
    expect(component.showDownloadLoader).toBeTruthy();
  });

  it('should call updateDownloadStatus when updateCardData is called' , () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'updateDownloadStatus').and.callFake(() => {});
    component.pageSections = mockPageSection;
    component.updateCardData(Response.download_list);
    expect(playerService.updateDownloadStatus).toHaveBeenCalled();
  });

  it('should call content manager service on when startDownload()', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    spyOn(contentManagerService, 'startDownload').and.returnValue(of(Response.download_success));
    component.startDownload(Response.result.result.content);
    expect(contentManagerService.startDownload).toHaveBeenCalled();
  });

  it('startDownload should fail', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const resourceService = TestBed.get(ResourceService);
    toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceBundle.messages;
    component.pageSections = mockPageSection;
    spyOn(contentManagerService, 'startDownload').and.returnValue(throwError(Response.download_error));
    component.startDownload(Response.result.result.content);
    expect(contentManagerService.startDownload).toHaveBeenCalled();
    expect(component.showDownloadLoader).toBeFalsy();
  });


});
