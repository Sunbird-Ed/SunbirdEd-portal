import { Injectable } from '@angular/core';
import { LearnerService } from './../learner/learner.service';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private learnerService: LearnerService, public configService: ConfigService) { }

  generateOTP(data) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.GENERATE,
      data: data
    };
    return this.learnerService.post(options);
  }

  generateAnonymousOTP(data) {
    const options = {
      url: this.configService.urlConFig.URLS.OTP.ANONYMOUS.GENERATE_USERDELETE,
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
}
