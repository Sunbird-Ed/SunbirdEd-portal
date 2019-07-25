
import {of as observableOf, BehaviorSubject, Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { UserService } from './../user/user.service';
import { IPageSection } from './../../interfaces/index';
import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { PublicDataService } from './../public-data/public-data.service';
import { environment } from '@sunbird/environment';

/**
*  Service for page API calls.
*/
@Injectable({
  providedIn: 'root'
})
export class PageApiService {
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
   * Reference of public data service
   */
  public publicDataService: PublicDataService;
  /**
  * the "constructor"
  *
  * @param {LearnerService} learnerService Reference of LearnerService.
  * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, public userService: UserService,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    publicDataService: PublicDataService ) {
    this.config = config;
    this.publicDataService = publicDataService;
  }
  /**
   *  api call for get page data.
   */
  getPageData(requestParam: IPageSection) {
   const pageData: any = this.cacheService.get('pageApi' + requestParam.name);
    if (pageData && _.isEmpty(requestParam.filters) && !(_.has(requestParam.sort_by, 'lastUpdatedOn') ||
     _.has(requestParam.sort_by, 'createdOn'))) {
      return observableOf(pageData);
    } else {
      return this.getPageSectionData(requestParam);
    }
  }

  getBatchPageData(requestParam: IPageSection) {
    return this.getPageSectionData(requestParam);
  }

  getPageSectionData (requestParam: IPageSection) {
    const option: any = {
      url: this.config.urlConFig.URLS.PAGE_PREFIX,
      param: { ...requestParam.params },
      data: {
        request: {
          source: requestParam.source,
          name: requestParam.name,
          filters: requestParam.filters,
          sort_by: requestParam.sort_by,
          softConstraints: requestParam.softConstraints,
          mode: requestParam.mode
        }
      }
    };
    if (!environment.isOffline) {
      option.data.request.organisationId = requestParam.organisationId;
    }
    if (!_.isEmpty(requestParam.exists)) {
      option.data['exists'] = requestParam.exists;
    }
    return this.publicDataService.post(option).pipe(map((data) => {
      this.setData(data, requestParam);
      return { sections : data.result.response.sections };
    }));
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


