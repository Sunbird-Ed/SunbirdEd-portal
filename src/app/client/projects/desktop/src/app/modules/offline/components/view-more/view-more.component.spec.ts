import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoreComponent } from './view-more.component';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, UtilService, ConfigService } from '@sunbird/shared';
import { CoreModule, OrgDetailsService, SearchService } from '@sunbird/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ConnectionService } from '../../services';
import { visitsEvent, contentList, appConfigViewAll } from './view-more.component.data.spec';
import { Location } from '@angular/common';
import { filters } from '../search/search.component.data.spec';
import { PublicPlayerService } from '@sunbird/public';
import { NavigationHelperService } from 'src/app/modules/shared';

const resourceBundle = {
  messages: {
    fmsg: {
      m0004: 'Fetching data failed, please try again later...',
      m0090: 'Could not download. Try again later',
      m0091: 'Enter a valid phone number'
    },
    smsg: {
      m0059: 'Content successfully copied'
    },
    stmsg: {
      m0138: 'FAILED'
    }
  }
};

class MockActivatedRoute {
  snapshot = {
    data: {
      softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
      telemetry: { env: 'search', pageid: 'view-more', type: 'view', subtype: 'paginate' }
    },
    params: { slug: 'ntp' },
    queryParams: { channel: '12345' }
  };
  queryParams = of({
    'key': 'test',
    'apiQuery': `{"filters":{"channel":"505c7c48ac6dc1edc9b08f21db5a571d",
    "contentType":["Collection","TextBook","LessonPlan","Resource"]},"mode":"soft",
    "params":{"orgdetails":"orgName,email","framework":"TEST"},"query":"test","facets":["board","medium",
    "gradeLevel","subject","contentType"],"softConstraints":{"badgeAssertions":98,"board":99,"channel":100}}`
  });
}

