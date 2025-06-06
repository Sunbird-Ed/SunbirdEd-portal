import { EventEmitter, Injectable } from '@angular/core';
import { ISharelink } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { environment } from '@sunbird/environment';
import * as _ from 'lodash-es';
import { CsMimeType } from '@project-sunbird/client-services/services/content/interface';

@Injectable()
export class ContentUtilsServiceService {
  /**
  *baseUrl;
  */
  public baseUrl: string;

  public contentShareEvent: EventEmitter<any> =  new EventEmitter<any>();

  private PLAYBACK_MIME_TYPES = [CsMimeType.YOUTUBE, CsMimeType.VIDEO, CsMimeType.WEBM, CsMimeType.PDF, CsMimeType.EPUB];
  private OTHER_MIME_TYPES = [CsMimeType.H5P, CsMimeType.HTML];
  /**
  *input for Sharelink;
  */
  contentShare: ISharelink;
  constructor(public configService: ConfigService) {
    const isDesktopApp = environment.isDesktopApp;
    this.baseUrl = document.location.origin + '/';
    if (isDesktopApp) {
      const origin = (<HTMLInputElement>document.getElementById('baseUrl'))
        ? (<HTMLInputElement>document.getElementById('baseUrl')).value : document.location.origin;
      this.baseUrl = origin + '/';
    }
  }
  /**
   * getBase64Url
   * generate the base url to play unlisted content for public users.
   * {object} identifier-content or course identifier
   * returns {string} type - content or course type.
   */
  getBase64Url(type, identifier) {
    return btoa(type + '/' + identifier);
  }
  /**
  * getUnlistedShareUrl
  * generate the url to play unlisted content for other users.
  * {object}  cData - content data
  * returns {string} url to share.
  */
  getUnlistedShareUrl(contentShare) {
    if (contentShare.mimeType === 'application/vnd.ekstep.content-collection') {
      if (contentShare.contentType === 'Course') {
        return `${this.baseUrl}learn/course/${contentShare.identifier}/Unlisted`;
      } else {
        return `${this.baseUrl}resources/play/collection/${contentShare.identifier}/Unlisted`;
      }
    } else {
      return `${this.baseUrl}resources/play/content/${contentShare.identifier}/Unlisted`;
    }
  }
  /**
  * getPublicShareUrl
  * {string}  identifier - content or course identifier
  * {string}  type - content or course type
  * {string}  collectionId - collection Id
  * returns {string} url to share
  */
  getPublicShareUrl(identifier, type, collectionId?) {
    let playertype: string;
    if (collectionId && type !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset ) {
      return `${this.baseUrl}play/collection/${collectionId}?contentId=${identifier}`;
    }
    if (type === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
      playertype = 'collection';
    } else if (type === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset) {
      playertype = 'questionset';
    } else {
      playertype = 'content';
    }
    return this.baseUrl + 'play' + '/' + playertype + '/' + identifier;
  }

  getCoursePublicShareUrl (courseid) {
    return `${this.baseUrl}explore-course/course/${courseid}`;
  }

  getCourseModulePublicShareUrl (courseId: string, moduleId: string) {
    return `${this.baseUrl}explore-course/course/${courseId}?moduleId=${moduleId}`;
  }
  /**
  * {content} is node which comes from collection tree for each content and returns rollup object upto 4 elements
  *  this function is called from public and private modules of collection and course players
  */
  getContentRollup (content) {
    const objectRollUp = {};
    let nodes = content.getPath();
    nodes = _.slice(nodes, 0, 4).slice(0, -1);
    nodes.forEach((eachnode, index) => objectRollUp['l' + (index + 1)] = eachnode.model.identifier);
    return objectRollUp;
  }

  getContentProgress(summary: any[], mimeType: CsMimeType): number {
      const summaryMap = summary.reduce((acc, s) => {
          Object.keys(s).forEach((k) => {
              acc[k] = s[k];
          });
          return acc;
      }, {});

      if (!summaryMap.progress) {
          return 0;
      }

      if (this.PLAYBACK_MIME_TYPES.indexOf(mimeType) > -1) {
          return this.calculatePlaybackProgress(
              summaryMap['progress'] || 0,
              summaryMap['visitedlength'] || 0,
              summaryMap['totallength'] || 0,
              summaryMap['endpageseen'] || false,
              summaryMap['visitedcontentend'] || false,
          );
      } else if (
          this.OTHER_MIME_TYPES.indexOf(mimeType) > -1
      ) {
          return this.absoluteProgress(summaryMap.progress, 0);
      } else {
          return this.absoluteProgress(summaryMap.progress, 100);
      }
  }

  calculatePlaybackProgress(
      progress: number,
      visitedLength: number,
      totalLength: number,
      endPageSeen: boolean,
      visitedContentEnd: boolean,
  ) {
      let customProgress;
      if (endPageSeen || visitedContentEnd || (totalLength && (visitedLength * 100) / totalLength) > 95) {
          customProgress = 100;
      } else {
          customProgress = progress;
      }
      return customProgress;
  }

  absoluteProgress(progress: number, threshold: number): number {
      if (progress >= threshold) {
          return 100;
      }

      return 0;
  }
}
