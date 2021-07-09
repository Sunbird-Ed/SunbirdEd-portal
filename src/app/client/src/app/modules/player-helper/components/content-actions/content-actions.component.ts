import { TelemetryService } from '@sunbird/telemetry';
import { actionButtons } from './actionButtons';
import { fullScreenActionButtons } from './actionButtons';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, ContentUtilsServiceService, ITelemetryShare, NavigationHelperService, OfflineCardService,
  UtilService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ContentManagerService } from '../../../public/module/offline/services';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-content-actions',
  templateUrl: './content-actions.component.html',
  styleUrls: ['./content-actions.component.scss']
})
export class ContentActionsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contentData;
  @Input() isFullScreen = false;
  @Output() contentDownloaded = new EventEmitter();
  actionButtons = actionButtons;
  fullScreenActionButtons = fullScreenActionButtons;
  contentRatingModal = false;
  contentId;
  collectionId;
  showExportLoader = false;
  showModal = false;
  showDeleteModal = false;
  public isConnected;
  public unsubscribe$ = new Subject<void>();
  telemetryShareData: Array<ITelemetryShare>;
  @Input() objectRollUp: {} = {};
  contentDownloadStatus = {};
  showDownloadLoader = false;
  deleteContentIds = [];
  sharelinkModal = false;
  shareLink: string;
  mimeType: string;
  subscription;
  isDesktopApp;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public contentUtilsServiceService: ContentUtilsServiceService,
    private telemetryService: TelemetryService,
    private navigationHelperService: NavigationHelperService,
    private deviceDetectorService: DeviceDetectorService,
    public contentManagerService: ContentManagerService,
    public offlineCardService: OfflineCardService,
    public utilService: UtilService,
  ) { }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    // Replacing cbse/ncert value with cbse
    if (_.toLower(_.get(this.contentData, 'board')) === 'cbse') {
      this.contentData.board = 'CBSE/NCERT';
    }
    const isVideoMimetype = _.includes(["video/mp4","video/webm"], _.get(this.contentData, 'mimeType'));
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params.collectionId;
    });
    this.actionButtons = _.cloneDeep(actionButtons);
    this.fullScreenActionButtons = _.cloneDeep(fullScreenActionButtons);
    _.find(this.actionButtons, (button) => {
      button.disabled = (button.label === 'Fullscreen') ? (isVideoMimetype || this.deviceDetectorService.isMobile() ||
        this.deviceDetectorService.isTablet()) : button.disabled;
    });
    this.collectionId = _.get(this.activatedRoute, 'snapshot.params.collectionId');
    this.mimeType = _.get(this.contentData, 'mimeType');
    this.contentPrintable();
    this.subscription = this.contentUtilsServiceService.contentShareEvent.subscribe((data) => {
      if (data === 'open') {
        this.shareContent(this.contentData);
      }
    });
    if(this.isDesktopApp) {
      this.contentManagerService.contentDownloadStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe( contentDownloadStatus => {
        this.contentDownloadStatus = contentDownloadStatus;
        this.changeContentStatus();
      });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes.contentData);
    this.contentPrintable();
    if (this.isDesktopApp && !_.get(changes, 'contentData.firstChange')) {
      this.contentData = _.get(changes, 'contentData.currentValue');
        this.contentManagerService.contentDownloadStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe( contentDownloadStatus => {
          this.contentDownloadStatus = contentDownloadStatus;
          if (this.contentData &&
            (contentDownloadStatus[this.contentData.identifier] === 'COMPLETED' ||
            contentDownloadStatus[this.contentData.identifier] === 'DOWNLOADED'
            ) && this.router.url.includes('mydownloads')) {
            this.contentDownloaded.emit(this.contentData);
          }
          this.changeContentStatus();
        });
    }
  }
  onActionButtonClick(event, content) {
      switch (event.data.name.toUpperCase()) {
        case 'RATE':
          this.contentRatingModal = true;
          this.logTelemetry('rate-content', content);
          break;
        case 'SHARE':
          if(this.isDesktopApp) {
            this.exportContent(content);
          } else {
            this.shareContent(content);
          }
          break;
        case 'UPDATE':
          this.updateContent(content);
          this.logTelemetry('update-content', content);
          break;
        case 'DOWNLOAD':
          this.isYoutubeContentPresent(content);
          const id = content.mimeType === 'application/vnd.ekstep.content-collection' ? 'download-collection' : 'download-content';
          this.logTelemetry(id, content);
          break;
        case 'DELETE':
          this.showDeleteModal = true;
          this.logTelemetry('confirm-delete-content', content);
          break;
        case 'PRINT':
          this.printPdf(content);
          this.logTelemetry('print-content', content);
          break;
        case 'FULLSCREEN':
          this.navigationHelperService.emitFullScreenEvent(true);
          this.logTelemetry('fullscreen-content', content);
          break;
        case 'MINIMIZE':
          this.navigationHelperService.emitFullScreenEvent(false);
          this.logTelemetry('minimize-screen-content', content);
          break;
      }
  }

  shareContent(content) {
    this.sharelinkModal = true;
          const param = {
            identifier: _.get(content, 'identifier'),
            type: _.get(content, 'contentType'),
          };
          this.setTelemetryShareData(param);
          this.shareLink = this.collectionId && _.get(content, 'identifier') ?
            this.contentUtilsServiceService.getPublicShareUrl(_.get(content, 'identifier'), _.get(content, 'mimeType'), this.collectionId) :
            this.contentUtilsServiceService.getPublicShareUrl(_.get(content, 'identifier'), _.get(content, 'mimeType'));
          this.logTelemetry('share-content', content);
  }

  printPdf(content: any) {
    const pdfUrl = _.get(content, 'itemSetPreviewUrl');
    window.open(pdfUrl, '_blank');
  }
    setTelemetryShareData(param) {
      this.telemetryShareData = [{
        id: param.identifier,
        type: param.contentType,
        ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
      }];
    }

    logTelemetry(id, content) {
      const interactData = {
        context: {
          env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
          cdata: []
        },
        edata: {
          id: id,
          type: 'click',
          pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'play-content',
        },
        object: {
          id: content['identifier'],
          type: content['contentType'],
          ver: `${content['pkgVersion']}`,
          rollup: this.objectRollUp,
        }
      };
      this.telemetryService.interact(interactData);
    }
  contentPrintable() {
    // selectedContent?.model?.itemSetPreviewUrl
   // console.log('------>', this.contentData);
    _.forEach(this.actionButtons, data => {
      if (data.name === 'print') {
        if (this.contentData.itemSetPreviewUrl) {
          data.disabled = false;
        } else {
          data.disable = true;
        }
      }
    });
    _.forEach(this.fullScreenActionButtons, data => {
      if (data.name === 'print') {
        if (this.contentData.itemSetPreviewUrl) {
          data.disabled = false;
        } else {
          data.disable = true;
        }
      }
    });
  }

    ngOnDestroy() {
      if (this.subscription.unsubscribe) {
        this.subscription.unsubscribe();
      }
    }

  changeContentStatus() {
    const status = {
      DOWNLOADING: this.resourceService.messages.stmsg.m0140,
      FAILED: this.resourceService.messages.stmsg.m0143,
      DOWNLOADED: this.resourceService.messages.stmsg.m0139,
      PAUSED: this.resourceService.messages.stmsg.m0142,
      CANCELED: this.resourceService.messages.stmsg.m0143,
      COMPLETED: this.resourceService.messages.stmsg.m0139,
      INPROGRESS: this.resourceService.messages.stmsg.m0140,
      RESUME: this.resourceService.messages.stmsg.m0140,
      INQUEUE: this.resourceService.messages.stmsg.m0140
    };

    _.forEach(this.actionButtons, data => {
      const disableButton = ['Download', 'Failed', 'Canceled', 'Cancel'];
      if (data.name === 'download') {
        const contentStatus = status[this.contentDownloadStatus[this.contentData.identifier]];
        if (this.contentData) {
        data.label = contentStatus ? _.capitalize(contentStatus) : this.isAvailable() ? 'Downloaded' : 'Download';
        } else {
          data.label = 'Download';
        }
        data.disabled = _.get(this.contentData, 'downloadUrl') ?  !_.includes(disableButton, data.label) : true;
      } else if (data.name === 'update') {
        data.label = _.capitalize(data.name);
        data.disabled =
        !(_.has(this.contentData, 'desktopAppMetadata') && _.get(this.contentData, 'desktopAppMetadata.updateAvailable'));
      } else if ( data.name === 'fullscreen') {
        data.disabled = false;
        data.label = 'Full screen';
      } else if ( !['rate', 'print'].includes(data.name)) {
        const downloaded = _.find(this.actionButtons, {name: 'download'});
        data.label = _.capitalize(data.name);
        data.disabled = !_.isEqual(downloaded.label, 'Downloaded');
      }
    });
  }

  isAvailable() {
    return (_.has(this.contentData, 'desktopAppMetadata') ? (!_.has(this.contentData, 'desktopAppMetadata.isAvailable')
    || _.get(this.contentData, 'desktopAppMetadata.isAvailable')) : false);
  }

  isYoutubeContentPresent(content) {
    this.showModal = this.offlineCardService.isYoutubeContent(content);
    if (!this.showModal) {
      this.downloadContent(content);
    }
  }

  downloadContent(content) {
    this.showDownloadLoader = true;
    this.contentData['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.contentManagerService.downloadContentId = content.identifier;
    this.contentManagerService.downloadContentData = content;
    this.contentManagerService.failedContentName = content.name;
    this.contentManagerService.startDownload({}).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      this.contentManagerService.downloadContentData = {};
      this.showDownloadLoader = false;
      this.contentData['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, (error) => {
      this.showDownloadLoader = false;
      this.contentManagerService.downloadContentId = '';
      this.contentManagerService.downloadContentData = {};
      this.contentManagerService.failedContentName = '';
      this.contentData['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
        this.toasterService.error(this.resourceService.messages.fmsg.m0090);
          }
    });

  }

  updateContent(content) {
    this.contentData.desktopAppMetadata['updateAvailable'] = false;
    const request = !_.isEmpty(this.collectionId) ? { contentId: content.identifier, parentId: this.collectionId } :
      { contentId: content.identifier };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
    }, (err) => {
      this.contentData.desktopAppMetadata['updateAvailable'] = true;
      const errorMessage = !this.isConnected ? _.replace(this.resourceService.messages.smsg.m0056, '{contentName}',
        content.name) :
        this.resourceService.messages.fmsg.m0096;
      this.toasterService.error(errorMessage);
    });
  }

  exportContent(content) {
    this.showExportLoader = true;
    this.contentManagerService.exportContent(content.identifier)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.showExportLoader = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0059);
      }, error => {
        this.showExportLoader = false;
        if (_.get(error, 'error.responseCode') !== 'NO_DEST_FOLDER') {
          this.toasterService.error(this.resourceService.messages.fmsg.m0091);
        }
      });
  }
  
  deleteContent(content) {
    const button = _.find(this.actionButtons, {label: 'Delete'});
    button.disabled = true;
    this.logTelemetry('delete-content', content);
    const request = !_.isEmpty(this.collectionId) ? {request: {contents: [content.identifier], visibility: 'Parent'}} :
      {request: {contents: [content.identifier]}};
    this.contentManagerService.deleteContent(request).subscribe(data => {
    if (!_.isEmpty(_.get(data, 'result.deleted'))) {
      this.contentData['desktopAppMetadata.isAvailable'] = false;
      this.toasterService.success(this.resourceService.messages.stmsg.desktop.deleteContentSuccessMessage);
    } else {
      this.toasterService.error(this.resourceService.messages.etmsg.desktop.deleteContentErrorMessage);
    }
    }, err => {
      this.toasterService.error(this.resourceService.messages.etmsg.desktop.deleteContentErrorMessage);
    });
  }

}
