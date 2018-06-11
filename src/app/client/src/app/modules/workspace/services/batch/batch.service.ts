import { Injectable, Input } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchService, SearchParam, LearnerService, ContentService, UserService } from '@sunbird/core';
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
  public userService: UserService;

  /**
   * Reference of content service.
   */
  public contentService: ContentService;

  /**
   * Reference of configService service
   */
  public configService: ConfigService;

  /**
   * Reference of learner service
   */
  public learnerService: LearnerService;

  /**
   * Reference of batchDetails.
  */
  public batchDetails: Ibatch;

  /**
   * Default method of OrganisationService class
   *
   * @param {UserService} userService user service reference
   * @param {ContentService} contentService content service reference
   * @param {ConfigService} configService configService service reference
   * @param {LearnerService} LearnerService learner service reference
   */
  constructor(userService: UserService, contentService: ContentService,
    configService: ConfigService, learnerService: LearnerService) {
    this.userService = userService;
    this.contentService = contentService;
    this.configService = configService;
    this.learnerService = learnerService;
  }

  /**
   * Search batch by batch id.
   *
   * @param {SearchParam} requestParam api request data
   */

  getBatchDetails(requestParam): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.GET_DETAILS,
      data: {
        request: {
          filters: requestParam.filters,
        }
      }
    };
    return this.learnerService.get(option);
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
    const isCourseMentor = this.userService.RoleOrgMap && this.userService.RoleOrgMap['COURSE_MENTOR'];
    const rootOrgId = this.userService.rootOrgId;
    if (isCourseMentor && isCourseMentor.includes(this.userService.rootOrgId)) {
      request.filters['rootOrgId'] = this.userService.rootOrgId;
    } else {
      try {
        this.orgIds = this.userService.RoleOrgMap && this.userService.RoleOrgMap['COURSE_MENTOR'];
        _.remove(this.orgIds, (id) => {
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
      url: this.configService.urlConFig.URLS.BATCH.ADD_USERS + '/' + batchId,
      data: {
        request: {
          userIds: requestParam.userIds
        }
      }
    };
    return this.learnerService.post(option);
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
      url: this.configService.urlConFig.URLS.BATCH.GET_DETAILS + '/' + requestParam.batchId,
    };
    return this.learnerService.get(option);
  }

  getUserDetails(searchParams) {
    return this.getUserList(searchParams);
  }
  getUserList(requestParam: SearchParam): Observable<ServerResponse> {
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
    return this.learnerService.post(option);
  }


  /**
  * method setBatchData
  */
  setBatchData(batchData): void {
   this.batchDetails = batchData;
  }
  /**
  * method getBatchData
  */
  getBatchData() {
    return this.batchDetails;
  }
}

