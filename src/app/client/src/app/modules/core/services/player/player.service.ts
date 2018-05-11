import { Router } from '@angular/router';
import { ContentService } from './../content/content.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { ConfigService, IUserData, ResourceService, ServerResponse,
  ContentDetails , PlayerConfig, ContentData
 } from '@sunbird/shared';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

  /**
   * helper services to fetch content details and preparing content player config
   */
@Injectable()
export class PlayerService {
  /**
   * stores content details
   */
  contentData: ContentData;
  constructor(public userService: UserService, public contentService: ContentService,
    public configService: ConfigService, public router: Router ) {
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<{contentId: string, contentData: ContentData }>}
   */
  getConfigByContent(id: string): Observable<PlayerConfig> {
    return this.getContent(id)
      .flatMap((contentDetails) => {
        return Observable.of(this.getConfig({
          contentId: contentDetails.result.content.identifier,
          contentData: contentDetails.result.content
        }));
      });
  }

  /**
   * Return content details
   * @param {string} contentId
   * @returns {Observable<ServerResponse>}
   */
  getContent(contentId: string, option: any = {params: {}}): Observable<ServerResponse> {
    const param = {fields: this.configService.urlConFig.params.contentGet};
    const paramField = { ...param, ...option.params };
    console.log('>>>>', paramField);
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      param:  paramField
    };
    return this.contentService.get(req).map((response: ServerResponse) => {
      this.contentData = response.result.content;
      return response;
    });
  }
  /**
   * returns player config details.
   * @param {ContentDetails} contentDetails
   * @memberof PlayerService
   */
  getConfig (contentDetails: ContentDetails): PlayerConfig {
    const configuration: any = this.configService.appConfig.PLAYER_CONFIG.playerConfig;
    configuration.context.contentId = contentDetails.contentId;
    configuration.context.sid = this.userService.sessionId;
    configuration.context.uid = this.userService.userid;
    configuration.context.channel = this.userService.channel;
    if (_.isUndefined(contentDetails.courseId)) {
      configuration.context.dims = this.userService.dims;
    } else {
      const cloneDims = _.cloneDeep(this.userService.dims) || [];
      cloneDims.push(contentDetails.courseId);
      if (contentDetails.batchHashTagId) {
        cloneDims.push(contentDetails.batchHashTagId);
      }
      configuration.context.dims = cloneDims;
    }
    configuration.context.tags = _.concat([], this.userService.channel);
    configuration.context.app = [this.userService.channel];
    if (contentDetails.courseId) {
      configuration.context.cdata = [{
        id: contentDetails.courseId,
        type: 'course'
      }];
    }
    configuration.context.pdata.id = this.userService.appId;
    configuration.metadata = contentDetails.contentData;
    configuration.data = contentDetails.contentData.mimeType !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent ?
    {} : contentDetails.contentData.body;
    return configuration;
  }
  playContent(content) {

    if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {

      if (content.contentType !== this.configService.appConfig.PLAYER_CONFIG.contentType.Course) {
        this.router.navigate(['/resources/play/collection', content.identifier]);
      } else {
        console.log('course consumption');
      }

    } else if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent) {

      this.router.navigate(['/resources/play/content', content.identifier]);

    } else if (this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.genericMimeType.includes(content.mimeType)) {

      this.router.navigate(['/resources/play/content', content.identifier]);

    } else {
      // toaster not valid content type
    }
  }
}
