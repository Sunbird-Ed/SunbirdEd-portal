import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { PublicPlayerService } from '@sunbird/public';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { UtilService, ResourceService, ToasterService, OfflineCardService, NavigationHelperService } from '@sunbird/shared';
import { Location } from '@angular/common';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit, OnDestroy {
  @Input() collectionData;
  @Input() showUpdate;
  currentRoute: string;
  showExportLoader = false;
  showModal = false;
  showDeleteModal = false;
  public unsubscribe$ = new Subject<void>();
  public isConnected;
  telemetryImpression: IImpressionEventInput;
  dialCode: string;
  disableDelete = false;
  contentDownloadStatus = {};
  showDownloadLoader = false;
  constructor(
    public location: Location,
    public utilService: UtilService,
    public resourceService: ResourceService,
    public contentManagerService: ContentManagerService,
    private connectionService: ConnectionService,
    public toasterService: ToasterService,
    public router: Router,
    public offlineCardService: OfflineCardService,
    public playerService: PublicPlayerService,
    public activatedRoute: ActivatedRoute,
    public navigationHelperService: NavigationHelperService,
    private telemetryService: TelemetryService,
  ) { }

  ngOnInit() {
    this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
    this.currentRoute = _.includes(this.router.url, 'browse') ? 'browse' : 'My Downloads';
    this.contentManagerService.contentDownloadStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe( contentDownloadStatus => {
      this.contentDownloadStatus = contentDownloadStatus;
      this.checkDownloadStatus();
    });
    this.checkOnlineStatus();
    this.router.events
    .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
    .subscribe(x => { this.setPageExitTelemtry(); });
  }

  checkOnlineStatus() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  checkDownloadStatus() {
    if (this.collectionData) {
      const downloadStatus = ['CANCELED', 'CANCEL', 'FAILED', 'DOWNLOAD'];
      const status = this.contentDownloadStatus[this.collectionData.identifier];
      this.collectionData['downloadStatus'] = _.isEqual(downloadStatus, status) ? 'DOWNLOAD' :
      (_.includes(['INPROGRESS', 'RESUME', 'INQUEUE'], status) ? 'DOWNLOADING' : _.isEqual(status, 'COMPLETED') ? 'DOWNLOADED' : status);
    }
  }

  updateCollection(collection) {
    collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.logTelemetry('update-collection');
    const request = {
      contentId: collection.identifier
    };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
      this.showUpdate = false;
    }, (err) => {
      this.showUpdate = true;
      const errorMessage = !this.isConnected ? _.replace(this.resourceService.messages.smsg.m0056, '{contentName}', collection.name) :
        this.resourceService.messages.fmsg.m0096;
      this.toasterService.error(errorMessage);
    });
  }

  exportCollection(collection) {
    this.logTelemetry('export-collection');
    this.showExportLoader = true;
    this.contentManagerService.exportContent(collection.identifier)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.showExportLoader = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0059);
      }, error => {
        this.showExportLoader = false;
        if (_.get(error, 'error.responseCode') !== 'NO_DEST_FOLDER') {
          this.toasterService.error(this.resourceService.messages.fmsg.m0091);
        }
      });
  }

  isYoutubeContentPresent(collection) {
    this.logTelemetry('is-youtube-in-collection');
    this.showModal = this.offlineCardService.isYoutubeContent(collection);
    if (!this.showModal) {
      this.downloadCollection(collection);
    }
  }

  downloadCollection(collection) {
    this.showDownloadLoader = true;
    this.disableDelete = false;
    collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.logTelemetry('download-collection');
    this.contentManagerService.downloadContentId = collection.identifier;
    this.contentManagerService.failedContentName = collection.name;
    this.contentManagerService.startDownload({}).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      this.showDownloadLoader = false;
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, error => {
      this.disableDelete = true;
      this.showDownloadLoader = false;
      this.contentManagerService.downloadContentId = '';
      this.contentManagerService.failedContentName = '';
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
        this.toasterService.error(this.resourceService.messages.fmsg.m0090);
          }
    });
  }

  deleteCollection(collectionData) {
    this.disableDelete = true;
    this.logTelemetry('delete-collection');
    const request = {request: {contents: [collectionData.identifier]}};
    this.contentManagerService.deleteContent(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
    this.toasterService.success(this.resourceService.messages.stmsg.desktop.deleteTextbookSuccessMessage);
    collectionData['downloadStatus'] = 'DOWNLOAD';
    collectionData['desktopAppMetadata.isAvailable'] = false;
    if (!this.router.url.includes('browse')) {
      this.goBack();
    }
    }, err => {
      this.disableDelete = false;
      this.toasterService.error(this.resourceService.messages.etmsg.desktop.deleteTextbookErrorMessage);
    });
  }

  checkStatus(status) {
    this.checkDownloadStatus();
    return this.utilService.getPlayerDownloadStatus(status, this.collectionData, this.currentRoute);
  }

  isBrowse() {
    return this.router.url.includes('browse');
  }

  goBack() {
    this.logTelemetry('close-collection-player');
    this.navigationHelperService.goBack();
  }

  setPageExitTelemtry() {
    let telemetryCdata;
    if (this.dialCode) {
      telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    if (this.collectionData) {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || []
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          subtype: 'pageexit',
          duration: this.navigationHelperService.getPageLoadTime()
        },
        object: {
        id: this.collectionData['identifier'],
        type: this.collectionData['contentType'],
        ver: `${this.collectionData['pkgVersion']}` || '1.0',
      }
    };
  }
}


  logTelemetry(id) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: [],
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'play-collection',
      },
      object: {
        id: this.collectionData['identifier'],
        type: this.collectionData['contentType'],
        ver: `${this.collectionData['pkgVersion']}` || '1.0',
      }
    };
    this.telemetryService.interact(interactData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
