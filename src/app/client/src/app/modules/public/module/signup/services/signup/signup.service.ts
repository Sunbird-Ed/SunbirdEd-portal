import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private learnerService: LearnerService, public configService: ConfigService,
              private http: HttpClient) {
  }

  generateOTP(data) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.GENERATE,
      data: data
    };
    return this.learnerService.post(options);
  }

  generateOTPforAnonymousUser(data, captchaResponse) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.ANONYMOUS.GENERATE + '?captchaResponse=' + captchaResponse,
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
      url: this.configService.urlConFig.URLS.USER.GET_USER_BY_KEY + '/' + data,
    };
    return this.learnerService.get(options);
  }

  checkUserExists(data) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.CHECK_USER_EXISTS + '/' + data,
    };
    return this.learnerService.get(options);
  }

  createUser(data) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.CREATE_V2,
      data: data
    };
    return this.learnerService.post(options);
  }

  /**
   * Accepts Terms and conditions and generate token of user
   * @param data
   */
  acceptTermsAndConditions(data) {
    const url = this.configService.urlConFig.URLS.USER.TNC_ACCEPT_LOGIN;
    return this.http.post(url, data);
  }

  createUserV3(data) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.SIGN_UP_V1,
      data: data
    };
    return this.learnerService.post(options);
  }
}
