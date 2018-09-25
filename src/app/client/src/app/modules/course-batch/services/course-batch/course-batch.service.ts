import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Input, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { PlayerService } from '@sunbird/core';
import { SearchParam, LearnerService, UserService, ContentService, SearchService } from '@sunbird/core';
import * as _ from 'lodash';

@Injectable()
export class CourseBatchService {
  private _enrollToBatchDetails: any;
  private _updateBatchDetails: any;
  public updateEvent = new EventEmitter();
  private _enrolledBatchDetails: any;
  private defaultUserList: any;
  courseHierarchy: any;

  constructor(public searchService: SearchService, public userService: UserService, public content: ContentService,
  public configService: ConfigService,
  public learnerService: LearnerService, private playerService: PlayerService) {
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

  getUserList(requestParam: SearchParam = {}): Observable<ServerResponse> {
    console.log(requestParam);
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
        option.data.request.filters['organisations.roles'] = ['COURSE_MENTOR'];
      } else if (mentorOrg) {
        option.data.request.filters['organisations.organisationId'] = requestParam.orgid;
      }
      return this.learnerService.post(option).pipe(map((data) => {
        if (_.isEmpty(requestParam)) {
          this.defaultUserList = data;
        }
        return data;
      }));
    }
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
  getBatchDetails(bathId) {
    const option = {
      url: `${this.configService.urlConFig.URLS.BATCH.GET_DETAILS}/${bathId}`
    };
    return this.learnerService.get(option);
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
  updateBatch(request) {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.UPDATE,
      data: {
        request: request
      }
    };
    return this.learnerService.patch(option);
  }
}
