import {Injectable} from '@angular/core';
import {ConfigService, InterpolatePipe, ServerResponse} from '@sunbird/shared';
import {HttpClient} from '@angular/common/http';
import {LearnerService} from '../learner/learner.service';
import {UserService} from '../user/user.service';
import {TelemetryService} from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import {CacheService} from 'ng2-cache-service';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

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

  instance: string;

  public fetchManagedUserList(request) {
    const options = {
      url: `${this.configService.urlConFig.URLS.USER.GET_MANAGED_USER}/${request.userId}?withTokens=false`
    };
    return this.learnerService.get(options);
  }

  public initiateSwitchUser(userId) {
    const url = this.configService.urlConFig.URLS.USER.SWITCH_USER + '/' + userId;
    return this.http.get(url);
  }

  public setSwitchUserData(userId, userSid) {
    // @ts-ignore
    document.getElementById('userId').value = userId;
    // @ts-ignore
    document.getElementById('userSid').value = userSid;
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
