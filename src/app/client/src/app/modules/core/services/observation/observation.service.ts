import { ConfigService } from '@sunbird/shared';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Service to provides CRUD methods to make Observation api request by extending DataService.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ObservationService extends DataService {
  /**
   * base Url for Observation api
   */
   baseUrl: string;
   /**
    * reference of config service.
    */
   public config: ConfigService;
   /**
    * reference of Observation service.
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
     this.baseUrl = this.config.urlConFig.URLS.OBSERVATION_PREFIX;
   }
}
