import { ITenantData, ITenantInfo, ITenantSettings } from './interfaces';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { BehaviorSubject ,  Observable, of, iif, combineLatest } from 'rxjs';
import { DataService } from '../data/data.service';
import { LearnerService } from './../learner/learner.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map, catchError, mergeMap, tap } from 'rxjs/operators';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import * as _ from 'lodash-es';

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
  _tenantData$ = new BehaviorSubject<ITenantInfo>(undefined);
  /**
   * BehaviorSubject containing tenant settings data.
   */
  _tenantSettings$ = new BehaviorSubject<ITenantSettings>(undefined);
  /**
   * Read only observable containing tenant data.
   */
  public readonly tenantData$: Observable<ITenantInfo> = this._tenantData$.asObservable()
  .pipe(skipWhile(data => data === undefined || data === null));
  /**
   * Read only observable containing tenant settings data.
   */
  public readonly tenantSettings$: Observable<ITenantSettings> = this._tenantSettings$.asObservable()
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
   * Variable that holds default tenant value
   */
  private _defaultTenant = '';
  // TODO refactor the igot specific changes
  slugForIgot = '';
  /**
   * The constructor
   * @param {HttpClient} http Reference of HttpClient.
   * @param {ConfigService} config Reference of ConfigService.
   */
  constructor(http: HttpClient, config: ConfigService, private cacheService: CacheService,
    private learnerService: LearnerService, private userService: UserService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.TENANT_PREFIX;
    this._defaultTenant = (<HTMLInputElement>document.getElementById('defaultTenant'))
      ? (<HTMLInputElement>document.getElementById('defaultTenant')).value : null;
    this.slugForIgot = (<HTMLInputElement>document.getElementById('slugForProminentFilter')) ?
      (<HTMLInputElement>document.getElementById('slugForProminentFilter')).value : null;
  }

  /**
   * @returns default tenant value
   */
  get defaultTenant() {
    return this._defaultTenant;
  }

  public initialize() {
    if (this.cacheService.exists('orgSettings')) {
      const orgSettings = this.cacheService.get('orgSettings');
      const slug = this.userService.slug !== '' ? this.userService.slug : this._defaultTenant;
      if (orgSettings.id === slug) {
        this._tenantSettings$.next(JSON.parse(orgSettings.value));
      } else {
        this.getSlugDefaultTenantInfo(this.userService.slug).subscribe();
      }
    } else {
      this.getSlugDefaultTenantInfo(this.userService.slug).subscribe();
    }
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
    if ((slug && slug !== '') && slug === this.slugForIgot) {
      slug = this.slugForIgot;
    } else {
      slug = this._defaultTenant;
    }
    const url = `${this.config.urlConFig.URLS.SYSTEM_SETTING.TENANT_CONFIG + '/'}` + slug;
    return this.learnerService.get({
      url: url
    }).pipe(map((data: ServerResponse) => {
      if (_.has(data, 'result.response')) {
        let configResponse = {};
        try {
          if (JSON.parse(data.result.response.value)) { configResponse = data; }
        } catch (parseJSONResponse) {
          // console.error('org settings parse error => ', parseJSONResponse);
        }
        return configResponse;
      } else {
        return {};
      }
    }), catchError((error) => {
      return of({});
    }));
  }

  public getSlugDefaultTenantInfo(slug) {
    return combineLatest([this.getTenantConfig(slug)])
    .pipe(
      mergeMap(([data]) => {
        return iif(() => _.isEmpty(data), this.getTenantConfig(this._defaultTenant), of(data));
      }),
      catchError(err => {
        console.error(err);
        return of({});
      }),
      tap(data => {
        this.setTenantSettings(data);
      })
    );
  }

  public setTenantSettings(settingsResponse) {
    const data = _.get(settingsResponse.result, 'response');
    this.cacheService.set('orgSettings', data , {
      maxAge: 86400
    });
    if (data) {
      this._tenantSettings$.next(JSON.parse(settingsResponse.result.response.value));
    }
  }
}
