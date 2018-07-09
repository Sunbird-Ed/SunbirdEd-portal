import { ConfigService, ServerResponse } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
/**
 * Service to fetch badges
 */
@Injectable()
export class BadgesService {
  /**
   * BehaviorSubject Containing badges.
   */
  private _badges$ = new BehaviorSubject<any>(undefined);
  /**
   * Read only observable Containing badges.
   */
  public readonly badges$: Observable<any> = this._badges$.asObservable();
  /**
   * local variable Containing badges.
   */
  private badges: any;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of lerner service.
   */
  public learner: LearnerService;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {LearnerService} learner LearnerService reference
   */
  constructor(config: ConfigService, learner: LearnerService) {
    this.config = config;
    this.learner = learner;
  }
  public initialize() {
  }
  /**
   * method to fetch badges from server.
  */
  public getAllBadgeList(req) {
    const option = {
      url: this.config.urlConFig.URLS.BADGE.BADGE_CLASS_SEARCH,
      data: req
    };
    return this.learner.post(option);
  }

  public getDetailedBadgeAssertions(req, assertions) {
    return Observable.create(observer => {
      const option = {
        url: this.config.urlConFig.URLS.BADGE.BADGE_CLASS_SEARCH,
        data: req
      };
      this.learner.post(option).subscribe((badgeSearchResponse) => {
        if (badgeSearchResponse) {
          const detailedAssertions: any[] = assertions;
          for (const detailedAssertion of detailedAssertions) {
            const badgeFound: any = _.find(badgeSearchResponse.result.badges, { 'badgeId': detailedAssertion.badgeId });
            if (badgeFound) {
              detailedAssertion.description = badgeFound.description;
            }
            observer.next(detailedAssertion);
          }
          observer.complete();
        }
      });
    });
  }
}
