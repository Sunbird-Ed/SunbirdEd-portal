
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { ConfigService, ServerResponse, ToasterService, ResourceService, IUserData } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import { _ } from 'lodash-es';
import { RolesAndPermissions, Roles } from './../../interfaces';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { PermissionService } from './permission.service';
import { mockPermissionRes } from './permission.mock.spec.data'

describe('PermissionService', () => {
    let component: PermissionService;

    const resourceService: Partial<ResourceService> = {};
    const config: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                ROLES: {
                    READ: "data/v1/role/read",
                }
            },
        },
        rolesConfig:{
            WORKSPACEAUTHGARDROLES: mockPermissionRes.WORKSPACEAUTHGARDROLES
        }
    };
    const learner: Partial<LearnerService> = {
        get: jest.fn().mockReturnValue(of(mockPermissionRes.success))
    };
    const userService: Partial<UserService> = {
        loggedIn: true,
        slug: jest.fn().mockReturnValue('tn') as any,
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],
                userRoles:['BOOK_REVIEWER']
            } as any,
        }) as any,
        setIsCustodianUser: jest.fn(),
        setGuestUser: jest.fn(),
        userid: 'sample-uid',
        appId: 'sample-id',
        getServerTimeDiff: '',
    };
    const toasterService: Partial<ToasterService> = {};

    beforeAll(() => {
        component = new PermissionService(
            resourceService as ResourceService,
            config as ConfigService,
            learner as LearnerService,
            userService as UserService,
            toasterService as ToasterService
        )
        component.mainRoles = mockPermissionRes.RolesAndPermissions;
        component.rolesAndPermissions = mockPermissionRes.RolesAndPermissions;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call the initialize method', () => {
        const privateMethodSpy = jest.spyOn(component,['setCurrentRoleActions'] as any) as any;
        component.initialize()
        expect(component).toBeTruthy();
        expect(privateMethodSpy).toBeCalled();
    });
    it('should create a instance of component and call the getPermissionsData method', () => {
        jest.spyOn(learner,'get').mockReturnValue(of(mockPermissionRes.success as any)) as any
        component['getPermissionsData']();
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call the checkRolesPermissions method', () => {
        const value = component.checkRolesPermissions(mockPermissionRes.roles);
        expect(component).toBeTruthy();
        expect(value).toBeFalsy();
    });
    it('should create a instance of component and call the checkRolesPermissions method', () => {
        userService.userData$.subscribe((data) => {
            data.userProfile.userRoles = ['PUBLIC'];
        });
        component.userRoles = ['PUBLIC', 'BOOK_CREATOR']
        component.initialize();
        const value = component.checkRolesPermissions(mockPermissionRes.roles);
        expect(component).toBeTruthy();
        expect(value).toBeTruthy();
    });
    it('should create a instance of component and call the allRoles method', () => {
        const value = component.allRoles;
        expect(component).toBeTruthy();
        expect(JSON.stringify(value)).toEqual(JSON.stringify(mockPermissionRes.RolesAndPermissions));
    });
    it('should create a instance of component and call the getWorkspaceAuthRoles method', () => {
        const value = component.getWorkspaceAuthRoles();
        expect(component).toBeTruthy();
        expect(JSON.stringify(value)).toEqual(JSON.stringify(mockPermissionRes.WORKSPACEAUTHGARDROLES[0]))
    });
    it('should create a instance of component and call the setCurrentRoleActions method', () => {
        component.rolesAndPermissions = mockPermissionRes.RolesAndPermissions;
        component['setCurrentRoleActions']();
        expect(component).toBeTruthy();
        expect(component.permissionAvailable).toBeTruthy();
    });
    xit('should create a instance of component and call the setCurrentRoleActions method with user error', () => {
        userService.userData$.subscribe((data) => {
            data.err = mockPermissionRes.error as any;
            component['setCurrentRoleActions']();
        });
    });
    
});