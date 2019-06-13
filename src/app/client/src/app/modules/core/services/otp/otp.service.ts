import { Injectable } from '@angular/core';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

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
}
