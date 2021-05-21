import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { OrgDetailsService, SearchService, TenantService, UserService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import {
  BrowserCacheTtlService,
  ConfigService, ConnectionService, LayoutService, NavigationHelperService, ResourceService,
  SharedModule, ToasterService,
  UtilService
} from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { CacheService } from 'ng2-cache-service';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { BehaviorSubject, Observable, of as observableOf, of, throwError } from 'rxjs';
import { ContentManagerService, SystemInfoService } from '../../services';
import { LibraryComponent } from './library.component';
import { response } from './library.component.spec.data';
describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let userService, searchService, orgDetailsService;
  let sendOrgDetails = true;
  let sendSearchResult = true;
  let sendFormResult = true;
  const resourceBundle = {
    messages: {
      fmsg: {
        m0004: 'Fetching data failed, please try again later...',
        m0091: 'Could not copy content. Try again later'
      },
      stmsg: {
        m0140: 'DOWNLOADING'
      },
      smsg: {
        m0059: 'Content successfully copied'
      }
    },
    frmelmnts: {
      lbl: {
        goToMyDownloads: 'Goto My Downloads',
        saveToPenDrive: 'Save to Pen drive',
        open: 'Open',
        allDownloads: 'All Downloads will be automatically added to',
        exportingContent: 'Copying {contentName}...',
        downloadingContent: 'Preparing to download {contentName}...',
        recentlyAdded: 'Recently Added',
        viewall: 'View All',
        desktop: {
          mylibrary: 'My Downloads'
        }
      },
      btn: {
        download: 'Download'
      }
    },
    languageSelected$: observableOf({})
  };
  class RouterStub {
    public navigationEnd = new NavigationStart(0, '/mydownloads');
    public navigate = jasmine.createSpy('navigate');
    public url = '';
    public events = new Observable(observer => {
      observer.next(this.navigationEnd);
      observer.complete();
    });
  }
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    paramsMock = new BehaviorSubject<any>({ pageNumber: '1' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      data: {
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        telemetry: { env: 'library', pageid: 'mydownloads', type: 'view', subtype: 'paginate' }
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeParams(params) { this.paramsMock.next(params); }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LibraryComponent
      ],
      imports: [
        CommonConsumptionModule,
        TelemetryModule.forRoot(),
        RouterModule.forRoot([]),
        HttpClientModule,
        SuiModule,
        SlickModule,
        FormsModule,
        SharedModule.forRoot()
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        NavigationHelperService,
        ConfigService,
        TenantService,
        CacheService,
        BrowserCacheTtlService,
        UtilService,
        ToasterService,
        ConnectionService,
        SystemInfoService,
        ContentManagerService,
        LayoutService,
        UserService, SearchService,
        { provide: ResourceService, useValue: resourceBundle },
        OrgDetailsService, { provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(observableOf(true));

    userService = TestBed.get(UserService);
    searchService = TestBed.get(SearchService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    sendOrgDetails = true;
    sendSearchResult = true;
    sendFormResult = true;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
      if (sendOrgDetails) {
        return of({ hashTagId: '123' });
      }
      return throwError({});
    });
    spyOn(searchService, 'getContentTypes').and.callFake((options) => {
      if (sendFormResult) {
        return of(response.formData);
      }
      return throwError({});
    });
    spyOn(searchService, 'contentSearch').and.callFake((options) => {
      if (sendSearchResult) {
        return of(response.successData);
      } else {
        return of(undefined);
      }
    });
    fixture.detectChanges();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'fetchCurrentPageData');
    component.ngOnInit();
    expect(component.fetchCurrentPageData).toHaveBeenCalled();
  });

  it('should call hoverActionClicked for Export ', () => {
    response.hoverActionsData['hover'] = {
      'type': 'save',
      'label': 'SAVE',
      'disabled': false
    };
    response.hoverActionsData['data'] = response.hoverActionsData.content;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'exportContent').and.callThrough();
    component.hoverActionClicked(response.hoverActionsData);
    expect(component.exportContent).toHaveBeenCalledWith(response.hoverActionsData.content.metaData.identifier);
    expect(component.showExportLoader).toBeTruthy();
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'export-collection');
    expect(component.contentData).toBeDefined();
  });

  it('should call hoverActionClicked for Open ', () => {
    response.hoverActionsData['hover'] = {
      'type': 'Open',
      'label': 'OPEN',
      'disabled': false
    };
    response.hoverActionsData['data'] = response.hoverActionsData.content;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'playContent');
    component.hoverActionClicked(response.hoverActionsData);
    expect(component.playContent).toHaveBeenCalledWith(response.hoverActionsData);
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'play-content');
    expect(component.contentData).toBeDefined();
  });

  it('should unsubscribe to userData observable', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should call constructSearchRequest', () => {
    component.ngOnInit();
    component.hashTagId = '01231711180382208027';
    component.formData = [response.formData[0]];
    const result = component.constructSearchRequest();
    expect(result).toEqual(response.constructSearchRequestWithFilter);
  });

  it('should call fetchContents and return value', () => {
    spyOn(component, 'addHoverData');
    component.fetchContents();
    expect(component.showLoader).toBeFalsy();
    expect(component.addHoverData).toHaveBeenCalled();
  });

  it('should call fetchContents and return undefined', () => {
    sendSearchResult = false;
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    component.fetchContents();
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData).toEqual([]);
    expect(component.pageSections).toEqual([]);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call fetchContents and all downloads should be at the top(At the zero index)', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.fetchContents();
      expect(component.sections[0].name).toEqual(response.testSectionName[0].name);
    });
    fixture.destroy();
  });

  it('should call fetchContents and sort the sections list', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.fetchContents();
      expect(component.sections[1].name).toEqual(response.testSectionName[1].name);
    });
    fixture.destroy();
  });
  it('should call fetchContents and sort the sections Contents list', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.fetchContents();
      expect(component.sections[1].contents[0].name).toEqual(response.testSectionName[1].contents[0].name);
    });
    fixture.destroy();
  });
  it('should not showCpuLoadWarning when cpuload is less than 90 ', () => {
    const systemInfoService = TestBed.get(SystemInfoService);
    spyOn(systemInfoService, 'getSystemInfo').and.returnValue(observableOf(response.systemInfo1));
    component.ngOnInit();
    expect(component.showCpuLoadWarning).toBeFalsy();
  });
  it('should  showCpuLoadWarning when cpuload is more than 90', () => {
    const systemInfoService1 = TestBed.get(SystemInfoService);
    spyOn(systemInfoService1, 'getSystemInfo').and.returnValue(observableOf(response.systemInfo));
    component.ngOnInit();
    expect(component.showCpuLoadWarning).toBeTruthy();
  });
  it('should handle system info error ', () => {
    const systemInfoService1 = TestBed.get(SystemInfoService);
    spyOn(systemInfoService1, 'getSystemInfo').and.returnValue(throwError(response.systemInfoError));
    component.ngOnInit();
    expect(component.showCpuLoadWarning).toBeFalsy();
  });

  it('should fetch current page data ', () => {
    component.fetchCurrentPageData();
    expect(component.pageTitle).toEqual('My Downloads');
  });

  it('should fetch current page data ', () => {
    sendFormResult = false;
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    component.fetchCurrentPageData();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should redo layout on render', () => {
    component.layoutConfiguration = null;
    spyOn<any>(component, 'redoLayout').and.callThrough();
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'switchableLayout').and.returnValue(of({ layout: {} }));
    component.initLayout();
    expect(component.layoutConfiguration).toEqual({});
    expect(component['redoLayout']).toHaveBeenCalled();
  });

  it('should redo layout on render when layoutConfiguration is null', () => {
    component.layoutConfiguration = null;
    spyOn<any>(component, 'redoLayout').and.callThrough();
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'switchableLayout').and.returnValue(of({}));
    component.initLayout();
    expect(component['redoLayout']).toHaveBeenCalled();
  });

  it('should get Org Details', () => {
    spyOn(component, 'fetchContentOnParamChange');
    component.getOrgDetails();
    expect(component.fetchContentOnParamChange).toHaveBeenCalled();
  });

  it('should fetch content after content manager complete event', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const route = TestBed.get(Router);
    route.url = '/mydownloads?selectedTab=mydownloads';
    spyOn(component, 'fetchContents');
    component.ngOnInit();
    contentManagerService.completeEvent.emit();
    expect(component.fetchContents).toHaveBeenCalled();
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

  it('should call exportContent with success', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'exportContent').and.returnValue(of({}));
    component.exportContent('123');
    expect(component.showExportLoader).toBeFalsy();
  });

  it('should call exportContent with error', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'exportContent').and.returnValue(throwError({ error: { responseCode: 'ERROR' } }));
    component.exportContent('123');
    expect(component.showExportLoader).toBeFalsy();
  });

  it('should call playContent', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn(publicPlayerService, 'playContent');
    component.playContent({});
    expect(publicPlayerService.playContent).toHaveBeenCalled();
  });

  it('should call hoverActionClicked for DOWNLOAD ', () => {
    response.hoverActionsData['hover'] = {
      'type': 'download',
      'label': 'Download',
      'disabled': false
    };
    response.hoverActionsData['data'] = response.hoverActionsData.content;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'downloadContent');
    component.hoverActionClicked(response.hoverActionsData);
    expect(component.downloadContent).toHaveBeenCalledWith(component.downloadIdentifier);
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'download-collection');
    expect(component.showModal).toBeFalsy();
    expect(component.contentData).toBeDefined();
  });

  it('should call download content with success ', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(of({}));
    component.downloadContent('123');
    expect(component.showDownloadLoader).toBeFalsy();
  });

  it('should call download content with error ', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const toasterService = TestBed.get(ToasterService);
    component.pageSections = [];
    spyOn(toasterService, 'error');
    spyOn(contentManagerService, 'startDownload').and.returnValue(throwError({ error: { params: { err: 'ERROR' } } }));
    component.downloadContent('123');
    expect(component.showDownloadLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call navigateToMyDownloads', () => {
    const router = TestBed.get(Router);
    component.navigateToMyDownloads();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

});
