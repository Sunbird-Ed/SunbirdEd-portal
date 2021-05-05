import { Injectable } from '@angular/core';
import { PublicDataService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class SystemInfoService {

  constructor(public publicDataService: PublicDataService, public configService: ConfigService) { }

  getSystemInfo() {
    const option = {
      url: this.configService.urlConFig.URLS.OFFLINE.SYSTEM_INFO
    };
    return this.publicDataService.get(option);
  }
}
