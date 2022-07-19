import { AuthGuard } from './auth-gard.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ConfigService, ResourceService, ToasterService } from '../../shared';
import { UserService, PermissionService } from '../../core';
import { of } from 'rxjs/internal/observable/of';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

describe('AuthGardService', () => {
    let authGuard: AuthGuard;
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            imsg: {
                m0035: 'Something went wrong',
            },
        }
    };
    const mockRouter: Partial<Router> = {
        navigate: jest.fn(),
        url: '/home'
    };
    const mockUserService: Partial<UserService> = {
        loggedIn: true,
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],
                profileUserType: {
                    type: 'student'
                }
            } as any
        }) as any,
        slug: jest.fn() as any
    };
    const mockConfigService: Partial<ConfigService> = {
        appConfig: {
            layoutConfiguration: "joy",
            TELEMETRY: {
                PID: 'sample-page-id'
            },
            UrlLinks: {
                downloadsunbirdApp: 'https://play.google.com/store/apps/details?'
            }
        },
        urlConFig: {
            URLS: {
                TELEMETRY: {
                    SYNC: true
                },
                CONTENT_PREFIX: ''
            }
        },
        rolesConfig: {
            ROLES: {
                announcement: ["ANNOUNCEMENT_SENDER"],
            }
        }
    };
    const mockToasterService: Partial<ToasterService> = {
        warning: jest.fn()
    };
    const mockPermissionService: Partial<PermissionService> = {
        permissionAvailable$: of(true) as any,
        checkRolesPermissions: jest.fn(() => {
            return true;
        }) as any
    };
    beforeAll(() => {
        authGuard = new AuthGuard(
            mockRouter as Router,
            mockPermissionService as PermissionService,
            mockResourceService as ResourceService,
            mockConfigService as ConfigService,
            mockToasterService as ToasterService,
            mockUserService as UserService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be able to hit route when user is logged in', () => {
        const snapshotroute = {
            url: [
                {
                    path: 'workspace',
                }
            ],
            data: {},
            root: ''
        };
        const mock = <T, P extends keyof T>(obj: Pick<T, P>): T => obj as T;
        const state = mock<RouterStateSnapshot, "url" | "root">({
            url: '/workspace',
            root: jest.fn() as any
        });
        const result = authGuard.canActivate(snapshotroute as any, state);
        expect(result).toBeTruthy();
    });

    it('canLoad should return false if user not logged in', () => {
        // @ts-ignore
        mockUserService.loggedIn = false;
        expect(authGuard.canLoad()).toBeFalsy();
    });

    it('canLoad should return true if user is logged in', () => {
        // @ts-ignore
        mockUserService.loggedIn = true;
        expect(authGuard.canLoad()).toBeTruthy();
    });

    it('should navigate to home', () => {
        // @ts-ignore
        mockUserService.loggedIn = true;
        authGuard.navigateToHome({
            next() { },
            complete() { },
        });
        expect(mockRouter.navigate).toHaveBeenCalled();
        expect(mockToasterService.warning).toHaveBeenCalled();
    });

    it('should navigate to home if permission is not fetched or error occurred while fetching permission', () => {
        mockPermissionService.permissionAvailable$ = new BehaviorSubject('error');
        authGuard.getPermission('creator').subscribe((data) => {
            expect(data).toBeFalsy();
            expect(mockRouter.navigate).toHaveBeenCalled();
            expect(mockToasterService.warning).toHaveBeenCalled();
        });
    });

    it('should navigate to home if passed role is not configured in config service', () => {
        mockPermissionService.permissionAvailable$ = new BehaviorSubject('success');
        authGuard.getPermission('unknown_role').subscribe((data) => {
            expect(data).toBeFalsy();
            expect(mockRouter.navigate).toHaveBeenCalled();
            expect(mockToasterService.warning).toHaveBeenCalled();
        });
    });

    it('should navigate to home if user does not have proper role', () => {
        mockPermissionService.permissionAvailable$ = new BehaviorSubject('success');
        authGuard.getPermission('announcement').subscribe((data) => {
            expect(data).toBeFalsy();
            expect(mockRouter.navigate).toHaveBeenCalled();
            expect(mockToasterService.warning).toHaveBeenCalled();
        });
    });

    it('should return true if user has proper role', () => {
        mockPermissionService.permissionAvailable$ = new BehaviorSubject('success');
        authGuard.getPermission('announcement').subscribe((data) => {
            expect(data).toBeTruthy();
        });
    });

    it('should return true if user has rootOrgAdmin role', () => {
        authGuard.getPermission('rootOrgAdmin').subscribe((data) => {
            expect(data).toBeTruthy();
        });
    });

    it('should navigate to home if role is rootOrgAdmin and user dosnt have rootOrgAdmin role', () => {
        authGuard.getPermission('rootOrgAdmin').subscribe((data) => {
            expect(data).toBeFalsy();
            expect(mockRouter.navigate).toHaveBeenCalled();
            expect(mockToasterService.warning).toHaveBeenCalled();
        });
    });
});
