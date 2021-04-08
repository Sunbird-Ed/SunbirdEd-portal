
import { of as observableOf, throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { BrowserCacheTtlService } from './../browser-cache-ttl/browser-cache-ttl.service';
import { HttpOptions, RequestParam, ServerResponse } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import dayjs from 'dayjs';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
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
  // Observable navItem source
  private _languageSelected = new BehaviorSubject<any>({});
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
        this._instance = (<HTMLInputElement>document.getElementById('instance')).value;
      } catch (error) {
      }
      ResourceService.singletonInstance = this;
    }
    return ResourceService.singletonInstance;
  }
  public initialize() {
    const range = { value: 'en', label: 'English', dir: 'ltr' };
    this.getResource(this.cacheService.get('portalLanguage') || 'en', range);
    this.translateService.setDefaultLang('en');
  }
  /**
   * method to fetch resource bundle
  */
  public getResource(language = 'en', range: any = {}): void {
    const option = {
      url: this.config.urlConFig.URLS.RESOURCEBUNDLES.ENG + '/' + language
    };
    this.get(option).subscribe(
      (data: ServerResponse) => {
        const { creation: { messages: creationMessages = {}, frmelmnts: creationFrmelmnts = {}, frmelemnts: creationFrmelemnts = {} } = {},
          consumption: { messages: consumptionMessages = {}, frmelmnts: consumptionFrmelmnts = {},
           frmelemnts: consumptionFrmelemnts = {} } = {} } = _.get(data, 'result') || {};
        this.messages = _.merge({}, creationMessages, consumptionMessages);
        this.frmelmnts = _.merge({}, creationFrmelmnts, consumptionFrmelmnts);
        this.frmelemnts = _.merge({}, creationFrmelemnts, consumptionFrmelemnts);
        this.getLanguageChange(range);
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
    const _uuid = UUID.UUID();
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

  getLanguageChange(language) {
    this.translateService.use(language.value);
    this._languageSelected.next(language);
  }
}
