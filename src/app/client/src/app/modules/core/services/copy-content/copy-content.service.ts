import { ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CollectionHierarchyAPI } from '../../interfaces';
import * as _ from 'lodash';
import { Router } from '@angular/router';

/**
 * Service to provides CRUD methods to make content api request by extending DataService.
 *
 */
@Injectable()
export class CopyContentService extends DataService {
  /**
   * base Url for content api
   */
  baseUrl: string;
  /**
   * To navigate to other pages
   */
  router: Router;
  copyData: any;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of config service.
   */
  public toasterService: ToasterService;
  /**
   * reference of lerner service.
   */
  public http: HttpClient;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient, toasterService: ToasterService, router: Router) {
    super(http);
    this.config = config;
    this.router = router;
    this.toasterService = toasterService;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
  }

  copyContent(contentData, userData) {
    const param = this.formatData(contentData, userData);
    console.log('this.contentData', contentData);
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.COPY + '/' + contentData.identifier,
      data: param
    };
    return this.post(option).map((response: ServerResponse) => {
      _.forEach(response.result.node_id, (value) => {
        this.redirectToEditor(contentData.mimeType, value);
      });
      return response;
    });
  }

  formatData(contentData, userData) {
    contentData.userId = userData.userId;
    contentData.userName = userData.firstName + ' ' + userData.lastName;
    contentData.organisationIds = userData.organisationIds;
    if (contentData.description === undefined) {
      contentData.description = '';
    }
    const req = {
      request: {
        content: {
          name: 'Copy of ' + contentData.name,
          description: contentData.description,
          code: contentData.code + '.copy',
          creator: contentData.userName,
          createdFor: contentData.organisationIds,
          createdBy: contentData.userId,
          organization: ['Sunbird']
        }
      }
    };
    return req;
  }

  redirectToEditor(mimeType: string, copiedIdentifier: string) {
    console.log('mimeType', mimeType);
    console.log('copiedIdentifier', copiedIdentifier);
    this.router.navigate(['/resources/play/content', copiedIdentifier]);

  }



}

