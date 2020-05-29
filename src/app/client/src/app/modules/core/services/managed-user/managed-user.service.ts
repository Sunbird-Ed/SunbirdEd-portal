import {Injectable} from '@angular/core';
import {ConfigService, InterpolatePipe} from '@sunbird/shared';
import {HttpClient} from '@angular/common/http';
import {LearnerService} from '../learner/learner.service';
import {UserService} from '../user/user.service';
import {TelemetryService} from '@sunbird/telemetry';


@Injectable({
  providedIn: 'root'
})
export class ManagedUserService {

  constructor(public configService: ConfigService, private http: HttpClient,
              private learnerService: LearnerService, public userService: UserService,
              private telemetryService: TelemetryService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  instance: string;

  public fetchManagedUserList(request) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.SEARCH_USER,
      data: request,
    };
    return this.learnerService.post(options);
  }

  public initiateSwitchUser(userId) {
    const url = this.configService.urlConFig.URLS.USER.SWITCH_USER + '/' + userId;
    return this.http.get(url);
  }

  public setSwitchUserData(userId, sessionIdentifier) {
    // @ts-ignore
    document.getElementById('userId').value = userId;
    // @ts-ignore
    document.getElementById('sessionIdentifier').value = sessionIdentifier;
    this.telemetryService.setSessionIdentifier(sessionIdentifier);
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
}
