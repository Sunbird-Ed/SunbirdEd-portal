import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';

import {
  ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, PaginationService, NavigationHelperService, OfflineCardService
} from '@sunbird/shared';
import { PublicPlayerService } from '@sunbird/public';
import { Location } from '@angular/common';
import { SearchService, OrgDetailsService, FrameworkService } from '@sunbird/core';
import { IPagination } from '@sunbird/announcement';
import { ConnectionService, ContentManagerService } from '../../services';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';


@Component({
  selector: 'app-desktop-explore-content',
  templateUrl: './desktop-explore-content.component.html',
  styleUrls: ['./desktop-explore-content.component.scss']
})
export class DesktopExploreContentComponent implements OnInit, OnDestroy {

  public showLoader = true;
  public noResultMessage: INoResultMessage;
  public filterType: string;
  public queryParams: any;
  public unsubscribe$ = new Subject<void>();
  public initFilters = false;
  public loaderMessage: ILoaderMessage;
  public hashTagId: string;
  public dataDrivenFilters: any = {};
  public facets: string[];
  public isViewAll = false;

  public paginationDetails: IPagination;
  public isConnected = navigator.onLine;
  isBrowse = false;
  showExportLoader = false;
  showDownloadLoader = false;
  contentName: string;
  downloadedContents: any[] = [];

  backButtonInteractEdata: IInteractEventEdata;
  filterByButtonInteractEdata: IInteractEventEdata;
  telemetryImpression: IImpressionEventInput;
  showModal = false;
  downloadIdentifier: string;

  @Input() contentList: any[] = [];
  @Input() isOnlineContents = false;
  @Output() visits: EventEmitter<any> = new EventEmitter();

  constructor(
    public contentManagerService: ContentManagerService,
    public router: Router,
    public searchService: SearchService,
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public configService: ConfigService,
    public utilService: UtilService,
    private publicPlayerService: PublicPlayerService,
    public location: Location,
    public orgDetailsService: OrgDetailsService,
    public frameworkService: FrameworkService,
    public paginationService: PaginationService,
    private connectionService: ConnectionService,
    public navigationHelperService: NavigationHelperService,
    public telemetryService: TelemetryService,
    private offlineCardService: OfflineCardService
  ) {
    this.filterType = this.configService.appConfig.explore.filterType;
  }

  ngOnInit() {
    this.isBrowse = this.isOnlineContents;
    this.setTelemetryData();
    this.prepareVisits();
    this.connectionService.monitor()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
      });

    this.contentManagerService.downloadListEvent
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.updateCardData(data);
      });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
    this.backButtonInteractEdata = {
      id: 'back-button',
      type: 'click',
      pageid: _.split(this.router.url, '/')[1] === 'view-all' ? 'view-all' : 'search'
    };

    this.filterByButtonInteractEdata = {
      id: 'filter-by-button',
      type: 'click',
      pageid: 'search'
    };
  }

  logTelemetry(content, actionId) {
    const telemetryInteractCdata = [{
      id: content.metaData.identifier || content.metaData.courseId,
      type: content.metaData.contentType
    }];
    const telemetryInteractObject = {
      id: content.metaData.identifier || content.metaData.courseId,
      type: content.metaData.contentType || 'Course',
      ver: content.metaData.pkgVersion ? content.metaData.pkgVersion.toString() : '1.0'
    };

    const appTelemetryInteractData: any = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
          _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
          _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env'),
        cdata: telemetryInteractCdata || [],
      },
      edata: {
        id: actionId,
        type: 'click',
        pageid: _.split(_.split(this.router.url, '/')[1], '?')[0] || 'library'
      }
    };

    if (telemetryInteractObject) {
      if (telemetryInteractObject.ver) {
        telemetryInteractObject.ver = _.isNumber(telemetryInteractObject.ver) ?
          _.toString(telemetryInteractObject.ver) : telemetryInteractObject.ver;
      }
      appTelemetryInteractData.object = telemetryInteractObject;
    }
    this.telemetryService.interact(appTelemetryInteractData);
  }

  prepareVisits() {
    const data: any = { visits: [] };
    _.forEach(this.contentList, (content, index) => {
      data.visits.push({
        objid: content.metaData.identifier,
        objtype: content.metaData.contentType,
        index: index,
      });
    });

    this.visits.emit(data);
  }

  hoverActionClicked(event) {
    event['data'] = event.content;
    this.contentName = event.content.name;
    switch (event.hover.type.toUpperCase()) {
      case 'OPEN':
        this.playContent(event);
        this.logTelemetry(event.data, 'play-content');
        break;
      case 'DOWNLOAD':
        this.downloadIdentifier = _.get(event, 'content.metaData.identifier');
        this.showModal = this.offlineCardService.isYoutubeContent(event.data);
        if (!this.showModal) {
          this.showDownloadLoader = true;
          this.downloadContent(this.downloadIdentifier);
          this.logTelemetry(event.data, 'download-content');
        }
        break;
      case 'SAVE':
        this.showExportLoader = true;
        this.exportContent(_.get(event, 'content.metaData.identifier'));
        this.logTelemetry(event.data, 'export-content');
        break;
    }
  }

  callDownload() {
    this.showDownloadLoader = true;
    this.downloadContent(this.downloadIdentifier);
  }

  playContent(event) {
    if (this.isBrowse) {
      this.publicPlayerService.playContentForOfflineBrowse(event);
    } else {
      this.publicPlayerService.playContent(event);
    }
  }

  downloadContent(contentId) {
    this.contentManagerService.downloadContentId = contentId;
    this.contentManagerService.startDownload({})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.downloadIdentifier = '';
        this.showDownloadLoader = false;
        this.contentManagerService.downloadContentId = '';
      }, error => {
        this.downloadIdentifier = '';
        this.contentManagerService.downloadContentId = '';
        this.showDownloadLoader = false;
        _.each(this.contentList, (contents) => {
          contents['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
        });
        this.toasterService.error(this.resourceService.messages.fmsg.m0090);
      });
  }

  exportContent(contentId) {
    this.contentManagerService.exportContent(contentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.showExportLoader = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0059);
      }, error => {
        this.showExportLoader = false;
        if (error.error.responseCode !== 'NO_DEST_FOLDER') {
          this.toasterService.error(this.resourceService.messages.fmsg.m0091);
        }
      });
  }

  updateCardData(downloadListdata) {
    if (this.isBrowse || this.isOnlineContents) {
      _.each(this.contentList, (contents) => {
        this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
      });
      this.contentList = this.utilService.addHoverData(this.contentList, this.isBrowse);
    }
  }
}
