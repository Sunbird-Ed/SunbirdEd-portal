import { FrameworkService, FormService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { of } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { _ } from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { PopupControlService } from '../../../../service/popup-control.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '@sunbird/profile';
import { ProfileFrameworkPopupComponent } from './profile-framework-popup.component';

describe('ProfileFrameworkPopupComponent', () => {
    let component: ProfileFrameworkPopupComponent;

    const router: Partial<Router> = {
        navigate: jest.fn()
    };
    const userService: Partial<UserService> = {};
    const frameworkService: Partial<FrameworkService> = {};
    const formService: Partial<FormService> = {};
    const resourceService: Partial<ResourceService> = {};
    const cacheService: Partial<CacheService> = {};
    const toasterService: Partial<ToasterService> = {};
    const channelService: Partial<ChannelService> = {};
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
});