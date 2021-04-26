import { Injectable } from '@angular/core';
import { PublicDataService } from '@sunbird/core';
import { map, catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';

import { ConfigService, ServerResponse } from '@sunbird/shared';


@Injectable({
  providedIn: 'root'
})
export class OfflineReportIssuesService {

  constructor(public publicDataService: PublicDataService, public configService: ConfigService) { }

  reportOtherIssue(apiBody): Observable<ServerResponse> {
    const requestParams = {
      url: this.configService.urlConFig.URLS.OFFLINE.REPORT_OTHER_ISSUE,
      data: apiBody
    };
    return this.publicDataService.post(requestParams).pipe(map((response: ServerResponse) => {
      return response;
    }), catchError(err => {
      return observableThrowError(err);
    }));
  }
}
