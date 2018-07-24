
import {mergeMap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService, PermissionService, LearnerService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ServerResponse } from '@sunbird/shared';
@Injectable()
export class ProfileService {
  constructor(private learnerService: LearnerService,
    public userService: UserService, public configService: ConfigService) { }
  /**
   * This method is used to update profile picture of the user
   */
  public updateAvatar(file) {
    return this.uploadMedia(file).pipe(mergeMap(results => {
      const req = {
        avatar: results.result.url
      };
      return this.updateProfile(req);
    }));
  }
  /**
   * This method invokes learner service to update user profile
   */
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
  /**
   * This method is used to update user profile visibility
   */
  updateProfileFieldVisibility(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_PROF_VIS_FIELDS,
      data: data
    };
    return this.learnerService.post(options);
  }
  /**
   * This method invokes learner service to upload user profile picture
   */
  public uploadMedia(file) {
    const options = {
      url: this.configService.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,
      data: file,
    };
    return this.learnerService.post(options);
  }
  /**
   * This method is used to format the request
   */
  private formatRequest(request) {
    request.userId = this.userService.userid;
    return {
      params: {},
      request: request
    };
  }
  /**
   * This method is used to add new skills
   */
  public add(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.ADD_SKILLS,
      data: data
    };
    return this.learnerService.post(options).pipe(map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, this.configService.appConfig.timeOutConfig.setTime);
        return res;
      }));
  }
  /**
   * This method invokes learner service to get user respective skills
   */
  public getSkills() {
    const options = {
      url: this.configService.urlConFig.URLS.USER.SKILLS
    };
    return this.learnerService.get(options);
  }
}
