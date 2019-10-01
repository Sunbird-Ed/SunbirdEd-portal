import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { takeUntil, first, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { PublicPlayerService } from '@sunbird/public';
import { DownloadManagerService, ConnectionService } from '@sunbird/offline';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ICard, UtilService, ToasterService, ContentData, OfflineCardService } from '@sunbird/shared';
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
  private contentType: string ;
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
  constructor(public resourceService: ResourceService, public utilService: UtilService,
    public router: Router,  public downloadManagerService: DownloadManagerService,
    public toasterService: ToasterService, public playerService: PublicPlayerService,
    public activatedRoute: ActivatedRoute, public offlineCardService: OfflineCardService,
    private connectionService: ConnectionService ) { }

  ngOnInit() {
    this.currentRoute = _.includes(this.router.url, 'browse') ? 'browse' : 'library';
    this.setTelemetryData();

    this.downloadManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
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
      type: this.contentType,
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
    this.downloadManagerService.downloadContentId = content.identifier;
    this.downloadManagerService.startDownload({}).subscribe(data => {
      this.downloadManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, error => {
      this.downloadManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      this.toasterService.error(this.resourceService.messages.fmsg.m0090);
    });
  }

  checkStatus(status) {
  return this.utilService.getPlayerDownloadStatus(status, this.contentData, this.currentRoute);
  }

  checkDownloadStatus(downloadListdata) {
    return this.playerService.updateDownloadStatus(downloadListdata, this.contentData);
  }

  download(content) {
    this.showModal = this.offlineCardService.isYoutubeContent(content);
    if (!this.showModal) {
      this.startDownload(content);
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
    this.downloadManagerService.updateContent(request).subscribe(data => {
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, error => {
      if (!this.isConnected) {
        this.toasterService.error(`You should be in online to update the content ${content.name}`);
      } else {
        this.toasterService.error(`Error:  ${error}`);
      }
    });
  }

  checkContentIsUpdated(content) {
    this.downloadManagerService.getContent(content).subscribe((data) => {
      this.contentData = _.get(data, 'result.content');
      this.checkForUpdate(this.contentData);
    }, error => {
      console.log('error', error);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
