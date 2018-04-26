import { Injectable } from '@angular/core';
import { ContentService } from './../content/content.service';
import { UserService } from './../user/user.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class FormService {
  /**
   * Reference of content service.
   */
  public content: ContentService;
  /**
   * Reference of user service.
   */
  public userService: UserService;
  /**
   * Reference of config service
   */
  public configService: ConfigService;

  /**
   * Default method of OrganisationService class
   *
   * @param {ContentService} content content service reference
   */
  constructor(content: ContentService, userService: UserService, configService: ConfigService) {
    this.content = content;
    this.userService = userService;
    this.configService  = configService ;
  }

  /**
    * @param {formType} content form type
    * @param {formAction} content form action type
    * @param {selectedContent} content selected content type
    */
  getFormConfig(formInputParams): Observable<ServerResponse> {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.dataDrivenForms.READ,
      data: {
        request: {
          type: formInputParams.formType,
          action: formInputParams.formAction,
          subType: this.configService.appConfig.formApiTypes[formInputParams.contentType],
          rootOrgId: this.userService.hashTagId,
          framework: formInputParams.framework
        }
      }
    };
    return this.content.post(channelOptions).map(
      (formConfig: ServerResponse) => {
        return formConfig.result.form.data.fields;
      });
  }
}
