import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService {

  downloadContentId: string;
  downloadEvent = new EventEmitter();
  downloadListEvent = new EventEmitter();

  constructor(private configService: ConfigService, private publicDataService: PublicDataService,
    public toasterService: ToasterService, public resourceService: ResourceService) { }

  getDownloadList() {
    const downloadListOptions = {
      url: this.configService.urlConFig.URLS.OFFLINE.DOWNLOAD_LIST,
      data: {}
    };
    return this.publicDataService.post(downloadListOptions).pipe(
      map((result) => {
        this.downloadListEvent.emit(result);
        return result;
      }),
      catchError((err) => {
        return observableThrowError(err);
      }));
  }

  startDownload(data) {
    const downloadOptions = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.DOWNLOAD}/${this.downloadContentId}`,
      data: data
    };
    return this.publicDataService.post(downloadOptions).pipe(
      map((result) => {
        this.toasterService.info(this.resourceService.messages.smsg.m0053);
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

  updateContent(data) {
    const requestParams = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.UPDATE}/${data.contentId}`,
      data: {
        request: {
          parentId:  _.get(data, 'parentId')
        }
      }
    };
  return this.publicDataService.post(requestParams).pipe(
    map((result) => {
      this.toasterService.info(this.resourceService.messages.smsg.m0055);
      this.downloadEvent.emit('updateStarted');
      return result;
    }),
    catchError((err) => {
      return observableThrowError(err);
    }));
  }

}
