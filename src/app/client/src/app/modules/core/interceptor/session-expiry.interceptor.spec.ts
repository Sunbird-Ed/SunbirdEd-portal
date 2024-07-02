import { UserService } from './../services';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, skipWhile } from 'rxjs/operators';
import { UtilService } from '@sunbird/shared';
import { ResourceService } from '../../shared/services/resource/resource.service';
import { ToasterService } from '../../shared/services/toaster/toaster.service';
import * as _ from 'lodash-es';
import { SessionExpiryInterceptor, HttpRequestInterceptor } from './session-expiry.interceptor';

describe('SessionExpiryInterceptor', () => {
 let SessionInterceptor: SessionExpiryInterceptor;
 let HttpInterceptor: HttpRequestInterceptor;


  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    endSession: jest.fn(() => of({})),
  };
  const mockUtilService: Partial<UtilService> = {
     isDesktopApp: false,
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
        lbl: {
          plslgn: 'Session Expired',
        },
      },
      instance: 'TestInstance',
    };
  const mockToasterService: Partial<ToasterService> = {
    warning: jest.fn(),
  };
   beforeAll(() => {
    SessionInterceptor = new SessionExpiryInterceptor(
      mockUserService as UserService,
      mockUtilService as UtilService,
      mockResourceService as ResourceService,
      mockToasterService as ToasterService
    );
    HttpInterceptor = new HttpRequestInterceptor();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a instance ', () => {
    expect(SessionInterceptor).toBeTruthy();
    expect(HttpInterceptor).toBeTruthy();
  });

  it('should handle session expiry and return undefined', async() => {
    const mockErrorResponse = {
      status: 401,
      error: { responseCode: 'SESSION_EXPIRED' },
    };

    const mockHandler = {
      handle: jest.fn(() => throwError(mockErrorResponse)),
    };

    await SessionInterceptor.intercept(null, mockHandler as any).subscribe(
      (error) => {
        expect(error).toBeUndefined();
      }
    );
  });

   it('should handle session expiry and return undefined (case for UNAUTHORIZED_ACCESS)', async() => {
    const mockErrorResponse = {
      status: 401,
      error: { responseCode: 'UNAUTHORIZED_ACCESS' },
    };

    const mockHandler = {
      handle: jest.fn(() => throwError(mockErrorResponse)),
    };

    await SessionInterceptor.intercept(null, mockHandler as any).subscribe(
      (error) => {
        expect(error).toBeUndefined();
      }
    );
  });

  it('should handle session expiry and return undefined (case for UNAUTHORIZED_USER)', async() => {
    const mockErrorResponse = {
      status: 401,
      error: { params: { err: 'UNAUTHORIZED_USER' } },
    };

    const mockHandler = {
      handle: jest.fn(() => throwError(mockErrorResponse)),
    };
    await SessionInterceptor.intercept(null, mockHandler as any).subscribe(
      (error) => {
        expect(error).toBeUndefined();
      }
    );
  });

  it('should not handle session expiry when status is not 401', async () => {
    const mockErrorResponse = {
      status: 500,
      error: { responseCode: 'SESSION_EXPIRED' },
    };

    const mockHandler = {
      handle: jest.fn(() => throwError(mockErrorResponse)),
    };

    try {
      await SessionInterceptor.intercept(null, mockHandler as any).toPromise();
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.error.responseCode).toBe('SESSION_EXPIRED');
    }
  });

   it('should show session expired message with correct parameters', () => {
    SessionInterceptor.showSessionExpiredMessage();
    const expectedMessage = 'Session Expired';
    expect(mockToasterService.warning).toHaveBeenCalledWith(expectedMessage);
  });


  it('should add mandatory headers to the request', () => {
    const mockRequest = new HttpRequest('GET', 'someurl');
    const mockHandler: Partial<HttpHandler> = {
      handle: jest.fn(),
    };
    const modifiedRequest = HttpInterceptor.addMandatoryHeaders(mockRequest);
    HttpInterceptor.intercept(mockRequest, mockHandler as HttpHandler);
    expect(mockHandler.handle).toHaveBeenCalledWith(modifiedRequest);
  });
});
