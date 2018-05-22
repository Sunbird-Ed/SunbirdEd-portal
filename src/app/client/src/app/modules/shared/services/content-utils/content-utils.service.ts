import { Injectable } from '@angular/core';
import { ISharelink } from './../../interfaces';
import { ConfigService } from './../config/config.service';

@Injectable()
export class ContentUtilsServiceService {
  /**
  *baseUrl;
  */
  public baseUrl: string;
  /**
  *input for Sharelink;
  */
  contentShare: ISharelink;
  constructor(public configService: ConfigService) {
    this.baseUrl = document.location.origin + '/';
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
  * returns {string} url to share
  */
  getPublicShareUrl(identifier, type) {
    let playertype: string;
    if (type === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
      playertype = 'collection';
    } else {
      playertype = 'content';
    }
    return this.baseUrl + 'play' + '/' + playertype + '/' + identifier;
  }
}
