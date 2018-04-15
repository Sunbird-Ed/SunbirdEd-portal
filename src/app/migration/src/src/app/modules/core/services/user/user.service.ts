import { ConfigService, ToasterService, ServerResponse, ResourceService, IUserProfile, IUserData, IAppIdEnv } from '@sunbird/shared';
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
 * Reference of appId
 */
  private _appId: string;
  /**
   * Reference of channel
   */
  public channel: string;
  /**
   * Reference of dims
   */
  public dims: Array<string> = [];
  /**
   * Reference of Ekstep_env
   */
  private _env: string;
    /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
    * To call resource service which helps to use language constant
    */
  public resourceService: ResourceService;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {LearnerService} learner LearnerService reference
   */
  constructor(config: ConfigService, learner: LearnerService, private http: HttpClient,
    resourceService: ResourceService,
    toasterService: ToasterService) {
    this.config = config;
    this.learner = learner;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
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
    public getAppidEnv(): void {
      const url = this.config.appConfig.APPID_EKSTEPENV;
      this.http.get(url)
      .catch((error: any) => {
            return Observable.throw(this.toasterService.error(this.resourceService.messages.emsg.m0005));
      })
      .subscribe((res: IAppIdEnv) => {
        this._appId = res.appId;
        this._env = res.ekstep_env;
      });
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
    try {
      this._userid = (<HTMLInputElement>document.getElementById('userId')).value;
      this._sessionId = (<HTMLInputElement>document.getElementById('sessionId')).value;
    } catch { }
    this.getUserProfile();
    this.getAppidEnv();
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
        if (profileData.rootOrgId) {
          organisationIds.push(profileData.rootOrgId);
        }
      });
    }
    const rootOrg = (profileData.rootOrg && !_.isUndefined(profileData.rootOrg.hashTagId)) ? profileData.rootOrg.hashTagId : 'sunbird';
    this.channel = rootOrg;
    this.dims = _.concat(organisationIds, this.channel);
    organisationIds = _.uniq(organisationIds);
    this._userProfile = profileData;
    this._userProfile.userRoles = userRoles;
    this._userProfile.orgRoleMap = orgRoleMap;
    this._userProfile.organisationIds = organisationIds;
    this._userid = this._userProfile.userId;
    this._rootOrgId = this._userProfile.rootOrgId;
    this._userData$.next({ err: null, userProfile: this._userProfile });
  }
  get userProfile() {
    return _.cloneDeep(this._userProfile);
  }

  get rootOrgId() {
    return this._rootOrgId;
  }
}
