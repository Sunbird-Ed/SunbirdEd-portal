
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
// SB service
import { LearnerService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
// Interface
import { GeoHttpParam, IGeoLocationDetails } from './../../interfaces';
// Rxjs
import { Observable } from 'rxjs';


import * as _ from 'lodash';

/**
 * Service to manage geo explorer http calls
 */
@Injectable()

/**
 * @class GeoExplorerService to manage geo http call
 */
export class GeoExplorerService {

  /**
   * Contains geo data
   */
  public _locationList: Array<IGeoLocationDetails>;
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
      url: this.config.urlConFig.URLS.GEO_EXPLORER.LOCATION_READ + '/' + param.rootOrgId + '?type=organisation'
    };

    return this.learner.get(option).pipe(
      map((data: ServerResponse) => {
        if (data.result.response) {
          this._locationList = _.cloneDeep(data.result.response);
        }
        return data;
      }));
  }

  get locationList () {
    return _.cloneDeep(this._locationList);
  }
}
