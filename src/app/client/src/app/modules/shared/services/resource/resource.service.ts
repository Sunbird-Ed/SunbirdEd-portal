import { HttpOptions, RequestParam, ServerResponse } from './../../interfaces';
import { Observable } from 'rxjs/Observable';
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
    private cacheService: CacheService) {
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
    const exists: boolean = this.cacheService.exists('resourcebundles' + language);
    if (exists) {
      const resourcebundles: any | null = this.cacheService.get('resourcebundles' + language);
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
    return this.http.get(this.baseUrl + requestParam.url, httpOptions)
      .flatMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return Observable.throw(data);
        }
        return Observable.of(data);
      });
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
