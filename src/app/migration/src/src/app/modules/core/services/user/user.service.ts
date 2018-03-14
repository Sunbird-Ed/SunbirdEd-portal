import { ConfigService, ServerResponse, UserProfile, UserData } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
/**
 * Service to fetch user details from server
 *
 */
@Injectable()
export class UserService {
  /**
   * Contains user id
   */
  public _userid: string;
  /**
   * Contains user profile.
   */
  private userProfile: UserProfile;
  /**
   * BehaviorSubject Containing user profile.
   */
  private _userData$ = new BehaviorSubject<UserData>(undefined);
  /**
   * Read only observable Containing user profile.
   */
  public readonly userData$: Observable<UserData> = this._userData$.asObservable();
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
  /**
   * get method to fetch userid.
   */
  get userid(): string {
    try {
      this._userid = (<HTMLInputElement>document.getElementById('userId')).value;
      this._userid = this._userid === '<%=userId%>' ? 'userId' : this._userid;
    } catch (e) {
      this._userid = 'userId';
    }
    return this._userid;
  }
  /**
   * method to fetch user profile from server.
   */
  public getUserProfile(): void {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${this.userid}`,
      param: this.config.urlConFig.params.userReadParam
    };
    this.learner.get(option).subscribe(
      (data: ServerResponse) => {
        this.setUserProfile(data);
      },
      (err: ServerResponse) => {
        this._userData$.next({ err: err, userProfile: this.userProfile });
      }
    );
  }

  public initialize() {
    this.getUserProfile();
  }
  /**
   * method to set user profile to behavior subject.
   */
  private setUserProfile(res: ServerResponse) {
    const profileData = res.result.response;
    const orgRoleMap = {};
    let organisationIds = [];
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
      });
    }
    organisationIds = _.uniq(organisationIds);
    this.userProfile = profileData;
    this.userProfile.userRoles = userRoles;
    this.userProfile.orgRoleMap = orgRoleMap;
    this.userProfile.organisationIds = organisationIds;
    this._userData$.next({ err: null, userProfile: this.userProfile });
  }
}
