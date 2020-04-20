import { ITenantData, ITenantInfo } from './interfaces';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { BehaviorSubject ,  Observable, of, iif, combineLatest } from 'rxjs';
import { DataService } from '../data/data.service';
import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map, catchError, mergeMap, tap, retry } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { isBuffer } from 'util';


/**
 * This service returns the organization details.
 */

@Injectable({
  providedIn: 'root'
})
export class TenantService extends DataService {
  /**
   * BehaviorSubject containing tenant data.
   */
  private _tenantData$ = new BehaviorSubject<ITenantInfo>(undefined);
  /**
   * Read only observable containing tenant data.
   */
  public readonly tenantData$: Observable<ITenantInfo> = this._tenantData$.asObservable()
  .pipe(skipWhile(data => data === undefined || data === null));
  /**
   * reference of http.
   */
  http: HttpClient;
  /**
   * reference of config service.
   */
  config: ConfigService;
  /**
   * Variable that holds tenant details.
   */
  tenantData: ITenantData;
  /**
   * This variable holds favicon details.
   */
  favicon: string;

  /**
   * The constructor
   * @param {HttpClient} http Reference of HttpClient.
   * @param {ConfigService} config Reference of ConfigService.
   */
  constructor(http: HttpClient, config: ConfigService, private cacheService: CacheService, private learnerService: LearnerService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.TENANT_PREFIX;
  }

  /**
   * API call to gather organization details.
   * @param slug Organization details passed from main-header component.
   */
  public getTenantInfo(slug?: string) {
    const orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug');
    // TODO: to rework igot.
    if (_.get(orgDetailsFromSlug, 'slug')) {
      slug = _.get(orgDetailsFromSlug, 'slug');
    }
    const url = `${this.config.urlConFig.URLS.TENANT.INFO + '/'}` + (slug ? slug : '');
    this.get({ url }).subscribe(
      (apiResponse: ServerResponse) => {
        this.tenantData = apiResponse.result;
        this._tenantData$.next({ err: null, tenantData: apiResponse.result });
      },
      (err: ServerResponse) => {
        this._tenantData$.next({ err: err, tenantData: undefined });
      }
    );
  }

  public getTenantConfig(slug: string) {
    const url = `${this.config.urlConFig.URLS.SYSTEM_SETTING.TENANT_CONFIG + '/'}` + slug;
    return this.learnerService.get({
      url: url
    }).pipe(map((data: ServerResponse) => {
      if (_.has(data, 'result.response')) {
        let configResponse = {};
        try {
          configResponse = JSON.parse(data.result.response.value);
        } catch (parseJSONResponse) {}
        return configResponse;
      } else {
        return {};
      }
    }), catchError((error) => {
      return of({});
    }));
  }

  public getSlugDefaultTenantInfo(slug, defaultTenant) {
    return combineLatest([this.getTenantConfig(slug)])
    .pipe(
      mergeMap(([data]) => {
        return iif(() => _.isEmpty(data), this.getTenantConfig(defaultTenant), of(data));
      }),
      catchError(err => {
        console.error(err);
        return of({});
      }),
      tap(data => {
        return data;
      })
    );
  }
}
