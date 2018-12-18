import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private learnerService: LearnerService, public configService: ConfigService) { }

  generateOTP(data) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.GENERATE,
      data: data
    };
    return this.learnerService.post(options);
  }

  verifyOTP(data) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.VERIFY,
      data: data
    };
    return this.learnerService.post(options);
  }

  getUserByKey(data) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.GET_USER_BY_KEY,
      data: data
    };
    return this.learnerService.post(options);
  }

  createUser(data) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.VTHREE_SIGNUP,
      data: data
    };
    return this.learnerService.post(options);
  }
}
