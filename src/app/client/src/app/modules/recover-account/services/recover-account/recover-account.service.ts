import { ConfigService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { TenantService, LearnerService } from '@sunbird/core';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecoverAccountService {

  tenantInfo: any;
  fuzzySearchResults: Array<any>;
  selectedAccountDetails: any;
  otpVerified = false;
  constructor(private tenantService: TenantService, public learnerService: LearnerService, public configService: ConfigService) {
    this.setTenantInfo();
  }
  private setTenantInfo() {
    this.tenantService.tenantData$.pipe(first()).subscribe(data => {
      if (!data.err) {
        this.tenantInfo = {
          logo: data.tenantData.logo,
          tenantName: data.tenantData.titleName
        };
      }
    });
  }
  fuzzyUserSearch(data: any) {
    const options = {
      url: this.configService.urlConFig.URLS.ACCOUNT_RECOVERY.FUZZY_SEARCH,
      data: data
    };
    return this.learnerService.post(options);
  }
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
}

