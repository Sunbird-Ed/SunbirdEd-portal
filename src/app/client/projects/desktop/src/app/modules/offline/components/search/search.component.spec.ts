import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { SharedModule, ResourceService, UtilService } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoreModule, OrgDetailsService, SearchService } from '@sunbird/core';
import { of, throwError } from 'rxjs';
import { filters, searchRequest, visitsEvent, onlineSearchRequest } from './search.component.data.spec';
import { NavigationHelperService } from 'src/app/modules/shared';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

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
        telemetry: { env: 'search', pageid: 'search', type: 'view', subtype: 'paginate' }
      },
      params: { slug: 'ntp' },
      queryParams: { channel: '12345' }
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [RouterModule.forRoot([]), CommonConsumptionModule, TelemetryModule.forRoot(), SharedModule.forRoot(), CoreModule],
      providers: [
        OrgDetailsService, SearchService, UtilService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call call ngOnInit', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const utilService = TestBed.get(UtilService);
    spyOn(orgDetailsService, 'getOrgDetails').and.returnValue(of({ hashTagId: '505c7c48ac6dc1edc9b08f21db5a571d' }));
    spyOn(component, 'setTelemetryData');
    spyOn(utilService, 'emitHideHeaderTabsEvent');
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
    expect(utilService.emitHideHeaderTabsEvent).toHaveBeenCalledWith(true);
  });


  it('should call call ngOnInit, when orgdetailsService return error', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const router = TestBed.get(Router);
    spyOn(orgDetailsService, 'getOrgDetails').and.returnValue(throwError({}));
    spyOn(component, 'setTelemetryData');
    spyOn(router, 'navigate');
    const element = document.createElement('INPUT');
    element.setAttribute('type', 'hidden');
    element.setAttribute('id', 'defaultTenant');
    element.setAttribute('value', 'ntp');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(element);
    component.ngOnInit();
    expect(orgDetailsService.getOrgDetails).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.hashTagId).toBe(undefined);
    expect(component.initFilters).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should call getFilters', () => {
    spyOn(component, 'fetchContentOnParamChange');
    spyOn(component, 'setNoResultMessage');

    component.getFilters(filters);

    expect(component.facets).toEqual(['board', 'medium', 'gradeLevel', 'subject', 'contentType']);
    expect(component.dataDrivenFilters).toEqual(filters);
    expect(component.fetchContentOnParamChange).toHaveBeenCalled();
    expect(component.setNoResultMessage).toHaveBeenCalled();
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

  it('should create visits for search page', () => {
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
    component.prepareVisits(visitsEvent);
    expect(component.visits).toEqual(visitsEvent.visits);
    expect(component.telemetryImpression.edata.visits).toEqual(visitsEvent.visits);
    expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
  });

  it('should navigate to previous page', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'goBack');
    component.goBack();
    expect(navigationHelperService.goBack).toHaveBeenCalled();
  });

  it('should call clearSearchQuery', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'clearSearchQuery');
    component.clearSearchQuery();
    expect(utilService.clearSearchQuery).toHaveBeenCalled();
  });

  it('should call setNoResultMessage', () => {
    component.setNoResultMessage();
    expect(component.noResultMessage).toEqual({ messageText: 'messages.stmsg.m0006' });
  });

});
