import { ResourceService, ToasterService, NavigationHelperService } from "@sunbird/shared";

import { TelemetryService } from "@sunbird/telemetry";
import { TenantService, FormService, UserService } from "@sunbird/core";
import { ProfileService } from "@sunbird/profile";
import { isObservable, Observable, of, throwError } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { OnboardingUserSelectionComponent } from "./onboarding-user-selection.component";
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from "rxjs/operators";

describe("onboarding user component", () => {
    let onboardingUserSelectionComponent: OnboardingUserSelectionComponent;
    const mockResourceService: Partial<ResourceService> = {};
    const mockTenantService: Partial<TenantService> = {};
    const mockRouter: Partial<Router> = {
        events: of({ id: 1, url: "sample-url" }) as any,
        navigate: jest.fn(),
        url: 'jest/something'
    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {};
    const mockTelemetryService: Partial<TelemetryService> = {};
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({})
    };
    const mockFormService: Partial<FormService> = {

        getFormConfig: jest.fn().mockReturnValue(of(true)) as any
    };
    const mockProfileService: Partial<ProfileService> = {};
    const mockUserService: Partial<UserService> = {};
    const mockToasterService: Partial<ToasterService> = {};

    beforeAll(() => {
        onboardingUserSelectionComponent = new OnboardingUserSelectionComponent(
            mockResourceService as ResourceService,
            mockTenantService as TenantService,
            mockRouter as Router,
            mockNavigationHelperService as NavigationHelperService,
            mockTelemetryService as TelemetryService,
            mockActivatedRoute as ActivatedRoute,
            mockFormService as FormService,
            mockProfileService as ProfileService,
            mockUserService as UserService,
            mockToasterService as ToasterService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should  create an instance of onboardingUserSelectionComponent', () => {
        expect(onboardingUserSelectionComponent).toBeTruthy();
    });

    describe('setup the onboardingUserSelection component', () => {

        describe('setup ngOnInit function', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should call setPopupInteractEdata method', () => {
                //arrange  
                const setPopupInteractEdataSpy = jest.spyOn(onboardingUserSelectionComponent, 'setPopupInteractEdata');
                //act
                onboardingUserSelectionComponent.ngOnInit();
                //assert
                expect(setPopupInteractEdataSpy).toBeCalled();
            });

            it('should call initialize method', () => {
                //arrange
                //@ts-ignore
                const initializeSpy = jest.spyOn(onboardingUserSelectionComponent, 'initialize');
                //act
                onboardingUserSelectionComponent.ngOnInit();
                //assert
                expect(initializeSpy).toBeCalled();
            })
        });
    });


    describe("setPopupInteractEdata method", () => {

        const userSelectionInteractEdataResponse = {
            id: "user-type-select",
            type: "click",
            pageid: "something",
        };

        it('should set this.userSelectionInteractEdata to the  given appropriate data userSelectionInteractEdataResponse', () => {
            //arrange
            onboardingUserSelectionComponent.userSelectionInteractEdata = undefined;
            //act
            onboardingUserSelectionComponent.setPopupInteractEdata();
            //assert
            expect(onboardingUserSelectionComponent.userSelectionInteractEdata).toEqual(userSelectionInteractEdataResponse);
        })
    })


    describe("initialize method", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call getFormConfig method of the onboard user selection component', () => {
            //arrange 
            //@ts-ignore
            const getFormConfigSpy = jest.spyOn(onboardingUserSelectionComponent, 'getFormConfig');
            //act
            onboardingUserSelectionComponent['initialize']();
            //assert
            expect(getFormConfigSpy).toBeCalled();
        })

        it('should call updateUserSelection ', () => {
            //arrange
            //@ts-ignore
            const updateUserSelectionSpy = jest.spyOn(onboardingUserSelectionComponent, 'updateUserSelection');
            //act
            onboardingUserSelectionComponent['initialize']();
            //assert
            expect(updateUserSelectionSpy).toBeCalled();
        });

        it('should return an observable after merge', () => {
            //arrange
            let returnedObservable = undefined;
            //run
            returnedObservable = onboardingUserSelectionComponent['initialize']();
            //assert
            expect(isObservable(returnedObservable)).toEqual(true);
        })
    });

    describe('getFormConfig method', () => {
        it('should return an Observable', () => {
            //arrange
            let returnedObservable = undefined;
            //run
            returnedObservable = onboardingUserSelectionComponent['getFormConfig']();
            //assert
            expect(isObservable(returnedObservable)).toEqual(true);
        });

        it('should capture the error in case of thrown error ', () => {
            //arrange
            let errorResponse: HttpErrorResponse = { status: 401 } as HttpErrorResponse;
            mockFormService.getFormConfig = jest.fn().mockReturnValue(throwError(errorResponse));
            //run
            onboardingUserSelectionComponent['getFormConfig']().subscribe(() => { }, (err: HttpErrorResponse) => {
                //assert
                expect(err).toEqual(errorResponse);
            });
        })
    })
})






