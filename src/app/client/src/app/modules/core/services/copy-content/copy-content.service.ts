import { map } from 'rxjs/operators';
import { ConfigService, ServerResponse, ContentData } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ContentService } from './../content/content.service';
import { FrameworkService } from './../framework/framework.service';

/**
 * Service to copy content
 */
@Injectable({
  providedIn: 'root'
})
export class CopyContentService {
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
  public contentService: ContentService;

  public frameworkService: FrameworkService;

  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {Router} router Router reference
   * @param {UserService} userService UserService reference
   * @param {ContentService} contentService ContentService reference
   */
  constructor(config: ConfigService, router: Router, userService: UserService, contentService: ContentService,
    frameworkService: FrameworkService ) {
    this.config = config;
    this.router = router;
    this.userService = userService;
    this.contentService = contentService;
    this.frameworkService = frameworkService;
    this.frameworkService.initialize();
  }

  /**
   * This method calls the copy API and call the redirecttoeditor method after success
   * @param {contentData} ContentData Content data which will be copied
   */
  copyContent(contentData: ContentData) {
    const param = this.formatData(contentData);
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.COPY + '/' + contentData.identifier,
      data: param
    };
    return this.contentService.post(option).pipe(map((response: ServerResponse) => {
      _.forEach(response.result.node_id, (value) => {
        this.redirectToEditor(param.request.content, value);
      });
      return response;
    }));
  }

  /**
   * This method prepares the request body for the copy API
   * @param {contentData} ContentData Content data which will be copied
   */
  formatData(contentData: ContentData) {
    const userData = this.userService.userProfile;
    if (contentData.description === undefined) {
      contentData.description = '';
    }
    let creator = userData.firstName;
    if (!_.isEmpty(userData.lastName)) {
      creator = userData.firstName + ' ' + userData.lastName;
    }
    const req = {
      request: {
        content: {
          name: 'Copy of ' + contentData.name,
          description: contentData.description,
          code: contentData.code + '.copy',
          creator: creator,
          createdFor: userData.organisationIds,
          createdBy: userData.userId,
          organisation: userData.organisationNames,
          framework: '',
          mimeType: contentData.mimeType,
          contentType: contentData.contentType
        }
      }
    };
    if (_.lowerCase(contentData.contentType) === 'course') {
      req.request.content.framework = contentData.framework;
    } else {
      this.frameworkService.frameworkData$.subscribe((frameworkData: any) => {
        if (!frameworkData.err) {
          req.request.content.framework = frameworkData.frameworkdata['defaultFramework'].code;
        }
      });
    }
    return req;
  }

  /**
   * This method redirect to the editor page depending on mimetype
   * @param {contentData} ContentData Content data which will be copied
   * @param {copiedIdentifier} string New identifier of the copy content
   */
  redirectToEditor(contentData, copiedIdentifier: string) {
    let url = '';
    if (contentData.mimeType === 'application/vnd.ekstep.content-collection') {
      url = `/workspace/content/edit/collection/${copiedIdentifier}/${contentData.contentType}/draft/${contentData.framework}/Draft`;
    } else if (contentData.mimeType === 'application/vnd.ekstep.ecml-archive') {
      url = `/workspace/content/edit/content/${copiedIdentifier}/draft/${contentData.framework}/Draft`;
    } else {
      url = `/workspace/content/edit/generic/${copiedIdentifier}/uploaded/${contentData.framework}/Draft`;
    }
    this.router.navigate([url]);
  }
}
