import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ISharelink } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { ResourceService } from './../resource/resource.service';
import { ToasterService } from './../toaster/toaster.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';


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
  /**
  * To navigate to other pages
  */
 route: Router;
   /**
   * BehaviorSubject Containing user profile.
   */
  private _extLinkData$ = new BehaviorSubject(undefined);
  /**
   * Read only observable Containing user profile.
   */
  public readonly extLinkData$: Observable<any> = this._extLinkData$.asObservable();

  newWindow: any;
  constructor(public configService: ConfigService, public resourceService: ResourceService,
    public toasterService: ToasterService, route: Router) {
    this.baseUrl = document.location.origin + '/';
    this.route = route;
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
  /**
   * getRedirectUrl function is to redirect to the external url link in a new tab
   * @param playerconfigMeta Playerconfig data to get artifacturl and contentId of the item in the player
   * @param courseId course id of the enrolled / playing course
   * @param userId  user id of the loggedin user
   */
  getRedirectUrl(playerconfigMeta: any, userId: string, courseId?: string, batchId?: string) {
    if (playerconfigMeta.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
      this.toasterService.warning(this.resourceService.messages.imsg.m0034);
      setTimeout(() => {
        // // this.newWindow = this.getNativeWindow();
        // this.newWindow.open(this.route.navigate(['/learn/redirect']), '_blank');
        // const newWindo = window.open('/learn/redirect', '_blank');

        // const newWindow = window.open('/learn/redirect', '_blank');
        window.redirectUrl = playerconfigMeta.artifactUrl + (courseId !== undefined ? '#&courseId=' + courseId : '') + '#&contentId='
          + playerconfigMeta.identifier + (batchId !== undefined ? '#&batchId=' + batchId : '') + '#&uid=' + userId;

       const extUrlLink = playerconfigMeta.artifactUrl + (courseId !== undefined ? '#&courseId=' + courseId : '') + '#&contentId='
          + playerconfigMeta.identifier + (batchId !== undefined ? '#&batchId=' + batchId : '') + '#&uid=' + userId;
          this._extLinkData$.next(extUrlLink);
      }, 3000);
    }
  }

  getNativeWindow() {
    return window;
}
}


