import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import {
  ResourceService, ToasterService, BrowserCacheTtlService, NavigationHelperService,
  ConfigService, UtilService
} from '@sunbird/shared';
import { TenantService, OrgDetailsService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { response } from './library.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, throwError } from 'rxjs';
import { SharedModule } from '@sunbird/shared';
import { ConnectionService, SystemInfoService} from '../../services';
import { configureTestSuite } from '@sunbird/test-util';
import {APP_BASE_HREF} from '@angular/common';
describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  const resourceBundle = {
    messages: {
      fmsg: {
        m0004: 'Fetching data failed, please try again later...'
      },
      stmsg: {
        m0140: 'DOWNLOADING'
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
        viewall: 'View All'
      },
      btn: {
        download: 'Download'
      }
    },
    languageSelected$: observableOf({})
  };
  class FakeActivatedRoute {
    snapshot = {
      data: {
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        telemetry: { env: 'library', pageid: 'library', type: 'view', subtype: 'paginate' }
      }
    };
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
        { provide: ResourceService, useValue: resourceBundle },
        OrgDetailsService, {provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(observableOf(true));
    fixture.detectChanges();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getSelectedFilters');
    component.ngOnInit();
    expect(component.getSelectedFilters).toHaveBeenCalled();
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

  it('should call hoverActionClicked for Export ', () => {
    response.hoverActionsData['hover'] = {
      'type': 'save',
      'label': 'SAVE',
      'disabled': false
    };
    response.hoverActionsData['data'] = response.hoverActionsData.content;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'exportContent');
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

  it('should call getSelectedFilters', () => {
    component.getSelectedFilters();
    expect(component.selectedFilters).toBeDefined();
  });

  it('should unsubscribe to userData observable', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should call onFilterChange in MyDownloads Page', () => {
    spyOn(component, 'resetSections');
    spyOn(component, 'fetchContents');
    component.onFilterChange(response.onFilterChangeEvent);
    expect(component.showLoader).toBeFalsy();
    expect(component.dataDrivenFilters).toEqual(response.onFilterChangeEvent.filters);
    expect(component.hashTagId).toEqual(response.onFilterChangeEvent.channelId);
  });

  it('should call onFilterChange in Browse Page', () => {
    component.isBrowse = true;
    spyOn(component, 'resetSections');
    spyOn(component, 'fetchContents');
    component.onFilterChange(response.onFilterChangeEvent);
    expect(component.showLoader).toBeTruthy();
    expect(component.dataDrivenFilters).toEqual(response.onFilterChangeEvent.filters);
    expect(component.hashTagId).toEqual(response.onFilterChangeEvent.channelId);
    expect(component.resetSections).toHaveBeenCalled();
    expect(component.fetchContents).toHaveBeenCalled();
  });

  it('should call onFilterChange in Browse Page', () => {
    component.pageSections = [{ name: 'Recently Added', contents: [], length: 2 }, { name: 'English', contents: [], length: 2 }];
    component.showSectionLoader = true;
    spyOn(component, 'fetchContents');
    component.onFilterChange(response.onFilterChangeEvent);
    expect(component.dataDrivenFilters).toEqual(response.onFilterChangeEvent.filters);
    expect(component.hashTagId).toEqual(response.onFilterChangeEvent.channelId);
    expect(component.fetchContents).toHaveBeenCalled();
    expect(component.showLoader).toBeFalsy();
    expect(component.showSectionLoader).toBeTruthy();
  });

  it('should call resetSections', () => {
    component.resetSections();
    expect(component.carouselMasterData).toEqual([]);
    expect(component.pageSections).toEqual([]);
  });

  it('should call constructSearchRequest with true', () => {
    component.hashTagId = '01285019302823526477';
    const result = component.constructSearchRequest(true);
    expect(result).toEqual(response.constructSearchRequestWithOutFacets);
  });

  it('should call constructSearchRequest with true', () => {
    component.hashTagId = '01285019302823526477';
    const result = component.constructSearchRequest(true, true);
    expect(result).toEqual(response.constructSearchRequestWithFilter);
  });

  it('should call fetchContents and return value', () => {
    spyOn(component, 'searchContent').and.returnValue(observableOf(response.searchResult));
    spyOn(component, 'addHoverData');
    component.fetchContents();
    expect(component.showLoader).toBeFalsy();
    expect(component.addHoverData).toHaveBeenCalled();
  });

  it('should call fetchContents and return undefined', () => {
    spyOn(component, 'searchContent').and.returnValue(observableOf(undefined));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    component.fetchContents();
    expect(component.showLoader).toBeFalsy();
    expect(component.carouselMasterData).toEqual([]);
    expect(component.pageSections).toEqual([]);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call onViewAllClick', () => {
    component.hashTagId = 'asasa12121';
    const queryParams = {
      channel: 'asasa12121',
      apiQuery: JSON.stringify({})
    };
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');
    spyOn(component, 'constructSearchRequest').and.returnValue({});
    component.onViewAllClick({});
    expect(router.navigate).toHaveBeenCalledWith(['view-all'], { queryParams });
    expect(component.constructSearchRequest).toHaveBeenCalledWith(false, true);
  });

  it('should call fetchContents and all downloads should be at the top(At the zero index)', () => {
    fixture.detectChanges();
   spyOn(component, 'searchContent').and.returnValue(observableOf(response.searchResult2));
   fixture.whenStable().then(() => {
    component.fetchContents();
    expect(component.sections[0].name).toEqual(response.testSectionName[0].name);
    });
    fixture.destroy();
  });

  it('should call fetchContents and sort the sections list', () => {
    fixture.detectChanges();
   spyOn(component, 'searchContent').and.returnValue(observableOf(response.searchResult2));
   fixture.whenStable().then(() => {
    component.fetchContents();
    expect(component.sections[1].name).toEqual(response.testSectionName[1].name);
    });
    fixture.destroy();
  });
  it('should call fetchContents and sort the sections Contents list', () => {
    fixture.detectChanges();
   spyOn(component, 'searchContent').and.returnValue(observableOf(response.searchResult2));
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
    const systemInfoService = TestBed.get(SystemInfoService);
   spyOn(systemInfoService, 'getSystemInfo').and.returnValue(observableOf(response.systemInfo));
   component.ngOnInit();
    expect(component.showCpuLoadWarning).toBeTruthy();
  });
  it('should handle system info error ', () => {
    const systemInfoService = TestBed.get(SystemInfoService);
   spyOn(systemInfoService, 'getSystemInfo').and.returnValue(throwError(response.systemInfoError));
   component.ngOnInit();
    expect(component.showCpuLoadWarning).toBeFalsy();
  });
});
