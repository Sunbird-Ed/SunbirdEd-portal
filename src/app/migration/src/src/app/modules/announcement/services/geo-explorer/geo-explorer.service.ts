import { Injectable } from '@angular/core';
// SB service
import { LearnerService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
// Interface
import { GeoHttpParam } from './../../interfaces';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

/**
 * Service to manage geo explorer http calls
 */
@Injectable()

/**
 * @class GeoExplorerService to manage geo http call
 */
export class GeoExplorerService {

  /**
   * Contains config service reference
   */
  public config: ConfigService;

  /**
   * Contains learner service reference
   */
  public learner: LearnerService;

  /**
   * Default method of class GeoExplorerService
   *
   * @param {LearnerService} learner
   * @param {ConfigService} config
   */
  constructor(learner: LearnerService, config: ConfigService) {
    this.config = config;
    this.learner = learner;
  }

  /**
   * Function to get location list by making http call
   *
   * @param {GeoHttpParam} param contains rootOrgId of logged-in user
   */
  getLocations(param: GeoHttpParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.GEO_EXPLORER.LOCATION_READ + param.rootOrgId + '?type=organisation'
    };

    return this.learner.get(option);
  }
}
