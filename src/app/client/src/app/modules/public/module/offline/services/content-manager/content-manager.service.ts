import { ElectronDialogService } from '../electron-dialog/electron-dialog.service';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { throwError as observableThrowError, BehaviorSubject } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { SystemInfoService } from '../system-info/system-info.service';
import { ActivatedRoute } from '@angular/router';
import { TelemetryService, IErrorEventInput } from '@sunbird/telemetry';

@Injectable({
  providedIn: 'root'
})
export class ContentManagerService {

  downloadContentId: string;
  downloadContentData: any = {};
  failedContentName: string;
  downloadEvent = new EventEmitter();
  downloadFailEvent = new EventEmitter<any>();
  downloadListEvent = new EventEmitter();
  completeEvent = new EventEmitter();
  deletedContent = new EventEmitter();
  contentDownloadStatus$ = new BehaviorSubject<any>({});
  contentDownloadStatus = {};
  deletedContentIds = [];
  constructor(private configService: ConfigService, private publicDataService: PublicDataService,
    public toasterService: ToasterService, public resourceService: ResourceService,
    public electronDialogService: ElectronDialogService,
    public systemInfoService: SystemInfoService,
    public activatedRoute: ActivatedRoute,
    private telemetryService: TelemetryService
  ) { }

  updateContentDownloadStatus(contentDownloadList) {
    this.contentDownloadStatus = {};
    _.forEach(contentDownloadList, content => {
      if (content.addedUsing === 'download') {
        _.forEach(content.contentDownloadList, childContent => {
          if (childContent.step === 'COMPLETE') {
            this.contentDownloadStatus[childContent.identifier] = _.includes(this.deletedContentIds, childContent.identifier) ?
            'DOWNLOAD' : 'DOWNLOADED';
          } else {
            this.contentDownloadStatus[childContent.identifier] = _.toUpper(content.status);
          }
        });
        this.contentDownloadStatus[content.contentId] = _.toUpper(content.status);
      }
    });
    this.contentDownloadStatus$.next(this.contentDownloadStatus);
  }

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
      map((respData: any) => {
        respData.result.response.contents = _.filter(_.get(respData, 'result.response.contents'), (o) => {
          return !_.includes(this.deletedContentIds, o.contentId);
        });
        this.updateContentDownloadStatus(respData.result.response.contents);
        return respData;
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
      tap((respData) => {
        this.deletedContentIds = _.remove(this.deletedContentIds, (n) => {
          return !_.includes(_.get(respData, 'result.contentsToBeDownloaded'), n);
        });
        this.toasterService.info(this.resourceService.messages.smsg.m0053);
        this.downloadEvent.emit('Download started');
      }),
      catchError(async (err: any) => {
        this.logErrorTelemetry(err);
        /* istanbul ignore else */
        if (_.get(err, 'error.params.err') === 'LOW_DISK_SPACE') {
          const popupInfo: any = {
            failedContentName: this.failedContentName,
          };

          try {
            const response = await this.getSuggestedDrive(popupInfo);
            this.downloadFailEvent.emit(response);
          } catch (error) {
            this.downloadFailEvent.emit(popupInfo);
          }
        }
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
  deleteContent(request) {
    const options = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.DELETE_CONTENT}`,
      data: request
    };
    return this.publicDataService.post(options).pipe(
      tap((data) => {
        this.deletedContentIds = _.uniq(_.concat(this.deletedContentIds, _.get(data, 'result.deleted')));
        this.deletedContent.emit(this.deletedContentIds);
      }));
  }

  changeContentLocation(request) {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.CHANGE_CONTENT_LOCATION,
      data: request
    };

    return this.publicDataService.post(options);
  }

  public async getSuggestedDrive(popupInfo: any) {
    try {
      const info = await this.systemInfoService.getSystemInfo().toPromise();
      // Check if the system is Windows and it has multiple drives
      /* istanbul ignore else */
      if (_.get(info, 'result.platform') === 'win32' && _.get(info, 'result.drives.length') !== 1) {
        const getAvailableSpace = (drive: any) => drive.size - drive.used;
        const suggestedDrive = info.result.drives.reduce((prev, current) => {
          return (getAvailableSpace(prev) > getAvailableSpace(current)) ? prev : current;
        });

        /* istanbul ignore else */
        if (suggestedDrive) {
          popupInfo.isWindows = true;
          popupInfo.drives = info.result.drives.map((item) => {
            return {
              label: item.fs,
              name: item.fs,
              isRecommended: item.fs === suggestedDrive.fs,
              isCurrentContentLocation: info.result.contentBasePath.startsWith(item.fs)
            };
          });

          popupInfo.drives.forEach(element => {
            if (element.isCurrentContentLocation) {
              element.label = `${element.name}&nbsp;&nbsp;(${this.resourceService.frmelmnts.lbl.currentLocation})`;
            } else if (element.isRecommended) {
              element.label = `${element.name}&nbsp;&nbsp;(${this.resourceService.frmelmnts.lbl.recommended})`;
            } else {
              element.label = element.name;
            }
          });
        }
      }
      return popupInfo;
    } catch (error) {
      console.error('Error while fetching system Info', error);
      return error;
    }
  }

  logErrorTelemetry(error) {
    const input: IErrorEventInput = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
        _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
        _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env')
      },
      object: {
        id: this.downloadContentId,
        type: this.downloadContentData.contentType,
        ver: `${this.downloadContentData.pkgVersion}`
      },
      edata: {
        err: _.get(error, 'error.params.err'),
        errtype: _.get(error, 'error.responseCode'),
        stacktrace: JSON.stringify(error)
      }
    };

    this.telemetryService.error(input);
  }

}
