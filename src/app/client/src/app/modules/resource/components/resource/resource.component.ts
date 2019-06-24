import { combineLatest, Subject } from 'rxjs';
import { PageApiService, PlayerService, UserService, ISort } from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef, AfterViewInit, HostListener } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData,
  BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, delay, tap } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
@Component({
  templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
  public baseUrl: string;
  public noResultMessage: INoResultMessage;
  public carouselMasterData: Array<ICaraouselData> = [];
  public filterType: string;
  public hashTagId: string;
  public sortingOptions: Array<ISort>;
  public queryParams: any;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public sortIntractEdata: IInteractEventEdata;
  public dataDrivenFilters: any = {};
  public frameworkData: object;
  public dataDrivenFilterEvent = new EventEmitter();
  public initFilters = false;
  public loaderMessage;
  public redirectUrl;
  public pageSections: Array<ICaraouselData> = [];

  @HostListener('window:scroll', []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
    && this.pageSections.length < this.carouselMasterData.length) {
        this.pageSections.push(this.carouselMasterData[this.pageSections.length]);
    }
  }
  constructor(private pageApiService: PageApiService, private toasterService: ToasterService, private cdr: ChangeDetectorRef,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService,
    private playerService: PlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, private userService: UserService,
    public navigationhelperService: NavigationHelperService) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this.router.onSameUrlNavigation = 'reload';
    this.filterType = this.configService.appConfig.library.filterType;
    this.redirectUrl = this.configService.appConfig.library.inPageredirectUrl;
  }

  ngOnInit() {
    this.userService.userData$.subscribe(userData => {
      if (userData && !userData.err) {
          this.frameworkData = _.get(userData.userProfile, 'framework');
      }
    });
    this.initFilters = true;
    this.hashTagId = this.userService.hashTagId;
    this.dataDrivenFilterEvent.pipe(first())
    .subscribe((filters: any) => {
      this.dataDrivenFilters = filters;
      this.fetchContentOnParamChange();
      this.setNoResultMessage();
    });
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
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
    .pipe(
      tap(data => this.prepareVisits([])), // trigger pageexit if last filter resulted 0 contents
      delay(1), // to trigger telemetry pageexit event
      tap(data => {
        this.showLoader = true;
        this.setTelemetryData();
      }),
      takeUntil(this.unsubscribe$))
    .subscribe((result) => {
      this.queryParams = { ...result[0], ...result[1] };
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
      filters: {channel: this.userService.hashTagId,
      board: [this.dataDrivenFilters.board]},
      softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
      mode: 'soft'
    };
    const manipulatedData = this.utilService.manipulateSoftConstraint( _.get(this.queryParams, 'appliedFilters'),
    softConstraintData, this.frameworkData );
    const option: any = {
      source: 'web',
      name: 'Resource',
      filters: _.get(this.queryParams, 'appliedFilters') ?  filters : _.get(manipulatedData, 'filters'),
      mode: _.get(manipulatedData, 'mode'),
      exists: [],
      params : this.configService.appConfig.Library.contentApiQueryParams
    };
    if (_.get(manipulatedData, 'filters')) {
      option.softConstraints = _.get(manipulatedData, 'softConstraints');
    }
    if (this.queryParams.sort_by) {
      option.sort_by = {[this.queryParams.sort_by]: this.queryParams.sortType  };
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
        this.cdr.detectChanges();
      }, err => {
        this.showLoader = false;
        this.carouselMasterData = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }
  private prepareCarouselData(sections = []) {
    const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.Library;
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
    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = this.inViewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }
  public playContent(event) {
    this.playerService.playContent(event.data.metaData);
  }
  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    const softConstraintsFilter = {
      board : [this.dataDrivenFilters.board],
      channel: this.hashTagId,
    };
    searchQuery.request.filters.softConstraintsFilter = JSON.stringify(softConstraintsFilter);
    searchQuery.request.filters.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQuery.request.filters.exists = searchQuery.request.exists;
    this.cacheService.set('viewAllQuery', searchQuery.request.filters);
    this.cacheService.set('pageSection', event, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQuery.request.filters, ...this.queryParams}; // , ...this.queryParams
    const sectionUrl = 'resources/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], {queryParams: queryParams});
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private setTelemetryData() {
    this.inViewLogs = []; // set to empty every time filter or page changes
  }

  ngAfterViewInit () {
    setTimeout(() => {
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
    });
  }

  private setNoResultMessage() {
      this.noResultMessage = {
        'message': 'messages.stmsg.m0007',
        'messageText': 'messages.stmsg.m0006'
      };
  }
}
