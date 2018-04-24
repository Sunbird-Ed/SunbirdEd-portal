import { Injectable } from '@angular/core';
import { UserService, PermissionService, LearnerService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ServerResponse } from '@sunbird/shared';
@Injectable()
export class ProfileService {
  constructor(private learnerService: LearnerService,
    public userService: UserService, public configService: ConfigService) { }

  public updateAvatar(file) {
    return this.uploadMedia(file).flatMap(results => {
      const req = {
        avatar: results.result.url
      };
      return this.updateProfile(req);
    });
  }
  public updateProfile(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_USER_PROFILE,
      data: data
    };
    return this.learnerService.patch(options).map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, 1000);
        return res;
      }
    );
  }
  updateProfileFieldVisibility(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_PROF_VIS_FIELDS,
      data: data
    };
    return this.learnerService.post(options);
  }
  public uploadMedia(file) {
    const options = {
      url: this.configService.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,
      data: file,
    };
    return this.learnerService.post(options);
  }
  private formatRequest(request) {
    request.userId = this.userService.userid;
    return {
      params: {},
      request: request
    };
  }
  public add(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.ADD_SKILLS,
      data: data
    };
    return this.learnerService.post(options).map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, 1000);
        return res;
      });
  }
  public getSkills() {
    const options = {
      url: this.configService.urlConFig.URLS.USER.SKILLS
    };
    return this.learnerService.get(options);
  }
}
