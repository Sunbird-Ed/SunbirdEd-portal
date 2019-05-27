import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService {

  downloadContentId: string;
  downloadEvent = new EventEmitter();

  constructor(private configService: ConfigService, private publicDataService: PublicDataService,
    private http: HttpClient) { }

  getDownloadList() {
    const downloadListOptions = {
      url: this.configService.urlConFig.URLS.OFFLINE.DOWNLOAD_LIST,
      data: {}
    };
    return this.publicDataService.post(downloadListOptions);
  }

  startDownload(data) {
    this.downloadEvent.emit('Download started');
    const downloadOptions = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.DOWNLOAD}/${this.downloadContentId}`,
      data: data
    };
    return this.publicDataService.post(downloadOptions);
  }

  exportContent(contentId) {
    const exportOptions = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.EXPORT}/${contentId}`
    };
    return this.publicDataService.get(exportOptions);
  }
}
