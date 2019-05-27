import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService {

  downloadContentId: string;
  downloadEvent = new EventEmitter();

  constructor(private configService: ConfigService, private publicDataService: PublicDataService,
    public toasterService: ToasterService, public resourceService: ResourceService) { }

  getDownloadList() {
    const downloadListOptions = {
      url: this.configService.urlConFig.URLS.OFFLINE.DOWNLOAD_LIST,
      data: {}
    };
    return this.publicDataService.post(downloadListOptions);
  }

  startDownload(data) {
    this.toasterService.info(this.resourceService.messages.smsg.m0053);
    const downloadOptions = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.DOWNLOAD}/${this.downloadContentId}`,
      data: data
    };
    return this.publicDataService.post(downloadOptions).pipe(
      map((result) => {
        this.downloadEvent.emit('Download started');
        return result;
      }),
      catchError((err) => {
        return observableThrowError(err);
      }));
  }

  exportContent(contentId) {
    const exportOptions = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.EXPORT}/${contentId}`
    };
    return this.publicDataService.get(exportOptions);
  }
}
