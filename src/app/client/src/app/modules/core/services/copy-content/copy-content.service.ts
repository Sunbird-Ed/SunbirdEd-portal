import { ConfigService, ServerResponse, ContentData, IUserProfile } from '@sunbird/shared';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CollectionHierarchyAPI } from '../../interfaces';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

/**
 * Service to copy content
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
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of user service.
   */
  public userService: UserService;
  /**
   * reference of lerner service.
   */
  public http: HttpClient;

  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   * @param {Router} router Router reference
   * @param {UserService} userService UserService reference
   */
  constructor(config: ConfigService, http: HttpClient, router: Router, userService: UserService) {
    super(http);
    this.config = config;
    this.router = router;
    this.userService = userService;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
  }

  /**
   * This method calls the copy API and call the redirecttoeditor method after success
   * @param {contentData} ContentData Conetnt data which will be copied
   * @param {userData} IUserProfile User data of the logged  in user
   */
  copyContent(contentData: ContentData) {
    const param = this.formatData(contentData);
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.COPY + '/' + contentData.identifier,
      data: param
    };
    return this.post(option).map((response: ServerResponse) => {
      _.forEach(response.result.node_id, (value) => {
        this.redirectToEditor(contentData, value);
      });
      return response;
    });
  }

  /**
   * This method prepares the request body for the copy API
   * @param {contentData} ContentData Conetnt data which will be copied
   * @param {userData} IUserProfile User data of the logged  in user
   */
  formatData(contentData: ContentData) {
    const userData = this.userService.userProfile;
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

  /**
   * This method redirect to the editor page depending on mimetype
   * @param {contentData} ContentData Conetnt data which will be copied
   * @param {copiedIdentifier} string New identifier of the copy content
   */
  redirectToEditor(contentData: ContentData, copiedIdentifier: string) {
    let url = '';
    if (contentData.mimeType === 'application/vnd.ekstep.content-collection') {
      url = `/workspace/content/edit/collection/${copiedIdentifier}/${contentData.contentType}/draft/${contentData.framework}`;
    } else if (contentData.mimeType === 'application/vnd.ekstep.ecml-archive') {
      url = `/workspace/content/edit/content/${copiedIdentifier}/draft/${contentData.framework}`;
    } else {
      url = `/workspace/content/edit/generic/${copiedIdentifier}/uploaded/${contentData.framework}`;
    }
    this.router.navigate([url]);
  }
}
