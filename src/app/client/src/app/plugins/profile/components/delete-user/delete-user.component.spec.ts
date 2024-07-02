
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService, LayoutService, IUserData } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { DeleteUserComponent } from './delete-user.component'

describe('DeleteUserComponent', () => {
    let component: DeleteUserComponent;

    const resourceService: Partial<ResourceService> = {
        messages: {
            imsg: {
                m0092: 'Please accept all terms and conditions'
            }
        },
        frmelmnts: {
            lbl: {
                phoneOtpDeleteInfo: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
                emailOtpDeleteInfo: 'An OTP has been sent you your registered email. Please enter the OTP to proceed with account deletion.',
                deleteConfirmMessage: 'Are you sure you want to delete your account ? This action is irreversible!',
                deleteNote: 'NOTE: Please Accept all terms and Conditions',
                deleteAccount: 'Delete Account',
                condition1: 'Personal Information: Your personal account information, including your profile and login details, will be permanently deleted, including your activity history. This information cannot be recovered',
                condition2: 'Certificates: For certificate verification purposes, only your name will be stored. Access Loss: You will lose access to all features and services associated with this account, and any subscriptions or memberships may be terminated.',
                condition3: 'Single Sign-On (SSO): If you use Single Sign-On (SSO) to sign in, be aware that a new account will be created the next time you sign in. This new account will not have any historical information.',
                condition4: 'Resource Retention: Even after your account is deleted, any contributions, content, or resources you have created within the portal will not be deleted. These will remain accessible to other users as part of the collective content.You will no longer have control or management rights over them.',
                condition5: 'Usage Reports: Usage reports will retain location data declared by you.',
                condition6: 'Make sure you have backed up any important data and have considered the consequences before confirming account deletion and downloaded your certificates.',
                verification: 'Verification'
            }
        }
    };
    const toasterService: Partial<ToasterService> = {
        warning: jest.fn()
    };
    const router: Partial<Router> = {
        url: 'test'
    };
    const userService: Partial<UserService> = {
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
    const activatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({
            type: 'edit',
            courseId: 'do_456789',
            batchId: '124631256'
        }),
        params: of({ collectionId: "123" }),
        snapshot: {
            data: {
                telemetry: {
                    env: 'certs',
                    pageid: 'certificate-configuration',
                    type: 'view',
                    subtype: 'paginate',
                    ver: '1.0'
                }
            }
        } as any
    };
    const navigationhelperService: Partial<NavigationHelperService> = {
        setNavigationUrl: jest.fn(),
        getPageLoadTime: jest.fn(),
        navigateToLastUrl: jest.fn(),
        goBack: jest.fn()
    };
    const layoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        redoLayoutCSS: jest.fn()
    };

    beforeAll(() => {
        component = new DeleteUserComponent(
            resourceService as ResourceService,
            toasterService as ToasterService,
            router as Router,
            userService as UserService,
            activatedRoute as ActivatedRoute,
            navigationhelperService as NavigationHelperService,
            layoutService as LayoutService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call the ngOnInit method', () => {
        layoutService.switchableLayout = jest.fn(() => of({ layout: 'abcd' }));
        component.ngOnInit();
        expect(component).toBeTruthy();
        expect(component.layoutConfiguration).toEqual('abcd');
    });
    it('should create a instance of component and call the goBack method', () => {
        component.goBack();
        expect(component).toBeTruthy();
        expect(navigationhelperService.goBack).toBeCalled();
    });
    it('should create a instance of component and call the onCancel method', () => {
        component.onCancel();
        expect(component).toBeTruthy();
        expect(navigationhelperService.navigateToLastUrl).toBeCalled();
    });
    it('should create a instance of component and call the onSubmitForm method', () => {
        component.onSubmitForm();
        expect(component).toBeTruthy();
        expect(toasterService.warning).toBeCalledWith(resourceService.messages.imsg.m0092);
    });
    it('should create a instance of component and call the onSubmitForm method with enableSubmitBtn true', () => {
        component.enableSubmitBtn = true;
        component.inputFields = [
            {
                nativeElement: {
                    checked: true
                }
            }
        ]
        component.onSubmitForm();
        expect(component).toBeTruthy();
        expect(component.showContactPopup).toBeTruthy();
    });
    it('should create a instance of component and call the validateModal method with inputFields', () => {
        component.conditions.length = 1;
        component.inputFields = [
            {
                nativeElement: {
                    checked: true
                }
            }
        ]
        component.validateModal();
        expect(component).toBeTruthy();
        expect(component.enableSubmitBtn).toBeTruthy();
    });
    it('should create a instance of component and call the validateModal method with inputFields', () => {
        component.conditions.length = 2;
        component.inputFields = [
            {
                nativeElement: {
                    checked: true
                }
            }
        ]
        component.validateModal();
        expect(component).toBeTruthy();
        expect(component.enableSubmitBtn).toBeFalsy();
    });
    it('should create a instance of component and call the createCheckedArray method with input checkedItem', () => {
        const checkedItem = 'Usage Reports: Usage reports will retain location data declared by you.'
        component.conditions = [
            'Usage Reports: Usage reports will retain location data declared by you.',
            'Make sure you have backed up any important data and have considered the consequences before confirming account deletion and downloaded your certificates.'
        ];
        component.createCheckedArray(checkedItem);
        expect(component).toBeTruthy();
        expect(component.conditions).toEqual(['Make sure you have backed up any important data and have considered the consequences before confirming account deletion and downloaded your certificates.']);
    });
    it('should create a instance of component and call the createCheckedArray method with input checkedItem and conditions as empty', () => {
        const checkedItem = 'Usage Reports: Usage reports will retain location data declared by you.'
        component.conditions = [];
        component.createCheckedArray(checkedItem);
        expect(component).toBeTruthy();
        expect(component.conditions).toEqual([checkedItem]);
    });
});