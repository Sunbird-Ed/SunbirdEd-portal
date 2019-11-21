import { map, catchError } from 'rxjs/operators';
import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';
import * as _ from 'lodash-es';
@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  userData;
  constructor(public configService: ConfigService, public publicDataService: PublicDataService) { }

  getUserLocation(request): Observable<ServerResponse> {
    const options = {
      url: this.configService.urlConFig.URLS.USER.LOCATION_SEARCH,
      data: request
    };
    return this.publicDataService.post(options).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
  getUser() {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.READ_USER
    };
    return this.publicDataService.get(options).pipe(map((response: ServerResponse) => {
      this.userData = _.get(response, 'result');
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
  saveUserLocation(request) {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.LOCATION_SAVE,
      data: request
    };
    return this.publicDataService.post(options).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
}
