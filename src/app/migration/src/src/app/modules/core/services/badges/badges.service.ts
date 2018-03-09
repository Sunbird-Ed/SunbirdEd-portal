import { ConfigService, ServerResponse } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
    this.getBadges();
  }
  /**
   * method to fetch badges from server.
  */
  public getBadges(): void {
    const option = {
      url: this.config.urlConFig.URLS.BADGE.GET
    };
    this.learner.get(option).subscribe(
      (badges: ServerResponse) => {
          this.badges = badges;
          this._badges$.next({err: null, userProfile: { ...this.badges }});
      },
      (err: ServerResponse) => {
        this._badges$.next({err: err, userProfile: { ...this.badges }});
      }
    );
  }
}
