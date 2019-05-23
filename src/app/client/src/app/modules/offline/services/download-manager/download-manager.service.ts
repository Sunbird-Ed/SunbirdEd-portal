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

  getDownloadList() {
    return this.http.get('https://demo5889147.mockable.io/api/v1/download');

    // const downloadOptions = {
    // url: this.configService.urlConFig.URLS.OFFLINE_DOWNLOAD.LIST,
    //   data: {}
    // };
    // return this.publicDataService.post(downloadOptions);
  }

  startDownload(data) {
    const downloadOptions = {
      url: this.configService.urlConFig.URLS.OFFLINE_DOWNLOAD.ADD,
      data: data
    };
    return this.publicDataService.post(downloadOptions);
  }
}

