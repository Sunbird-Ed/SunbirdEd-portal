
import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchParam, LearnerService, UserService, PlayerService } from '@sunbird/core';
import * as _ from 'lodash-es';
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

  courseHierarchy: any;

  /**
   * Default method of OrganisationService class
   *
   * @param {UserService} userService user service reference
   * @param {ContentService} contentService content service reference
   * @param {ConfigService} configService configService service reference
   * @param {LearnerService} LearnerService learner service reference
   */
  constructor(userService: UserService, public playerService: PlayerService,
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
  /**
   * this is set only for open batches, as participants will not be there
  */
  setBatchData(batchData): void {
    this.batchDetails = batchData;
  }
  getBatchDetails(batchId) {
    if (this.batchDetails && batchId === this.batchDetails.identifier) {
      return observableOf(this.batchDetails);
    } else {
      const option = {
        url: `${this.configService.urlConFig.URLS.BATCH.GET_DETAILS}/${batchId}`
      };
      return this.learnerService.get(option).pipe(map((date) => {
        return date.result.response;
      }));
    }
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
  getUpdateBatchDetails(batchId) {
    return this.getBatchDetails(batchId).pipe(map((data) => {
      return data;
    }));
  }

  getParticipantList(data) {
    const options = {
      url: this.configService.urlConFig.URLS.BATCH.GET_PARTICIPANT_LIST,
      data: data
    };
    return this.learnerService.post(options).pipe(map((response: any) => {
      return _.get(response, 'result.batch.participants') || [];
    }));
  }

  removeUsersFromBatch(batchId, request) {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.REMOVE_USERS + '/' + batchId,
      data: request
    };
    return this.learnerService.post(option);
  }

  getCourseHierarchy(courseId) {
    if (this.courseHierarchy && this.courseHierarchy.identifier === courseId) {
      return observableOf(this.courseHierarchy);
    } else {
      return this.playerService.getCollectionHierarchy(courseId).pipe(map((response: ServerResponse) => {
        this.courseHierarchy = response.result.content;
        return response.result.content;
      }));
    }
  }
}

