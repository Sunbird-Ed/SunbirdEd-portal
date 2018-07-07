import { Injectable, Input } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchService, SearchParam, LearnerService, UserService } from '@sunbird/core';
import { Ibatch } from './../../interfaces';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
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
  getUserList(requestParam: SearchParam = { filters: {} }): Observable<ServerResponse> {
    if (_.isEqual(requestParam, { filters: {} }) && this.defaultUserList) {
      return Observable.of(this.defaultUserList);
    } else {
      const option = {
        url: this.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
        data: {
          request: {
            filters: requestParam.filters,
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
      return this.learnerService.post(option).map((data) => {
        this.defaultUserList = data;
        return data;
      });
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
    return this.learnerService.get(option).map((date) => {
      return date.result.response;
    });
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
      return Observable.of(this.batchDetails);
    } else {
      return this.getBatchDetails(bathId).map((date) => {
        return date.result.response;
      });
    }
  }
}

