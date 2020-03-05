import { combineLatest, Subject } from 'rxjs';
import { PlayerService, UserService, ISort, SearchService, FrameworkService } from '@sunbird/core';
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
  public noResultMessage;
  public apiContentList: Array<ICaraouselData> = [];
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
  public pageSections: Array<any> = [];
  selectedFilters = {};
  frameworkId;

  @HostListener('window:scroll', []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
    && this.pageSections.length < this.apiContentList.length) {
        this.pageSections.push(this.apiContentList[this.pageSections.length]);
    }
  }
  constructor(private searchService: SearchService, private toasterService: ToasterService, private cdr: ChangeDetectorRef,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService,
    private playerService: PlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, private userService: UserService,
    public navigationhelperService: NavigationHelperService, public frameworkService: FrameworkService) {
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
    this.frameworkService.channelData$.pipe(takeUntil(this.unsubscribe$)).subscribe((channelData) => {
      if (!channelData.err) {
        this.frameworkId = _.get(channelData, 'channelData.defaultFramework');
        console.log('this.frameworkId', this.frameworkId);
      }
    });
    this.userService.userData$.subscribe(userData => {
      if (userData && !userData.err) {
          this.frameworkData = _.get(userData.userProfile, 'framework');
      }
    });
    this.initFilters = true;
    this.hashTagId = this.userService.hashTagId;
    this.dataDrivenFilterEvent
    .subscribe((filters: any) => {
      this.dataDrivenFilters = filters;
      this.fetchContentOnParamChange();
      this.setNoResultMessage();
    });
  }
  public getFilters(filters) {
    const selectedFilters = _.pick(filters.filters, ['board', 'medium', 'gradeLevel']);
    this.dataDrivenFilterEvent.emit(selectedFilters);
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
      this.apiContentList = [];
      this.pageSections = [];
      this.fetchPageData();
    });
  }
private prepareSearchRequest() {
  let filters = _.pickBy(this.dataDrivenFilters, (value: Array<string> | string) => value && value.length);
  filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
  filters['contentType'] = filters.contentType || ['TextBook']; // TODO: if req. // ['Collection', 'TextBook', 'LessonPlan',
  const option = {
    limit: 100 || this.configService.appConfig.SEARCH.PAGE_LIMIT,
    filters: filters || {},
    params : this.configService.appConfig.Library.contentApiQueryParams
  };

  if (this.frameworkId) {
    option.params.framework = this.frameworkId;
  }

  return option;
}

  private fetchPageData() {
    const option = this.prepareSearchRequest();
    this.searchService.contentSearch(option).pipe(
      map((response) => {
        const filteredContents = _.omit(_.groupBy(_.get(response, 'result.content'), 'subject'), ['undefined']);
      for (const [key, value] of Object.entries(filteredContents)) {
        const isMultipleSubjects = key.split(',').length > 1;
        if (isMultipleSubjects) {
            const subjects = key.split(',');
            subjects.forEach((subject) => {
                if (filteredContents[subject]) {
                    filteredContents[subject] = _.uniqBy(filteredContents[subject].concat(value), 'identifier');
                } else {
                    filteredContents[subject] = value;
                }
            });
            delete filteredContents[key];
        }
      }
      const sections = [];
      for (const section in filteredContents) {
        if (section) {
            sections.push({
                name: section,
                contents: filteredContents[section]
            });
        }
      }
      return _.map(sections, (section) => {
        _.forEach(section.contents, contents => {
          contents.cardImg = contents.appIcon || 'assets/images/book.png';
        });
        return section;
      });
    }))
      .subscribe(data => {
        this.showLoader = false;
        this.apiContentList = data;
        if (!this.apiContentList.length) {
          return; // no page section
        }
        if (this.apiContentList.length >= 2) {
          this.pageSections = [this.apiContentList[0], this.apiContentList[1]];
        } else if (this.apiContentList.length >= 1) {
          this.pageSections = [this.apiContentList[0]];
        }
      }, err => {
        this.showLoader = false;
        this.apiContentList = [];
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
      'title': this.resourceService.frmelmnts.lbl.noBookfoundTitle,
      'subTitle': this.resourceService.frmelmnts.lbl.noBookfoundSubTitle,
      'buttonText': this.resourceService.frmelmnts.lbl.noBookfoundButtonText,
      'showExploreContentButton': true
    };
  }

  private navigateToExploreContent() {
    this.router.navigate(['search/Library', 1], {queryParams: this.dataDrivenFilters});
  }
}
