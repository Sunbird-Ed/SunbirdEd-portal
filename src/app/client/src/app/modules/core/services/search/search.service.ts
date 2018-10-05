
import { map } from 'rxjs/operators';
import { Injectable, Input } from '@angular/core';
import { UserService } from './../user/user.service';
import { ContentService } from './../content/content.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs';
import { SearchParam } from './../../interfaces/search';
import { LearnerService } from './../learner/learner.service';
import { PublicDataService } from './../public-data/public-data.service';
/**
 * Service to search content
 */
@Injectable()
export class SearchService {
  /**
   * Contains searched content list
   */
  private _searchedContentList: any;
  /**
   * Contains searched organization list
   */
  private _searchedOrganisationList: any;
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
  public learnerService: LearnerService;

  /**
   * Reference of public data service
   */
  public publicDataService: PublicDataService;
  /**
   * Default method of OrganisationService class
   *
   * @param {UserService} user user service reference
   * @param {ContentService} content content service reference
   * @param {ConfigService} config config service reference
   * @param {LearnerService} config learner service reference
   */
  constructor(user: UserService, content: ContentService, config: ConfigService,
    learnerService: LearnerService, publicDataService: PublicDataService) {
    this.user = user;
    this.content = content;
    this.config = config;
    this.learnerService = learnerService;
    this.publicDataService = publicDataService;
  }
  /**
   * Search content by user id.
   *
   * @param {SearchParam} requestParam api request data
   */
  searchContentByUserId(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.COMPOSITE.SEARCH,
      data: {
        request: {
          filters: {
            status: requestParam.status || ['Live'],
            createdBy: requestParam.params.userId ? requestParam.params.userId : this.user.userid,
            contentType: requestParam.contentType || ['Course'],
            mimeType: requestParam.mimeType,
            objectType: requestParam.objectType,
            concept: requestParam.concept
          },
          limit: requestParam.limit,
          offset: (requestParam.pageNumber - 1) * requestParam.limit,
          query: requestParam.query,
          sort_by: {
            lastUpdatedOn: requestParam.params.lastUpdatedOn || 'desc'
          }
        }
      }
    };
    return this.content.post(option).pipe(
      map((data: ServerResponse) => {
        this._searchedContentList = data.result;
        return data;
      }));
  }
  /**
   * Get searched content list
   */
  get searchedContentList(): { content: Array<any>, count: number } {
    return this._searchedContentList;
  }
  /**
   * Get organization details.
   *
   * @param {requestParam} requestParam api request data
   */
  getOrganisationDetails(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            id: requestParam.orgid,
          }
        }
      }
    };
    return this.publicDataService.post(option).pipe(
      map((data: ServerResponse) => {
        this._searchedOrganisationList = data.result.response;
        return data;
      }));
  }

  /**
   * Get organization details.
   *
   * @param {requestParam} requestParam api request data
  */
  getSubOrganisationDetails(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            rootOrgId: requestParam.rootOrgId,
          }
        }
      }
    };
    return this.publicDataService.post(option).pipe(
      map((data: ServerResponse) => {
        return data;
      }));
  }
  /**
   * Get searched organization list
   */
  get searchedOrganisationList(): { content: Array<any>, count: number } {
    return this._searchedOrganisationList;
  }
  /**
   * Composite Search.
   *
   * @param {SearchParam} requestParam api request data
  */
  compositeSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.COMPOSITE.SEARCH,
      data: {
        request: {
          filters: requestParam.filters,
          offset: requestParam.offset,
          limit: requestParam.limit,
          query: requestParam.query,
          sort_by: requestParam.sort_by
        }
      }
    };
    const objectType = requestParam && requestParam.filters && requestParam.filters.objectType;
    return this.content.post(option);
  }
  /**
   * User Search.
  */
  userSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: requestParam.filters,
          limit: requestParam.limit,
          offset: (requestParam.pageNumber - 1) * requestParam.limit,
          query: requestParam.query,
          softConstraints: { badgeAssertions: 1 }
        }
      }
    };
    return this.content.post(option);
  }
  /**
   * User Search.
  */
  orgSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: requestParam.filters,
          limit: requestParam.limit,
          offset: (requestParam.pageNumber - 1) * requestParam.limit,
          query: requestParam.query
        }
      }
    };
    return this.publicDataService.post(option);
  }
  /**
   * Course Search.
   *
   * @param {SearchParam} requestParam api request data
  */
  courseSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.COURSE.SEARCH,
      data: {
        request: {
          filters: requestParam.filters,
          offset: (requestParam.pageNumber - 1) * requestParam.limit,
          limit: requestParam.limit,
          query: requestParam.query,
          sort_by: requestParam.sort_by
        }
      }
    };
    return this.content.post(option);
  }
  /**
   * Content Search.
   *
   * @param {SearchParam} requestParam api request data
  */
  contentSearch(requestParam: SearchParam, addDefaultContentTypesInRequest: boolean = true):
    Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.SEARCH,
      data: {
        request: {
          filters: requestParam.filters,
          limit: requestParam.limit,
          query: requestParam.query,
          sort_by: requestParam.sort_by,
          exists: requestParam.exists,
          softConstraints: requestParam.softConstraints || { badgeAssertions: 1 },
          facets: requestParam.facets && requestParam.facets
        }
      }
    };
    if (requestParam['pageNumber'] && requestParam['limit']) {
      option.data.request['offset'] = (requestParam.pageNumber - 1) * requestParam.limit;
    }

    if (!option.data.request.filters.contentType && addDefaultContentTypesInRequest) {
      option.data.request.filters.contentType = [
        'Collection',
        'TextBook',
        'LessonPlan',
        'Resource'
      ];
    }
    return this.publicDataService.post(option);
  }
  /**
  * Batch Search.
  *
  * @param {SearchParam} requestParam api request data
 */
  batchSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.BATCH.GET_BATCHS,
      data: {
        request: {
          filters: requestParam.filters,
          offset: (requestParam.pageNumber - 1) * requestParam.limit,
          limit: requestParam.limit,
          sort_by: requestParam.sort_by
        }
      }
    };
    return this.learnerService.post(option);
  }
  /**
   * getUserList.
   *
   * @param {SearchParam} requestParam api request data
  */
  getUserList(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: requestParam.filters
        }
      }
    };
    return this.learnerService.post(option);
  }
}


