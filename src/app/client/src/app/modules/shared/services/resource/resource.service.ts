import { of as observableOf, throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { BrowserCacheTtlService } from './../browser-cache-ttl/browser-cache-ttl.service';
import { HttpOptions, RequestParam, ServerResponse } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as UUID } from 'uuid';
import dayjs from 'dayjs';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import * as _ from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';
/**
 * Service to fetch resource bundle
 */
@Injectable()
export class ResourceService {
  // Workaround for issue https://github.com/angular/angular/issues/12889
  // Dependency injection creates new instance each time if used in router sub-modules
  static singletonInstance: ResourceService;
  /**
  * messages bundle
  */
  messages: any = {};
  /**
  * frmelmnts bundle
  */
  frmelmnts: any = {};
  /**
  * frmelemnts bundle
  */
  frmelemnts: any = {};
  tbk: object = {};
  tvc: object = {};
  tvk: object = {};
  crs: object = {};
  /**
   * reference of config service.
   */
  public config: ConfigService;
  public baseUrl: string;
  public http: HttpClient;

  /**
   * Contains instance name
   */
  private _instance: string;
  private _selectedLang: string;
  // Observable navItem source
  _languageSelected = new BehaviorSubject<any>({});
  // Observable navItem stream
  languageSelected$ = this._languageSelected.asObservable();

  public RESOURCE_CONSUMPTION_ROOT = 'result.consumption.';

  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http LearnerService reference
   */
  constructor(config: ConfigService, http: HttpClient,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private translateService: TranslateService) {
    if (!ResourceService.singletonInstance) {
      this.http = http;
      this.config = config;
      this.baseUrl = this.config.urlConFig.URLS.RESOURCEBUNDLES_PREFIX;
      try {
        this._instance = document.getElementById('instance')?(<HTMLInputElement>document.getElementById('instance')).value:'';
      } catch (error) {
      }
      ResourceService.singletonInstance = this;
    }
    return ResourceService.singletonInstance;
  }
  public initialize() {
    const range = { value: 'ar', label: 'Arabic', dir: 'rtl' };
    this.getResource(this.cacheService.get('portalLanguage') || 'ar', range);
    this.translateService.setDefaultLang('ar');
  }
  /**
   * method to fetch resource bundle
  */
  public getResource(language = 'ar', range: any = {}): void {
    this._selectedLang = language;
    const option = {
      url: this.config.urlConFig.URLS.RESOURCEBUNDLES.ENG + '/' + language
    };
    this.get(option).subscribe(
      (data: ServerResponse) => {
        const { creation: { messages: creationMessages = {}, frmelmnts: creationFrmelmnts = {}, frmelemnts: creationFrmelemnts = {} } = {},
          consumption: { messages: consumptionMessages = {}, frmelmnts: consumptionFrmelmnts = {},
            frmelemnts: consumptionFrmelemnts = {}, tbk = {}, tvc = {}, tvk = {}, crs = {} } = {} } = _.get(data, 'result') || {};
        this.messages = _.merge({}, creationMessages, consumptionMessages);
        this.frmelmnts = _.merge({}, creationFrmelmnts, consumptionFrmelmnts);
        this.frmelemnts = _.merge({}, creationFrmelemnts, consumptionFrmelemnts);
        this.tbk = tbk; this.tvc = tvc; this.tvk = tvk; this.crs = crs;
        const currentLangObj = { ...range, value: language, dir: range.dir };
        this.getLanguageChange(currentLangObj);
      },
      (err: ServerResponse) => {
      }
    );

    this.translateService.use(language);
  }
  get(requestParam: RequestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };
    return this.http.get(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }
  /**
   * @description - Function to generate HTTP headers for API request
   * @returns HttpOptions
   */
  private getHeader(): HttpOptions['headers'] {
    const _uuid = UUID();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': '',
      'X-Source': 'web',
      'ts': dayjs().format(),
      'X-msgid': _uuid,
      'X-Request-ID': _uuid,
      'X-Session-Id': 'X-Session-Id'
    };
  }
  /**
 * get method to fetch instance.
 */
  get instance(): string {
    return _.upperCase(this._instance);
  }

  get selectedLang(): string {
    return this._selectedLang;
  }

  getLanguageChange(language) {
    this.translateService.use(language.value);
    this._languageSelected.next(language);
  }
}
