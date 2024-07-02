
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UserService, TenantService } from '@sunbird/core';
import { Subscription, Subject, throwError } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { IUserProfile, ILoaderMessage } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { _ } from 'lodash-es';
import { of } from 'rxjs';
import { PopupControlService } from '../../../../service/popup-control.service';
import { mockUserData } from '../../../core/services/user/user.mock.spec.data';
import { tNcMockResponse } from './terms-conditions-popup.component.spec.data';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionsPopupComponent } from './terms-conditions-popup.component';

describe('TermsAndConditionsPopupComponent', () => {
    let component: TermsAndConditionsPopupComponent;

    const userService: Partial<UserService> = {
        loggedIn: true,
        slug: jest.fn().mockReturnValue('tn') as any,
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],
                managedBy: 'user123',
            } as any
        }) as any,
        setIsCustodianUser: jest.fn(),
        userid: 'sample-uid',
        appId: 'sample-id',
        getServerTimeDiff: '',
        acceptTermsAndConditions: jest.fn()
    };
    const resourceService: Partial<ResourceService> = {
        messages: {
            stmsg: {
                m0129: 'Loading the terms and conditions.'
            },
            fmsg: {
                m0085: 'There was a technical error. Try again.'
            },
            emsg: {
                m0005: 'Something went wrong, try again later'
            }
        }
    };
    const toasterService: Partial<ToasterService> = {
        success: jest.fn(),
        error: jest.fn()
    };
    const tenantService: Partial<TenantService> = {
        tenantData$: of({ favicon: 'sample-favicon', tenantData: { logo: 'test' } }) as any
    };
    const sanitizer: Partial<DomSanitizer> = {
        bypassSecurityTrustResourceUrl: jest.fn()
    };
    const popupControlService: Partial<PopupControlService> = {
        changePopupStatus: jest.fn()
    };
    const dialogRefData = {
        close: jest.fn()
    };
    const matDialog: Partial<MatDialog> = {
        getDialogById: jest.fn().mockReturnValue(dialogRefData)
    };

    beforeAll(() => {
        component = new TermsAndConditionsPopupComponent(
            userService as UserService,
            resourceService as ResourceService,
            toasterService as ToasterService,
            tenantService as TenantService,
            sanitizer as DomSanitizer,
            popupControlService as PopupControlService,
            matDialog as MatDialog
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should call the ngOninit method and  userProfile need to be', () => {
        userService._userProfile = { 'organisations': ['01229679766115942443'] } as any;
        tenantService._tenantData$ = jest.fn().mockReturnValue(of(tNcMockResponse.tenantMockData) as any) as any;
        userService._userData$ = jest.fn().mockReturnValue(throwError({ error: true }) as any) as any;
        component.ngOnInit();
        const obj = {
            userId: 'sample-uid',
            rootOrgId: 'sample-root-id',
            rootOrg: {},
            hashTagIds: ['id'],
            managedBy: 'user123'
        }
        expect(JSON.stringify(component['userProfile'])).toEqual(JSON.stringify(obj));
    });
    it('should call the ngOninit method and  userProfile need to be', () => {
        component.tncUrl = 'https://sunbird.org/termsandcond/demo.html'
        userService._userProfile = { 'organisations': ['01229679766115942443'] } as any;
        tenantService._tenantData$ = jest.fn().mockReturnValue(of(tNcMockResponse.tenantMockData) as any) as any;
        userService._userData$ = jest.fn().mockReturnValue(throwError({ error: true }) as any) as any;
        component.ngOnInit();
        expect(sanitizer.bypassSecurityTrustResourceUrl).toBeCalled();
    });
    it('should call acceptTermsAndConditions api', () => {
        component.disableContinueBtn = true;
        component.adminTncVersion = 'V4';
        userService._userProfile = { 'organisations': ['01229679766115942443'] } as any;
        jest.spyOn(userService, 'acceptTermsAndConditions').mockReturnValue(of({}) as any);
        jest.spyOn(component, 'onClose');
        component.onSubmitTnc('1234');
        expect(component.onClose).toHaveBeenCalled();
    });
    it('should call acceptTermsAndConditions api with reportViewerTncVersion', () => {
        component.disableContinueBtn = true;
        component.adminTncVersion = null;
        component.reportViewerTncVersion = 'V4';
        userService._userProfile = { 'organisations': ['01229679766115942443'] } as any;
        jest.spyOn(userService, 'acceptTermsAndConditions').mockReturnValue(of({}) as any);
        jest.spyOn(component, 'onClose');
        component.onSubmitTnc('1234');
        expect(component.onClose).toHaveBeenCalled();
    });
    it('should call acceptTermsAndConditions api with error', () => {
        component.disableContinueBtn = true;
        component.adminTncVersion = null;
        component.reportViewerTncVersion = 'V4';
        userService._userProfile = { 'organisations': ['01229679766115942443'] } as any;
        jest.spyOn(userService, 'acceptTermsAndConditions').mockReturnValue(throwError({ error: 'true' }) as any);
        jest.spyOn(component, 'onClose');
        component.onSubmitTnc('1234');
        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0085);
    });
    it('should call onClickCheckbox api', () => {
        component.onClickCheckbox(true);
        expect(component.disableContinueBtn).toBeFalsy()
    });
    it('should call onClose api', () => {
        component.close = new EventEmitter<void>();
        jest.spyOn(popupControlService, 'changePopupStatus');
        jest.spyOn(component.close, 'emit');
        component.onClose('modalId');
    });
    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component['userSubscription'] = {
                unsubscribe: jest.fn(),
            } as any;
            component['tenantDataSubscription'] = {
                unsubscribe: jest.fn(),
            } as any;
            component.unsubscribe = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe.next).toHaveBeenCalled();
            expect(component.unsubscribe.complete).toHaveBeenCalled();
            expect(component.userSubscription.unsubscribe).toHaveBeenCalled();
            expect(component.tenantDataSubscription.unsubscribe).toHaveBeenCalled();
        });
    });
});