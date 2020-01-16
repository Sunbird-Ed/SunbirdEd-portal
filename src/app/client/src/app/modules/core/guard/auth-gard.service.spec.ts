import { TestBed, inject, async } from '@angular/core/testing';
import { AuthGuard } from './auth-gard.service';
import { RouterModule, Router, Routes, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService, ResourceService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LearnerService, UserService, PermissionService, CoreModule } from '@sunbird/core';
describe('AuthGardService', () => {
    // const authGuard: AuthGuard;
    const router = {
        navigate: jasmine.createSpy('navigate')
    };
    const snapshot = {
        state: jasmine.createSpy('url')
    };
    const activeroutesnapshot = {
        route: jasmine.createSpy('')
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthGuard, PermissionService, ToasterService, UserService, ResourceService, ConfigService, LearnerService,
                BrowserCacheTtlService,
                { provide: Router, useValue: router },
                { provide: RouterStateSnapshot, useValue: snapshot },
                {
                    provide: ActivatedRoute, useValue: {
                        snapshot: {
                            url: [
                                {
                                    path: 'workspace',
                                }
                            ],
                        },
                    }
                }],
            imports: [HttpClientTestingModule, CoreModule]
        });
    });
    it('be able to hit route when user is logged in', () => {
        const authservice = TestBed.get(AuthGuard);
        const snapshotroute = {
            url: [
                {
                    path: 'workspace',
                }
            ],
            data: {}
        };
        const result = authservice.canActivate(snapshotroute, RouterStateSnapshot);
        expect(result).toBeTruthy();
    });

    it('canLoad should return false if user not logged in', () => {
        const userService = TestBed.get(UserService);
        const authservice = TestBed.get(AuthGuard);
        spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
        expect(authservice.canLoad()).toBeFalsy();
    });

    it('canLoad should return true if user is logged in', () => {
        const userService = TestBed.get(UserService);
        const authservice = TestBed.get(AuthGuard);
        spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
        expect(authservice.canLoad()).toBeTruthy();
    });
});
