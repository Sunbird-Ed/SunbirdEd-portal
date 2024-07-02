import { Component, OnInit } from '@angular/core';
import { DeviceRegisterService, UserService } from '@sunbird/core';
import { ResourceService, UtilService, NavigationHelperService, ToasterService, ConfigService} from '@sunbird/shared';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../../../shared/services/layoutconfig/layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CslFrameworkService } from '../../../../../public/services/csl-framework/csl-framework.service';
import { GuestProfileComponent } from './guest-profile.component';

describe('GuestProfileModule', () => {

  let component: GuestProfileComponent;

  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn(),
    switchableLayout: jest.fn(() => of([{data: ''}])),
  };
  const mockToasterService: Partial<ToasterService> = {};
  const mockDeviceRegisterService: Partial<DeviceRegisterService> = {
    fetchDeviceProfile: jest.fn().mockReturnValue(of({ result: 'result' })) as any,
  };
  const mockUtilService: Partial<UtilService> = {
    isDesktopApp: true,
  };
  const mockUserService: Partial<UserService> = {
    getGuestUser: jest.fn(() => of({role: 'teacher'})),
  };
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getAllFwCatName: jest.fn(),
    getFrameworkCategoriesObject: jest.fn(),
  };
  const mockRouter: Partial<Router> = {
    navigate: jest.fn()
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    getPageLoadTime: jest.fn().mockReturnValue('1ms')
  };
  const mockConfigService: Partial<ConfigService> = {
    constants: {
      SIZE: {
        LARGE: 'mockLargeSize',
      },
      VIEW: {
        VERTICAL: 'mockVerticalView',
      },
    },
  };
    beforeAll(() => {
    component = new GuestProfileComponent(
      mockActivatedRoute as ActivatedRoute,
      mockResourceService as ResourceService,
      mockLayoutService as LayoutService,
      mockDeviceRegisterService as DeviceRegisterService,
      mockUtilService as UtilService,
      mockUserService as UserService,
      mockRouter as Router,
      mockNavigationHelperService as NavigationHelperService,
      mockToasterService as ToasterService,
      mockConfigService as ConfigService,
      mockCslFrameworkService as CslFrameworkService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create a instance of guestProfileComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call getGuestUser and initialize properties on ngOnInit', () => {
    const mockFrameworkCategories = {
      fwCategory1: { code: '1' },
    };
    const localStorageMock = { getItem: jest.fn() };
    jest.spyOn(window, 'localStorage', 'get').mockReturnValue(localStorageMock as any);
    const mockGuestUser = {role: 'teacher'};
    const mockGetFrameworkCategories = jest.fn().mockReturnValue(mockFrameworkCategories);
    (mockCslFrameworkService.getAllFwCatName as any).mockImplementation(mockGetFrameworkCategories);
    component.ngOnInit();
    expect(mockCslFrameworkService.getAllFwCatName).toHaveBeenCalled();
    expect(mockCslFrameworkService.getFrameworkCategoriesObject).toHaveBeenCalled();
    expect(mockUserService.getGuestUser).toHaveBeenCalled();
    expect(component.guestUser).toEqual(mockGuestUser);
    expect(localStorageMock.getItem).not.toHaveBeenCalled();
  });

});