import { TelemetryService } from '@sunbird/telemetry';
import { actionButtons } from './actionButtons';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, OfflineCardService, NavigationHelperService } from '@sunbird/shared';
import { PublicPlayerService } from '@sunbird/public';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject} from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-actions',
  templateUrl: './content-actions.component.html',
  styleUrls: ['./content-actions.component.scss']
})
export class ContentActionsComponent implements OnInit, OnChanges {
  @Input() contentData;
  @Input() showUpdate;
  @Output() contentDownloaded = new EventEmitter();
  actionButtons = actionButtons;
  contentRatingModal = false;
  contentId;
  collectionId;
  showExportLoader = false;
  showModal = false;
  showDeleteModal = false;
  public isConnected;
  public unsubscribe$ = new Subject<void>();
  @Input() objectRollUp: {} = {};
  contentDownloadStatus = {};
  showDownloadLoader = false;
  deleteContentIds = [];
  constructor(
    public contentManagerService: ContentManagerService,
    private playerService: PublicPlayerService,
    private connectionService: ConnectionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public offlineCardService: OfflineCardService,
    public navigationHelperService: NavigationHelperService,
    private telemetryService: TelemetryService
  ) { }

  ngOnInit() {
    this.collectionId = _.get(this.activatedRoute.snapshot.params, 'collectionId');
    this.checkOnlineStatus();
    this.contentManagerService.contentDownloadStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe( contentDownloadStatus => {
      this.contentDownloadStatus = contentDownloadStatus;
      this.changeContentStatus();
    });
  }

  checkOnlineStatus() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkOnlineStatus();
    if (!changes.contentData.firstChange) {
      this.contentData = changes.contentData.currentValue;
        this.contentManagerService.contentDownloadStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe( contentDownloadStatus => {
          this.contentDownloadStatus = contentDownloadStatus;
          if (this.contentData &&
            (contentDownloadStatus[this.contentData.identifier] === 'COMPLETED' ||
            contentDownloadStatus[this.contentData.identifier] === 'DOWNLOADED'
            ) && !this.router.url.includes('browse')) {
            this.contentDownloaded.emit(this.contentData);
          }
          this.changeContentStatus();
        });
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
        data.disabled = !_.includes(disableButton, data.label);
      } else if (data.name === 'update') {
        data.label = _.capitalize(data.name);
        data.disabled =
        !(_.has(this.contentData, 'desktopAppMetadata') && _.get(this.contentData, 'desktopAppMetadata.updateAvailable'));
      } else if (data.name !== 'rate') {
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
  isBrowse() {
    return this.router.url.includes('browse');
  }

  changeLabel(data, disabled, label) {
      data.disabled = disabled;
      data.label = _.capitalize(label);
  }

  onActionButtonClick(event, content) {
    switch (event.data.name.toUpperCase()) {
      case 'UPDATE':
        this.updateContent(content);
        this.logTelemetry('update-content', content);
        break;
      case 'DOWNLOAD':
        this.isYoutubeContentPresent(content);
        this.logTelemetry('is-youtube-content', content);
        break;
      case 'DELETE':
        this.showDeleteModal = true;
        this.logTelemetry('confirm-delete-content', content);
        break;
      case 'RATE':
        this.contentRatingModal = true;
        this.logTelemetry('rate-content', content);
        break;
      case 'SHARE':
        this.exportContent(content);
        this.logTelemetry('share-content', content);
        break;
    }
  }

  isYoutubeContentPresent(content) {
    this.showModal = this.offlineCardService.isYoutubeContent(content);
    if (!this.showModal) {
      this.downloadContent(content);
    }
  }

  downloadContent(content) {
    this.showDownloadLoader = true;
    this.logTelemetry('download-content', content);
    this.contentData['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.contentManagerService.downloadContentId = content.identifier;
    this.contentManagerService.failedContentName = content.name;
    this.contentManagerService.startDownload({}).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      this.showDownloadLoader = false;
      this.contentData['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, (error) => {
      this.showDownloadLoader = false;
      this.contentManagerService.downloadContentId = '';
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

}
