import { ConfigService, ServerResponse, IUserProfile, IUserData, IAppIdEnv } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
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
  public learnerService: LearnerService;
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
  private _authenticated: boolean;
  public anonymousSid: string;
  private _contentChannelFilter: string;
  /**
   * Reference of content service.
   */
  public contentService: ContentService;
  /**
   * Reference of orgNames
   */
  private orgNames: Array<string> = [];
  /**
  * constructor
  * @param {ConfigService} config ConfigService reference
  * @param {LearnerService} learner LearnerService reference
  */
  constructor(config: ConfigService, learner: LearnerService,
    private http: HttpClient, contentService: ContentService) {
    this.config = config;
    this.learnerService = learner;
    this.contentService = contentService;
    try {
      this._userid = (<HTMLInputElement>document.getElementById('userId')).value;
      this._sessionId = (<HTMLInputElement>document.getElementById('sessionId')).value;
      this._authenticated = true;
    } catch (error) {
      this._authenticated = false;
      this.anonymousSid = UUID.UUID();
    }
    try {
      this._appId = (<HTMLInputElement>document.getElementById('appId')).value;
      this._env = (<HTMLInputElement>document.getElementById('ekstepEnv')).value;
    } catch (error) {
    }

  }
  /**
   * returns login status.
   */
  get loggedIn(): boolean {
    return this._authenticated;
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
    this.learnerService.get(option).subscribe(
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
  // public getAppIdEnv(): void {
  //   const url = this.config.appConfig.APPID_EKSTEPENV;
  //   this.http.get(url).subscribe((res: IAppIdEnv) => {
  //     this._appId = res.appId;
  //     this._env = res.ekstep_env;
  //   },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

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

  public initialize(loggedIn) {
    if (loggedIn === true) {
      this.getUserProfile();
    }
    // this.getAppIdEnv();
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
      });
    }
    if (profileData.rootOrgId) {
      organisationIds.push(profileData.rootOrgId);
    }
    this._channel = _.get(profileData, 'rootOrg.hashTagId');
    this._dims = _.concat(organisationIds, this.channel);
    organisationIds = _.uniq(organisationIds);
    this._userProfile = profileData;
    this._userProfile.userRoles = userRoles;
    this._userProfile.orgRoleMap = orgRoleMap;
    this._userProfile.organisationIds = organisationIds;
    this._userid = this._userProfile.userId;
    this._rootOrgId = this._userProfile.rootOrgId;
    this._hashTagId = this._userProfile.rootOrg.hashTagId;
    this.setContentChannelFilter();
    this.getOrganisationDetails(organisationIds);
    this.setRoleOrgMap(profileData);
    this.setOrgDetailsToRequestHeaders();
    this._userData$.next({ err: null, userProfile: this._userProfile });
    document.title = this._userProfile.rootOrg.orgName;
  }
  setContentChannelFilter() {
    try {
      const contentChannelFilter = (<HTMLInputElement>document.getElementById('contentChannelFilter')).value;
      if (contentChannelFilter && contentChannelFilter.toLowerCase() === 'self') {
        this._contentChannelFilter = this.channel;
      }
    } catch (error) {
      console.log('unable to set content channel filter');
    }
  }
  setOrgDetailsToRequestHeaders() {
    this.learnerService.rootOrgId = this._rootOrgId;
    this.learnerService.channelId = this._channel;
    this.contentService.rootOrgId = this._rootOrgId;
    this.contentService.channelId = this._channel;
  }
  get contentChannelFilter() {
    return this._contentChannelFilter;
  }

  /**
   * Get organization details.
   *
   * @param {requestParam} requestParam api request data
   */
  getOrganisationDetails(organisationIds) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            id: organisationIds,
          }
        }
      }
    };
    this.contentService.post(option).subscribe
      ((data: ServerResponse) => {
        _.forEach(data.result.response.content, (orgData) => {
          this.orgNames.push(orgData.orgName);
        });
        this._userProfile.organisationNames = this.orgNames;
      },
      (err: ServerResponse) => {
        this.orgNames = [];
        this._userProfile.organisationNames = this.orgNames;
      }
      );
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
    let roles = [];
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
    _.forEach(this._userProfile.roles, (value, index) => {
      roleOrgMap[value] = _.union(roleOrgMap[value], [this.rootOrgId]);
    });
    this._userProfile.roleOrgMap = roleOrgMap;
  }
  get RoleOrgMap() {
    return _.cloneDeep(this._userProfile.roleOrgMap);
  }

  /**
   * method to log session start
   */
  public startSession(): void {
    const fingerPrint2 = new Fingerprint2();
    fingerPrint2.get((result, components) => {
      const url = `/v1/user/session/start/${result}`;
      this.http.get(url).subscribe();
    });
  }
}

