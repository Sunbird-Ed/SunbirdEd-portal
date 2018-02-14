import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {urlConFig} from './url.config';
import { DataService } from './data.service';

//const urlConFig = (<any>urlConfig);
@Injectable()
export class UserService {
  private userid: string;
  private userProfile: object = {};
  private _userData$ = new BehaviorSubject<any>(undefined);
  public readonly userData$: Observable<any> = this._userData$.asObservable();
  constructor(private http: HttpClient, private dataService:DataService) {
    if((<HTMLInputElement>document.getElementById('userId'))){
      this.userid =  (<HTMLInputElement>document.getElementById('userId')).value;
    }
    this.userid = this.userid === '<%=userId%>' ? 'userId' : this.userid;
    if(!(this.userid)){
      this.userid ="874ed8a5-782e-4f6c-8f36-e0288455901e";
    }
    this.getUserProfile();
   }

  public getUserProfile() {
    const option = {
      url: urlConFig.URLS.USER.GET_PROFILE + this.userid,
      param: urlConFig.params.userReadParam
    };
    this.dataService.get(option, urlConFig.URLS.LEARNER_PREFIX).subscribe(
      data => {
        console.log(data);
        this.setUserProfile(data);
      },
      err => {
        console.log('error in getting profile', err);
      }
    );
  }
  private setUserProfile(res) {
    if (res && res.responseCode === 'OK') {
       const profileData = res.result.response;
      let userRoles = profileData.roles;
      _.forEach(profileData.organisations, (org) => {
        if (org.roles && _.isArray(org.roles)) {
          userRoles = _.union(userRoles, org.roles);
        }
      });
      this.userProfile = profileData;
      this.userProfile['userRoles'] = userRoles;
      this._userData$.next({err: null, userProfile: { ...this.userProfile } });

    } else {

      this._userData$.next({err: res.responseCode, userProfile: { ...this.userProfile } });
    }
  }
}

