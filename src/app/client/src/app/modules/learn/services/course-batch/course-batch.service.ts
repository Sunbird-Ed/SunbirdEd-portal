import { Injectable, Input, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {SearchParam, LearnerService, UserService, ContentService, SearchService } from '@sunbird/core';

@Injectable()
export class CourseBatchService {
  private _enrollToBatchDetails: any;
  private _updateBatchDetails: any;
  public updateEvent = new EventEmitter();
  private _enrolledBatchDetails: any;
  constructor(public searchService: SearchService, public user: UserService, public content: ContentService, public config: ConfigService,
    public learnerService: LearnerService) { }
  getAllBatchDetails(searchParams) {
    return this.batchSearch(searchParams);
  }
  getUserDetails(searchParams) {
    return this.getUserList(searchParams);
  }
  batchSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.GET_BATCHS,
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
  getUserList(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: requestParam.filters,
          query: requestParam.query || ''
        }
      }
    };
    const mentorOrg = this.user.userProfile.roleOrgMap['COURSE_MENTOR'];
    if (mentorOrg && mentorOrg.includes(this.user.rootOrgId)) {
      option.data.request.filters['rootOrgId'] = this.user.rootOrgId;
    } else if (mentorOrg) {
      option.data.request.filters['organisations.organisationId'] = mentorOrg;
    }
    return this.learnerService.post(option);
  }
  getBatchDetails(bathId) {
    const option = {
      url: `${this.config.urlConFig.URLS.BATCH.GET_DETAILS}/${bathId}`
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
      return Observable.of(this._enrollToBatchDetails);
    } else {
      return this.getBatchDetails(bathId).map((data) => {
        return data.result.response;
      });
    }
  }
  getUpdateBatchDetails(bathId) {
    if (this._updateBatchDetails && bathId === this._updateBatchDetails.identifier) {
      return Observable.of(this._updateBatchDetails);
    } else {
      return this.getBatchDetails(bathId).map((date) => {
        return date.result.response;
      });
    }
  }
  enrollToCourse(data) {
    const options = {
      url: this.config.urlConFig.URLS.COURSE.ENROLL_USER_COURSE,
      data: data
    };
    return this.learnerService.post(options);
  }

  createBatch(request) {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.CREATE,
      data: {
        request: request
      }
    };
    return this.learnerService.post(option);
  }
  updateBatch(request) {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.UPDATE,
      data: {
        request: request
      }
    };
    return this.learnerService.patch(option);
  }
  addUsersToBatch(request, batchId) {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.ADD_USERS + '/' + batchId,
      data: {
        request: request
      }
    };
    return this.learnerService.post(option);
  }
  getEnrolledBatchDetails(batchId) {
    if (this._enrolledBatchDetails && this._enrolledBatchDetails.identifier === batchId) {
      return Observable.of(this._enrolledBatchDetails);
    } else {
      return this.getBatchDetails(batchId).map((data) => {
        this._enrolledBatchDetails = data.result.response;
        return data.result.response;
      });
    }
  }
}
