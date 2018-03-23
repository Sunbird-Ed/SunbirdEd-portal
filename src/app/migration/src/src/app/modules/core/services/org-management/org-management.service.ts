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

  constructor(configService: ConfigService, learnerService: LearnerService) {
    this.learnerService = learnerService;
    this.configService = configService;
  }
  public bulkOrgUpload(req) {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.BULK.ORGANIZATIONS_UPLOAD,
      data: req
    };
    return this.upload(option);
  }
  public bulkUserUpload(req) {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.BULK.USERS_UPLOAD,
      data: req
    };
    return this.upload(option);
  }
  /**
* for making upload api calls
* @param {RequestParam} requestParam interface
*/
  upload(requestParam: RequestParam): Observable<ServerResponse> {
    console.log('inside upload()', requestParam);
    const httpOptions = {
      data: requestParam.data,
      url: requestParam.url
    };
    return this.learnerService.post(httpOptions);
  }
  bulkUploadStatus(processId) {
    console.log('inside bulkUploadStatus() service', processId);
    const options = {
      url: this.configService.urlConFig.URLS.ADMIN.BULK.STATUS + '/' + processId
    }
    console.log('url', options.url);
    return this.learnerService.get(options);
  }
}
