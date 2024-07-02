import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { combineLatest as observableCombineLatest, of } from 'rxjs';
import { ResourceService, ToasterService, ConfigService, UtilService, NavigationHelperService, LayoutService} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, PlayerService, CoursesService, UserService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import {mergeMap, tap, retry, catchError, map, finalize, debounceTime, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialCodeService } from '../../services/dial-code/dial-code.service';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { DialCodeComponent } from './dial-code.component';

describe('DialCodeComponent', () => {
  let component: DialCodeComponent;

  const mockResourceService: Partial<ResourceService> = {};
  const mockUserService: Partial<UserService> = {};
  const mockCoursesService: Partial<CoursesService> = {};
  const mockRouter: Partial<Router> = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {};
  const mockSearchService: Partial<SearchService> = {};
  const mockToasterService: Partial<ToasterService> = {};
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      DIAL_CODE: { PAGE_LIMIT: 10 },
    }
  };
  const mockUtilService: Partial<UtilService> = {};
  const mockNavigationHelperService: Partial<NavigationHelperService> = {};
  const mockPlayerService: Partial<PlayerService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockPublicPlayerService: Partial<PublicPlayerService> = {};
  const mockDialCodeService: Partial<DialCodeService> = {};
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    transformDataForCC: jest.fn(),
  };
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn(),
    switchableLayout: jest.fn(() => of([{ layout: 'demo' }])),
  };

  beforeEach(() => {
    component = new DialCodeComponent(
    mockResourceService as ResourceService,
    mockUserService as UserService,
    mockCoursesService as CoursesService,
    mockRouter as Router,
    mockActivatedRoute as ActivatedRoute,
    mockSearchService as SearchService,
    mockToasterService as ToasterService,
    mockConfigService as ConfigService,
    mockUtilService as UtilService,
    mockNavigationHelperService as NavigationHelperService,
    mockPlayerService as PlayerService,
    mockTelemetryService as TelemetryService,
    mockPublicPlayerService as PublicPlayerService,
    mockDialCodeService as DialCodeService,
    mockCslFrameworkService as CslFrameworkService,
    mockLayoutService as LayoutService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle goBack() correctly', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should call initLayout on ngOnInit', () => {
    jest.spyOn(component, 'initLayout');
    component.ngOnInit();
    expect(component.initLayout).toHaveBeenCalled();
  });

});