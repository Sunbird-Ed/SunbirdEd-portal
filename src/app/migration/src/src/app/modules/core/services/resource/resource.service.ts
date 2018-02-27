import { Observable } from 'rxjs/Observable';
import { ConfigService } from './../config/config.service';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from './../../interfaces';

/**
 * Service to fetch resource bundle
 */
@Injectable()
export class ResourceService extends DataService {
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
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http LearnerService reference
   */
  constructor(config: ConfigService, http: HttpClient) {
    /**
     * @param {HttpClient} http LearnerService reference
    */
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.RESOURCEBUNDLES_PREFIX;
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
        console.log('error in getting resource', err);
      }
    );
   }
}
