import { combineLatest, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  public showFilters = false;
  public hashTagId: string;
  public dataDrivenFilters: any = {};
  public facets: string[];
  public contentList = [];
  public isViewAll = false;

  public paginationDetails: IPagination;
  public isConnected = navigator.onLine;
  isBrowse = false;
  showExportLoader = false;
  showDownloadLoader = false;
  contentName: string;

  backButtonInteractEdata: IInteractEventEdata;
  filterByButtonInteractEdata: IInteractEventEdata;
  telemetryImpression: IImpressionEventInput;

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
    this.isBrowse = Boolean(_.includes(this.router.url, 'browse'));
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

    if (_.includes(this.router.url, 'view-all')) {
      this.isViewAll = true;
      this.fetchRecentlyAddedContent();
    } else {
      this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
      this.isViewAll = false;
      this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).subscribe((orgDetails: any) => {
        this.hashTagId = orgDetails.hashTagId;
        this.initFilters = true;
      }, error => {
        this.router.navigate(['']);
      });
    }

    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      takeUntil(this.unsubscribe$))
      .subscribe(element => { this.prepareVisits(); });
  }

  fetchRecentlyAddedContent() {
    const softConstraintData: any = {
      filters: {
        channel: this.hashTagId,
        contentType: ['Collection', 'TextBook', 'LessonPlan', 'Resource']
      },
      softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
      mode: 'soft'
    };

    const facets = ['board', 'medium', 'gradeLevel', 'subject'];

    const option = {
      filters: softConstraintData.filters,
      mode: _.get(softConstraintData, 'mode'),
      facets: facets,
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams,
      softConstraints: softConstraintData.softConstraints
    };

    this.searchService.contentSearch(option)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.showLoader = false;
        const orderedContents = _.orderBy(_.get(response, 'result.content'), ['desktopAppMetadata.updatedOn'], ['desc']);
        this.contentList = this.formatSearchResults(orderedContents);
      }, error => {
        this.setNoResultMessage();
      });
  }

  public getFilters(filters) {
    this.facets = filters.map(element => element.code);
    this.dataDrivenFilters = filters;
    this.fetchContentOnParamChange();
    this.setNoResultMessage();
  }

  onFilterChange(event) {
    this.showLoader = true;
    this.dataDrivenFilters = _.cloneDeep(event.filters);
    this.fetchContents();
    this.publicPlayerService.libraryFilters = event.filters;
  }

  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
      .pipe(debounceTime(5),
        delay(10),
        map(result => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$)
      ).subscribe(({ params, queryParams }) => {
        this.showLoader = true;
        this.paginationDetails.currentPage = params.pageNumber;
        this.queryParams = { ...queryParams };
        this.fetchContents();
      });
  }

  private fetchContents() {
    this.constructSearchRequest();
    this.searchService.contentSearch(this.constructSearchRequest())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.showLoader = false;
        this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.LibrarySearch;
        this.contentList = this.utilService.getDataForCard(data.result.content, constantData, dynamicFields, metaData);
        this.addHoverData();
      }, err => {
        this.showLoader = false;
        this.contentList = [];
        this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      });
  }

  addHoverData() {
    _.each(this.contentList, (value) => {
      value['hoverData'] = {
        'note': this.isBrowse && _.get(value, 'downloadStatus') ===
          'DOWNLOADED' ? this.resourceService.frmelmnts.lbl.goToMyDownloads : '',
        'actions': [
          {
            'type': this.isBrowse ? 'download' : 'save',
            'label': this.isBrowse ? _.capitalize(_.get(value, 'downloadStatus')) ||
              this.resourceService.frmelmnts.btn.download :
              this.resourceService.frmelmnts.lbl.saveToPenDrive,
            'disabled': this.isBrowse && (_.get(value, 'downloadStatus') === 'DOWNLOADED' ||
              _.get(value, 'downloadStatus') === 'DOWNLOADING' ||
              _.get(value, 'downloadStatus') === 'PAUSED') ? true : false
          },
          {
            'type': 'open',
            'label': this.resourceService.frmelmnts.lbl.open
          }
        ]
      };
    });
  }

  constructSearchRequest() {
    let filters = _.pickBy(this.dataDrivenFilters, (value: Array<string> | string) => value && value.length);
    filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
    const softConstraintData: any = {
      filters: {
        channel: this.hashTagId
      },
      softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
      mode: 'soft'
    };
    if (this.dataDrivenFilters.board) {
      softConstraintData.board = this.dataDrivenFilters.board;
    }
    const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.dataDrivenFilters, 'appliedFilters'),
      softConstraintData);
    const option: any = {
      filters: _.get(this.dataDrivenFilters, 'appliedFilters') ? filters : manipulatedData.filters,
      mode: _.get(manipulatedData, 'mode'),
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams,
      query: this.queryParams.key,
      facets: this.facets,
    };

    if (_.includes(this.router.url, 'browse')) {
      option.limit = this.configService.appConfig.SEARCH.PAGE_LIMIT;
      option.pageNumber = _.get(this.paginationDetails, 'currentPage');
    }

    option.filters['contentType'] = filters.contentType || ['Collection', 'TextBook', 'LessonPlan', 'Resource'];
    if (manipulatedData.filters) {
      option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
    }

    this.frameworkService.channelData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((channelData) => {
        if (!channelData.err) {
          option.params.framework = _.get(channelData, 'channelData.defaultFramework');
        }
      });

    return option;
  }

  private formatSearchResults(list) {
    _.forEach(list, (value, index) => {
      const constantData = this.configService.appConfig.ViewAll.otherCourses.constantData;
      const metaData = this.configService.appConfig.ViewAll.metaData;
      const dynamicFields = this.configService.appConfig.ViewAll.dynamicFields;
      list[index] = this.utilService.processContent(list[index],
        constantData, dynamicFields, metaData);
    });
    return list;
  }

  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    const url = _.replace(_.split(this.router.url, '?')[0], /[^\/]+$/, page.toString());
    this.router.navigate([url], { queryParams: this.queryParams });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  goBack() {
    if (_.includes(this.router.url, 'browse')) {
      this.router.navigate(['/browse']);
    } else {
      this.router.navigate(['']);
    }

    this.utilService.clearSearchQuery();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private setNoResultMessage() {
    if (!(this.router.url.includes('/browse'))) {
      this.noResultMessage = {
        'message': 'messages.stmsg.m0007',
        'messageText': 'messages.stmsg.m0133'
      };
    } else {
      this.noResultMessage = {
        'message': 'messages.stmsg.m0007',
        'messageText': 'messages.stmsg.m0006'
      };
    }
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
    _.each(this.contentList, (contents) => {
      this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
    });
    this.addHoverData();
  }
}
