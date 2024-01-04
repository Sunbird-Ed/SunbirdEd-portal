import {
  PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage, ILoaderMessage, UtilService, BrowserCacheTtlService, NavigationHelperService, IPagination,
  LayoutService, COLUMN_TYPE, OfflineCardService
} from '@sunbird/shared';
import { SearchService, PlayerService, CoursesService, UserService, ISort, OrgDetailsService, SchemaService } from '@sunbird/core';
import { combineLatest, Subject, of } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, delay, debounceTime, tap, mergeMap } from 'rxjs/operators';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { ContentManagerService } from '../../../public/module/offline/services/content-manager/content-manager.service';
import {omit, groupBy, get, uniqBy, toLower, find, map as _map, forEach, each} from 'lodash-es';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  templateUrl: './home-search.component.html'
})
export class HomeSearchComponent implements OnInit, OnDestroy, AfterViewInit {

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
  public contentList: Array<any> = [];
  public cardIntractEdata: IInteractEventEdata;
  public loaderMessage: ILoaderMessage;
  public redirectUrl;
  public frameWorkName: string;
  public closeIntractEdata;
  public enrolledSection;
  public filterIntractEdata;
  public showBatchInfo = false;
  public selectedCourseBatches: any;
  public selectedFilters;
  sortingOptions: Array<ISort>;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  public globalSearchFacets: Array<string>;
  public allTabData;
  public allMimeType;
  isDesktopApp = false;
  contentDownloadStatus = {};
  downloadIdentifier: string;
  showDownloadLoader = false;
  contentData;
  contentName: string;
  showModal = false;
  showBackButton = false;
  frameworkCategories;
  globalFilterCategories;
  categoryKeys: any[];

