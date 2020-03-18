import {
  PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  ICard, ILoaderMessage, UtilService, NavigationHelperService
} from '@sunbird/shared';
import { SearchService, PlayerService, OrgDetailsService, UserService, FrameworkService } from '@sunbird/core';
import { IPagination } from '@sunbird/announcement';
import { PublicPlayerService } from '../../../../services';
import { combineLatest, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, debounceTime, tap, delay } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { environment } from '@sunbird/environment';
import {
  ContentManagerService
} from './../../../../../../../../projects/desktop/src/app/modules/offline/services/content-manager/content-manager.service';

@Component({
  templateUrl: './explore-content.component.html',
  styleUrls: ['./explore-content.component.scss']
})
export class ExploreContentComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
  public showLoginModal = false;
  public baseUrl: string;
  public noResultMessage;
  public filterType: string;
  public queryParams: any;
  public hashTagId: string;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public sortIntractEdata: IInteractEventEdata;
  public dataDrivenFilters: any = {};
  public dataDrivenFilterEvent = new EventEmitter();
  public initFilters = false;
  public facets: Array<string>;
  public facetsList: any;
  public paginationDetails: IPagination;
  public contentList: Array<ICard> = [];
  public cardIntractEdata: IInteractEventEdata;
  public loaderMessage: ILoaderMessage;
  isOffline: boolean = environment.isOffline;
  showExportLoader = false;
  contentName: string;
  showDownloadLoader = false;
  frameworkId;
  constructor(public searchService: SearchService, public router: Router,
    public activatedRoute: ActivatedRoute, public paginationService: PaginationService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public configService: ConfigService, public utilService: UtilService, public orgDetailsService: OrgDetailsService,
    public navigationHelperService: NavigationHelperService, private publicPlayerService: PublicPlayerService,
    public userService: UserService, public frameworkService: FrameworkService,
    public cacheService: CacheService, public navigationhelperService: NavigationHelperService,
    public contentManagerService: ContentManagerService) {
    this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
    this.filterType = this.configService.appConfig.explore.filterType;
  }
  ngOnInit() {
    this.frameworkService.channelData$.pipe(takeUntil(this.unsubscribe$)).subscribe((channelData) => {
      if (!channelData.err) {
        this.frameworkId = _.get(channelData, 'channelData.defaultFramework');
      }
    });
    this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).pipe(
      mergeMap((orgDetails: any) => {
        this.hashTagId = orgDetails.hashTagId;
        this.initFilters = true;
        return this.dataDrivenFilterEvent;
      }), first()
    ).subscribe((filters: any) => {
      this.dataDrivenFilters = filters;
      this.fetchContentOnParamChange();
      this.setNoResultMessage();
    },
      error => {
        this.router.navigate(['']);
      }
    );

    if (this.isOffline) {
      this.contentManagerService.downloadEvent.pipe(tap(() => {
        this.showDownloadLoader = false;
      }), takeUntil(this.unsubscribe$)).subscribe(() => { });

      this.contentManagerService.downloadListEvent.pipe(
        takeUntil(this.unsubscribe$)).subscribe((data) => {
          this.updateCardData(data);
        });
    }
  }
  public getFilters(filters) {
    this.facets = filters.map(element => element.code);
    const defaultFilters = _.reduce(filters, (collector: any, element) => {
      if (element.code === 'board') {
        collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
      }
      return collector;
    }, {});
    this.dataDrivenFilterEvent.emit(defaultFilters);
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
      .pipe(debounceTime(5),
        tap(data => this.inView({ inview: [] })),
        delay(10),
        tap(data => this.setTelemetryData()),
        map(result => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$)
      ).subscribe(({ params, queryParams }) => {
        this.showLoader = true;
        this.paginationDetails.currentPage = params.pageNumber;
        this.queryParams = { ...queryParams };
        this.contentList = [];
        this.fetchContents();
      });
  }
  private fetchContents() {
    const filters: any = _.omit(this.queryParams, ['key', 'sort_by', 'sortType', 'appliedFilters', 'softConstraints']);
    filters.channel = this.hashTagId;
    filters.contentType = filters.contentType || this.configService.appConfig.CommonSearch.contentType;
    const option: any = {
      filters: filters,
      limit: this.configService.appConfig.SEARCH.PAGE_LIMIT,
      pageNumber: this.paginationDetails.currentPage,
      query: this.queryParams.key,
      mode: 'soft',
      softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints') || {},
      facets: this.facets,
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams || {}
    };
    if (this.queryParams.softConstraints) {
      try {
        option.softConstraints = JSON.parse(this.queryParams.softConstraints);
      } catch {

      }
    }
    if (this.frameworkId) {
      option.params.framework = this.frameworkId;
    }
    this.searchService.contentSearch(option)
      .subscribe(data => {
        this.showLoader = false;
        this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
        this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.contentList = data.result.content || [];
      }, err => {
        this.showLoader = false;
        this.contentList = [];
        this.facetsList = [];
        this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      });
  }
  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    const url = this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString());
    this.router.navigate([url], { queryParams: this.queryParams });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  private setTelemetryData() {
    this.inViewLogs = []; // set to empty every time filter or page changes
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    this.cardIntractEdata = {
      id: 'content-card',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
  public playContent(event) {
    // For offline environment content will only play when event.action is open
    if (event.action === 'download' && this.isOffline) {
      this.startDownload(event.data.metaData.identifier);
      this.showDownloadLoader = true;
      this.contentName = event.data.name;
      return false;
    } else if (event.action === 'export' && this.isOffline) {
      this.showExportLoader = true;
      this.contentName = event.data.name;
      this.exportOfflineContent(event.data.metaData.identifier);
      return false;
    }

    if (!this.userService.loggedIn && event.data.contentType === 'Course') {
      this.showLoginModal = true;
      this.baseUrl = '/' + 'learn' + '/' + 'course' + '/' + event.data.metaData.identifier;
    } else {
      if (_.includes(this.router.url, 'browse') && this.isOffline) {
        this.publicPlayerService.playContentForOfflineBrowse(event);
      } else {
        this.publicPlayerService.playContent(event);
      }
    }
  }
  public inView(event) {
    _.forEach(event.inview, (elem, key) => {
      const obj = _.find(this.inViewLogs, { objid: elem.data.identifier });
      if (!obj) {
        this.inViewLogs.push({
          objid: elem.data.identifier,
          objtype: elem.data.contentType || 'content',
          index: elem.id
        });
      }
    });

    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = this.inViewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private setNoResultMessage() {
    if (this.isOffline && !(this.router.url.includes('/browse'))) {
      this.noResultMessage = {
        'message': 'messages.stmsg.m0007',
        'title': 'messages.stmsg.m0133'
      };
    } else {
      this.noResultMessage = {
        'title': this.resourceService.frmelmnts.lbl.noBookfoundTitle,
        'subTitle': this.resourceService.frmelmnts.lbl.noBookfoundSubTitle,
        'buttonText': this.resourceService.frmelmnts.lbl.noBookfoundButtonText,
        'showExploreContentButton': false
      };
    }
  }

  startDownload(contentId) {
    this.contentManagerService.downloadContentId = contentId;
    this.contentManagerService.startDownload({}).subscribe(data => {
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

  exportOfflineContent(contentId) {
    this.contentManagerService.exportContent(contentId).subscribe(data => {
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
  }
}
