import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from './../user/user.service';
import { IPageSection } from './../../interfaces/index';
import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, BrowserCacheTtlService } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { Observable } from 'rxjs/Observable';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash';

/**
*  Service for page API calls.
*/
@Injectable()
export class PageApiService {
  /**
  *  To do learner service api call.
  */
  private learnerService: LearnerService;
  /**
  *  To get url, app configs.
  */
  private config: ConfigService;
  /**
  * BehaviorSubject Containing user profile.
  */
  private _pageData$ = new BehaviorSubject<any>(undefined);
  /**
   * Read only observable Containing user profile.
   */
  public readonly pageData$: Observable<any> = this._pageData$.asObservable();
  /**
  * the "constructor"
  *
  * @param {LearnerService} learnerService Reference of LearnerService.
  * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, learnerService: LearnerService, public userService: UserService,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService ) {
    this.config = config;
    this.learnerService = learnerService;
  }
  /**
   *  api call for get page data.
   */
  getPageData(requestParam: IPageSection) {
   const pageData: any = this.cacheService.get('pageApi' + requestParam.name);
    if (pageData && _.isEmpty(requestParam.filters) && !(_.has(requestParam.sort_by, 'lastUpdatedOn') ||
     _.has(requestParam.sort_by, 'createdOn'))) {
      return Observable.of(pageData);
    } else {
      const option: any = {
        url: this.config.urlConFig.URLS.PAGE_PREFIX,
        data: {
          request: {
            source: requestParam.source,
            name: requestParam.name,
            filters: requestParam.filters,
            sort_by: requestParam.sort_by,
          }
        }
      };
      if (this.userService.contentChannelFilter) {
        option.data.request.filters.channel = this.userService.contentChannelFilter;
      }
      return this.learnerService.post(option).map((data) => {
        this.setData(data, requestParam);
        return { sections : data.result.response.sections };
      });
    }
  }
  setData(data, requestParam) {
    const sort_by = _.has(requestParam.sort_by, 'lastUpdatedOn') || _.has(requestParam.sort_by, 'createdOn');
    if (_.isEmpty(requestParam.filters) && !sort_by) {
      this.cacheService.set('pageApi' + requestParam.name, { sections: data.result.response.sections }, {
        maxAge: this.browserCacheTtlService.browserCacheTtl
      });
    }
  }
}


