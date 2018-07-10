
import {of as observableOf,  Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Injectable, Input, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchService, SearchParam, LearnerService, UserService } from '@sunbird/core';
import { Ibatch } from './../../interfaces';
import * as _ from 'lodash';
/**
 * Service for batch
 */
@Injectable()
export class BatchService {
  /**
   * Reference of user service.
   */
  public userService: UserService;

  /**
   * Reference of configService service
   */
  public configService: ConfigService;

  /**
   * Reference of learner service
   */
  public learnerService: LearnerService;

  batchDetails: any;

  defaultUserList: any;

  public updateEvent = new EventEmitter();

  /**
   * Default method of OrganisationService class
   *
   * @param {UserService} userService user service reference
   * @param {ContentService} contentService content service reference
   * @param {ConfigService} configService configService service reference
   * @param {LearnerService} LearnerService learner service reference
   */
  constructor(userService: UserService,
    configService: ConfigService, learnerService: LearnerService) {
    this.userService = userService;
    this.configService = configService;
    this.learnerService = learnerService;
  }
  getUserList(requestParam: SearchParam = {}): Observable<ServerResponse> {
    if (_.isEmpty(requestParam) && this.defaultUserList) {
      return observableOf(this.defaultUserList);
    } else {
      const option = {
        url: this.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
        data: {
          request: {
            filters: requestParam.filters || {},
            query: requestParam.query || ''
          }
        }
      };
      const mentorOrg = this.userService.userProfile.roleOrgMap['COURSE_MENTOR'];
      if (mentorOrg && mentorOrg.includes(this.userService.rootOrgId)) {
        option.data.request.filters['rootOrgId'] = this.userService.rootOrgId;
      } else if (mentorOrg) {
        option.data.request.filters['organisations.organisationId'] = mentorOrg;
      }
      return this.learnerService.post(option).pipe(map((data) => {
        if (_.isEmpty(requestParam)) {
          this.defaultUserList = data;
        }
        return data;
      }));
    }
  }
  updateBatch(request) {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.UPDATE,
      data: {
        request: request
      }
    };
    return this.learnerService.patch(option);
  }
  getBatchDetails(bathId) {
    const option = {
      url: `${this.configService.urlConFig.URLS.BATCH.GET_DETAILS}/${bathId}`
    };
    return this.learnerService.get(option).pipe(map((date) => {
      return date.result.response;
    }));
  }
  updateBatchDetails(requestParam): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.UPDATE,
      data: {
        request: {
          name: requestParam.name,
          description: requestParam.description,
          enrollmentType: requestParam.enrollmentType,
          startDate: requestParam.startDate,
          endDate: requestParam.endDate,
          createdFor: requestParam.createdFor,
          id: requestParam.id,
          mentors: requestParam.mentors
        }
      }
    };
    return this.learnerService.patch(option);
  }
  addUsersToBatch(request, batchId) {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.ADD_USERS + '/' + batchId,
      data: {
        request: request
      }
    };
    return this.learnerService.post(option);
  }
  /**
  * method setBatchData
  */
  setBatchData(batchData): void {
    this.batchDetails = batchData;
   }
   getUpdateBatchDetails(bathId) {
    if (this.batchDetails && bathId === this.batchDetails.identifier) {
      return observableOf(this.batchDetails);
    } else {
      return this.getBatchDetails(bathId).pipe(map((date) => {
        return date.result.response;
      }));
    }
  }
}

