import { SharedModule } from '@sunbird/shared';
import { SessionExpiryInterceptor } from './session-expiry.interceptor';
import { UserService } from '@sunbird/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('Session Expiry Interceptor', () => {

    let sessionExpiryInterceptor: SessionExpiryInterceptor;
    let httpMock: HttpTestingController;
    const mockUrl = '/data';
    let userService: UserService;
    const makeApiCall = () => {
        const http = TestBed.get(HttpClient);
        return http.get(mockUrl);
    };
    configureTestSuite();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
            providers: [UserService, SessionExpiryInterceptor, {
                provide: HTTP_INTERCEPTORS,
                useClass: SessionExpiryInterceptor,
                multi: true,
            }]
        });
        sessionExpiryInterceptor = TestBed.get(SessionExpiryInterceptor);
        httpMock = TestBed.get(HttpTestingController);
        userService = TestBed.get(UserService);
    });

    it('should intercept any api call', () => {
        spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
        spyOn(sessionExpiryInterceptor, 'intercept').and.callThrough();
        makeApiCall().subscribe(null, err => {
            expect(err.error).toBeDefined();
            expect(err.error).toEqual({ responseCode: 'SESSION_EXPIRED' });
            expect(err.status).toBe(401);
            expect(err.statusText).toBe('Unauthorized');
            expect(sessionExpiryInterceptor.sessionExpired).toBeFalsy();
            expect(sessionExpiryInterceptor.intercept).toHaveBeenCalled();
        });
        const mockHttp = httpMock.expectOne(mockUrl);
        mockHttp.flush({ responseCode: 'SESSION_EXPIRED' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle session expiry when status code is 401 and user is logged in ', () => {
        spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
        spyOn(userService, 'endSession');
        spyOn(sessionExpiryInterceptor, 'handleSessionExpiry').and.callThrough();
        makeApiCall().subscribe(null, err => {
            expect(err.error).toEqual({ responseCode: 'SESSION_EXPIRED' });
            expect(sessionExpiryInterceptor.sessionExpired).toBeTruthy();
            expect(sessionExpiryInterceptor.handleSessionExpiry).toHaveBeenCalled();
        });
        const mockHttp = httpMock.expectOne(mockUrl);
        mockHttp.flush({ responseCode: 'SESSION_EXPIRED' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should not handle session expiry when status code is 401 and user is not logged in ', () => {
        spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
        makeApiCall().subscribe(null, err => {
            expect(err.error).toEqual({ responseCode: 'SESSION_EXPIRED' });
            expect(sessionExpiryInterceptor.sessionExpired).toBeFalsy();
        });
        const mockHttp = httpMock.expectOne(mockUrl);
        mockHttp.flush({ responseCode: 'SESSION_EXPIRED' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle session expiry when status code is not 401', () => {
        spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
        makeApiCall().subscribe(null, err => {
            expect(err.error).toEqual({ responseCode: 'SESSION_EXPIRED' });
            expect(sessionExpiryInterceptor.sessionExpired).toBeFalsy();
        });
        const mockHttp = httpMock.expectOne(mockUrl);
        mockHttp.flush({ responseCode: 'SESSION_EXPIRED' }, { status: 500, statusText: 'Unauthorized' });
    });

    afterEach(() => {
        SessionExpiryInterceptor.singletonInstance = null;
        httpMock.verify();
    });
});

