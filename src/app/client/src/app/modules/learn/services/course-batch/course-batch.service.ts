import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Input, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchParam, LearnerService, UserService, ContentService, SearchService } from '@sunbird/core';
import * as _ from 'lodash';

@Injectable()
export class CourseBatchService {
  private _enrollToBatchDetails: any;
  private _updateBatchDetails: any;
  public updateEvent = new EventEmitter();
  private _enrolledBatchDetails: any;
  private defaultUserList: any;
  constructor(public searchService: SearchService, public userService: UserService, public content: ContentService,
    public configService: ConfigService,
    public learnerService: LearnerService) { }
  getAllBatchDetails(searchParams) {
    return this.batchSearch(searchParams);
  }
  batchSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.GET_BATCHS,
      data: {
        request: {
          filters: requestParam.filters,
          limit: requestParam.limit,
          sort_by: requestParam.sort_by
        }
      }
    };
    return this.learnerService.post(option);
  }
  getUserList(requestParam: SearchParam = {}): Observable<ServerResponse> {
    if (_.isEmpty(requestParam) && this.defaultUserList) {
      return observableOf(this.defaultUserList);
    } else {
      const request = _.cloneDeep(requestParam);
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
  getBatchDetails(bathId) {
    const option = {
      url: `${this.configService.urlConFig.URLS.BATCH.GET_DETAILS}/${bathId}`
    };
    return this.learnerService.get(option);
  }
  setEnrollToBatchDetails(enrollBatchDetails: any) {
    this._enrollToBatchDetails = enrollBatchDetails;
  }
  setUpdateBatchDetails(enrollBatchDetails: any) {
    this._updateBatchDetails = enrollBatchDetails;
  }
  getEnrollToBatchDetails(bathId) {
    if (this._enrollToBatchDetails && bathId === this._enrollToBatchDetails.identifier) {
      return observableOf(this._enrollToBatchDetails);
    } else {
      return this.getBatchDetails(bathId).pipe(map((data) => {
        return data.result.response;
      }));
    }
  }
  getUpdateBatchDetails(bathId) {
    if (this._updateBatchDetails && bathId === this._updateBatchDetails.identifier) {
      return observableOf(this._updateBatchDetails);
    } else {
      return this.getBatchDetails(bathId).pipe(map((date) => {
        return date.result.response;
      }));
    }
  }
  enrollToCourse(data) {
    const options = {
      url: this.configService.urlConFig.URLS.COURSE.ENROLL_USER_COURSE,
      data: data
    };
    return this.learnerService.post(options);
  }
  // Testing by Rhea
  unEnrollToCourse(data) {
    const options = {
      url: this.configService.urlConFig.URLS.COURSE.UNENROLL_USER_COURSE,
      data: data
    };
    return this.learnerService.post(options);
  }

  createBatch(request) {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.CREATE,
      data: {
        request: request
      }
    };
    return this.learnerService.post(option);
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
  addUsersToBatch(request, batchId) {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.ADD_USERS + '/' + batchId,
      data: {
        request: request
      }
    };
    return this.learnerService.post(option);
  }
  getEnrolledBatchDetails(batchId) {
    if (this._enrolledBatchDetails && this._enrolledBatchDetails.identifier === batchId) {
      return observableOf(this._enrolledBatchDetails);
    } else {
      return this.getBatchDetails(batchId).pipe(map((data) => {
        this._enrolledBatchDetails = data.result.response;
        return data.result.response;
      }));
    }
  }
}
