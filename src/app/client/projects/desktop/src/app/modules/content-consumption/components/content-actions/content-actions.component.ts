import { Location } from '@angular/common';
import { actionButtons } from './actionButtons';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, OfflineCardService, NavigationHelperService } from '@sunbird/shared';
import { PublicPlayerService } from '@sunbird/public';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { IActionButton, ActionButtonType } from '@project-sunbird/common-consumption';
import { takeUntil, mergeMap, mergeAll, map } from 'rxjs/operators';
import { Subject, combineLatest, merge, of } from 'rxjs';
import * as _ from 'lodash-es';
import { last } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-content-actions',
  templateUrl: './content-actions.component.html',
  styleUrls: ['./content-actions.component.scss']
})
export class ContentActionsComponent implements OnInit, OnChanges {
  @Input() contentData;
  @Input() showUpdate;
  @Output() deletedContent = new EventEmitter();
  actionButtons = actionButtons;
  contentRatingModal = false;
  contentId;
  collectionId;
  showExportLoader = false;
  showModal = false;
  showDeleteModal = false;
  private isConnected;
  public unsubscribe$ = new Subject<void>();

  constructor(
    private contentManagerService: ContentManagerService,
    private playerService: PublicPlayerService,
    private connectionService: ConnectionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public offlineCardService: OfflineCardService,
    public navigationHelperService: NavigationHelperService
  ) { }

  ngOnInit() {
    this.collectionId = _.get(this.activatedRoute.snapshot.params, 'collectionId');
    this.contentManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.checkDownloadStatus(data);
    });
    this.checkOnlineStatus();
  }

  checkOnlineStatus() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  checkDownloadStatus(downloadListdata) {
      this.contentData = this.playerService.updateDownloadStatus(downloadListdata, this.contentData);
      this.updateActionButton('download', _.isEqual(_.get(this.contentData, 'downloadStatus'), 'DOWNLOADED'),
      _.get(this.contentData, 'downloadStatus'));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkOnlineStatus();
    if (!changes.contentData.firstChange) {
      this.contentData = changes.contentData.currentValue;
      _.forEach(this.actionButtons, data => {
        if (data.name === 'download') {
          const disabled = this.getContentStatus();
          this.updateActionButton(data.name, disabled, (disabled ? 'Downloaded' : 'Download'));
        } else if (data.name !== 'rate') {
          this.updateActionButton(data.name, !this.getContentStatus());
        }
      });
    }
  }

  updateActionButton(name, disabled, label?) {
    const data: any = _.find(this.actionButtons, { name: name });
    data.disabled = data.name === 'update' ? !_.get(this.contentData, 'desktopAppMetadata.updateAvailable') : disabled;
    data.label = _.isEmpty(label) ? _.capitalize(data.name) : _.capitalize(label);
  }

  getContentStatus () {
    return _.get(this.contentData, 'desktopAppMetadata.isAvailable') || _.isEqual(_.get(this.contentData, 'downloadStatus'), 'DOWNLOADED');
  }

  onActionButtonClick(event, content) {
    console.log('Event', event, 'content', content);
    switch (event.data.name.toUpperCase()) {
      case 'UPDATE':
        this.updateContent(content);
        // this.logTelemetry(event.data, 'update-content');
        break;
      case 'DOWNLOAD':
        this.isYoutubeContentPresent(content);
        // this.logTelemetry(event.data, 'download-content');
        break;
      case 'DELETE':
        this.showDeleteModal = true;
        // this.logTelemetry(event.data, 'delete-content');
        break;
      case 'RATE':
        this.contentRatingModal = true;
        // this.logTelemetry(event.data, 'rate-content');
        break;
      case 'SHARE':
        this.exportContent(content);
        // this.logTelemetry(event.data, 'share-content');
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
    console.log('downloadContent');
    this.contentManagerService.downloadContentId = content.identifier;
    this.contentManagerService.startDownload({}).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
      this.updateActionButton('Download', true, _.get(content, 'downloadStatus'));
    }, (error) => {
      this.updateActionButton('Download', false, _.get(content, 'downloadStatus'));
      this.contentManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      this.toasterService.error(this.resourceService.messages.fmsg.m0090);
    });

  }

  updateContent(content) {
    const request = !_.isEmpty(this.collectionId) ? { contentId: content.identifier, parentId: this.collectionId } :
      { contentId: this.contentId };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
      this.contentData.desktopAppMetadata.updateAvailable = false;
      this.updateActionButton('update', true);
    }, (err) => {
      this.updateActionButton('update', false);
      const errorMessage = !this.isConnected ? _.replace(this.resourceService.messages.smsg.m0056, '{contentName}',
        this.contentData.name) :
        this.resourceService.messages.fmsg.m0096;
      this.toasterService.error(errorMessage);
    });
  }

  deleteContent(content) {
    console.log('deleteContent');
    const request = {request: {contents: [content.identifier], visibility: 'Parent'}};
    this.contentManagerService.deleteContent(request).subscribe(data => {
    this.contentData = { desktopAppMetadata: { isAvailable: false} };
    this.toasterService.success(this.resourceService.messages.stmsg.desktop.deleteSuccessMessage);
    this.deletedContent.emit(content.identifier);
    }, err => {
      this.toasterService.error(this.resourceService.messages.stmsg.desktop.deleteErrorMessage);
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

  logTelemetry(event, id, extras?) {
    console.log('logTelemetry');
  }

}
