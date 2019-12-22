import { combineLatest, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil, map, debounceTime, delay, filter } from 'rxjs/operators';

import {
  ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, PaginationService, NavigationHelperService
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

  @Input() contentList: any[] = [];
  @Input() isOnlineContents = false;

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
  ) {
    this.filterType = this.configService.appConfig.explore.filterType;
  }

  ngOnInit() {
    this.isBrowse = this.isOnlineContents;
    this.setTelemetryData();
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

    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      takeUntil(this.unsubscribe$))
      .subscribe(element => { this.prepareVisits(); });
  }

  addHoverData(contentList) {
    _.each(contentList, (value) => {
      value['hoverData'] = {
        'note': this.isBrowse && _.get(value, 'downloadStatus') ===
          'DOWNLOADED' ? this.resourceService.frmelmnts.lbl.goToMyDownloads : '',
        'actions': [
          {
            'type': this.isBrowse ? 'download' : 'save',
            'label': this.isBrowse ? _.capitalize(_.get(value, 'downloadStatus')) ||
              this.resourceService.frmelmnts.btn.download :
              this.resourceService.frmelmnts.lbl.saveToPenDrive,
            'disabled': this.isBrowse && _.includes(['DOWNLOADED', 'DOWNLOADING', 'PAUSED'], Boolean(_.get(value, 'downloadStatus')))
          },
          {
            'type': 'open',
            'label': this.resourceService.frmelmnts.lbl.open
          }
        ]
      };
    });

    return contentList;
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
        pageid: _.split(this.router.url, '/')[1] || 'library'
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
    const visits = [];
    _.forEach(this.contentList, (content, index) => {
      visits.push({
        objid: content.metaData.identifier,
        objtype: content.metaData.contentType,
        index: index,
      });
    });

    this.telemetryImpression.edata.visits = visits;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
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
        this.showDownloadLoader = true;
        this.downloadContent(_.get(event, 'content.metaData.identifier'));
        this.logTelemetry(event.data, 'download-content');
        break;
      case 'SAVE':
        this.showExportLoader = true;
        this.exportContent(_.get(event, 'content.metaData.identifier'));
        this.logTelemetry(event.data, 'export-content');
        break;
    }
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
        this.showDownloadLoader = false;
        this.contentManagerService.downloadContentId = '';
      }, error => {
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
      this.addHoverData(this.contentList);
    }
  }
}
