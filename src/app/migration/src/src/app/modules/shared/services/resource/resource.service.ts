import { HttpOptions, RequestParam, ServerResponse} from './../../interfaces';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './../config/config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
/**
 * Service to fetch resource bundle
 */
@Injectable()
export class ResourceService {
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
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http LearnerService reference
   */
  constructor(config: ConfigService, http: HttpClient) {
    /**
     * @param {HttpClient} http LearnerService reference
    */
    this.http = http;
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.RESOURCEBUNDLES_PREFIX;
   }
  public initialize() {
    this.getResource();
  }
  /**
   * method to fetch resource bundle
  */
   public getResource(): void {
    const option = {
      url: this.config.urlConFig.URLS.RESOURCEBUNDLES.ENG
    };
    this.get(option).subscribe(
      (data: ServerResponse) => {
          this.messages = data.result.messages;
          this.frmelmnts = data.result.frmelmnts;
      },
      (err: ServerResponse) => {
      }
    );
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
}
