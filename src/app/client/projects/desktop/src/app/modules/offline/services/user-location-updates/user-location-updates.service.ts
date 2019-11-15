import { map, catchError } from 'rxjs/operators';
import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLocationUpdatesService {

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
}
