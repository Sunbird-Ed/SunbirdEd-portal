import { Injectable } from '@angular/core';
import { ContentService } from './../content/content.service';
import { UserService } from './../user/user.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { CacheService } from 'ng2-cache-service';
@Injectable()
export class FormService {
  /**
   * Reference of content service.
   */
  public content: ContentService;
  /**
   * Reference of user service.
   */
  public user: UserService;
  /**
   * Reference of config service
   */
  public config: ConfigService;
  /**
 * form config data
 */
  public formconfig;

  private newSelectedContent;

  public _cacheService: CacheService;

  /**
   * Default method of OrganisationService class
   *
   * @param {ContentService} content content service reference
   */
  constructor(content: ContentService, user: UserService, config: ConfigService, _cacheService: CacheService) {
    this.content = content;
    this.user = user;
    this.config = config;
    this._cacheService = _cacheService;
  }
  /**
    * @param {formType} content form type
    * @param {formAction} content form action type
    * @param {selectedContent} content selected content type
    */
  getFormConfig(formType, formAction, selectedContent, framework): Observable<ServerResponse> {
    this.newSelectedContent = this.config.appConfig.formApiTypes[selectedContent];
    const channelOptions = {
      url: this.config.urlConFig.URLS.dataDrivenForms.READ,
      data: {
        request: {
          type: formType,
          action: formAction,
          subType: this.newSelectedContent,
          rootOrgId: this.user._hashTagId,
          framework: framework
        }
      }
    };
    return this.content.post(channelOptions).map(
      (formConfig: ServerResponse) => {
        console.log('selectedContent + formAction', selectedContent + formAction);
        this._cacheService.set(selectedContent + formAction, formConfig.result.form.data.fields, { maxAge: 10 * 60 });
        return formConfig.result.form.data.fields;
      },
      (err: ServerResponse) => {
        return err;
      }
    );
  }
}
