import { UserService } from './../services';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, skipWhile } from 'rxjs/operators';
import { TraceService } from '@sunbird/shared';
import * as _ from 'lodash-es';



@Injectable({
  providedIn: 'root'
})
export class SessionExpiryInterceptor implements HttpInterceptor {
  static singletonInstance: SessionExpiryInterceptor;
  sessionExpired = false;
  constructor(public userService: UserService, public traceService: TraceService) {
    if (!SessionExpiryInterceptor.singletonInstance) {
      SessionExpiryInterceptor.singletonInstance = this;
    }
    return SessionExpiryInterceptor.singletonInstance; // creating singleton instance
  }
  handleSessionExpiry(event) {
    if ([401, '401'].includes(event.status) && this.userService.loggedIn
      && (event.error.responseCode === 'SESSION_EXPIRED' || event.error.responseCode === 'UNAUTHORIZED_ACCESS')) {
      this.sessionExpired = true;
      return of(undefined); // to help stop event propagation
    } else {
      return throwError(event);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.injectContext(request);
    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      this.traceService.endSpan();
      return event; // success case
    }),
      catchError((error: HttpEvent<any>) => {
        return this.handleSessionExpiry(error); // error case
      }),
      skipWhile(data => data === undefined || data === null)); // stop api call and show login popup
  }

  injectContext(req: HttpRequest<any> ): HttpRequest<any> {

    this.traceService.startSpan(req.url);
    const currentSpan: any = this.traceService.currentSpan;
    const currentParentSpan: any = this.traceService.currentParentSpan;

    const cloneReq = req.clone({
      headers: req.headers
      .set('X-traceId', currentParentSpan._uuid)
      .set('X-traceName', currentParentSpan._operationName)
      .set('X-spanId', currentSpan._uuid)
      .set('X-spanName', currentSpan._operationName)
    });
    return cloneReq;
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
