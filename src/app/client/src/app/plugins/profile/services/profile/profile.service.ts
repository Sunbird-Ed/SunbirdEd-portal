import { Injectable } from '@angular/core';
import { UserService, PermissionService, LearnerService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ServerResponse } from '@sunbird/shared';
import { ILogEventInput } from '@sunbird/telemetry';
@Injectable()
export class ProfileService {
  constructor(private learnerService: LearnerService,
    public userService: UserService, public configService: ConfigService) { }
  /**
   * This method is used to update profile picture of the user
   */
  public updateAvatar(file, logEvent: ILogEventInput) {
    return this.uploadMedia(file, logEvent).flatMap(results => {
      const req = {
        avatar: results.result.url
      };
      return this.updateProfile(req, logEvent);
    });
  }
  /**
   * This method invokes learner service to update user profile
   */
  public updateProfile(request, logEvent: ILogEventInput) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_USER_PROFILE,
      data: data
    };
    return this.learnerService.patch(options, logEvent).map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, this.configService.appConfig.timeOutConfig.setTime);
        return res;
      }
    );
  }
  /**
   * This method is used to update user profile visibility
   */
  updateProfileFieldVisibility(request, logEvent: ILogEventInput) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_PROF_VIS_FIELDS,
      data: data
    };
    return this.learnerService.post(options, logEvent);
  }
  /**
   * This method invokes learner service to upload user profile picture
   */
  public uploadMedia(file, logEvent: ILogEventInput) {
    const options = {
      url: this.configService.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,
      data: file,
    };
    return this.learnerService.post(options, logEvent);
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
  public add(request, logEvent: ILogEventInput) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.ADD_SKILLS,
      data: data
    };
    return this.learnerService.post(options, logEvent).map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, this.configService.appConfig.timeOutConfig.setTime);
        return res;
      });
  }
  /**
   * This method invokes learner service to get user respective skills
   */
  public getSkills(logEvent: ILogEventInput) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.SKILLS
    };
    return this.learnerService.get(options, logEvent);
  }
}
