import { Location } from '@angular/common';
import { actionButtons } from './actionButtons';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService, ResourceService, ToasterService, OfflineCardService, NavigationHelperService } from '@sunbird/shared';
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
  actionButtons = actionButtons;
  public unsubscribe$ = new Subject<void>();
  @Input() contentData;
  @Input() showUpdate;
  contentRatingModal = false;
  public isConnected = navigator.onLine;
  contentId;
  collectionId;
  showExportLoader = false;
  showModal = false;
  message: string;
  @Output() deletedContent = new EventEmitter();

  constructor(
    public contentManagerService: ContentManagerService,
    public playerService: PublicPlayerService,
    public configService: ConfigService,
    public router: Router,
    private connectionService: ConnectionService,
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.contentData.firstChange) {
      this.contentData = changes.contentData.currentValue;
      console.log('this.conetntDataatconetntDataat', this.contentData);
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
    console.log('contentDatacontentDatacontentDatacontentData', this.contentData.desktopAppMetadata);
    data.disabled = data.name === 'update' ? !_.get(this.contentData, 'desktopAppMetadata.updateAvailable') : disabled;
    data.label = _.isEmpty(label) ? _.capitalize(data.name) : _.capitalize(label);
  }

  isBrowse() {
    return this.router.url.includes('browse');
  }

  getContentStatus () {
    return _.get(this.contentData, 'desktopAppMetadata.isAvailable') || _.isEqual(_.get(this.contentData, 'downloadStatus'), 'DOWNLOADED');
  }

  checkDownloadStatus(downloadListdata) {
    this.contentData = this.playerService.updateDownloadStatus(downloadListdata, this.contentData);
    this.updateActionButton('download', _.isEqual(_.get(this.contentData, 'downloadStatus'), 'DOWNLOADED'),
    _.get(this.contentData, 'downloadStatus'));
  }

  checkOnlineStatus() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
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
        this.deleteContent(content);
        // this.logTelemetry(event.data, 'delete-content');
        break;
      case 'RATE':
        this.contentRatingModal = true;
        // this.rateContent(content);
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
    const request = !_.isEmpty(this.collectionId) ? { contentId: this.contentId, parentId: this.collectionId } :
      { contentId: this.contentId };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
      this.updateActionButton('Update', true);
    }, (err) => {
      this.updateActionButton('Update', false);
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
    this.deletedContent.emit(content.identifier);
    }, err => {
      console.log('errerrerr', err);
    });
  }

  // rateContent(content) {
  //   console.log('rateContent');
  // }

  exportContent(content) {
    console.log('exportContent');
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