describe('ViewMoreComponent', () => {
  let component: ViewMoreComponent;
  let fixture: ComponentFixture<ViewMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMoreComponent],
      imports: [RouterModule.forRoot([]), CommonConsumptionModule, TelemetryModule.forRoot(), SharedModule.forRoot(), CoreModule],
      providers: [OrgDetailsService, SearchService, UtilService, ConnectionService, NavigationHelperService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create visits for view-more page', () => {
    component.telemetryImpression = {
      context: {
        env: 'search'
      },
      edata: {
        visits: [],
        subtype: 'paginate',
        type: 'view',
        pageid: 'search',
        uri: '/search?key=test',
        duration: 0.0065
      }
    };
    component.visits = [];
    component.contentList = contentList;
    fixture.detectChanges();
    component.prepareVisits(visitsEvent);
    expect(component.visits).toEqual(visitsEvent.visits);
    expect(component.telemetryImpression.edata.visits).toEqual(visitsEvent.visits);
    expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
  });

  it('should call clearSearchQuery', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'clearSearchQuery');
    component.clearSearchQuery();
    expect(utilService.clearSearchQuery).toHaveBeenCalled();
  });

  it('should navigate to previous page', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'goBack');
    component.goBack();
    expect(navigationHelperService.goBack).toHaveBeenCalled();
  });

  it('should call setNoResultMessage', () => {
    component.setNoResultMessage();
    expect(component.noResultMessage).toEqual({
      messageText: 'messages.stmsg.m0133',
      message: 'messages.stmsg.m0007',
    });
  });

  it('should call setNoResultMessage ', () => {
    const router = TestBed.get(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/browse');
    component.setNoResultMessage();
    expect(component.noResultMessage).toEqual({
      messageText: 'messages.stmsg.m0006',
      message: 'messages.stmsg.m0007',
    });
  });

  it('should call formatSearchResults', () => {
    const configService = TestBed.get(ConfigService);
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'processContent');
    spyOn(configService.appConfig, 'ViewAll').and.returnValue(appConfigViewAll);
    component.formatSearchResults(contentList);
    expect(utilService.processContent).toHaveBeenCalled();
    expect(configService.appConfig.ViewAll).toBeDefined();
  });

  it('should call call ngOnInit', () => {
    const router = TestBed.get(Router);
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'emitHideHeaderTabsEvent');
    spyOnProperty(router, 'url', 'get').and.returnValue('view-all');
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(orgDetailsService, 'getOrgDetails').and.returnValue(of({ hashTagId: '505c7c48ac6dc1edc9b08f21db5a571d' }));
    spyOn(component, 'setTelemetryData');
    spyOn(component, 'setNoResultMessage');
    spyOn(component, 'fetchRecentlyAddedContent');
    const element = document.createElement('INPUT');
    element.setAttribute('type', 'hidden');
    element.setAttribute('id', 'defaultTenant');
    element.setAttribute('value', 'ntp');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(element);
    component.ngOnInit();
    expect(orgDetailsService.getOrgDetails).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.hashTagId).toBe('505c7c48ac6dc1edc9b08f21db5a571d');
    expect(component.initFilters).toBe(true);
    expect(component.isViewAll).toBe(true);
    expect(component.fetchRecentlyAddedContent).toHaveBeenCalled();
    expect(utilService.emitHideHeaderTabsEvent).toHaveBeenCalledWith(true);
    expect(component.setNoResultMessage).toHaveBeenCalled();
  });

  it('should call getFilters', () => {
    spyOn(component, 'fetchContentOnParamChange');

    component.getFilters(filters);

    expect(component.facets).toEqual(['board', 'medium', 'gradeLevel', 'subject', 'contentType']);
    expect(component.dataDrivenFilters).toEqual(filters);
    expect(component.fetchContentOnParamChange).toHaveBeenCalled();
  });

  it('should call onFilterChange', () => {
    spyOn(component, 'fetchContents');

    const event = {
      filters: {
        appliedFilters: true,
        board: ['TEST_BOARD']
      }
    };
    component.onFilterChange(event);
    expect(component.fetchContents).toHaveBeenCalled();
    expect(component.showLoader).toBe(true);
    expect(component.dataDrivenFilters).toEqual(event.filters);
  });

  it('should call onFilterChange for viewAll', () => {
    spyOn(component, 'fetchRecentlyAddedContent');
    component.isViewAll = true;
    const event = {
      filters: {
        appliedFilters: true,
        board: ['TEST_BOARD']
      }
    };
    component.onFilterChange(event);
    expect(component.fetchRecentlyAddedContent).toHaveBeenCalled();
    expect(component.showLoader).toBe(true);
    expect(component.dataDrivenFilters).toEqual(event.filters);
  });

  it('should not navigateToPage', () => {
    component.paginationDetails.totalPages = 5;
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');
    spyOn(window, 'scroll');
    component.navigateToPage(0);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(window.scroll).not.toHaveBeenCalled();
  });

  it('should call navigateToPage', () => {
    component.paginationDetails.totalPages = 5;
    const router = TestBed.get(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('view-more/3');
    spyOn(router, 'navigate');
    spyOn(window, 'scroll');
    component.navigateToPage(3);
    expect(router.navigate).toHaveBeenCalled();
    expect(window.scroll).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  it('should call fetchRecentlyAddedContent', () => {
    const searchService = TestBed.get(SearchService);
    const utilService = TestBed.get(UtilService);
    spyOn(searchService, 'contentSearch').and.returnValue(of({}));
    spyOn(component, 'formatSearchResults');
    spyOn(utilService, 'addHoverData');
    component.dataDrivenFilters = filters;
    component.fetchRecentlyAddedContent(false);
    expect(searchService.contentSearch).toHaveBeenCalled();
    expect(component.formatSearchResults).toHaveBeenCalled();
    expect(utilService.addHoverData).toHaveBeenCalled();
  });

  it('should call fetchRecentlyAddedContent on error', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.returnValue(throwError({}));
    component.dataDrivenFilters = filters;
    component.dataDrivenFilters.appliedFilters = true;
    component.fetchRecentlyAddedContent(true);
    expect(searchService.contentSearch).toHaveBeenCalled();
    expect(component.showLoader).toBe(false);
  });

  it('should call updateCardData', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    const utilService = TestBed.get(UtilService);
    spyOn(publicPlayerService, 'updateDownloadStatus');
    spyOn(utilService, 'addHoverData');
    component.contentList = contentList;
    component.updateCardData(contentList);
    expect(utilService.addHoverData).toHaveBeenCalled();
    expect(publicPlayerService.updateDownloadStatus).toHaveBeenCalled();
  });
});
