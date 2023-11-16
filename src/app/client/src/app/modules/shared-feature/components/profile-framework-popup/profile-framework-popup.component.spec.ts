import { FrameworkService, FormService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { of, throwError } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { _ } from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { PopupControlService } from '../../../../service/popup-control.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '@sunbird/profile';
import { Response } from './profile-framework-popup.component.spec.data';
import { ProfileFrameworkPopupComponent } from './profile-framework-popup.component';

describe('ProfileFrameworkPopupComponent', () => {
    let component: ProfileFrameworkPopupComponent;
    const router: Partial<Router> = {
        navigate: jest.fn()
    };
    const userService: Partial<UserService> = {
        loggedIn: true,
        slug: jest.fn().mockReturnValue("tn") as any,
        userData$: of({ userProfile: Response.userProfile as any }) as any,
        setIsCustodianUser: jest.fn(),
        userid: 'sample-uid',
        appId: 'sample-id',
        getServerTimeDiff: '',
        userProfile: Response.userProfile,
        setUserFramework: jest.fn(),
        createGuestUser: jest.fn()
    };
    const frameworkService: Partial<FrameworkService> = {};
    const formService: Partial<FormService> = {
        getFormConfig:jest.fn()
    };
    const resourceService: Partial<ResourceService> = {
        messages: {
            smsg: {
                m0058: 'User preference updated successfully',
            },
            emsg: {
                m0005: 'Something went wrong, try again later'
            }
        }
    };
    const cacheService: Partial<CacheService> = {
        set: jest.fn(),
        get: jest.fn()
    };
    const toasterService: Partial<ToasterService> = {
        success: jest.fn(),
        error: jest.fn()
    };
    const channelService: Partial<ChannelService> = {
        getFrameWork:jest.fn()
    };
    const orgDetailsService: Partial<OrgDetailsService> = {
        getOrgDetails: jest.fn(),
        getCustodianOrgDetails: jest.fn()
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
    const profileService: Partial<ProfileService> = {};
    beforeAll(() => {
        component = new ProfileFrameworkPopupComponent(
            router as Router,
            userService as UserService,
            frameworkService as FrameworkService,
            formService as FormService,
            resourceService as ResourceService,
            cacheService as CacheService,
            toasterService as ToasterService,
            channelService as ChannelService,
            orgDetailsService as OrgDetailsService,
            popupControlService as PopupControlService,
            matDialog as MatDialog,
            profileService as ProfileService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should throw warning and navigate to resource if not in edit mode and fetching custodian org details fails', () => {
        component.dialogProps = {
            id: 'test'
        }
        component.isGuestUser = true
        component.isStepper = false
        matDialog.open = jest.fn();
        const nonCustodianOrg = { result: { response: { value: 'ROOT_ORG' } } }
        orgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
        orgDetailsService.getOrgDetails = jest.fn().mockReturnValue(of({})) as any;
        component.hashId = 1234
        component.ngOnInit();
        expect(component.guestUserHashTagId).toBe(1234)
    });
    it('should call navigateToLibrary method', () => {
        component.dialogRef = MatDialogRef as any
        component.dialogRef.close = jest.fn();
        component['navigateToLibrary']();
        expect(component).toBeTruthy();
        expect(cacheService.set).toHaveBeenCalledWith('showFrameWorkPopUp', 'installApp');
    });
    describe('new Describe of isCustodianOrgUser', () => {
        it('should call isCustodianOrgUser method', () => {
            const nonCustodianOrg = { result: { response: { value: 'ORG_001' } } }
            orgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
            userService.userProfile.rootOrg.rootOrgId = "ORG_OO1"
            let output = component['isCustodianOrgUser']();
            expect(output).toBeTruthy();
        });
        it('should call isCustodianOrgUser method with return as false', () => {
            const nonCustodianOrg = { result: { response: { value: 'ROOT_ORG' } } }
            userService.userProfile.rootOrg.rootOrgId = "ORG_OO1"
            orgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
            let output = component['isCustodianOrgUser']();
            expect(output).toBeTruthy();
        });
    });
    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component['unsubscribe'] = {
                unsubscribe: jest.fn(),
            } as any;
            component.dialogRef = MatDialogRef as any
            component.dialogRef.close = jest.fn();
            component.ngOnDestroy();
            expect(component['unsubscribe'].unsubscribe).toHaveBeenCalled();
        });
    });
    it('should call enableSubmitButton method', () => {
        component['_formFieldProperties'] = Response.formFields1;
        component['enableSubmitButton']();
        expect(component.showButton).toBeTruthy();
    });
    it('should call enableSubmitButton method with showButton as false', () => {
        component['_formFieldProperties'] = Response.formFields1;
        component.selectedOption = Response.selectedOption;
        component['enableSubmitButton']();
        expect(component.showButton).toBeFalsy();
    });
    it('should call onSubmitForm method', () => {
        jest.spyOn(userService, 'setUserFramework');
        profileService.updateProfile = jest.fn(() => of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        component.onSubmitForm();
        expect(userService.setUserFramework).toBeCalled();
    });
    it('should call onSubmitForm method', () => {
        jest.spyOn(userService, 'setUserFramework');
        localStorage.setItem('userType', 'student');
        profileService.updateProfile = jest.fn(() => of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        userService.createGuestUser = jest.fn().mockReturnValue(of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        component.isStepper = true;
        component.isGuestUser = true;
        component.onSubmitForm();
        expect(toasterService.success).toBeCalledWith(resourceService.messages.smsg.m0058);
    });
    it('should call onSubmitForm method with error', () => {
        jest.spyOn(userService, 'setUserFramework');
        localStorage.setItem('userType', 'student');
        profileService.updateProfile = jest.fn(() => of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        userService.createGuestUser = jest.fn().mockReturnValue(throwError({
            'result': {
                'response': 'ERROR'
            }
        })) as any;
        component.isStepper = true;
        component.isGuestUser = true;
        component.onSubmitForm();
        expect(toasterService.error).toBeCalledWith(resourceService.messages.emsg.m0005);
    });
    it('should call getFormDetails method', () => {
        component['_formFieldProperties'] = Response.formFields1;
        component['getFormDetails']();
        expect(formService.getFormConfig).toHaveBeenCalled();
    });
    it('should call getFormDetails method with admin user', () => {
        component['_formFieldProperties'] = Response.formFields1;
        localStorage.setItem('userType', 'administrator');
        component['getFormDetails']();
        expect(formService.getFormConfig).toHaveBeenCalled();
    });
});