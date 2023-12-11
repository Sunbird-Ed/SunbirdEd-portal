import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { DeviceRegisterService, FormService, OrgDetailsService, UserService } from '../../../../modules/core/services';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { IImpressionEventInput, IInteractEventInput, TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { IDeviceProfile } from '../../../../modules/shared-feature/interfaces/deviceProfile';
import { SbFormLocationSelectionDelegate } from '../delegate/sb-form-location-selection.delegate';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash-es';
import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import { of, throwError } from 'rxjs';
import { onboardingLocationMockData } from './location-selection.component.spec.data';
import { LocationSelectionComponent } from './location-selection.component';

xdescribe('LocationSelectionComponent', () => {
  let locationSelectionComponent: LocationSelectionComponent;
  const mockResourceService: Partial<ResourceService> = {
    messages: {
      fmsg:{
        m0049: "This is a error"
      }
    }
  };
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
    success: jest.fn()
  };
  const mockLocationService: Partial<LocationService> = {
  };
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn()
  };
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue('tn') as any,
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };
  const mockDeviceRegisterService: Partial<DeviceRegisterService> = {};
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>()
  };
  const mockPopupControlService: Partial<PopupControlService> = {
    changePopupStatus: jest.fn(),
    getOnboardingData: jest.fn()
  };
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn()
  };
  const mockOrgDetailsService: Partial<OrgDetailsService> = {};
  const mockUtilService: Partial<UtilService> = {
    isDesktopApp: true,
    isIos: true
  };
  const dialogRefData = {
    close: jest.fn()
  };
  const mockDialog: Partial<MatDialog> = {
    getDialogById: jest.fn().mockReturnValue(dialogRefData)
  };
  beforeAll(() => {
    locationSelectionComponent = new LocationSelectionComponent(
      mockResourceService as ResourceService,
      mockToasterService as ToasterService,
      mockLocationService as LocationService,
      mockRouter as Router,
      mockUserService as UserService,
      mockDeviceRegisterService as DeviceRegisterService,
      mockNavigationHelperService as NavigationHelperService,
      mockPopupControlService as PopupControlService,
      mockTelemetryService as TelemetryService,
      mockFormService as FormService,
      mockOrgDetailsService as OrgDetailsService,
      mockUtilService as UtilService,
      mockDialog as MatDialog
    )
    locationSelectionComponent.sbFormLocationSelectionDelegate = new SbFormLocationSelectionDelegate(
      mockUserService as UserService,
      mockLocationService as LocationService,
      mockFormService as FormService,
      mockDeviceRegisterService as DeviceRegisterService,
      mockOrgDetailsService as OrgDetailsService
    )
  });
  beforeEach(() => {
    locationSelectionComponent.sbFormLocationSelectionDelegate.init = jest.fn(() => {
      return Promise.resolve();
    });
    locationSelectionComponent.sbFormLocationSelectionDelegate.init['catch'] = jest.fn(() => {
      return Promise.reject();
    });
    jest.clearAllMocks();
  });

  it('should be create a instance of LocationSelectionComponent', () => {
    expect(locationSelectionComponent).toBeTruthy();
  });

  it('should initialize with location enabled when response from popupcontrol service is true', () => {
    const formConfigResponse = {
      locationPopup: {
        isVisible: true
      }
    };
    jest.spyOn(locationSelectionComponent.popupControlService, 'getOnboardingData').mockReturnValue(of(formConfigResponse));
    locationSelectionComponent.ngOnInit();
    expect(locationSelectionComponent.isLocationEnabled).toEqual(true);
  });

  it('should initialize with location enabled when response from popupcontrol service is false', () => {
    const formConfigResponse = {
      locationPopup: {
        isVisible: false
      }
    };
    jest.spyOn(locationSelectionComponent.popupControlService, 'getOnboardingData').mockReturnValue(of(formConfigResponse));
    locationSelectionComponent.ngOnInit();
    expect(locationSelectionComponent.isLocationEnabled).toEqual(false);
  });
  
  it('should initialize sbFormLocationSelectionDelegate successfully', async () => {
    await locationSelectionComponent.ngOnInit();
    expect(locationSelectionComponent.sbFormLocationSelectionDelegate.init).toHaveBeenCalledWith(
      locationSelectionComponent.deviceProfile,
      locationSelectionComponent.showModal,
      locationSelectionComponent.isStepper
    );
    expect(mockToasterService.error).not.toHaveBeenCalled();
  });

  it('should handle error during sbFormLocationSelectionDelegate initialization', async () => {
    locationSelectionComponent.sbFormLocationSelectionDelegate.init = jest.fn().mockRejectedValueOnce('Initialization failed');
    const closeModalSpy = jest.spyOn(locationSelectionComponent, 'closeModal');
    await locationSelectionComponent.ngOnInit();
    expect(locationSelectionComponent.sbFormLocationSelectionDelegate.init).toHaveBeenCalledWith(
      locationSelectionComponent.deviceProfile,
      locationSelectionComponent.showModal,
      locationSelectionComponent.isStepper
    );
    expect(closeModalSpy).toHaveBeenCalled();

    if (locationSelectionComponent.isLocationEnabled) {
      expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0049);
    }
  });

  it('should close the popup after submitting', () => {
    // arrange
    jest.spyOn(mockPopupControlService, 'changePopupStatus');
    locationSelectionComponent.onboardingModal = {
      deny(): any {
        return {};
      }
    };
    locationSelectionComponent.close = {
      emit(): any {
        return {};
      }
    } as any;
    jest.spyOn(locationSelectionComponent.onboardingModal, 'deny');
    jest.spyOn(locationSelectionComponent.close, 'emit');
    locationSelectionComponent.closeModal();
    expect(mockPopupControlService.changePopupStatus).toHaveBeenCalledWith(true);
  });

  it('should destroy location delegate', () => {
    jest.spyOn(locationSelectionComponent['sbFormLocationSelectionDelegate'], 'destroy').mockReturnValue(Promise.resolve());
    locationSelectionComponent.ngOnDestroy();
    expect(locationSelectionComponent['sbFormLocationSelectionDelegate'].destroy).toHaveBeenCalledWith();
  });
   
});