import { Injectable, EventEmitter } from '@angular/core';
import { ServerResponse, ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

/**
 * Service to get course consumption dashboard
 *
 * It responsible to make http call
 */
@Injectable()

/**
 * @class UserSearchService
 */
export class UserSearchService {

  userDetailsObject: any;

    /**
   * To listen event
   */
  userDeleteEvent = new EventEmitter();


  /**
   * To get api urls
   */
  public config: ConfigService;

  constructor(private learnerService: LearnerService,
  config: ConfigService) {
    this.config = config;
  }

  deleteUser(requestParam) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.DELETE_USER,
      data: {
        'request': {
          'userId': requestParam.userId
        }
      }
    };

    return this.learnerService.post(option).map(data => {
      this.userDeleteEvent.emit(requestParam.userId);
      return data;
    });

   // return this.learnerService.post(option);
  }

  updateRoles(requestParam) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.UPDATE_USER_ORG_ROLES,
      data: {
          'request': {
            'userId': requestParam.userId,
            'organisationId': requestParam.orgId,
            'roles': requestParam.roles
          }
        }
    };

    return this.learnerService.post(option);
  }

  getUserById(requestParam) {
    const option = {
      url: this.config.urlConFig.URLS.USER.GET_PROFILE + requestParam.userId
    };

    return this.learnerService.get(option);
  }
}
