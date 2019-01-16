import {
  PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  ICard, ILoaderMessage, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { SearchService, PlayerService, CoursesService, UserService, FormService, ISort, ICourses } from '@sunbird/core';
import { IPagination } from '@sunbird/announcement';
import { combineLatest, Subject, of } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, debounceTime, catchError } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';

@Component({
  templateUrl: './home-search.component.html'
})
export class HomeSearchComponent implements OnInit, OnDestroy {

  public showLoader = true;
  public noResultMessage: INoResultMessage;
  public filterType: string;
  public queryParams: any;
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
  public redirectUrl;
  public frameWorkName: string;
  public closeIntractEdata;
  public enrolledSection;
  public filterIntractEdata;

  sortingOptions: Array<ISort>;

  constructor(public searchService: SearchService, public router: Router,
    public activatedRoute: ActivatedRoute, public paginationService: PaginationService,
    public resourceService: ResourceService, public toasterService: ToasterService, public changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService, public utilService: UtilService, public coursesService: CoursesService,
    private playerService: PlayerService, public userService: UserService, public cacheService: CacheService,
    public formService: FormService, public browserCacheTtlService: BrowserCacheTtlService) {
    this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
    this.filterType = this.configService.appConfig.home.filterType;
    // this.redirectUrl = this.configService.appConfig.courses.searchPageredirectUrl;
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this.setTelemetryData();
  }
  ngOnInit() {
    this.initFilters = true;
    combineLatest(this.fetchEnrolledCoursesSection(), this.dataDrivenFilterEvent).pipe(first()).
    subscribe((data: Array<any>) => {
      this.enrolledSection = data[0];
        this.dataDrivenFilters = data[1];
        this.fetchContentOnParamChange();
        this.setNoResultMessage();
      },
      error => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
    });
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
    .pipe(debounceTime(5),
        map((result) => ({params: { pageNumber: Number(result[0].pageNumber)}, queryParams: result[1]})),
        takeUntil(this.unsubscribe$))
      .subscribe(({params, queryParams}) => {
        this.showLoader = true;
        this.queryParams = { ...queryParams };
        this.paginationDetails.currentPage = params.pageNumber;
        this.contentList = [];
        this.fetchContents();
      });
  }
  private fetchContents() {
    let filters = _.pickBy(this.queryParams, (value: Array<string> | string) => value && value.length);
    // filters.channel = this.hashTagId;
    // filters.board = _.get(this.queryParams, 'board') || this.dataDrivenFilters.board;
    filters = _.omit(filters, ['key', 'sort_by', 'sortType']);
    filters.contentType = filters.contentType || ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'Course'];
    const option = {
        filters: filters,
        limit: this.configService.appConfig.SEARCH.PAGE_LIMIT,
        offset: (this.paginationDetails.currentPage - 1 ) * (this.configService.appConfig.SEARCH.PAGE_LIMIT),
        query: this.queryParams.key,
        sort_by: {[this.queryParams.sort_by]: this.queryParams.sortType},
        // softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        facets: this.facets,
        params: this.configService.appConfig.Course.contentApiQueryParams
    };
    this.searchService.compositeSearch(option)
    .subscribe(data => {
        this.showLoader = false;
        this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
        this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
            this.configService.appConfig.SEARCH.PAGE_LIMIT);
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.HomeSearch;
        this.contentList = _.map(data.result.content, (content: any) => {
          const enrolledContent = _.find(this.enrolledSection.contents,
            (enrolledCourse) => (enrolledCourse.metaData.courseId === content.identifier));
          return enrolledContent ||
            this.utilService.processContent(content, constantData, dynamicFields, metaData);
        });
    }, err => {
        this.showLoader = false;
        this.contentList = [];
        this.facetsList = [];
        this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
            this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
    });
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
  private fetchEnrolledCoursesSection() {
    return this.coursesService.enrolledCourseData$.pipe(map(({enrolledCourses, err}) => {
      const enrolledSection = {
        name: 'My Courses',
        length: 0,
        contents: []
      };
      if (err) {
        // show toaster message this.resourceService.messages.fmsg.m0001
        return enrolledSection;
      }
      const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.CoursePageSection.enrolledCourses;
      enrolledSection.contents = this.utilService.getDataForCard(enrolledCourses, constantData, dynamicFields, metaData);
      return enrolledSection;
    }));
  }
  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
        return;
    }
    this.router.navigate(['search/All', page], { queryParams: this.queryParams });
  }
  public playContent(event) {
    if (event.data.metaData.batchId) {
      event.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
      event.data.metaData.contentType = 'Course';
    }
    this.changeDetectorRef.detectChanges();
    this.playerService.playContent(event.data.metaData);
  }
  public inView(event) {
    _.forEach(event.inview, (elem, key) => {
        const obj = _.find(this.inViewLogs, { objid: elem.data.metaData.identifier});
        if (!obj) {
            this.inViewLogs.push({
                objid: elem.data.metaData.identifier,
                objtype: elem.data.metaData.contentType || 'content',
                index: elem.id
            });
        }
    });
    this.telemetryImpression.edata.visits = this.inViewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  private setTelemetryData() {
    this.closeIntractEdata = {
      id: 'search-close',
      type: 'click',
      pageid: 'home-search'
    };
    this.cardIntractEdata = {
      id: 'content-card',
      type: 'click',
      pageid: 'home-search'
    };
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: 'home-search'
    };
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private setNoResultMessage() {
    this.noResultMessage = {
      'message': _.get(this.resourceService, 'messages.stmsg.m0007') || 'No results found',
      'messageText': _.get(this.resourceService, 'messages.stmsg.m0006') || 'Please search for something else.'
    };
  }
}
