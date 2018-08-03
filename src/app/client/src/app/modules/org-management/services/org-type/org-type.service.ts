
import {map} from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { IorgTypeData } from './../../interfaces';

/**
 * Service to manage organisation type http calls
 */
@Injectable()

/**
 * @class OrgTypeService to manage organisation type http call
 */
export class OrgTypeService {

  /**
  * BehaviorSubject containing organisation listing data.
  */
  private _orgTypeData$ = new BehaviorSubject<IorgTypeData>(undefined);

  /**
   * Read only observable containing organisation listing data.
   */
  public readonly orgTypeData$: Observable<IorgTypeData> = this._orgTypeData$.asObservable();

  /**
  * To listen event after organisation type update
  */
  orgTypeUpdateEvent = new EventEmitter();

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
   * @param {LearnerService} learner Contains learner service reference
   * @param {ConfigService} config Contains config service reference
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
        this._orgTypeData$.next({ orgTypeData: data, err: null });
      },
      (err: ServerResponse) => {
        this._orgTypeData$.next({ orgTypeData: null, err: err });
      }
    );
  }

  /**
   * Function to add organisation type
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
    return this.learner.post(option).pipe(map(data => {
      this.getOrgTypes();
      return data;
    }));
  }

  /**
   * Function to update organisation type
   */
  updateOrgType(orgDetails): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ORG_TYPE.UPDATE,
      data: {
        'request': orgDetails
      }
    };
    return this.learner.patch(option).pipe(map(data => {
      this.orgTypeUpdateEvent.emit(orgDetails);
      return data;
    }));
  }
}

