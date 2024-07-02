
import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import { ConfigService } from '../../../shared/services/config/config.service';
import { BrowserCacheTtlService } from '../../../shared/services/browser-cache-ttl/browser-cache-ttl.service';
import {  ServerResponse } from '../../../shared/interfaces/serverResponse';
import { Observable, of } from 'rxjs';
import { PublicDataService } from './../public-data/public-data.service';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import * as _ from 'lodash-es';
import { OrgDetailsService } from '../org-details/org-details.service';
@Injectable({
  providedIn: 'root'
})
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
  constructor(userService: UserService, configService: ConfigService, publicDataService: PublicDataService,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService, private orgDetailsService: OrgDetailsService) {
    this.userService = userService;
    this.configService = configService;
    this.publicDataService = publicDataService;
  }

  /**
    * @param {formType} content form type
    * @param {formAction} content form action type
    * @param {selectedContent} content selected content type
    */
  getFormConfig(formInputParams, hashTagId?: string, responseKey = 'data.fields'): Observable<any> {
    return this.getHashTagID().pipe(
      mergeMap(rootOrgId => {
        const channelOptions: any = {
          url: this.configService.urlConFig.URLS.dataDrivenForms.READ,
          data: {
            request: {
              type: formInputParams.formType,
              action: formInputParams.formAction,
              subType: this.configService.appConfig.formApiTypes[formInputParams.contentType]
              ? this.configService.appConfig.formApiTypes[formInputParams.contentType]
              : formInputParams.contentType,
              rootOrgId: hashTagId || rootOrgId || '*',
              component: _.get(formInputParams, 'component'),
              framework: formInputParams.framework || localStorage.getItem('selectedFramework') || '*'
            }
          }
        };
        const formKey = `${channelOptions.data.request.type}${channelOptions.data.request.action}
        ${channelOptions.data.request.subType}${channelOptions.data.request.rootOrgId}${formInputParams.framework}`;
         const key = btoa(formKey);
        if (this.cacheService.get(key)) {
          const data = this.cacheService.get(key);
          return of(data);
        } else {
          if (formInputParams.framework) {
            channelOptions.data.request.framework = formInputParams.framework;
          }
          return this.publicDataService.post(channelOptions).pipe(map(
            (formConfig: ServerResponse) => {
              const result = _.get(formConfig.result.form, responseKey)
              this.setForm(formKey, result);
              return result;
            }));
        }
      })
    )
  }
  getHashTagID() {
    if (this.userService.loggedIn) {
      return of(this.userService.hashTagId || this.cacheService.get('channelId'));
    } else {
      if (this.userService.slug) {
        return this.orgDetailsService.getOrgDetails(this.userService.slug).pipe(
          map((orgDetails : any) => {
            return orgDetails?.hashTagId || '*'
          }))
      } else {
        return this.orgDetailsService.getCustodianOrgDetails().pipe(
          map((orgDetails: any) => {
            return _.get(orgDetails, 'result.response.value') || '*'
          }))
      }
    }
  }
  setForm(formKey, formData) {
     const key = btoa(formKey);
     this.cacheService.set(key, formData,
      {maxAge: this.browserCacheTtlService.browserCacheTtl});
  }
}
