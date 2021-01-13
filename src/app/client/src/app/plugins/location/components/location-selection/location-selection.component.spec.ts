import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { UserService, DeviceRegisterService, FormService } from '../../../../modules/core/services';
import { ResourceService, ToasterService, NavigationHelperService, ServerResponse } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { LocationService } from '../..';
import { LocationSelectionComponent } from './location-selection.component';
import { of, Observable, throwError } from 'rxjs';

describe('LocationSelectionComponent', () => {
    let locationSelectionComponent: LocationSelectionComponent;
    const mockDeviceRegisterService: Partial<DeviceRegisterService> = {};
    const mockFormService: Partial<FormService> = {};
    const mockLocationService: Partial<LocationService> = {
        updateProfile(request): Observable<ServerResponse> {
            return of({} as any);
          }
    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {};
    const mockPopupControlService: Partial<PopupControlService> = {
        changePopupStatus(): void {
            return;
        }
    };
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            fmsg: {
                m0049: 'Unable to load data'
            }
        }
    } as any;
    const mockTelemetryService: Partial<TelemetryService> = {};
    const mockToasterService: Partial<ToasterService> = {
        error(): string {
            return 'sample-message';
        }
    };
    const mockRouter: Partial<Route> = {};
    const mockUserService: Partial<UserService> = {};
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
            mockFormService as FormService
        );
    });

    describe('constructor()', () => {
        it('should be able to create an instance', () => {
            expect(locationSelectionComponent).toBeTruthy();
        });
    });

    describe('ngOnInit', () => {
        it('should be unable to load the location data', () => {
            // arrange
            spyOn(mockPopupControlService, 'changePopupStatus').and.callThrough();
            spyOn(locationSelectionComponent['sbFormLocationSelectionDelegate'], 'init').and.returnValue(Promise.reject());
            spyOn(locationSelectionComponent, 'closeModal').and.callThrough();
            spyOn(mockToasterService, 'error').and.returnValue('unable to load');
            // act
            locationSelectionComponent.ngOnInit();
            // assert
            expect(mockPopupControlService.changePopupStatus).toHaveBeenCalled();
            expect(locationSelectionComponent['sbFormLocationSelectionDelegate'].init).toHaveBeenCalled();
        });
    });

    it('should close the popup after submitting', () => {
        // arrange
        spyOn(mockPopupControlService, 'changePopupStatus').and.callThrough();
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
        spyOn(locationSelectionComponent.onboardingModal, 'deny').and.callThrough();
        spyOn(locationSelectionComponent.close, 'emit').and.callThrough();
        // act
        locationSelectionComponent.closeModal();
        // assert
        expect(mockPopupControlService.changePopupStatus).toHaveBeenCalledWith(true);
        expect(locationSelectionComponent.onboardingModal.deny).toHaveBeenCalled();
        expect(locationSelectionComponent.close.emit).toHaveBeenCalled();
    });

    it('should destroy location delegate', () => {
        spyOn(locationSelectionComponent['sbFormLocationSelectionDelegate'], 'destroy').and
        .returnValue(Promise.resolve());
        // act
        locationSelectionComponent.ngOnDestroy();
        // assert
        expect(locationSelectionComponent['sbFormLocationSelectionDelegate'].destroy).toHaveBeenCalledWith();
    });

    describe('updateUserLocation', () => {
        it('should update user profile', async () => {
            // arrange
            spyOn(locationSelectionComponent['sbFormLocationSelectionDelegate'], 'updateUserLocation').and
                .returnValue(Promise.resolve([{}]));
            locationSelectionComponent.userService = {
                loggedIn: true,
                userid: 'sample-user-id',
            } as any;
            locationSelectionComponent['sbFormLocationSelectionDelegate'].formGroup = {
                value: {
                    name: 'sample-name',
                    persona: 'teacher'
                }
            } as any;
            spyOn(mockLocationService, 'updateProfile').and.returnValue(of({}));
            spyOn(locationSelectionComponent, 'closeModal').and.callFake(() => {});
            // act
            await locationSelectionComponent.updateUserLocation();
            // assert
            expect(locationSelectionComponent.userService.loggedIn).toBeTruthy();
            expect(locationSelectionComponent['sbFormLocationSelectionDelegate'].updateUserLocation).toHaveBeenCalled();
        });

        it('should be unable update user profile', async () => {
            spyOn(locationSelectionComponent['sbFormLocationSelectionDelegate'], 'updateUserLocation').and
                .returnValue(Promise.reject({}));
            locationSelectionComponent.userService = {
                loggedIn: true,
                userid: 'sample-user-id',
            } as any;
            locationSelectionComponent['sbFormLocationSelectionDelegate'].formGroup = {
                value: {
                    name: 'sample-name',
                    persona: 'teacher'
                }
            } as any;
            spyOn(locationSelectionComponent, 'closeModal').and.callFake(() => {});
            spyOn(mockToasterService, 'error').and.returnValue('unable to load sample data');
            // act
            await locationSelectionComponent.updateUserLocation();
            // assert
            expect(locationSelectionComponent.userService.loggedIn).toBeTruthy();
            expect(locationSelectionComponent['sbFormLocationSelectionDelegate'].updateUserLocation).toHaveBeenCalled();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0049);
        });
    });
});
