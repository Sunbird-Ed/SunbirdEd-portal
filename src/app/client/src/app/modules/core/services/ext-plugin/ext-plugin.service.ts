import { ConfigService } from '@sunbird/shared';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 *
 */

@Injectable({
  providedIn: 'root'
})
export class ExtPluginService extends DataService {

  /**
   * base Url for public api
   */
  baseUrl: string;
  /**
   * reference of config service.
   */
  public config: ConfigService;

  public http: HttpClient;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.EXT_PLUGIN_PREFIX;
  }
}
