import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService {

  constructor(private configService: ConfigService, private publicDataService: PublicDataService,
    private http: HttpClient) { }

  getDownloadList(contentId) {
    return this.http.get('https://demo5889147.mockable.io/api/v1/download');

    // const downloadOptions = {
    //   url: this.configService.urlConFig.URLS.CHANNEL.READ,
    //   data: {}
    // };
    // return this.publicDataService.post(downloadOptions);
  }
}

