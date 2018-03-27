import { Injectable } from '@angular/core';
import { ConfigService, RequestParam, ServerResponse, HttpOptions } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OrgManagementService {
  /**
 * reference of config service.
 */
  public configService: ConfigService;
  /**
* reference of learner service.
*/
  public learnerService: LearnerService;
  /**
* for making upload api calls
* @param {RequestParam} requestParam interface
*/
  constructor(configService: ConfigService, learnerService: LearnerService) {
    this.learnerService = learnerService;
    this.configService = configService;
  }
  public bulkOrgUpload(req): Observable<ServerResponse> {
    const httpOptions: RequestParam = {
      url: this.configService.urlConFig.URLS.ADMIN.BULK.ORGANIZATIONS_UPLOAD,
      data: req
    };
    return this.learnerService.post(httpOptions);
  }
  public bulkUserUpload(req): Observable<ServerResponse> {
    const httpOptions: RequestParam = {
      url: this.configService.urlConFig.URLS.ADMIN.BULK.USERS_UPLOAD,
      data: req
    };
    return this.learnerService.post(httpOptions);
  }
  bulkUploadStatus(processId) {
    const options = {
      url: this.configService.urlConFig.URLS.ADMIN.BULK.STATUS + '/' + processId
    };
    return this.learnerService.get(options);
  }
}
