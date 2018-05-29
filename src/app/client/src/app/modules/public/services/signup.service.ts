import { Injectable } from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import * as  _ from 'lodash';

@Injectable()
export class SignupService {

  constructor(private learnerService: LearnerService, public configService: ConfigService) { }
  /**
   * This method is used to format the request
   */
  private formatRequest(request) {
    if (_.get(request, 'phone')) {
      request.phoneVerified = true;
    }
    return {
      params: {},
      request: request
    };
  }
  /**
   * This method invokes learner service to add new user
   */
  signup(req) {
    const data = this.formatRequest(req);
    const options = {
      url: this.configService.urlConFig.URLS.USER.SIGNUP,
      data: data
    };
    return this.learnerService.post(options);
  }

}
