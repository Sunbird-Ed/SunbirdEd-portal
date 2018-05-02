import { ConfigService, ServerResponse, IUserProfile, IUserData, IAppIdEnv } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
/**
 * Service to fetch user details from server
 *
 */
@Injectable()
export class UserService {
  /**
   * Contains user id
   */
  private _userid: string;
  /**
    * Contains session id
    */
  private _sessionId: string;
  /**
   * Contains root org id
   */
  public _rootOrgId: string;
  /**
   * Contains user profile.
   */
  private _userProfile: IUserProfile;
  /**
   * BehaviorSubject Containing user profile.
   */
  private _userData$ = new BehaviorSubject<IUserData>(undefined);
  /**
   * Read only observable Containing user profile.
   */
  public readonly userData$: Observable<IUserData> = this._userData$.asObservable();
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of lerner service.
   */
  public learner: LearnerService;
    /**
   * Contains hashTag id
   */
  private _hashTagId: string;
  /**
 * Reference of appId
 */
  private _appId: string;
  /**
   * Reference of channel
   */
  private _channel: string;
  /**
   * Reference of dims
   */
  private _dims: Array<string> = [];
  /**
   * Reference of Ekstep_env
   */
  private _env: string;
   /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {LearnerService} learner LearnerService reference
   */
  constructor(config: ConfigService, learner: LearnerService, private http: HttpClient) {
    this.config = config;
    this.learner = learner;
    try {
      this._userid = (<HTMLInputElement>document.getElementById('userId')).value;
      this._sessionId = (<HTMLInputElement>document.getElementById('sessionId')).value;
    } catch (error) {
    }
  }
  /**
   * get method to fetch userid.
   */
  get userid(): string {
    return this._userid;
  }
  /**
  * get method to fetch sessionId.
  */
  get sessionId(): string {
    return this._sessionId;
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
        this._userData$.next({ err: err, userProfile: this._userProfile });
      }
    );
  }
/**
    * method to fetch appId and Ekstep_env from server.
    */
    public getAppIdEnv(): void {
      const url = this.config.appConfig.APPID_EKSTEPENV;
      this.http.get(url).subscribe((res: IAppIdEnv) => {
        this._appId = res.appId;
        this._env = res.ekstep_env;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * get method to fetch appId.
   */
  get appId(): string {
    return this._appId;
  }
  /**
   * get method to fetch Ekstep_env.
   */
  get env(): string {
    return this._env;
  }

  public initialize() {
    this.getUserProfile();
    this.getAppIdEnv();
  }
  /**
   * method to set user profile to behavior subject.
   */
  private setUserProfile(res: ServerResponse) {
    const profileData = res.result.response;
    const orgRoleMap = {};
    let organisationIds = [];
    profileData.rootOrgAdmin = false;
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
        if (profileData.rootOrgId) {
          organisationIds.push(profileData.rootOrgId);
        }
      });
    }
    const rootOrg = (profileData.rootOrg && !_.isUndefined(profileData.rootOrg.hashTagId)) ? profileData.rootOrg.hashTagId : 'sunbird';
    this._channel = rootOrg;
    this._dims = _.concat(organisationIds, this.channel);
    organisationIds = _.uniq(organisationIds);
    this._userProfile = profileData;
    this._userProfile.userRoles = userRoles;
    this._userProfile.orgRoleMap = orgRoleMap;
    this._userProfile.organisationIds = organisationIds;
    this._userid = this._userProfile.userId;
    this._rootOrgId = this._userProfile.rootOrgId;
    this.setRoleOrgMap(profileData);
    this._hashTagId = this._userProfile.rootOrg.hashTagId;
    this._userData$.next({ err: null, userProfile: this._userProfile });
  }
  get userProfile() {
    return _.cloneDeep(this._userProfile);
  }

  get rootOrgId() {
    return this._rootOrgId;
  }

  get hashTagId() {
    return this._hashTagId;
  }

  get channel() {
    return this._channel;
  }

  get dims() {
    return this._dims;
  }

  private setRoleOrgMap(profile) {
    let  roles = [];
    const roleOrgMap = {};
    _.forEach(profile.organisations, (org) => {
      roles = roles.concat(org.roles);
    });
    roles = _.uniq(roles);
    _.forEach(roles, (role) => {
      _.forEach(profile.organisations, (org) => {
        roleOrgMap[role] = roleOrgMap[role] || [];
        if (_.indexOf(org.roles, role) > -1) { }
        roleOrgMap[role].push(org.organisationId);
      });
    });
    this._userProfile.roleOrgMap = roleOrgMap;
  }
  get RoleOrgMap () {
    return _.cloneDeep(this._userProfile.roleOrgMap);
  }
}
