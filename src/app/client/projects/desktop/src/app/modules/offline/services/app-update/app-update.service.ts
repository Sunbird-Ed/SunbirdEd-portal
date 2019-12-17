import { ConfigService, ServerResponse } from '@sunbird/shared';
import { map, catchError } from 'rxjs/operators';
import { PublicDataService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(public publicDataService: PublicDataService, public configService: ConfigService) { }

  checkForAppUpdate (): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.APP_UPDATE
    };
    return this.publicDataService.get(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }

  getAppInfo (): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.APP_INFO
    };
    return this.publicDataService.get(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
}
