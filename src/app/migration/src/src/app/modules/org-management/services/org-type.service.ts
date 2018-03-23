import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Service to manage geo explorer http calls
 */
@Injectable()

/**
 * @class GeoExplorerService to manage geo http call
 */
export class OrgTypeService {

   /**
   * BehaviorSubject Containing user profile.
   */
  private _orgTypeData$ = new BehaviorSubject<any>(undefined);

  public readonly orgTypeData$: Observable<any> = this._orgTypeData$.asObservable();

 // orgTypeDetails: any;

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
   * Function to get organisation types
   */
  getOrgTypes(): void {
    const option = {
      url: this.config.urlConFig.URLS.ORG_TYPE.GET
    };
    this.learner.get(option).subscribe(
      (data: ServerResponse) => {
        this._orgTypeData$.next(data);
      },
      (err: ServerResponse) => {
        this._orgTypeData$.next(err);
      }
    );
  }

  /**
   * Function to add organisation types
   */
  addOrgType(orgName: string): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ORG_TYPE.ADD,
      data: {
        'request': {
          'name': orgName
        }
      }
    };
    return this.learner.post(option);
  }

  updateOrgType(orgDetails): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ORG_TYPE.UPDATE,
      data: {
        'request': orgDetails
      }
    };
    return this.learner.patch(option);
  }
}


