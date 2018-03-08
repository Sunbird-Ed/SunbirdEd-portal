import { ConfigService, ServerResponse,  } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService, AnnouncementService } from '@sunbird/core';
import { HttpClient } from '@angular/common/http';

// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

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
   * Contains announcement api's base url
   */
  baseUrl: string;

  /**
   * Default method of class CreateService
   *
   * @param user
   * @param {ConfigService} config Contains config service reference. It's used to get api's url
   */
  constructor(private user: UserService, private config: ConfigService, private http: HttpClient,
    private announcementService: AnnouncementService) {
  }

  /**
   * Get announcement types by making http call.
   *
   * Announcement type is required field to create new announcement
   */
  getAnnouncementTypes() {
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
      const data = [{
        'id': '9b20d566-c5db-11e7-abc4-cec278b6b50a',
        'name': 'Circular'
      }];
      return Observable.throw(data);
    });
  }

  formatFileSize(bytes) {
    // const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 2);
  }
}
