import { ContentService } from './../content/content.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { ConfigService, IUserData, ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
import { ContentDetails , PlayerConfig, ContentData } from './../../interfaces';
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
    public configService: ConfigService ) {
  }
  /**
   * Return content details
   * @param {string} contentId
   * @returns {Observable<ServerResponse>}
   */
  getContent(contentId: string): Observable<ServerResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      param: { fields: this.configService.urlConFig.params.contentGet }
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
  getContentPlayerConfig (contentDetails: ContentDetails): PlayerConfig {
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
    configuration.data = contentDetails.contentData.mimeType !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecml ?
    {} : contentDetails.contentData.body;
    return configuration;
  }
}
