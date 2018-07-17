
import {of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';

import {mergeMap} from 'rxjs/operators';
import { BrowserCacheTtlService } from './../browser-cache-ttl/browser-cache-ttl.service';
import { HttpOptions, RequestParam, ServerResponse } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash';
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
   * reference of config service.
   */
  public config: ConfigService;
  public baseUrl: string;
  public http: HttpClient;

  /**
   * Contains instance name
   */
  private _instance: string;

  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http LearnerService reference
   */
  constructor(config: ConfigService, http: HttpClient,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService) {
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
    this.getResource();
  }
  /**
   * method to fetch resource bundle
  */
  public getResource(language = 'en'): void {
    const resourcebundles: any | null = this.cacheService.get('resourcebundles' + language);
    if (resourcebundles) {
      this.messages = resourcebundles.messages;
      this.frmelmnts = resourcebundles.frmelmnts;
    } else {
      const option = {
        url: this.config.urlConFig.URLS.RESOURCEBUNDLES.ENG + '/' + language
      };
      this.get(option).subscribe(
        (data: ServerResponse) => {
          this.messages = data.result.messages;
          this.frmelmnts = data.result.frmelmnts;
          this.cacheService.set('resourcebundles' + language, {
            messages: data.result.messages,
            frmelmnts: data.result.frmelmnts
          }, {
              maxAge: this.browserCacheTtlService.browserCacheTtl
            });
        },
        (err: ServerResponse) => {
        }
      );
    }
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
  private getHeader(): HttpOptions['headers'] {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': '',
      'X-Source': 'web',
      'ts': moment().format(),
      'X-msgid': UUID.UUID()
    };
  }
  /**
 * get method to fetch instance.
 */
  get instance(): string {
    return this._instance;
  }
}
