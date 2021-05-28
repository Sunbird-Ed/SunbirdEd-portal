import { ConfigService, ServerResponse, IUserProfile, IUserData, IOrganization, HttpOptions } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject, iif, of, throwError } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { PublicDataService } from './../public-data/public-data.service';
import { skipWhile, tap } from 'rxjs/operators';
import { APP_BASE_HREF } from '@angular/common';
import { CacheService } from 'ng2-cache-service';
import { DataService } from './../data/data.service';
import { environment } from '@sunbird/environment';


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
  public orgNames: Array<string> = [];

  public rootOrgName: string;

  public organizationsDetails: Array<IOrganization>;
  public createManagedUser = new EventEmitter();
  public isDesktopApp = false;
  private _guestData$ = new BehaviorSubject<any>(undefined);
  private guestUserProfile;
  public readonly guestData$: Observable<any> = this._guestData$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));
  /**
   * Reference of public data service.
   */
  public publicDataService: PublicDataService;
  private _slug = '';
  public _isCustodianUser: boolean;
  public anonymousUserPreference;
  public readonly userOrgDetails$ = this.userData$.pipe(
    mergeMap(data => iif(() =>
      !this._userProfile.organisationIds, of([]), this.getOrganizationDetails(this._userProfile.organisationIds))),
    shareReplay(1));

  /**
  * constructor
  * @param {ConfigService} config ConfigService reference
  * @param {LearnerService} learner LearnerService reference
  */
  constructor(config: ConfigService, learner: LearnerService, private cacheService: CacheService,
    private http: HttpClient, contentService: ContentService, publicDataService: PublicDataService,
    @Inject(APP_BASE_HREF) baseHref: string, private dataService: DataService) {
    this.config = config;
    this.learnerService = learner;
    this.contentService = contentService;
    this.publicDataService = publicDataService;
    this.isDesktopApp = environment.isDesktopApp;
    try {
      this._userid = (<HTMLInputElement>document.getElementById('userId')).value;
      DataService.userId = this._userid;
      this._sessionId = (<HTMLInputElement>document.getElementById('sessionId')).value;
      DataService.sessionId = this._sessionId;
      this._authenticated = true;
    } catch (error) {
      this._authenticated = false;
      this._anonymousSid = UUID.UUID();
      DataService.sessionId = this._anonymousSid;
    }
    try {
      this._appId = (<HTMLInputElement>document.getElementById('appId')).value;
      this._cloudStorageUrls = (<HTMLInputElement>document.getElementById('cloudStorageUrls')).value.split(',');
    } catch (error) {
    }
    this._slug = baseHref && baseHref.split('/')[1] ? baseHref.split('/')[1] : '';
  }
  get slug() {
    return this._slug;
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

  setUserId(userId: string) {
    this._userid = userId;
  }
  /**
  * get method to fetch sessionId.
  */
  get sessionId(): string {
    return this._sessionId;
  }
  setIsCustodianUser(isCustodianUser) {
    this._isCustodianUser = isCustodianUser;
  }
  get isCustodianUser(): boolean {
    return this._isCustodianUser;
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
    this._slug = _.get(profileData, 'rootOrg.slug');
    profileData.skills = _.get(profileData, 'skills') || [];
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
    organisationIds = _.uniq(organisationIds);
    this._dims = _.concat(organisationIds, this.channel);
    this._userProfile = profileData;
    this._userProfile.userRoles = _.uniq(userRoles);
    this._userProfile.orgRoleMap = orgRoleMap;
    this._userProfile.organisationIds = organisationIds;
    this._userProfile.hashTagIds = _.uniq(hashTagIds);
    this._userProfile.userId = this.userid; // this line is added to handle userId not returned from user service
    this._rootOrgId = this._userProfile.rootOrgId;
    this._hashTagId = _.get(this._userProfile, 'rootOrg.hashTagId');
    this.setRoleOrgMap(profileData);
    this.setOrgDetailsToRequestHeaders();
    this._userData$.next({ err: null, userProfile: this._userProfile });
    this.rootOrgName = _.get(this._userProfile, 'rootOrg.orgName');

    // Storing profile details of stroger credentials user in cache
    if (!this._userProfile.managedBy) {
      this.cacheService.set('userProfile', this._userProfile);
    }

    if (window['TagManager']) {
      window['TagManager'].SBTagService.pushTag({ userLoocation: profileData.userLocations }, 'USERLOCATION_', true)
      window['TagManager'].SBTagService.pushTag(profileData.framework, 'USERFRAMEWORK_', true);
    }
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
  private getOrganizationDetails(organisationIds) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_EXT_SEARCH,
      data: {
        request: {
          filters: {
            id: organisationIds,
          }
        }
      }
    };
    return this.publicDataService.post(option)
      .pipe(tap((data: ServerResponse) => {
        this.organizationsDetails = _.get(data, 'result.response.content');
        this.orgNames = _.map(this.organizationsDetails, org => org.orgName);
      }));
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
    _.forEach(this.organizationsDetails, (orgDetails) => {
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

  public endSession() {
    const url = this.config.urlConFig.URLS.USER.END_SESSION;
    return this.http.get(url);
  }

  getUserByKey(key) {
    return this.learnerService.get({ url: this.config.urlConFig.URLS.USER.GET_USER_BY_KEY + '/' + key });
  }

  getIsUserExistsUserByKey(key) {
    return this.learnerService.get({ url: this.config.urlConFig.URLS.USER.USER_EXISTS_GET_USER_BY_KEY + '/' + key });
  }

  getFeedData() {
    return this.learnerService.get({ url: this.config.urlConFig.URLS.USER.GET_USER_FEED + '/' + this.userid });
  }

  registerUser(data) {
    const options = {
      url: this.config.urlConFig.URLS.USER.SIGN_UP_MANAGED_USER,
      data: data
    };
    return this.learnerService.post(options).pipe(
      map((resp) => {
        this.createManagedUser.emit(_.get(resp, 'result.userId'));
        return resp;
      }));
  }

  userMigrate(requestBody) {
    const option = {
      url: this.config.urlConFig.URLS.USER.USER_MIGRATE,
      data: requestBody
    };
    return this.learnerService.post(option);
  }

  setUserFramework(framework) {
    this._userProfile.framework = framework;
  }

  getUserData(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    return this.learnerService.getWithHeaders(option);
  }

  getAnonymousUserPreference(): Observable<ServerResponse> {
    const options = {
      url: this.config.urlConFig.URLS.OFFLINE.READ_USER
    };
    return this.publicDataService.get(options).pipe(map((response: ServerResponse) => {
      this.anonymousUserPreference = _.get(response, 'result');
      return response;
    }));
  }

  updateAnonymousUserDetails(request): Observable<ServerResponse> {
    const options = {
      url: this.config.urlConFig.URLS.OFFLINE.UPDATE_USER,
      data: request
    };
    return this.publicDataService.post(options);
  }

  createAnonymousUser(request): Observable<ServerResponse> {
    const options = {
      url: this.config.urlConFig.URLS.OFFLINE.CREATE_USER,
      data: request
    };
    return this.publicDataService.post(options).pipe(map((response: ServerResponse) => {
      this.getAnonymousUserPreference().subscribe();
      return response;
    }));
  }

  getGuestUser(): Observable<any> {
    if (this.isDesktopApp) {
      return this.getAnonymousUserPreference().pipe(map((response: ServerResponse) => {
        this.guestUserProfile = _.get(response, 'result');
        this._guestData$.next({ userProfile: this.guestUserProfile });
        return this.guestUserProfile;
      }));
    } else {
      const guestUserDetails = localStorage.getItem('guestUserDetails');

      if (guestUserDetails) {
        this.guestUserProfile = JSON.parse(guestUserDetails);
        this._guestData$.next({ userProfile: this.guestUserProfile });
        return of(this.guestUserProfile);
      } else {
        return throwError(undefined);
      }
    }
  }

  updateGuestUser(userDetails, formValue): Observable<any> {
    if (window['TagManager']) {
      window['TagManager'].SBTagService.pushTag(formValue, 'USERLOCATION_', true);
      window['TagManager'].SBTagService.pushTag(userDetails, 'USERFRAMEWORK_', true);
    }
    if (this.isDesktopApp) {
      userDetails.identifier = userDetails._id;
      const userType = localStorage.getItem('userType');

      if (userType) {
        userDetails.role = userType;
      }
      const req = { request: userDetails };
      return this.updateAnonymousUserDetails(req);
    } else {
      localStorage.setItem('guestUserDetails', JSON.stringify(userDetails));
      return of({});
    }
  }

  createGuestUser(userDetails): Observable<any> {
    if (this.isDesktopApp) {
      const req = { request: userDetails };
      return this.createAnonymousUser(req);
    } else {
      localStorage.setItem('guestUserDetails', JSON.stringify(userDetails));
      return of({});
    }
  }

  get defaultFrameworkFilters() {
    const isUserLoggedIn = this.loggedIn || false;
    const { framework = null } = this.userProfile || {};
    const userFramework = (isUserLoggedIn && framework && _.pick(framework, ['medium', 'gradeLevel', 'board'])) || {};
    return { board: ['CBSE'], gradeLevel: isUserLoggedIn ? [] : ['Class 10'], medium: [], ...userFramework };
  }
}
