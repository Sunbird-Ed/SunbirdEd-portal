
import {mergeMap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService, PermissionService, LearnerService, FormService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ServerResponse } from '@sunbird/shared';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private learnerService: LearnerService,
    public userService: UserService, public configService: ConfigService, public formService: FormService) { }
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
   * This method call portal backend API and invokes learner service to update user profile with private url
   */
  public updatePrivateProfile(request) {
    const data = this.formatRequest(request);
    const options = {
      url: 'portal/user/v1/update',
      data: data
    };
    return this.learnerService.patch(options);
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
   * This method is used to format the request
   */
  private formatRequest(request) {
    request.userId = request.userId ? request.userId : this.userService.userid;
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
      url: this.configService.urlConFig.URLS.USER.UPDATE_SKILLS,
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

  public getUserLocation(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.LOCATION_SEARCH,
      data: data
    };
    return this.learnerService.post(options);
  }

  public downloadCertificates(request) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.DOWNLOAD_CERTIFICATE,
      data: request,
    };
    return this.learnerService.post(options);
  }
  /**
   * This method invokes learner service to create/update user self declaration
   */
  public declarations(request) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.USER_DECLARATION,
      data: {
        params: {},
        request: request
      }
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

  getPersonas(orgId?: string) {
    const formServiceInputParams = {
      formType: 'user',
      formAction: 'list',
      contentType: 'personas',
      component: 'portal'
    };
    return this.formService.getFormConfig(formServiceInputParams, orgId).pipe(map((response) => {
      return response;
    }));
  }

  getPersonaTenantForm(orgId?: string) {
    const formServiceInputParams = {
      formType: 'user',
      formAction: 'get',
      contentType: 'tenantPersonaInfo',
      component: 'portal'
    };
    return this.formService.getFormConfig(formServiceInputParams, orgId).pipe(map((response) => {
      return response;
    }));
  }

  getSelfDeclarationForm(orgId?: string) {
    const formServiceInputParams = {
      formType: 'user',
      formAction: 'submit',
      contentType: 'selfDeclaration',
      component: 'portal'
    };
    return this.formService.getFormConfig(formServiceInputParams, orgId).pipe(map((response) => {
      return response;
    }));
  }
}
