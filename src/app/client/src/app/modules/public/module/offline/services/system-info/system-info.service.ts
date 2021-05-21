import { Injectable } from '@angular/core';
import { PublicDataService } from '../../../../../core/services/public-data/public-data.service';
import { ConfigService } from '../../../../../shared/services/config/config.service';

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
