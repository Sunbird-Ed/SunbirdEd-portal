import { combineLatest, of, Subject, forkJoin, Observable, throwError, Subscription } from 'rxjs';
import { PageApiService, CoursesService, ISort, PlayerService, FormService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit, HostListener } from '@angular/core';
import {
  ResourceService, ServerResponse, ToasterService, ICaraouselData, ConfigService, UtilService, INoResultMessage,
  BrowserCacheTtlService, NavigationHelperService, LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import {
  UserService, OrgDetailsService, FrameworkService
} from '@sunbird/core';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { takeUntil, map, mergeMap, first, filter, catchError, tap, delay } from 'rxjs/operators';

@Component({
  templateUrl: './learn-page.component.html'
})
export class LearnPageComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
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
  public frameWorkName: string;
  public initFilters = false;
  public loaderMessage;
  public sortingOptions: ISort;
  public enrolledSection: any;
  public redirectUrl: string;
  public enrolledCourses: Array<any>;
  public showBatchInfo = false;
  public selectedCourseBatches: any;
  public pageSections: Array<ICaraouselData> = [];
  public usersProfile: any;
  public toUseFrameWorkData = false;
  private resourceDataSubscription: Subscription;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT:string;
  SECOND_PANEL_LAYOUT:string;
  private myCoursesSearchQuery = JSON.stringify({
    'request': {
      'filters': {
        'contentType': [
          'Course'
        ],
        'objectType': [
          'Content'
        ],
        'status': [
          'Live'
        ]
      },
      'sort_by': {
        'lastPublishedOn': 'desc'
      },
      'limit': 10,
      'organisationId': _.get(this.userService.userProfile, 'organisationIds')
    }
  });
  public slugForProminentFilter = (<HTMLInputElement>document.getElementById('slugForProminentFilter')) ?
  (<HTMLInputElement>document.getElementById('slugForProminentFilter')).value : null;
  orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug');

  constructor(private pageApiService: PageApiService, private toasterService: ToasterService,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService, public coursesService: CoursesService,
    private playerService: PlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, public formService: FormService,
    public navigationhelperService: NavigationHelperService, private orgDetailsService: OrgDetailsService,
    public userService: UserService, public frameworkService: FrameworkService, public layoutService: LayoutService) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.redirectUrl = this.configService.appConfig.courses.inPageredirectUrl;
    this.filterType = this.configService.appConfig.courses.filterType;
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }
  @HostListener('window:scroll', []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
      && this.pageSections.length < this.carouselMasterData.length) {
      this.pageSections.push(this.carouselMasterData[this.pageSections.length]);
    }
  }
  ngOnInit() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.initLayout();
    this.getLanguageChange();
    // TODO change the slug to 'Igot'
    if (this.userService.slug === this.slugForProminentFilter) {
      this.toUseFrameWorkData = true;
    }
    if (this.userService._isCustodianUser && this.orgDetailsFromSlug ) {
      if (_.get(this.orgDetailsFromSlug, 'slug') === this.slugForProminentFilter) {
        this.toUseFrameWorkData = true;
      }
      this.hashTagId = _.get(this.orgDetailsFromSlug, 'hashTagId');
    }
    combineLatest(this.fetchEnrolledCoursesSection(), this.getFrameWork()).pipe(
      mergeMap((data: Array<any>) => {
        this.enrolledSection = data[0];
        if (data[1]) {
          this.initFilters = true;
          this.frameWorkName = data[1];
          // return this.dataDrivenFilterEvent;
          return of({});
        } else {
          return of({});
        }
      })).subscribe((filters: any) => {
        this.dataDrivenFilters = filters;
        this.fetchContentOnParamChange();
        this.setNoResultMessage();
      },
        error => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0002);
        });
  }
  initLayout() {
    this.redoLayout();
    this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig=> {
        if(layoutConfig!=null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
        this.redoLayout();
      });
  }
  redoLayout() {
      if(this.layoutConfiguration!=null) {
        this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0,this.layoutConfiguration,COLUMN_TYPE.threeToNine);
        this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1,this.layoutConfiguration,COLUMN_TYPE.threeToNine);
      } else {
        this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0,null,COLUMN_TYPE.fullLayout);
        this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1,null,COLUMN_TYPE.fullLayout);
      }
  }

  private getLanguageChange() {
    this.resourceService.languageSelected$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(item => {
        if (_.get(this.enrolledSection, 'name')) {
          this.enrolledSection.name = this.resourceService.frmelmnts.lbl.mytrainings;
        }
      });
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
      .pipe(
        tap(data => this.prepareVisits([])), // trigger pageexit if last filter resulted 0 contents
        delay(1), // to trigger telemetry
        tap(data => {
          this.showLoader = true;
          this.setTelemetryData();
        }),
        mergeMap(result => {
          this.queryParams = { ...result[0], ...result[1] };
          return this.buildOption();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.carouselMasterData = [];
        this.pageSections = [];
        this.fetchPageData(result);
      }, error => {
        this.fetchPageData(error);
      });
  }
  private buildOption(): Observable<any> {
    const filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
      if (_.includes(['sort_by', 'sortType', 'appliedFilters'], key)) {
        return false;
      }
      return value.length;
    });
    let hashTagId = this.userService.hashTagId;
    if (this.userService._isCustodianUser  && this.orgDetailsFromSlug) {
      hashTagId = _.get(this.orgDetailsFromSlug, 'hashTagId');
    }
    const option: any = {
      source: 'web',
      name: 'Course',
      organisationId: hashTagId,
      filters: filters,
      params: this.configService.appConfig.CoursePageSection.contentApiQueryParams
    };
    this.usersProfile = this.userService.userProfile;
    const custodianOrgDetails = this.orgDetailsService.getCustodianOrgDetails();
    const getCourseSection = this.coursesService.getCourseSectionDetails();
    return forkJoin([custodianOrgDetails, getCourseSection]).pipe(
      map(result => {
        if (_.get(this.usersProfile, 'rootOrg.rootOrgId') !== _.get(result[0], 'result.response.value')) {
          if (_.get(result[1], 'result.response.value')) {
            const sectionId = _.get(result[1], 'result.response.value');
            option['sections'] = {};
            option['sections'][sectionId] = {
             'filters': {
               'batches.createdFor': [_.get(this.usersProfile, 'rootOrg.rootOrgId')]
             }
            };
          }
        }
        return option;
      }),
      catchError((err) => {
        return throwError(option);
      }));
  }
  private fetchPageData(option) {
    console.log(option);
    if (this.queryParams.sort_by) {
      option.sort_by = { [this.queryParams.sort_by]: this.queryParams.sortType };
    }
    this.pageApiService.getPageData(option).pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.showLoader = false;
        this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
        if (!this.carouselMasterData.length) {
          return; // no page section
        }
        if (this.enrolledSection.contents.length) {
          this.pageSections = [this.carouselMasterData[0]];
        } else if (!this.enrolledSection.contents.length && this.carouselMasterData.length >= 2) {
          this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
        } else {
          this.pageSections = [this.carouselMasterData[0]];
        }
      }, err => {
        this.showLoader = false;
        this.carouselMasterData = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
      });
  }
  private prepareCarouselData(sections = []) {
    const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.CoursePageSection.course;
    const carouselData = _.reduce(sections, (collector, element) => {
      const contents = _.slice(_.get(element, 'contents'), 0, slickSize) || [];
      element.contents = _.map(contents, content => this.utilService.processContent(content, constantData, dynamicFields, metaData));
      if (element.contents && element.contents.length) {
        collector.push(element);
      }
      return collector;
    }, []);
    return carouselData;
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
  private getFrameWork() {
    const framework = this.frameworkService.getDefaultCourseFramework();
    if (framework) {
      return framework;
    } else {
      return of(false);
    }
  }
  private fetchEnrolledCoursesSection() {
    return this.coursesService.enrolledCourseData$.pipe(map(({ enrolledCourses, err }) => {
      this.enrolledCourses = _.orderBy(enrolledCourses, ['enrolledDate'], ['desc']);
      const enrolledSection = {
        name: this.resourceService.frmelmnts.lbl.mytrainings,
        length: 0,
        count: 0,
        contents: []
      };
      this.resourceDataSubscription = this.resourceService.languageSelected$.subscribe(item => {
        enrolledSection.name = this.resourceService.frmelmnts.lbl.mytrainings;
      });
      if (err) {
        return enrolledSection;
      }
      const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.CoursePageSection.enrolledCourses;
      enrolledSection.contents = _.map(this.enrolledCourses, content => {
        const formatedContent = this.utilService.processContent(content, constantData, dynamicFields, metaData);
        formatedContent.metaData.mimeType = 'application/vnd.ekstep.content-collection'; // to route to course page
        formatedContent.metaData.contentType = 'Course'; // to route to course page
        return formatedContent;
      });
      enrolledSection.count = enrolledSection.contents.length;
      return enrolledSection;
    }));
  }
  public prepareVisits(event) {
    _.forEach(event, (content, index) => this.inViewLogs.push({
      objid: content.metaData.courseId ? content.metaData.courseId : content.metaData.identifier,
      objtype: 'course',
      index: index,
      section: content.section,
    }));
    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = this.inViewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }
  public playContent({ section, data }) {
    const { metaData } = data;
    if (section === this.resourceService.frmelmnts.lbl.mytrainings) { // play course if course is in My course section
      return this.playerService.playContent(metaData);
    }

    const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } =
    this.coursesService.findEnrolledCourses(metaData.identifier);

    if (!expiredBatchCount && !onGoingBatchCount) { // go to course preview page, if no enrolled batch present
      return this.playerService.playContent(metaData);
    }

    if (onGoingBatchCount === 1) { // play course if only one open batch is present
      metaData.batchId = openBatch.ongoing.length ? openBatch.ongoing[0].batchId : inviteOnlyBatch.ongoing[0].batchId;
      return this.playerService.playContent(metaData);
    }
    this.selectedCourseBatches = { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch, courseId: metaData.identifier };
    this.showBatchInfo = true;
  }

  public viewAll(event) {
    const searchQuery = _.get(event, 'searchQuery') ?  JSON.parse(event.searchQuery) : JSON.parse(this.myCoursesSearchQuery);
    const searchQueryParams: any = {};
    _.forIn(searchQuery.request.filters, (value, key) => {
      if (_.isPlainObject(value)) {
        searchQueryParams.dynamic = JSON.stringify({ [key]: value });
      } else {
        searchQueryParams[key] = value;
      }
    });
    searchQueryParams.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQueryParams.exists = searchQuery.request.exists;
    this.cacheService.set('viewAllQuery', searchQueryParams, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQueryParams, ...this.queryParams };
    this.cacheService.set('pageSection', event, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], { queryParams: queryParams });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
  private setTelemetryData() {
    this.inViewLogs = [];
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: 'course-page'
    };
  }
  ngAfterViewInit() {
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