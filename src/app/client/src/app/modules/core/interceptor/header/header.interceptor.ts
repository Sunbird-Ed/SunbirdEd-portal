import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(
      filter(event => event instanceof HttpResponse),
      tap((event: HttpResponse<any>) => {
        if (event.ok && event.status === 200) {
          const traceId = localStorage.getItem('traceId');
          const responseTraceId = event.headers.get('X-Trace-Enabled');

          if (responseTraceId && traceId !== responseTraceId) {
            localStorage.setItem('traceId', responseTraceId);
          }
        }
      }));
  }
}
