import { ConfigService, ServerResponse, } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService, AnnouncementService } from '@sunbird/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
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
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.DEFINITIONS,
      data: {
        'request': {
          'rootOrgId': this._rootOrgId,
          'definitions': ['announcementTypes']
        }
      }
    };

    return this.announcementService.post(option)
      .map((data: ServerResponse) => {
        if (data.result.announcementTypes) {
          this._announcementTypes = data.result.announcementTypes;
        }
        return data;
      })
      .catch((err: ServerResponse) => {
        // TODO: remove this before pushing
        const data = [{
          'id': '9b20d566-c5db-11e7-abc4-cec278b6b50a',
          'name': 'Circular'
        }];
        return Observable.throw(data);
      });
  }

  /**
   * To save announcement data by making http call
   *
   * @param formData user entered data
   */
  saveAnnouncement(formData): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.CREATE,
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
}
