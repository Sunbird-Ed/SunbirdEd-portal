import { Injectable } from '@angular/core';
import { PublicDataService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private publicDataService: PublicDataService, public configService: ConfigService) { }

  generateOTP(data) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.GENERATE,
      data: data
    };
    return this.publicDataService.post(options);
  }

  verifyOTP(data) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.VERIFY,
      data: data
    };
    return this.publicDataService.post(options);
  }

  getUserByKey(data) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.GET_USER_BY_KEY + '/' + data,
    };
    return this.publicDataService.get(options);
  }

  createUser(data) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.CREATE_V2,
      data: data
    };
    return this.publicDataService.post(options);
  }
}
