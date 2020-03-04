import { ElectronDialogService } from './../electron-dialog/electron-dialog.service';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class ContentManagerService {

  downloadContentId: string;
  downloadEvent = new EventEmitter();
  downloadListEvent = new EventEmitter();
  completeEvent = new EventEmitter();
  deletedContent = new EventEmitter();

  constructor(private configService: ConfigService, private publicDataService: PublicDataService,
    public toasterService: ToasterService, public resourceService: ResourceService,
    private electronDialogService: ElectronDialogService) { }

  emitAfterDeleteContent(contentData) {
    this.deletedContent.emit(contentData);
  }

  emitDownloadListEvent(downloadList) {
    this.downloadListEvent.emit(downloadList);
  }

  getContentList() {
    const downloadListOptions = {
      url: this.configService.urlConFig.URLS.OFFLINE.DOWNLOAD_LIST,
      data: {}
    };
    return this.publicDataService.post(downloadListOptions).pipe(
      map((result) => {
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
    const exportOptions: any = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.EXPORT}/${contentId}`
    };
    return this.electronDialogService.showContentExportDialog().pipe(mergeMap((response: any) => {
      if (response.destFolder) {
        exportOptions.param = {
          destFolder: response.destFolder
        };
      }
      return this.publicDataService.get(exportOptions);
    }));
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

  resumeImportContent(importId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.RESUME_IMPORT}/${importId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }

  cancelImportContent(importId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.CANCEL_IMPORT}/${importId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }

  pauseImportContent(importId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.PAUSE_IMPORT}/${importId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }

  retryImportContent(importId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.RETRY_IMPORT}/${importId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }

  resumeDownloadContent(downloadId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.RESUME_DOWNLOAD}/${downloadId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }

  cancelDownloadContent(downloadId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.CANCEL_DOWNLOAD}/${downloadId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }

  pauseDownloadContent(downloadId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.PAUSE_DOWNLOAD}/${downloadId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }

  retryDownloadContent(downloadId) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.RETRY_DOWNLOAD}/${downloadId}`,
      data: {}
    };
    return this.publicDataService.post(options);
  }
  deleteContent (request) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.DELETE_CONTENT}`,
      data: request
    };
    return this.publicDataService.post(options);
  }

}
