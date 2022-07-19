import { ConfigService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { TenantService, LearnerService } from '@sunbird/core';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecoverAccountService {

  tenantInfo: any;
  fuzzySearchResults: Array<any> = [];
  selectedAccountIdentifier: any = {};
  otpVerified = true;
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
  fuzzyUserSearch(data: any, captchaResponse?: string) {
    const options = {
      url: this.configService.urlConFig.URLS.ACCOUNT_RECOVERY.FUZZY_SEARCH + '?captchaResponse=' + captchaResponse,
      data: {
        request: {
          filters: {
            'isDeleted' : 'false',
            fuzzy: {
              firstName: data.name
            }
          }
        }
      }
    };
    if (this.getIdentifierType(data.identifier) === 'phone') {
      options.data.request.filters['$or'] = {
        phone: data.identifier,
        prevUsedPhone: data.identifier
      };
    } else {
      options.data.request.filters['$or'] = {
        email: data.identifier,
        prevUsedEmail: data.identifier
      };
    }
    return this.learnerService.post(options);
  }
  getIdentifierType(value) {
    value = Number(value);
    const phoneRegX = new RegExp(/^[6-9]\d{9}$/);
    if (phoneRegX.test(value)) {
      return 'phone';
    } else {
      return 'email';
    }
  }
  resetPassword(data: any) {
    const options = {
      url: this.configService.urlConFig.URLS.ACCOUNT_RECOVERY.RESET_PASSWORD,
      data: data
    };
    return this.learnerService.post(options);
  }
  generateOTP(data, captchaResponse?) {
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
}
