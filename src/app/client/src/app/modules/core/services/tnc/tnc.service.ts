import { Injectable } from '@angular/core';
import { LearnerService } from './../learner/learner.service';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class TncService {

  constructor(private learnerService: LearnerService, public configService: ConfigService) {
  }
  /**
   * Fetches terms and condition config data
   */
  getTncConfig() {
    const options = {
      url: this.configService.urlConFig.URLS.SYSTEM_SETTING.TNC_CONFIG
    };
    return this.learnerService.get(options);
  }

  getGroupsTnc() {
    const options = {
      url: this.configService.urlConFig.URLS.SYSTEM_SETTING.GROUPS_TNC
    };
    return this.learnerService.get(options);
  }

  getAdminTnc() {
    const options = {
      url: this.configService.urlConFig.URLS.SYSTEM_SETTING.ORG_ADMIN_URL
    };
    return this.learnerService.get(options);
  }
}
