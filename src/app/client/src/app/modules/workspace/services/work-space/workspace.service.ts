import {Inject, Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService } from '@sunbird/core';
import { IDeleteParam } from '../../interfaces/delteparam';
import { DOCUMENT } from '@angular/platform-browser';
@Injectable()
export class WorkSpaceService {
  /**
  * reference of config service.
  */
  public config: ConfigService;
  /**
   * Reference of content service.
  */
  public content: ContentService;
  /**
  *baseUrl;
  */
  public baseUrl: string;
  /**
  * Constructor - default method of AnnouncementService class
  * @param {ConfigService} config ConfigService reference
  * @param {HttpClient} http HttpClient reference
  */
  constructor(config: ConfigService, content: ContentService , @Inject(DOCUMENT) private document: any) {
    this.content = content;
    this.config = config;
    this.baseUrl = document.location.origin + '/';
  }
  deleteContent(requestParam: IDeleteParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.RETIRE,
      data: {
        'request': {
          'contentIds': requestParam.contentIds
        }
      }
    };
    return this.content.delete(option);
  }
  /**
  * getBase64Url
  * generate the base url to play unlisted content for public users.
  * {object}  identifier - content or course identifier
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
  getUnlistedShareUrl(content) {
    if (content.contentType === 'Course') {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('course', content.identifier);
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('collection', content.identifier);
    } else {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('content', content.identifier);
    }
  }
}