  constructor(public searchService: SearchService, public router: Router,
    public activatedRoute: ActivatedRoute, public paginationService: PaginationService,
    public resourceService: ResourceService, public toasterService: ToasterService, public changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService, public utilService: UtilService, public coursesService: CoursesService,
    private playerService: PlayerService, public userService: UserService, public cacheService: CacheService,
    public browserCacheTtlService: BrowserCacheTtlService, public orgDetailsService: OrgDetailsService,
    public navigationhelperService: NavigationHelperService, public layoutService: LayoutService, private schemaService: SchemaService,
    public contentManagerService: ContentManagerService, public telemetryService: TelemetryService,
    private offlineCardService: OfflineCardService, public cslFrameworkService: CslFrameworkService) {
    this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
    this.filterType = this.configService.appConfig.home.filterType;
    // this.redirectUrl = this.configService.appConfig.courses.searchPageredirectUrl;
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this.setTelemetryData();
  }
  ngOnInit() {
    this.categoryKeys = this.cslFrameworkService.transformDataForCC();
    this.frameworkCategories = this.cslFrameworkService.getFrameworkCategories();
    this.globalFilterCategories = this.cslFrameworkService.getAlternativeCodeForFilter();
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.listenLanguageChange();
    this.contentManagerService.contentDownloadStatus$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(contentDownloadStatus => {
      this.contentDownloadStatus = contentDownloadStatus;
      this.addHoverData();
    });
    this.searchService.getContentTypes().pipe(takeUntil(this.unsubscribe$)).subscribe(formData => {
      this.allTabData = _.find(formData, (o) => o.title === 'frmelmnts.tab.all');
      this.globalSearchFacets = _.get(this.allTabData, 'search.facets');
      this.setNoResultMessage();
      this.initFilters = true;
    }, error => {
      this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
      this.navigationhelperService.goBack();
    });
    this.initFilters = true;
    this.initLayout();
    combineLatest(this.fetchEnrolledCoursesSection(), this.dataDrivenFilterEvent)
    .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Array<any>) => {
        this.enrolledSection = data[0];
        this.dataDrivenFilters = data[1];
        this.fetchContentOnParamChange();
        this.setNoResultMessage();
      },
        error => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0002);
        });
        this.checkForBack();
        this.moveToTop();
  }
  checkForBack() {
    if (_.get(this.activatedRoute, 'snapshot.queryParams["showClose"]') === 'true') {
      this.showBackButton = true;
    }
  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
        this.redoLayout();
      });
  }
  redoLayout() {
    if (this.layoutConfiguration != null) {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine);
    } else {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
    }
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams, this.schemaService.fetchSchemas())
      .pipe(debounceTime(5),
        tap(data => this.inView({ inview: [] })), // trigger pageexit if last filter resulted 0 contents
        delay(10), // to trigger pageexit telemetry event
        tap(data => {
          this.showLoader = true;
          this.setTelemetryData();
        }),
        map((result) => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$))
      .subscribe(({ params, queryParams }) => {
        this.queryParams = { ...queryParams };
        this.globalSearchFacets = (this.queryParams && this.queryParams.searchFilters) ?
        JSON.parse(this.queryParams.searchFilters) : this.globalSearchFacets;
        this.paginationDetails.currentPage = params.pageNumber;
        this.contentList = [];
        this.fetchContents();
      });
  }
  private fetchContents() {
    /* istanbul ignore next */
    const selectedMediaType = _.isArray(_.get(this.queryParams, 'mediaType')) ? _.get(this.queryParams, 'mediaType')[0] :
      _.get(this.queryParams, 'mediaType');
    const mimeType = _.find(_.get(this.allTabData, 'search.filters.mimeType'), (o) => {
      return o.name === (selectedMediaType || 'all');
    });
    let filters = _.pickBy(this.queryParams, (value: Array<string> | string) => value && value.length);
    const omitKeys = ['key', 'sort_by', 'sortType', 'appliedFilters', 'selectedTab', 'mediaType', 'contentType', 'description'];
    filters = this.schemaService.schemaValidator({
      inputObj: filters || {},
      properties: _.get(this.schemaService.getSchema('content'), 'properties') || {},
      omitKeys: omitKeys
    });
    filters.primaryCategory = filters.primaryCategory || _.get(this.allTabData, 'search.filters.primaryCategory');
    filters.mimeType = filters.mimeType || _.get(mimeType, 'values');

    const _filters = _.get(this.allTabData, 'search.filters');
    _.forEach(_filters, (el, key) => {
      if (!['primaryCategory', 'mimeType'].includes(key) && !_.has(filters, key)) {
        filters[key] = el;
      }
    });
    
    const option = {
      filters: filters,
      fields: _.get(this.allTabData, 'search.fields'),
      limit: _.get(this.allTabData, 'search.limit') ?  _.get(this.allTabData, 'search.limit')
      : this.configService.appConfig.SEARCH.PAGE_LIMIT,
      offset: (this.paginationDetails.currentPage - 1) * (this.configService.appConfig.SEARCH.PAGE_LIMIT),
      query: this.queryParams.key,
      sort_by: { lastPublishedOn: 'desc' },
      facets: this.globalSearchFacets,
      params: this.configService.appConfig.Course.contentApiQueryParams,
      pageNumber: this.paginationDetails.currentPage
    };
    this.searchService.contentSearch(option)
      .pipe(
        mergeMap(data => {
        //   const { subject: selectedSubjects = [] } = (this.selectedFilters || {}) as { subject: [] };
        //   const filteredContents = omit(groupBy(get(data, 'result.content') || get(data, 'result.QuestionSet'), content => {
        //     return ((this.queryParams['primaryCategory'] && this.queryParams['primaryCategory'].length > 0) ? content['subject'] : content['primaryCategory']);
        // }), ['undefined']);
        // for (const [key, value] of Object.entries(filteredContents)) {
        //     const isMultipleSubjects = key && key.split(',').length > 1;
        //     if (isMultipleSubjects) {
        //         const subjects = key && key.split(',');
        //         subjects.forEach((subject) => {
        //             if (filteredContents[subject]) {
        //                 filteredContents[subject] = uniqBy(filteredContents[subject].concat(value), 'identifier');
        //             } else {
        //                 filteredContents[subject] = value;
        //             }
        //         });
        //         delete filteredContents[key];
        //     }
        // }
        // const sections = [];
        // for (const section in filteredContents) {
        //     if (section) {
        //         if (selectedSubjects.length && !(find(selectedSubjects, selectedSub => toLower(selectedSub) === toLower(section)))) {
        //             continue;
        //         }
        //         sections.push({
        //             name: section,
        //             contents: filteredContents[section]
        //         });
        //     }
        // }
        // _map(sections, (section) => {
        //     forEach(section.contents, contents => {
        //         contents.cardImg = contents.appIcon || 'assets/images/book.png';
        //     });
        //     return section;
        // });
        // this.contentList = sections;
        if(get(data, 'result.content') && get(data, 'result.QuestionSet')){
          this.contentList = _.concat(get(data, 'result.content'), get(data, 'result.QuestionSet'));
        } else if(get(data, 'result.content')){
          this.contentList = get(data, 'result.content');
        } else {
          this.contentList = get(data, 'result.QuestionSet');
        }
        this.addHoverData();
          const channelFacet = _.find(_.get(data, 'result.facets') || [], facet => _.get(facet, 'name') === 'channel');
          if (channelFacet) {
            const rootOrgIds = this.orgDetailsService.processOrgData(_.get(channelFacet, 'values'));
            return this.orgDetailsService.searchOrgDetails({
              filters: { isTenant: true, id: rootOrgIds },
              fields: ['slug', 'identifier', 'orgName']
            }).pipe(
              mergeMap(orgDetails => {
                channelFacet.values = _.get(orgDetails, 'content');
                return of(data);
              })
            );
          }
          return of(data);
        })
      )
      .subscribe(data => {
        this.showLoader = false;
        this.facets = this.searchService.updateFacetsData(_.get(data, 'result.facets'));
        this.facets.forEach((facet) => {
          facet['label'] = this.utilService.transposeTerms(facet['label'], facet['label'], this.resourceService.selectedLang);
        });
        this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
        this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
      }, err => {
        this.showLoader = false;
        this.contentList = [];
        this.facetsList = [];
        this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      });
  }
  private fetchEnrolledCoursesSection() {
    return this.coursesService.enrolledCourseData$.pipe(map(({ enrolledCourses, err }) => {
      const enrolledSection = {
        name: this.resourceService.frmelmnts.lbl.mytrainings,
        length: 0,
        contents: []
      };
      if (err) {
        // shows toaster message this.resourceService.messages.fmsg.m0001
        return enrolledSection;
      }
      const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.CoursePageSection.enrolledCourses;
      enrolledSection.contents = this.utilService.getDataForCard(enrolledCourses, constantData, dynamicFields, metaData);
      return enrolledSection;
    }));
  }
  moveToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    const url = this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString());
    this.router.navigate([url], { queryParams: this.queryParams });
    this.moveToTop();
  }
  goback() {
    if (this.navigationhelperService['_history'].length > 1) {
      this.navigationhelperService.goBack();
    }
  }

  public playContent({ data }) {
    const metaData = data;
    this.changeDetectorRef.detectChanges();
    const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } =
    this.coursesService.findEnrolledCourses(metaData.identifier);
    if (!expiredBatchCount && !onGoingBatchCount) { // go to course preview page, if no enrolled batch present
      return this.playerService.playContent(data);
    }

    if (onGoingBatchCount === 1) { // play course if only one open batch is present
      metaData.batchId = openBatch.ongoing.length ? openBatch.ongoing[0].batchId : inviteOnlyBatch.ongoing[0].batchId;
      return this.playerService.playContent(data);
    }
    // else if (onGoingBatchCount === 0 && expiredBatchCount === 1){
    //   metaData.batchId = openBatch.expired.length ? openBatch.expired[0].batchId : inviteOnlyBatch.expired[0].batchId;
    //   return this.playerService.playContent(metaData);
    // }
    this.selectedCourseBatches = { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch, courseId: metaData.identifier };
    this.showBatchInfo = true;
  }
  public inView(event) {
    _.forEach(event.inview, (elem, key) => {
      const obj = _.find(this.inViewLogs, { objid: elem.data.metaData.identifier });
      if (!obj) {
        this.inViewLogs.push({
          objid: elem.data.metaData.identifier,
          objtype: elem.data.metaData.contentType || 'content',
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
  private setTelemetryData() {
    this.inViewLogs = []; // set to empty every time filter or page changes
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
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private setNoResultMessage() {
    this.noResultMessage = {
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    };
  }

  callDownload() {
    this.showDownloadLoader = true;
    this.downloadContent(this.downloadIdentifier);
  }

  addHoverData() {
    this.contentList = this.utilService.addHoverData(this.contentList, true);  
  }

  hoverActionClicked(event) {
    event['data'] = event.content;
    this.contentName = event.content.name;
    this.contentData = event.data;
    let telemetryButtonId: any;
    switch (event.hover.type.toUpperCase()) {
        case 'OPEN':
            this.playContent(event);
            this.logTelemetry(this.contentData, 'play-content');
            break;
        case 'DOWNLOAD':
            this.downloadIdentifier = _.get(event, 'content.identifier');
            this.showModal = this.offlineCardService.isYoutubeContent(this.contentData);
            if (!this.showModal) {
                this.showDownloadLoader = true;
                this.downloadContent(this.downloadIdentifier);
            }
            telemetryButtonId = this.contentData.mimeType ===
                'application/vnd.ekstep.content-collection' ? 'download-collection' : 'download-content';
            this.logTelemetry(this.contentData, telemetryButtonId);
            break;
    }
  }

  downloadContent(contentId) {
    this.contentManagerService.downloadContentId = contentId;
    this.contentManagerService.downloadContentData = this.contentData;
    this.contentManagerService.failedContentName = this.contentName;
    this.contentManagerService.startDownload({})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
            this.downloadIdentifier = '';
            this.contentManagerService.downloadContentId = '';
            this.contentManagerService.downloadContentData = {};
            this.contentManagerService.failedContentName = '';
            this.showDownloadLoader = false;
        }, error => {
            this.downloadIdentifier = '';
            this.contentManagerService.downloadContentId = '';
            this.contentManagerService.downloadContentData = {};
            this.contentManagerService.failedContentName = '';
            this.showDownloadLoader = false;
            _.each(this.contentList, (content) => {
              content['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
            });
            if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
                this.toasterService.error(this.resourceService.messages.fmsg.m0090);
            }
        });
  }

  private listenLanguageChange() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((languageData) => {
      this.setNoResultMessage();
      if (_.get(this.contentList, 'length') ) {
        if (this.isDesktopApp) {
          this.addHoverData();
        }
        this.facets = this.searchService.updateFacetsData(this.facets);
      }
    });
  }

  logTelemetry(content, actionId) {
    const telemetryInteractObject = {
        id: content.identifier,
        type: content.contentType,
        ver: content.pkgVersion ? content.pkgVersion.toString() : '1.0'
    };

    const appTelemetryInteractData: any = {
        context: {
            env: _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
            _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
            _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env')
        },
        edata: {
            id: actionId,
            type: 'click',
            pageid: this.router.url.split('/')[1] || 'Search-page'
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

  /**
   * @param  { Object } filters - filters object
   * @description handleFilterChange
   * - Function to handle filters data
   * - `filters` object propagating from app-global-search-filter
   * - Set filters data to cache with key `searchFiltersAll`
   * - TTL for `searchFiltersAll` is based on form configuration
   * - Form configuration key `metaData.cacheTimeout` provides TTL for cache storage of filters
   * - If form configuration is not set then by default `3600000` value is set as TTL
   * - If `filters` object has se_boards key and cache has data
   * - Incoming data is merged with existing data
   * - Final filters are stored in cache
   * - If cache does not have filters
   * - then incoming filters are stored in cache
   */
  /* istanbul ignore next */
  public handleFilterChange(filters) {
    const filterData = filters && filters.filters || {};
    if (filterData.channel && this.facets) {
      const channelIds = [];
      const facetsData = _.find(this.facets, { 'name': 'channel' });
      _.forEach(filterData.channel, (value, index) => {
        const data = _.find(facetsData.values, { 'identifier': value });
        if (data) {
          channelIds.push(data.name);
        }
      });
      if (channelIds && Array.isArray(channelIds) && channelIds.length > 0) {
        filterData.channel = channelIds;
      }
    }
    this.selectedFilters = filterData;
    const _cacheTimeout = _.get(this.allTabData, 'metaData.cacheTimeout') || 3600000;
    /* istanbul ignore next */
    if (this.cacheService.exists('searchFiltersAll') && Object.keys(filterData).length > 0 && !_.get(filterData, 'key') 
    
    && _.get(this.activatedRoute, 'snapshot.queryParams.ignoreSavedFilter') !== 'true' ) {
        const _searchFilters = this.cacheService.get('searchFiltersAll');
      let _cacheFilters = {
        primaryCategory: [..._.intersection(filterData['primaryCategory'], _searchFilters['primaryCategory']), ..._.difference(filterData['primaryCategory'], _searchFilters['primaryCategory'])],
        [this.globalFilterCategories[0]]  : (_.get(filterData, this.globalFilterCategories[0]) && filterData[this.globalFilterCategories[0]].length > 0) ? [_.union(_searchFilters[this.globalFilterCategories[0]], filterData[this.globalFilterCategories[0]])[0]] : [],
        [this.globalFilterCategories[1]]: [..._.intersection(filterData[this.globalFilterCategories[1]], _searchFilters[this.globalFilterCategories[1]]), ..._.difference(filterData[this.globalFilterCategories[1]], _searchFilters[this.globalFilterCategories[1]])],
        [this.globalFilterCategories[2]]: [..._.intersection(filterData[this.globalFilterCategories[2]], _searchFilters[this.globalFilterCategories[2]]), ..._.difference(filterData[this.globalFilterCategories[2]], _searchFilters[this.globalFilterCategories[2]])],
        [this.globalFilterCategories[3]]: [..._.intersection(filterData[this.globalFilterCategories[3]], _searchFilters[this.globalFilterCategories[3]]),
        ..._.difference(filterData[this.globalFilterCategories[3]], _searchFilters[this.globalFilterCategories[3]])].map((e) => { return _.startCase(e) }),
        selectedTab: _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'all'
      };
      for (const key in _cacheFilters) {
        if (_cacheFilters[key] && _cacheFilters[key].length == 0) delete _cacheFilters[key];
      }
      this.cacheService.set('searchFiltersAll', this.selectedFilters, { expires: Date.now() + _cacheTimeout });
    } else if (!this.cacheService.exists('searchFiltersAll') && Object.keys(filterData).length > 0 && !_.get(filterData, 'key') 
    && _.get(this.activatedRoute, 'snapshot.queryParams.ignoreSavedFilter') !== 'true') {
      this.cacheService.set('searchFiltersAll', filterData, { expires: Date.now() + _cacheTimeout });
    } else {
      if(_.get(this.activatedRoute, 'snapshot.queryParams.ignoreSavedFilter') === 'true'){
      } else{
        this.cacheService.remove('searchFiltersAll');
      }
    }
    const defaultFilters = _.reduce(filters, (collector: any, element) => {
      if (element.code === this.frameworkCategories?.fwCategory1?.code) {
        collector[this.frameworkCategories?.fwCategory1?.code] = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
      }
      return collector;
    }, {});
    this.dataDrivenFilterEvent.emit(defaultFilters);
  }

public viewAll(event) {
    this.moveToTop();
    this.logViewAllTelemetry(event);
     const searchQueryParams: any = {};
    searchQueryParams.defaultSortBy = JSON.stringify({ lastPublishedOn: 'desc' });
    searchQueryParams['exists'] = undefined;
    searchQueryParams['primaryCategory'] = (this.queryParams.primaryCategory && this.queryParams.primaryCategory.length)
     ? this.queryParams.primaryCategory : [event.name];
     (this.queryParams.primaryCategory && this.queryParams.primaryCategory.length) ? (searchQueryParams['subject'] = [event.name]) :
    (searchQueryParams[this.globalFilterCategories[3]] = this.queryParams[this.globalFilterCategories[3]]);
    searchQueryParams['selectedTab'] = 'all';
  if (this.queryParams.channel) {
    searchQueryParams['channel'] = this.queryParams.channel;
  }
    searchQueryParams['visibility'] = [];
    searchQueryParams['appliedFilters'] = true;
    const sectionUrl = '/resources' + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], { queryParams: searchQueryParams, state: {} });
 }

 public isUserLoggedIn(): boolean {
  return this.userService && (this.userService.loggedIn || false);
}

logViewAllTelemetry(event) {
  const telemetryData = {
      cdata: [{
          type: 'section',
          id: event.name
      }],
      edata: {
          id: 'view-all'
      }
  };
  this.getInteractEdata(telemetryData);
}

getInteractEdata(event) {
  const cardClickInteractData = {
      context: {
          cdata: event.cdata,
          env: this.isUserLoggedIn() ? 'library' : this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
          id: get(event, 'edata.id'),
          type: 'click',
          pageid: this.isUserLoggedIn() ? 'library' : this.activatedRoute.snapshot.data.telemetry.pageid
      },
      object: get(event, 'object')
  };
  this.telemetryService.interact(cardClickInteractData);
}

}

