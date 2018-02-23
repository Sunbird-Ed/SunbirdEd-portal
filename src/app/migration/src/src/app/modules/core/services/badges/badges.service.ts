import { ConfigService } from './../config/config.service';
import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BadgesService {
  private _badges$ = new BehaviorSubject<any>(undefined);
  public readonly badges$: Observable<any> = this._badges$.asObservable();
  private badges: any;
  constructor(public config: ConfigService, public learner: LearnerService) {
     this.getBadges();
  }
  public getBadges() {
    const option = {
      url: this.config.urlConFig.URLS.BADGE.GET
    };
    this.learner.get(option).subscribe(
      (badges: any) => {
        if (badges && badges.responseCode === 'OK') {
          this.badges = badges;
          this._badges$.next({err: null, userProfile: { ...this.badges }});
        } else {
          this._badges$.next({err: null, userProfile: { ...this.badges } });
        }
      },
      err => {
        this._badges$.next({err: err, userProfile: { ...this.badges }});
        console.log(err);
      }
    );
  }
}
