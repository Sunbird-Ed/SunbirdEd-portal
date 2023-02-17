import {Injectable} from '@angular/core';
import {ConfigService, InterpolatePipe, ServerResponse} from '@sunbird/shared';
import {HttpClient} from '@angular/common/http';
import {LearnerService} from '../learner/learner.service';
import {UserService} from '../user/user.service';
import {TelemetryService} from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import {BehaviorSubject, of} from 'rxjs';
import {map, skipWhile} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManagedUserService {

  constructor(public configService: ConfigService, private http: HttpClient,
              private learnerService: LearnerService, public userService: UserService,
              private telemetryService: TelemetryService, private cacheService: CacheService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  private _managedUserProfile;

  /**
   * BehaviorSubject Containing managed user list.
   */
  private _managedUserList$ = new BehaviorSubject(undefined);

  /**
   * Read only observable Containing managed user list.
   */
  public readonly managedUserList$ = this._managedUserList$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

  instance: string;

  public fetchManagedUserList() {
    const userId = this.getUserId();
    let url = `${this.configService.urlConFig.URLS.USER.GET_MANAGED_USER}/${userId}`;
    url = url + '?sortBy=createdDate&order=desc';
    const options = {
      url: url
    };
    this.learnerService.get(options).subscribe((data: ServerResponse) => {
        this._managedUserProfile = data;
        this._managedUserList$.next(this._managedUserProfile);
      },
      (err: ServerResponse) => {
        this._managedUserList$.next(this._managedUserProfile);
      }
    );
  }

  updateUserList(data) {
    this._managedUserProfile.result.response.content = [data].concat(this._managedUserProfile.result.response.content);
    this._managedUserList$.next(this._managedUserProfile);
  }

  public initiateSwitchUser(request) {
    const url = this.configService.urlConFig.URLS.USER.SWITCH_USER + '/' + request.userId + '?isManagedUser=' + request.isManagedUser;
    return this.http.get(url);
  }

  public setSwitchUserData(userId, userSid) {
    // @ts-ignore
    document.getElementById('userId').value = userId;
    if (document.getElementById('userSid')) {
      // @ts-ignore
      document.getElementById('userSid').value = userSid;
    }
    this.telemetryService.setSessionIdentifier(userSid);
    this.userService.setUserId(userId);
    this.userService.initialize(true);
  }

  public getMessage(message, name) {
    const filterPipe = new InterpolatePipe();
    let errorMessage =
      filterPipe.transform(message, '{instance}', this.instance);
    errorMessage =
      filterPipe.transform(errorMessage, '{userName}', name);
    return errorMessage;
  }

  getUserId() {
    if (this.userService.userProfile.managedBy) {
      return this.userService.userProfile.managedBy;
    } else {
      return this.userService.userid;
    }
  }

  processUserList(userList, currentUserId) {
    const processedList = [];
    _.forEach(userList, (userData) => {
      // skipping the current user from showing into the list
      if (!(currentUserId === userData.identifier)) {
        userData.title = userData.firstName;
        userData.initial = userData.firstName && userData.firstName[0];
        userData.selected = false;
        processedList.push(userData);
      }
    });
    return processedList || [];
  }

  getParentProfile() {
    // get parent's profile data
    const userProfile = this.cacheService.get('userProfile');
    if (userProfile) {
      return of(userProfile);
    } else {
      const userId = this.getUserId();
      return this.userService.getUserData(userId).pipe(map((res: ServerResponse) => {
          return _.get(res, 'result.response');
        }
      ));
    }
  }
}
