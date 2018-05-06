import { ContentService } from './../content/content.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { ConfigService, IUserData, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
interface ContentDetails {
  contentId: string;
  contentData: any;
  courseId?: string;
  batchHashTagId?: string;
}
@Injectable()
export class PlayerService {

  constructor(public userService: UserService, public resourceService: ResourceService,
    public contentService: ContentService, public configService: ConfigService) {

  }

  getPlayerConfig(contentId: string): Observable<any> {
    return this.getContent(contentId)
      .flatMap((contentDetails) => {
        return Observable.of(this.getConfig({
          contentId: contentDetails.result.content.identifier,
          contentData: contentDetails.result.content
        }));
      }).catch((error) => {
        return error;
      });
  }

  getContent(contentId): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      param: { fields: this.configService.urlConFig.params.contentGet }
    };
    return this.contentService.get(req);
  }

  private getConfig(contentDetails: ContentDetails) {
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
