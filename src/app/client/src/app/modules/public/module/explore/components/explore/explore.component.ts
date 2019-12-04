import { combineLatest, Subject } from 'rxjs';
import { PageApiService, OrgDetailsService, UserService } from '@sunbird/core';
import { PublicPlayerService } from './../../../../services';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData,
  BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, tap } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { environment } from '@sunbird/environment';
import {
  ContentManagerService
} from './../../../../../../../../projects/desktop/src/app/modules/offline/services/content-manager/content-manager.service';


@Component({
  selector: 'app-explore-component',
  templateUrl: './explore.component.html'
})
export class ExploreComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
  public showLoginModal = false;
  public baseUrl: string;
  public noResultMessage: INoResultMessage;
  public carouselMasterData: Array<ICaraouselData> = [];
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
  public loaderMessage;
  public pageSections: Array<ICaraouselData> = [];
  isOffline: boolean = environment.isOffline;
  showExportLoader = false;
  contentName: string;
  public slug: string;
  organisationId: string;
  showDownloadLoader = false;


  @HostListener('window:scroll', []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
      && this.pageSections.length < this.carouselMasterData.length) {
      this.pageSections.push(this.carouselMasterData[this.pageSections.length]);
    }
  }
  constructor(private pageApiService: PageApiService, private toasterService: ToasterService,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService, private orgDetailsService: OrgDetailsService,
    private publicPlayerService: PublicPlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, private userService: UserService,
    public navigationhelperService: NavigationHelperService, public contentManagerService: ContentManagerService) {
    this.router.onSameUrlNavigation = 'reload';
    this.filterType = this.configService.appConfig.explore.filterType;
  }

  ngOnInit() {
    this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).pipe(
      mergeMap((orgDetails: any) => {
        this.slug = orgDetails.slug;
        this.hashTagId = orgDetails.hashTagId;
        this.initFilters = true;
        this.organisationId = orgDetails.id;
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
      this.contentManagerService.downloadListEvent.pipe(
        takeUntil(this.unsubscribe$)).subscribe((data) => {
        this.updateCardData(data);
      });
      this.contentManagerService.completeEvent.pipe(
        takeUntil(this.unsubscribe$)).subscribe((data) => {
          if (this.router.url === '/') {
            this.fetchPageData();
          }
      });
      this.contentManagerService.downloadEvent.pipe(tap(() => {
        this.showDownloadLoader = false;
      }), takeUntil(this.unsubscribe$)).subscribe(() => {});
    }
  }

  public getFilters(filters) {
    const defaultFilters = _.reduce(filters, (collector: any, element) => {
      if (element.code === 'board') {
        collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
      }
      return collector;
    }, {});
    this.dataDrivenFilterEvent.emit(defaultFilters);
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.showLoader = true;
        this.queryParams = { ...result[1] };
        this.carouselMasterData = [];
        this.pageSections = [];
        this.fetchPageData();
      });
  }
  private fetchPageData() {
    const filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
      if (_.includes(['sort_by', 'sortType', 'appliedFilters'], key)) {
        return false;
      }
      return value.length;
    });
    const softConstraintData = {
      filters: {
        channel: this.hashTagId,
        board: [this.dataDrivenFilters.board]
      },
      softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
      mode: 'soft'
    };
    const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.queryParams, 'appliedFilters'),
      softConstraintData);
    const option = {
      organisationId: this.organisationId,
      source: 'web',
      name: 'Explore',
      filters: _.get(this.queryParams, 'appliedFilters') ? filters : _.get(manipulatedData, 'filters'),
      mode: _.get(manipulatedData, 'mode'),
      exists: [],
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams
    };
    if (_.get(manipulatedData, 'filters')) {
      option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
    }
    this.pageApiService.getPageData(option)
      .subscribe(data => {
        this.showLoader = false;
        this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
        if (!this.carouselMasterData.length) {
          return; // no page section
        }
        if (this.carouselMasterData.length >= 2) {
          this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
        } else if (this.carouselMasterData.length >= 1) {
          this.pageSections = [this.carouselMasterData[0]];
        }
      }, err => {
        this.showLoader = false;
        this.carouselMasterData = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
  }
  private prepareCarouselData(sections = []) {
    const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.ExplorePage;
    const carouselData = _.reduce(sections, (collector, element) => {
      const contents = _.slice(_.get(element, 'contents'), 0, slickSize) || [];
      element.contents = this.utilService.getDataForCard(contents, constantData, dynamicFields, metaData);
      if (element.contents && element.contents.length) {
        collector.push(element);
      }
      return collector;
    }, []);
    return carouselData;
  }
  public prepareVisits(event) {
    _.forEach(event, (inView, index) => {
      if (inView.metaData.identifier) {
        this.inViewLogs.push({
          objid: inView.metaData.identifier,
          objtype: inView.metaData.contentType,
          index: index,
          section: inView.section,
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inViewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
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
  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    const softConstraintsFilter = {
      board: [this.dataDrivenFilters.board],
      channel: this.hashTagId,
    };
    if (_.includes(this.router.url, 'browse') || !this.isOffline) {
      searchQuery.request.filters.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
      searchQuery.request.filters.softConstraintsFilter = JSON.stringify(softConstraintsFilter);
      searchQuery.request.filters.exists = searchQuery.request.exists;
    }
    this.cacheService.set('viewAllQuery', searchQuery.request.filters);
    this.cacheService.set('pageSection', event, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQuery.request.filters, ...this.queryParams };
    const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], { queryParams: queryParams });
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
  private setTelemetryData() {
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
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
  private setNoResultMessage() {
    if (this.isOffline && !(this.router.url.includes('/browse'))) {
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

  startDownload (contentId) {
    this.contentManagerService.downloadContentId = contentId;
    this.contentManagerService.startDownload({}).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
    }, error => {
      this.contentManagerService.downloadContentId = '';
      this.showDownloadLoader = false;
      _.each(this.pageSections, (pageSection) => {
        _.each(pageSection.contents, (pageData) => {
          pageData['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
        });
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
    _.each(this.pageSections, (pageSection) => {
      _.each(pageSection.contents, (pageData) => {
        this.publicPlayerService.updateDownloadStatus(downloadListdata, pageData);
      });
    });
  }

}
