import { Injectable } from '@angular/core';
import { ISharelink } from './../../interfaces';

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
  constructor() {
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
    if (contentShare.contentType === 'Course') {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('course', contentShare.identifier);
    } else if (contentShare.mimeType === 'application/vnd.ekstep.content-collection') {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('collection', contentShare.identifier);
    } else {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('content', contentShare.identifier);
    }
  }
  /**
  * getPublicShareUrl
  * {string}  identifier - content or course identifier
  * {string}  type - content or course type
  * returns {string} url to share
  */
  getPublicShareUrl(identifier, type) {
    return this.baseUrl + '/play' +  type + '/' + identifier;
  }
}
