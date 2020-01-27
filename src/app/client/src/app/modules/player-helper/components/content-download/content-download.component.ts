import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { takeUntil, first, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { PublicPlayerService } from '@sunbird/public';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ICard, UtilService, ToasterService, ContentData, OfflineCardService, ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-download',
  templateUrl: './content-download.component.html',
  styleUrls: ['./content-download.component.scss']
})
export class ContentDownloadComponent implements OnInit, OnDestroy {

  @Input() contentData: ContentData;
  @Output() clickEvent = new EventEmitter<any>();
  public unsubscribe$ = new Subject<void>();
  currentRoute: string;
  public telemetryInteractObject: IInteractEventObject;
  public downloadContentInteractEdata: IInteractEventEdata;
  public cancelDownloadYoutubeContentEdata: IInteractEventEdata;
  public updateContentInteractEdata: IInteractEventEdata;
  showModal: Boolean = false;
  @Input() collectionId;
  updateLabel: string;
  isConnected = navigator.onLine;
  showUpdateModal: Boolean = false;
  isUpdated: Boolean = false;
  showUpdate: Boolean = false;
  showUpdated = false;
  message;
  constructor(public resourceService: ResourceService, public utilService: UtilService,
    public router: Router,  public contentManagerService: ContentManagerService,
    public toasterService: ToasterService, public playerService: PublicPlayerService,
    public activatedRoute: ActivatedRoute, public offlineCardService: OfflineCardService,
    private connectionService: ConnectionService, public configService: ConfigService ) { }

  ngOnInit() {
    this.currentRoute = _.includes(this.router.url, 'browse') ? 'browse' : 'library';
    this.setTelemetryData();

    this.contentManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.checkDownloadStatus(data);
    });

    if (!_.isEmpty(this.collectionId)) {
      this.checkContentIsUpdated(this.contentData);
    }

    this.checkOnlineStatus();
    this.checkForUpdate(this.contentData);

  }

  setTelemetryData() {

    this.telemetryInteractObject = {
      id: this.contentData['identifier'],
      type: this.contentData['contentType'],
      ver: this.contentData['pkgVersion'] || '1.0'
    };

    this.downloadContentInteractEdata = {
      id: this.contentData['mimeType'] !== 'application/vnd.ekstep.content-collection' ? 'download-content' : 'download-collection',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };

    this.cancelDownloadYoutubeContentEdata = {
      id: 'cancel-download-content',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };

    this.updateContentInteractEdata = {
      id: 'update-content',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };

  }

  startDownload(content) {
    this.showUpdate = false;
    this.contentManagerService.downloadContentId = content.identifier;
    this.contentManagerService.startDownload({}).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, error => {
      this.contentManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      this.toasterService.error(this.resourceService.messages.fmsg.m0090);
    });
  }

  checkStatus(status) {
  return this.utilService.getPlayerDownloadStatus(status, this.contentData, this.currentRoute);
  }

  checkDownloadStatus(downloadListdata) {
  this.contentData = this.playerService.updateDownloadStatus(downloadListdata, this.contentData);
  if (this.contentData ['downloadStatus'] === this.resourceService.messages.stmsg.m0139 && this.showUpdate) {
    this.toasterService.success('Update Successful');
  }
  }

  download(content) {
    this.showModal = this.offlineCardService.isYoutubeContent(content);
    if (!this.showModal) {
      this.startDownload(content);
    } else {
      this.message = content.mimeType !== 'application/vnd.ekstep.content-collection' ? this.resourceService.messages.stmsg.m0141 :
      this.resourceService.messages.stmsg.m0137;
    }
  }

  checkUpdateStatus(status) {
   return this.utilService.getPlayerUpdateStatus(status, this.contentData, this.currentRoute, this.showUpdate);
  }

  assignLabel() {
    this.updateLabel = this.contentData['mimeType'] !== 'application/vnd.ekstep.content-collection' ?
      this.resourceService.frmelmnts.lbl.updatecontent : this.resourceService.frmelmnts.lbl.updatecollection;
  }

  checkOnlineStatus() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (!this.isConnected) {
        this.checkForUpdate(this.contentData);
      }
    });
  }

  checkForUpdate(contentData) {
    this.showUpdate = _.get(contentData, 'desktopAppMetadata.updateAvailable') && this.currentRoute === 'library';
    this.assignLabel();
  }

  updateContent(content) {
    const request = {
      contentId: content.identifier,
      parentId: this.collectionId
    };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, err => {
      const errorMessage = !this.isConnected ? _.replace(this.resourceService.messages.smsg.m0056, '{contentName}', content.name) :
                                              this.resourceService.messages.fmsg.m0096;
      this.toasterService.error(errorMessage);
    });
  }

  checkContentIsUpdated(content) {
    const params = {params: this.configService.appConfig.PublicPlayer.contentApiQueryParams};
    this.playerService.getContent(content.identifier, params).pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {
      this.contentData = _.get(response, 'result.content');
      this.checkForUpdate(this.contentData);
    }, (err) => {
      console.log(`Error: ${err}`);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
