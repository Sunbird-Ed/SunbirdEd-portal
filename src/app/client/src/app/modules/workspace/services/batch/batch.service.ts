import { Injectable, Input } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchService,SearchParam, LearnerService, ContentService, UserService } from '@sunbird/core';
import { Ibatch } from './../../interfaces/batch';
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
  *  orgIds
  */
  orgIds: string;
  
  /**
  *  rootOrgId
  */
  rootOrgId: string;
  /**
   * Reference of user service.
   */
  public user: UserService;

  /**
   * Reference of content service.
   */
  public content: ContentService;

  /**
   * Reference of config service
   */
  public config: ConfigService;

  /**
   * Reference of learner service
   */
  public learner: LearnerService;

  /**
   * Reference of batchDetails.
  */
  public batchDetails: Ibatch;

  /**
   * Default method of OrganisationService class
   *
   * @param {UserService} user user service reference
   * @param {ContentService} content content service reference
   * @param {ConfigService} config config service reference
   * @param {LearnerService} config learner service reference
   */
  constructor(user: UserService, content: ContentService,
    config: ConfigService, learner: LearnerService) {
    this.user = user;
    this.content = content;
    this.config = config;
    this.learner = learner;
  }

  /**
   * Search batch by batch id.
   *
   * @param {SearchParam} requestParam api request data
   */

  getBatchDetails(requestParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.GET_DETAILS,
      data: {
        request: {
          filters: requestParam.filters,
        }
      }
    };
    return this.learner.get(option);
  }
  /**
  *  Method getRequestBodyForUserSearch
 */
  getRequestBodyForUserSearch(query, users) {
    const request = {
      filters: {},
    };

    if (query) {
      request['query'] = query;
    }
    if (users) {
      request.filters['identifier'] = users;
    }
    const isCourseMentor = this.user.RoleOrgMap && this.user.RoleOrgMap['COURSE_MENTOR'];
    const rootOrgId = this.user.rootOrgId;
    if (isCourseMentor && isCourseMentor.includes(this.user.rootOrgId)) {
      request.filters['rootOrgId'] = this.user.rootOrgId;
    } else {
      try {
        this.orgIds = this.user.RoleOrgMap && this.user.RoleOrgMap['COURSE_MENTOR'];
        _.remove(this.orgIds, function (id) {
          return id === rootOrgId;
        });
      } catch (error) {
        console.error(error);
      }
      request.filters['organisations.organisationId'] = this.orgIds;
    }
    return {
      request: request
    };
  }
  /**
  *  Method filterUserSearchResult
 */
  filterUserSearchResult(userData, query) {
    if (query) {
      const fname = userData.firstName !== null && userData.firstName.includes(query);
      const lname = userData.lastName !== null && userData.lastName.includes(query);
      const email = userData.email !== null && userData.email.includes(query);
      const phone = userData.phone !== null && userData.phone.includes(query);
      return fname || lname || email || phone;
    } else {
      return true;
    }
  }
  /**
 *  Method getUserOtherDetail
*/
  getUserOtherDetail(userData) {
    if (userData.email && userData.phone) {
      return ' (' + userData.email + ', ' + userData.phone + ')';
    }
    if (userData.email && !userData.phone) {
      return ' (' + userData.email + ')';
    }
    if (!userData.email && userData.phone) {
      return ' (' + userData.phone + ')';
    }
  }
  /**
  * method update
  * desc Update a existing batch
  * memberOf Services.batchService
  * param {Object} request - Request object
  * param {string} request.id - Batch id.
  * param {string} request.courseId - Course Id.
  * param {string} request.name - Name of batch
  * param {string} request.description - Description of batch.
  * param {string} request.enrollmentType - Enrollment type for batch ie-Open, invite-only.
  * param {string} request.startDate - Start date batch
  * param {string} request.endDate - End date for batch
  * param {Object[]} request.createdFor - UserId list of mentees.
  * param {Object[]} request.mentor - UserId list of Mentors
  * returns {Promise} Promise object containing response code.
  * instance
  */
  updateBatchDetails(requestParam: Ibatch): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.UPDATE,
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
    return this.learner.patch(option);
  }

  /**
  * method addUsers
  * desc Add mentee to existing batch
  * memberOf Services.batchService
  * param {Object} request - Request object
  * param {Object[]} request.userIds - UserId list of mentees.
  * param {string} batchId - Batch id.
  */
  addUsers(requestParam: Ibatch, batchId) {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.ADD_USERS + '/' + batchId,
      data: {
        request: {
          userIds: requestParam.userIds
        }
      }
    };
    return this.learner.post(option);
  }

  /**
  * method getBatchDetails
  * desc Get batch details
  * memberOf Services.batchService
  * param {Object} request - Request object
  * param {string} request.batchId - Batch id.
  * returns {Promise} Promise object containing  batch details.
   * instance
  */

  getBatchDetailsById(requestParam: Ibatch) {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.GET_DETAILS + '/' + requestParam.batchId,
    };
    return this.learner.get(option);
  }


  /**
  * method setBatchData
  */
  setBatchData(batchData): void {
    console.log(JSON.stringify(batchData));
    this.batchDetails = batchData;
  }
  /**
  * method getBatchData
  */
  getBatchData() {
    return this.batchDetails;
  }
}

