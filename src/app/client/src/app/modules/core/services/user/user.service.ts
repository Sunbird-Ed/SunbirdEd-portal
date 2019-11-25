import { ConfigService, ServerResponse, IUserProfile, IUserData, IOrganization, HttpOptions } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { PublicDataService } from './../public-data/public-data.service';
import { skipWhile } from 'rxjs/operators';

/**
 * Service to fetch user details from server
 *
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Contains user id
   */
  private _userid: string;
  /**
    * Contains session id
    */
  private _sessionId: string;

  timeDiff: any;

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
  public readonly userData$: Observable<IUserData> = this._userData$.asObservable()
  .pipe(skipWhile(data => data === undefined || data === null));
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
   * Reference of cloud Storage Urls
   */
  private _cloudStorageUrls: string[];
  private _authenticated: boolean;
  private _anonymousSid: string;
  /**
   * Reference of content service.
   */
  public contentService: ContentService;
  /**
   * Reference of orgNames
   */
  private orgNames: Array<string> = [];

  public rootOrgName: string;

  public orgnisationsDetails: Array<IOrganization>;

  /**
   * Reference of public data service.
   */
  public publicDataService: PublicDataService;

  /**
  * constructor
  * @param {ConfigService} config ConfigService reference
  * @param {LearnerService} learner LearnerService reference
  */
  constructor(config: ConfigService, learner: LearnerService,
    private http: HttpClient, contentService: ContentService, publicDataService: PublicDataService) {
    this.config = config;
    this.learnerService = learner;
    this.contentService = contentService;
    this.publicDataService = publicDataService;
    try {
      this._userid = (<HTMLInputElement>document.getElementById('userId')).value;
      this._sessionId = (<HTMLInputElement>document.getElementById('sessionId')).value;
      this._authenticated = true;
    } catch (error) {
      this._authenticated = false;
      this._anonymousSid = UUID.UUID();
    }
    try {
      this._appId = (<HTMLInputElement>document.getElementById('appId')).value;
      this._cloudStorageUrls = (<HTMLInputElement>document.getElementById('cloudStorageUrls')).value.split(',');
    } catch (error) {
    }
  }
  get anonymousSid() {
    return this._anonymousSid;
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
    this.learnerService.getWithHeaders(option).subscribe(
      (data: ServerResponse) => {
        if (data.ts) {
          // data.ts is taken from header and not from api response ts, and format in IST
          this.timeDiff = data.ts;
        }
        this.setUserProfile(data);
      },
      (err: ServerResponse) => {
        this._userData$.next({ err: err, userProfile: this._userProfile });
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
   * get method to fetch cloudStorageUrls.
   */
  get cloudStorageUrls(): string[] {
    return this._cloudStorageUrls;
  }

  public initialize(loggedIn) {
    if (loggedIn) {
      this.getUserProfile();
    }
  }
  /**
   * method to set user profile to behavior subject.
   */
  private setUserProfile(res: ServerResponse) {
    const profileData = res.result.response;
    const orgRoleMap = {};
    const hashTagIds = [];
    this._channel = _.get(profileData, 'rootOrg.hashTagId');
    profileData.skills = _.get(profileData, 'skills' ) || [];
    hashTagIds.push(this._channel);
    let organisationIds = [];
    if (profileData.rootOrgId) {
      organisationIds.push(profileData.rootOrgId);
    }
    profileData.rootOrgAdmin = false;
    let userRoles = ['PUBLIC'];
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
        if (org.hashTagId) {
          hashTagIds.push(org.hashTagId);
        } else if (org.organisationId) {
          hashTagIds.push(org.organisationId);
        }
      });
    }
    this._dims = _.concat(organisationIds, this.channel);
    organisationIds = _.uniq(organisationIds);
    this._userProfile = profileData;
    this._userProfile.userRoles = _.uniq(userRoles);
    this._userProfile.orgRoleMap = orgRoleMap;
    this._userProfile.organisationIds = organisationIds;
    this._userProfile.hashTagIds = _.uniq(hashTagIds);
    this._userProfile.userId = this.userid; // this line is added to handle userId not returned from user service
    this._rootOrgId = this._userProfile.rootOrgId;
    this._hashTagId = this._userProfile.rootOrg.hashTagId;
    this.getOrganisationDetails(organisationIds);
    this.setRoleOrgMap(profileData);
    this.setOrgDetailsToRequestHeaders();
    this._userData$.next({ err: null, userProfile: this._userProfile });
    this.rootOrgName = this._userProfile.rootOrg.orgName;
  }
  setOrgDetailsToRequestHeaders() {
    this.learnerService.rootOrgId = this._rootOrgId;
    this.learnerService.channelId = this._channel;
    this.contentService.rootOrgId = this._rootOrgId;
    this.contentService.channelId = this._channel;
    this.publicDataService.rootOrgId = this._rootOrgId;
    this.publicDataService.channelId = this._channel;
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
    this.publicDataService.post(option).subscribe
      ((data: ServerResponse) => {
        this.orgnisationsDetails = _.get(data, 'result.response.content');
        _.forEach(this.orgnisationsDetails, (orgData) => {
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

  /**
   * This method invokes learner service to update tnc accept
   */
  public acceptTermsAndConditions(requestBody) {
    const options = {
      url: this.config.urlConFig.URLS.USER.TNC_ACCEPT,
      data: requestBody
    };
    return this.learnerService.post(options).pipe(map(
      (res: ServerResponse) => {
        this._userProfile.promptTnC = false;
      }
    ));
  }

  get orgIdNameMap() {
    const mapOrgIdNameData = {};
    _.forEach(this.orgnisationsDetails, (orgDetails) => {
      mapOrgIdNameData[orgDetails.identifier] = orgDetails.orgName;
    });
    return mapOrgIdNameData;
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

  get getServerTimeDiff() {
    return this.timeDiff;
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
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'))
      ? (<HTMLInputElement>document.getElementById('deviceId')).value : '';
    const url = `/v1/user/session/start/${deviceId}`;
    this.http.get(url).subscribe();
  }

  getUserByKey(key) {
    return this.learnerService.get({ url: this.config.urlConFig.URLS.USER.GET_USER_BY_KEY + '/' + key});
  }

  getFeedData() {
    return this.learnerService.get({ url: this.config.urlConFig.URLS.USER.GET_USER_FEED + '/' + this.userid});
  }

  userMigrate(requestBody) {
    const option = {
      url: this.config.urlConFig.URLS.USER.USER_MIGRATE,
      data: requestBody
    };
    return this.learnerService.post(option);
  }

}
