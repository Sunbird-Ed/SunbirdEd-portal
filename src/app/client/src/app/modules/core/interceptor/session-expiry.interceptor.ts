import { UserService } from './../services';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, skipWhile } from 'rxjs/operators';
import { UtilService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class SessionExpiryInterceptor implements HttpInterceptor {
  static singletonInstance: SessionExpiryInterceptor;
  sessionExpired = false;
  constructor(public userService: UserService, private utilService: UtilService) {
    if (!SessionExpiryInterceptor.singletonInstance) {
      SessionExpiryInterceptor.singletonInstance = this;
    }
    return SessionExpiryInterceptor.singletonInstance; // creating singleton instance
  }
  handleSessionExpiry(event) {
    if ([401, '401'].includes(event.status) && this.userService.loggedIn
      && (event.error.responseCode === 'SESSION_EXPIRED' || event.error.responseCode === 'UNAUTHORIZED_ACCESS'
      || (event.error.params && event.error.params.err === 'UNAUTHORIZED_USER'))) {

      if (!this.utilService.isDesktopApp) {
        this.sessionExpired = true;
      }

      this.userService.endSession().subscribe((response) => {
        if (this.utilService.isDesktopApp) {
          this.utilService.showSessionExpiredMessage();
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      });
      return of(undefined); // to help stop event propagation
    } else {
      return throwError(event);
    }
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      return event; // success case
    }),
      catchError((error: HttpEvent<any>) => {
        return this.handleSessionExpiry(error); // error case
      }),
      skipWhile(data => data === undefined || data === null)); // stop api call and show login popup
  }
}

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor { // TODO: request interceptor to append header(channel, appId...)
  addMandatoryHeaders(request) {
    const customReq = request.clone({
      // headers: request.headers.set('x-channel-id', 'sunbird')
    });
    return customReq;
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addMandatoryHeaders(request));
  }
}
