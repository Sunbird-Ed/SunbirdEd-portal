import { ConfigService } from './../config/config.service';
import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {
  public _userid: string;
  private userProfile: any = {};
  private _userData$ = new BehaviorSubject<any>(undefined);
  public readonly userData$: Observable<any> = this._userData$.asObservable();
  constructor(public config: ConfigService, public learner: LearnerService) {
    this.getUserProfile();
  }
  get userid() {
    try {
      this._userid = (<HTMLInputElement>document.getElementById('userId')).value;
      this._userid = this._userid === '<%=userId%>' ? 'userId' : this._userid;
    } catch (e) {
      this._userid = 'userId';
    }
    return this._userid;
  }
  public getProperty(property) {
    if (this[property]) {
      return { ...this[property] };
    } else {
      return null;
    }
  }

  public getUserProfile() {
    const option = {
      url: this.config.urlConFig.URLS.USER.GET_PROFILE + this.userid,
      param: this.config.urlConFig.params.userReadParam
    };
    this.learner.get(option).subscribe(
      data => {
        this.setUserProfile(data);
      },
      err => {
        this._userData$.next({ err: err, userProfile: { ...this.userProfile } });
        console.log('error in getting profile', err);
      }
    );
  }

  private setUserProfile(res) {
    if (res && res.responseCode === 'OK') {
      const profileData = res.result.response;
      const orgRoleMap = {};
      let organisationIds = [];
      // const organisationNames = [];
      let userRoles = profileData.roles;
      if (profileData.organisations) {
        _.forEach(profileData.organisations, (org) => {
          if (org.roles && _.isArray(org.roles)) {
            userRoles = _.union(userRoles, org.roles);
            if (org.organisationId === profileData.rootOrgId &&
              (_.indexOf(org.roles, 'ORG_ADMIN') > -1 ||
                _.indexOf(org.roles, 'SYSTEM_ADMINISTRATION') > -1)) {
              profileData.rootOrgAdmin = true;
            }
            orgRoleMap[org.organisationId] = org.roles;
          }
          if (org.organisationId) {
            organisationIds.push(org.organisationId);
          }
          // if (org.orgName) {
          //   organisationNames.push(org.orgName);
          // }
        });
      }
      organisationIds = _.uniq(organisationIds);
      this.userProfile = profileData;
      this.userProfile.userRoles = userRoles;
      this.userProfile.orgRoleMap = orgRoleMap;
      this.userProfile.organisationIds = organisationIds;
      // this.userProfile.organisationNames = organisationNames;
      this.processProfileData();
      this._userData$.next({ err: null, userProfile: { ...this.userProfile } });
      // this.updateProfileImage();
    } else {
      // toasterService.error($rootScope.messages.fmsg.m0005)
      this._userData$.next({ err: res.responseCode, userProfile: { ...this.userProfile } });
    }
  }

  formateDate(userDetails) {
    if (userDetails.length) {
      userDetails.forEach(function (element) {
        if (element.updatedDate) {
          element.updatedDate = new Date(element.updatedDate);
        }
      }, this);
    }
  }
  processProfileData() {
    const profileData: any = this.userProfile;
    this.userProfile.fullName = profileData.firstName + ' ' + profileData.lastName;
    this.userProfile.dob = profileData.dob ? new Date(profileData.dob) : profileData.dob;
    this.formateDate(this.userProfile.jobProfile);
    this.formateDate(this.userProfile.address);
    this.formateDate(this.userProfile.education);
  }

}
