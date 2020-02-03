import { Injectable } from '@angular/core';
import { PublicDataService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  constructor(public publicDataService: PublicDataService, public configService: ConfigService) { }

  getMemoryInfo() {
    const option = {
      url: this.configService.urlConFig.URLS.OFFLINE.MEMORY
    };
    return this.publicDataService.get(option);
  }
}
