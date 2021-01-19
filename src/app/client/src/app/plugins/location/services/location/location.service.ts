import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// import { UserService, PermissionService, LearnerService, FormService } from '../../../core';
import { UserService } from '../../../../modules/core/services/user/user.service';
import { LearnerService } from '../../../../modules/core/services/learner/learner.service';
import { FormService } from '../../../../modules/core/services/form/form.service';

// import { ResourceService, ConfigService, IUserProfile, IUserData, ServerResponse } from '@sunbird/shared';
import { ConfigService } from '../../../../modules/shared/services/config/config.service';
import { ServerResponse } from '../../../../modules/shared/interfaces/serverResponse';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private learnerService: LearnerService,
    public userService: UserService, public configService: ConfigService, public formService: FormService) { }

  private formatRequest(request) {
    request.userId = request.userId ? request.userId : this.userService.userid;
    return {
      params: {},
      request: request
    };
  }

  public updateProfile(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_USER_PROFILE,
      data: data
    };
    return this.learnerService.patch(options).pipe(map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, this.configService.appConfig.timeOutConfig.setTime);
        return res;
      }
    ));
  }

  public getUserLocation(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.LOCATION_SEARCH,
      data: data
    };
    return this.learnerService.post(options);
  }
}
