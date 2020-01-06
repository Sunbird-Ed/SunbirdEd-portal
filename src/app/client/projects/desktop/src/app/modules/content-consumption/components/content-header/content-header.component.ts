import { PublicPlayerService } from '@sunbird/public';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { UtilService, ResourceService, ToasterService, OfflineCardService, NavigationHelperService } from '@sunbird/shared';
import { Location } from '@angular/common';
import { IContentHeader } from './../../interfaces';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit, OnDestroy {
  @Input() collectionData;
  public unsubscribe$ = new Subject<void>();
  public isConnected = navigator.onLine;
  currentRoute: string;
  showExportLoader = false;
  @Input() showUpdate;
  showModal = false;
  message;
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
    public navigationHelperService: NavigationHelperService
  ) { }

  ngOnInit() {
    this.currentRoute = _.includes(this.router.url, 'browse') ? 'browse' : 'My Downloads';
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
    this.collectionData = this.playerService.updateDownloadStatus(downloadListdata, this.collectionData);
  }

  updateCollection(collection) {
    const request = {
      contentId: collection.identifier
    };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
      this.collectionData.showUpdate = false;
    }, (err) => {
      this.collectionData.showUpdate = true;
      const errorMessage = !this.isConnected ? _.replace(this.resourceService.messages.smsg.m0056, '{contentName}', collection.name) :
        this.resourceService.messages.fmsg.m0096;
      this.toasterService.error(errorMessage);
    });
  }

  exportCollection(collection) {
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
    this.showModal = this.offlineCardService.isYoutubeContent(collection);
    if (!this.showModal) {
      this.downloadCollection(collection);
    }
  }

  downloadCollection(collection) {
    this.contentManagerService.downloadContentId = collection.identifier;
    this.contentManagerService.startDownload({}).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, error => {
      this.contentManagerService.downloadContentId = '';
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      this.toasterService.error(this.resourceService.messages.fmsg.m0090);
    });
  }

  isBrowse() {
    return this.router.url.includes('browse');
  }

  goBack() {
    const  previousUrl =  this.navigationHelperService.getPreviousUrl();
    if (Boolean(_.includes(previousUrl.url, '/play/collection/'))) {
     return this.router.navigate(['/']);
    }
    previousUrl.queryParams ? this.router.navigate([previousUrl.url],
      {queryParams: previousUrl.queryParams}) : this.router.navigate([previousUrl.url]);
    this.utilService.clearSearchQuery();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  checkStatus(status) {
    return this.utilService.getPlayerDownloadStatus(status, this.collectionData, this.currentRoute);
  }
  deleteCollection(collection) {
    const request = {request: {contents: [collection.identifier]}};
    this.contentManagerService.deleteContent(request).subscribe(data => {
    this.goBack();
    }, err => {
      console.log('errerrerr', err);
    });
  }
}
