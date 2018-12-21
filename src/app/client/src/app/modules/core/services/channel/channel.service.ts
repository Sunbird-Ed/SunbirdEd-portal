import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { PublicDataService } from './../public-data/public-data.service';
@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private configService: ConfigService, private publicDataService: PublicDataService) { }
  getFrameWork(hashTagId) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.CHANNEL.READ + '/' + hashTagId
    };
    return this.publicDataService.get(channelOptions);
  }
}
