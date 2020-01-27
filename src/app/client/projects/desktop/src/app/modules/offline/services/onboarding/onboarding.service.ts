import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class OnboardingService {
  onboardCompletion = new EventEmitter();
  userData;
  constructor(public configService: ConfigService, public publicDataService: PublicDataService) { }

  searchLocation(filters): Observable<ServerResponse> {
    const options = {
      url: this.configService.urlConFig.URLS.USER.LOCATION_SEARCH,
      data: {
        request: {
          filters
        }
      }
    };
    return this.publicDataService.post(options);
  }

  getUser() {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.READ_USER
    };

    return this.publicDataService.get(options).pipe(map((response: ServerResponse) => {
        this.userData = response.result;
        return this.userData;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  saveLocation(request): Observable<ServerResponse> {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.LOCATION_SAVE,
      data: request
    };
    return this.publicDataService.post(options);
  }

  saveUserPreference(request) {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.CREATE_USER,
      data: request
    };
    return this.publicDataService.post(options);
  }
  getLocation() {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.LOCATION_READ
    };
    return this.publicDataService.get(options).pipe(map((response: ServerResponse) => {
        return response;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
