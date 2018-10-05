import { of , Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Input, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse, BrowserCacheTtlService } from '@sunbird/shared';
import { PlayerService } from '@sunbird/core';
import { SearchParam, LearnerService, UserService, ContentService, SearchService } from '@sunbird/core';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
@Injectable()
export class CourseBatchService {
  private _enrollToBatchDetails: any;
  private _updateBatchDetails: any;
  public updateEvent = new EventEmitter();
  private _enrolledBatchDetails: any;
  private defaultUserList: any;
  courseHierarchy: any;

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    public searchService: SearchService, public userService: UserService, public content: ContentService,
    public configService: ConfigService,
    public learnerService: LearnerService, private playerService: PlayerService) {
  }
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
  getCourseHierarchy(courseId) {
    if (this.courseHierarchy && this.courseHierarchy.identifier === courseId) {
      return of(this.courseHierarchy);
    } else {
      return this.playerService.getCollectionHierarchy(courseId).pipe(map((response: ServerResponse) => {
        this.courseHierarchy = response.result.content;
        return response.result.content;
      }));
    }
  }

  getUserList(requestParam: SearchParam = {}): Observable<ServerResponse> {
    const userList: any | null = this.cacheService.get('userList' + requestParam.query);
    if (userList) {
      return of(userList.data);
    } else {
      if (_.isEmpty(requestParam) && this.defaultUserList) {
        return of(this.defaultUserList);
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
          if (requestParam.query) {
            this.cacheService.set('userList' + requestParam.query, {data},
          {maxAge: this.browserCacheTtlService.browserCacheTtl});
          }
          return data;
        }));
      }
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
      return of(this._enrollToBatchDetails);
    } else {
      return this.getBatchDetails(bathId).pipe(map((data) => {
        return data.result.response;
      }));
    }
  }
  getUpdateBatchDetails(bathId) {
    if (this._updateBatchDetails && bathId === this._updateBatchDetails.identifier) {
      return of(this._updateBatchDetails);
    } else {
      return this.getBatchDetails(bathId).pipe(map((date) => {
        return date.result.response;
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
  updateBatch(request) {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.UPDATE,
      data: {
        request: request
      }
    };
    return this.learnerService.patch(option);
  }
  getEnrolledBatchDetails(batchId) {
    if (this._enrolledBatchDetails && this._enrolledBatchDetails.identifier === batchId) {
      return of(this._enrolledBatchDetails);
    } else {
      return this.getBatchDetails(batchId).pipe(map((data) => {
        this._enrolledBatchDetails = data.result.response;
        return data.result.response;
      }));
    }
  }
}
