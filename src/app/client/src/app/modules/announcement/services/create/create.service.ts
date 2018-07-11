
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, } from '@sunbird/shared';
import { UserService, AnnouncementService } from '@sunbird/core';


import * as _ from 'lodash';

@Injectable()

export class CreateService {
  /**
   * It holds logged-in user root org id
   *
   * It's needed to get announcement types
   */
  public _rootOrgId: string;

  /**
   * Contains announcement types
   */
  public _announcementTypes: object;

  /**
   * To get logged-in user profile data
   */
  public user: UserService;

  /**
   * To get file upload api url
   */
  public config: ConfigService;

  /**
   * Announcement common service to make http call
   */
  public announcementService: AnnouncementService;

  /**
   * Default method of class CreateService
   *
   * @param user
   * @param {UserService} user Reference of user service
   * @param {ConfigService} config Contains config service reference. It's used to get api's url
   */
  constructor(user: UserService, config: ConfigService, announcementService: AnnouncementService) {
    this.user = user;
    this.config = config;
    this.announcementService = announcementService;
  }

  /**
   * Get announcement types by making http call.
   *
   * Announcement type is required field to create new announcement
   */
  getAnnouncementTypes(): Observable<ServerResponse> {
    this._rootOrgId = this.user.rootOrgId;
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.DEFINITIONS,
      data: {
        'request': {
          'rootOrgId': this._rootOrgId,
          'definitions': ['announcementTypes']
        }
      }
    };

    return this.announcementService.post(option).pipe(
      map((data: ServerResponse) => {
        if (data.result.announcementTypes) {
          this._announcementTypes = data.result.announcementTypes;
        }
        return data;
      }),
      catchError((err) => {
        return observableThrowError(err);
      }), );
  }

  /**
   * To save announcement data by making http call
   *
   * @param {object}  formData announcement form data
   * @param {boolean} resend   to make announcement resend api call
   */
  saveAnnouncement(formData, resend: boolean): Observable<ServerResponse> {
    this._rootOrgId = this.user.rootOrgId;
    const option = {
      url: resend ? this.config.urlConFig.URLS.ANNOUNCEMENT.RESEND : this.config.urlConFig.URLS.ANNOUNCEMENT.CREATE,
      data: {
        request: {
          title: formData.title,
          from: formData.from,
          type: formData.type,
          description: formData.description,
          links: formData.links,
          sourceId: this._rootOrgId,
          attachments: formData.attachments,
          target: {
            geo: {
              ids: _.map(formData.target, 'id')
            }
          }
        }
      }
    };

    return this.announcementService.post(option);
  }

  /**
   * Get resend announcement data
   *
   * @param {string} id announcement identifier
   */
  resendAnnouncement(id: string): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.RESEND + '/' + id
    };
    return this.announcementService.get(option);
  }
}
