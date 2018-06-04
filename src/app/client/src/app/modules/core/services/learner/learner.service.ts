import { ConfigService } from '@sunbird/shared';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TelemetryService } from '@sunbird/telemetry';

/**
 * Service to provides CRUD methods to make Learner api request by extending DataService.
 *
 */
@Injectable()
export class LearnerService extends DataService {
  /**
   * base Url for lerner api
   */
  baseUrl: string;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient, telemetryService: TelemetryService) {
    super(http, telemetryService);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.LEARNER_PREFIX;
  }
}
