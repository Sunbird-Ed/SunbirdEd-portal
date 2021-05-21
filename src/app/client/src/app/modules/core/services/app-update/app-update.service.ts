import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from '@sunbird/shared';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../../../shared/services/config/config.service';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService extends DataService {

  baseUrl: string;
  constructor(public configService: ConfigService, public http: HttpClient) {
    super(http);
    this.baseUrl = this.configService.urlConFig.URLS.PUBLIC_PREFIX;
  }

  checkForAppUpdate (): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.APP_UPDATE
    };
    return this.get(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }

  getAppInfo (): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.APP_INFO
    };
    return this.get(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
}
