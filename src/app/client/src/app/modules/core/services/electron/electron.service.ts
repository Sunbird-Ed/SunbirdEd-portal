import { ConfigService } from '@sunbird/shared';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Service to provides CRUD methods to make Learner api request by extending DataService.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ElectronService extends DataService {
  /**
   * base Url for lerner api
   */
  baseUrl: string;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of lerner service.
   */
  public http: HttpClient;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.ELECTRON_DIALOG_PREFIX;
  }
}
