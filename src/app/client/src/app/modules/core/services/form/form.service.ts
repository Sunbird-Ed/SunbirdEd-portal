
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs';
import { PublicDataService } from './../public-data/public-data.service';
@Injectable()
export class FormService {
  /**
   * Reference of user service.
   */
  public userService: UserService;
  /**
   * Reference of config service
   */
  public configService: ConfigService;

  /**
   * Reference of public data service
   */
  public publicDataService: PublicDataService;

  /**
   * Default method of OrganisationService class
   *
   * @param {PublicDataService} publicDataService content service reference
   */
  constructor(userService: UserService, configService: ConfigService, publicDataService: PublicDataService) {
    this.userService = userService;
    this.configService  = configService ;
    this.publicDataService = publicDataService;
  }

  /**
    * @param {formType} content form type
    * @param {formAction} content form action type
    * @param {selectedContent} content selected content type
    */
  getFormConfig(formInputParams, hashTagId?: string): Observable<ServerResponse> {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.dataDrivenForms.READ,
      data: {
        request: {
          type: formInputParams.formType,
          action: formInputParams.formAction,
          subType: this.configService.appConfig.formApiTypes[formInputParams.contentType],
          rootOrgId: hashTagId ? hashTagId : this.userService.hashTagId,
          framework: formInputParams.framework
        }
      }
    };
    return this.publicDataService.post(channelOptions).pipe(map(
      (formConfig: ServerResponse) => {
        return formConfig.result.form.data.fields;
      }));
  }
}
