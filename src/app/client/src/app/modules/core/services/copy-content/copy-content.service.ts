import { map, mergeMap, switchMap } from 'rxjs/operators';
import { ConfigService, ServerResponse, ContentData } from '@sunbird/shared';
import { Inject, Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ContentService } from './../content/content.service';
import { FrameworkService } from './../framework/framework.service';
import { of } from 'rxjs';
import {DOCUMENT} from '@angular/common';

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

  hostUrl: string;

  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {Router} router Router reference
   * @param {UserService} userService UserService reference
   * @param {ContentService} contentService ContentService reference
   */
  constructor(config: ConfigService, router: Router, userService: UserService, contentService: ContentService,
    frameworkService: FrameworkService,@Inject(DOCUMENT) private document: Document) {
    this.config = config;
    this.router = router;
    this.userService = userService;
    this.contentService = contentService;
    this.frameworkService = frameworkService;
    this.hostUrl = document.location.origin;
  }
  /**
   * This method calls the copy API and call the redirecttoeditor method after success
   * @param {contentData} ContentData Content data which will be copied & question set.
   */
  copyContent(contentData: ContentData) {
    let urlPath = _.get(contentData,'mimeType') === 'application/vnd.sunbird.questionset' ? this.config.urlConFig.URLS.QUESTIONSET.COPY : this.config.urlConFig.URLS.CONTENT.COPY;
      return this.userService.userOrgDetails$.pipe(mergeMap(data => { // fetch user org details before copying content
        this.frameworkService.initialize();
        return this.formatData(contentData).pipe(
          switchMap((param: any) => {
            const option = {
              url: urlPath + '/' + contentData.identifier,
              data: param
            };
            let reqParms =  _.get(contentData,'mimeType') === 'application/vnd.sunbird.questionset' ? param.request.questionset : param.request.content;
            return this.contentService.post(option).pipe(map((response: ServerResponse) => {
              _.forEach(response.result.node_id, (value) => {
                this.redirectToEditor(reqParms, value);
              });
              return response;
            }));
          })
        );
      }));
  }
  /**
   * @since - 1.#SH-66 || 2.#SH-362
   * @param  {ContentData} contentData
   * @description - API to copy a textbook as a course.
   */
  copyAsCourse(collectionData: ContentData) {
    const userData = this.userService.userProfile;
    const selectedData = collectionData['children'].filter((item) => {
      return item['selected'] === true;
    });
    const requestData = {
      request: {
        course: {
          name: 'Copy of ' + collectionData.name,
          description: collectionData.description,
          organisation: _.uniq(this.userService.orgNames),
          createdFor: userData.organisationIds,
          createdBy: userData.userId,
          framework: collectionData.framework,
          code: collectionData.identifier,
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course'
        },
        hierarchy: selectedData
      }
    };

    const option = {
      data: requestData,
      url: this.config.urlConFig.URLS.CONTENT.COPY_AS_COURSE
    };

    return this.contentService.post(option).pipe(map((response: ServerResponse) => {
      const courseIdentifier = _.get(response, 'result.identifier');
      this.openCollectionEditor(collectionData.framework, courseIdentifier);
      return response;
    }));
  }
  /**
   * This method prepares the request body for the copy API
   * @param {contentData} ContentData Content data which will be copied
   * @description  request will be formed based on the mimetype
   */
  formatData(contentData: ContentData) {
    const defaultReqKey = "content";
    const userData = this.userService.userProfile;
    if (contentData.description === undefined) {
      contentData.description = '';
    }
    let creator = userData.firstName;
    if (!_.isEmpty(userData.lastName)) {
      creator = userData.firstName + ' ' + userData.lastName;
    }
    let commonReq = {
      request: {
        content: {
          name: 'Copy of ' + contentData.name,
          createdFor: userData.organisationIds,
          createdBy: userData.userId,
          mimeType: contentData.mimeType,
        }
      }
    }
    if (_.get(contentData, 'mimeType') === 'application/vnd.sunbird.questionset') {
      return this.dynamicReqKeyHandler(commonReq, defaultReqKey, 'questionset');
    }
    else {
      let reqContentData = {
        description: contentData.description,
        code: contentData.code + '.copy',
        creator: creator,
        organisation: _.uniq(this.userService.orgNames),
        framework: '',
        contentType: contentData.contentType
      }
      let mergedContentReq = Object.assign({},commonReq);
      mergedContentReq.request.content = {...commonReq.request.content, ...reqContentData};
      if (_.lowerCase(contentData.contentType) === 'course') {
         //@ts-ignore
        mergedContentReq.request.content.framework = contentData.framework;
        return of(mergedContentReq);
      } else {
        return this.frameworkService.frameworkData$.pipe(
          switchMap((frameworkData: any) => {
            if (!frameworkData.err) {
              //@ts-ignore
              mergedContentReq.request.content.framework = _.get(frameworkData, 'frameworkdata.defaultFramework.code');
            }
            return of(mergedContentReq);
          })
        );
      }
    }
  }
  /**
  * This method will construct and return the request body based on user define key ex: questionset,content etc
  * @param {reqParms} ContentData request data 
  * @param {oldkey} string default key ex: content
  * @param {newkey} string new key to change the request metadata key
  */
  dynamicReqKeyHandler(reqParms, oldKey, newKey) {
    Object.defineProperty(
      reqParms.request,
      newKey,
      Object.getOwnPropertyDescriptor(reqParms.request, oldKey)
    );
    delete reqParms.request[oldKey];
    return of(reqParms)
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
      if ((_.toLower(contentData.contentType) !== 'lessonplan')) {
        url = `workspace/edit/${contentData.contentType}/${copiedIdentifier}/draft/Draft`;
      }
    } else if (contentData.mimeType === 'application/vnd.ekstep.ecml-archive') {
      url = `/workspace/content/edit/content/${copiedIdentifier}/draft/${contentData.framework}/Draft`;
    } else if (_.get(contentData,'mimeType') === 'application/vnd.sunbird.questionset') {
      url = `/workspace/edit/QuestionSet/${copiedIdentifier}/allcontent/Draft`;
      setTimeout(() => {
        window.open(this.hostUrl + url, "_self");
      }, 1000);
      return;
    }
    else {
      url = `/workspace/content/edit/generic/${copiedIdentifier}/uploaded/${contentData.framework}/Draft`;
    }
    this.router.navigate([url]);
  }

  /**
   * @since - #SH-66
   * @param  {string} framework
   * @param  {string} copiedIdentifier
   * @description - It will launch the collection editor
   */
  openCollectionEditor(framework: string, copiedIdentifier: string) {
    const url = `/workspace/content/edit/collection/${copiedIdentifier}/Course/draft/${framework}/Draft`;
    this.router.navigate([url]);
  }
}
