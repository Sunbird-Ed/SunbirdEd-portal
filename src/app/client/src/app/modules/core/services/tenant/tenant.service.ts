import { ITenantData, ITenantInfo } from './interfaces';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
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
  private _tenantData$ = new BehaviorSubject<ITenantInfo>(undefined);
  public slugForProminentFilter = (<HTMLInputElement>document.getElementById('slugForProminentFilter')) ?
  (<HTMLInputElement>document.getElementById('slugForProminentFilter')).value : null;

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
  constructor(http: HttpClient, config: ConfigService, private cacheService: CacheService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.TENANT_PREFIX;
  }

  /**
   * API call to gather organization details.
   * @param slug Organization details passed from main-header component.
   */
  public getTenantInfo(slug?: string) {
    const orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug')
    if (_.get(orgDetailsFromSlug, 'slug') === this.slugForProminentFilter) {
      slug = _.get(orgDetailsFromSlug, 'slug')
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
}
