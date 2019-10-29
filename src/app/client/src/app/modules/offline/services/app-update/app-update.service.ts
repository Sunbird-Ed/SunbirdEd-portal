import { ConfigService } from '@sunbird/shared';
import { map, catchError } from 'rxjs/operators';
import { PublicDataService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(public publicDataService: PublicDataService, public configService: ConfigService) { }

  isAppUpdated () {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.APP_UPDATE
    };
    return this.publicDataService.get(requestParams).pipe(map((response) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
}
