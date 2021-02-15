import { combineLatest, Subject, of, merge, throwError, forkJoin, BehaviorSubject } from 'rxjs';
import {
  PageApiService, OrgDetailsService, FormService, UserService, CoursesService, FrameworkService,
  PlayerService, SearchService
} from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData, BrowserCacheTtlService, ServerResponse,
  NavigationHelperService, LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { PublicPlayerService } from '@sunbird/public';
import { takeUntil, map, mergeMap, filter, catchError, tap, pluck, switchMap, delay, startWith, skip, skipWhile } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
@Component({
  templateUrl: './course-page.component.html'
})
export class CoursePageComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
  public showLoginModal = false;
  public baseUrl: string;
  public noResultMessage: INoResultMessage;
  public carouselMasterData: Array<ICaraouselData> = [];
  public queryParams: any;
  public hashTagId: string;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public frameWorkName: string;
  public initFilters = false;
  public loaderMessage;
  public pageSections: Array<ICaraouselData> = [];
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT: string;
  SECOND_PANEL_LAYOUT: string;
  pageTitle;
  pageTitleSrc;
  svgToDisplay;
  formData: any;
  public facets;
  public facetsList: any;
  public selectedFilters = {};
  public subscription$;
  public enrolledCourses: Array<any>;
  public enrolledSection: any;
  public selectedCourseBatches: any;
  public showBatchInfo = false;
  public dataDrivenFilterEvent = new EventEmitter();
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
  _courseSearchResponse: any;
  isPageAssemble: boolean = true;
  isDesktopApp: boolean = false;
  defaultFilters = {};

  private _facets$ = new Subject();
  public facets$ = this._facets$.asObservable().pipe(startWith({}), catchError(err => of({})));
  private fetchContents$ = new Subject();

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
    private browserCacheTtlService: BrowserCacheTtlService, private userService: UserService, public formService: FormService,
    public navigationhelperService: NavigationHelperService, public layoutService: LayoutService, private coursesService: CoursesService,
    private frameworkService: FrameworkService, private playerService: PlayerService, private searchService: SearchService, private contentSearchService: ContentSearchService) {
    this.setTelemetryData();
  }

  public isUserLoggedIn(): boolean {
    return this.userService && (this.userService.loggedIn || false);
  }

  private initialize() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
    this.setNoResultMessage();
    if (this.isUserLoggedIn()) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      this.router.onSameUrlNavigation = 'reload';
    }
  }

  private getQueryParams() {
    const { params, queryParams } = this.activatedRoute;
    return combineLatest(params, queryParams)
      .pipe(
        tap(_ => {
          if (this.isUserLoggedIn()) {
            this.prepareVisits([]);
          }
        }),
        delay(1),
        map(([params = {}, queryParams = {}]) => ({ params, queryParams })),
        filter(({ queryParams }) => !_.isEqual(this.queryParams, queryParams)),
        tap(({ queryParams }) => {
          this.inViewLogs = [];
          this.queryParams = { ...queryParams };
        })
      );
  }

  private searchOrgDetails({ filters, fields }) {
    return this.orgDetailsService.searchOrgDetails({ filters, fields })
      .pipe(
        pluck('content')
      );
  }

  private getOrgDetails() {
    const obs$ = this.orgDetailsService.getCustodianOrgDetails();
    if (this.isUserLoggedIn()) {
      return obs$
        .pipe(
          map(custodianOrg => {
            return {
              channelId: _.get(this.userService, 'hashTagId'), custodianOrg: false,
              ...(this.userService.hashTagId === _.get(custodianOrg, 'result.response.value') && { custodianOrg: true })
            };
          }));
    } else {
      if (this.userService.slug) {
        return this.orgDetailsService.getOrgDetails(this.userService.slug)
          .pipe(map(((orgDetails: any) => ({ channelId: orgDetails.hashTagId, custodianOrg: false }))));
      } else {
        return obs$.pipe(map(((orgDetails: any) => ({ channelId: _.get(orgDetails, 'result.response.value'), custodianOrg: true }))));
      }
    }
  }

  private getChannelData() {
    return this.getOrgDetails().pipe(
      switchMap(channelData => {
        const { channelId, custodianOrg } = channelData as { channelId: string, custodianOrg: boolean };
        this.hashTagId = channelId;
        return forkJoin(this.contentSearchService.initialize(channelId, custodianOrg, _.get({ ...this.defaultFilterValues, ...this.defaultFilters }, 'board[0]')), this.getFrameWork());
      })
    );
  }

  ngOnInit() {
    this.initialize();
    this.subscription$ = this.mergeObservables();
    this.isDesktopApp = this.utilService.isDesktopApp;
  }

  private mergeObservables() {
    const observables = [this.getChannelData(), this.getFormData(), this.getQueryParams(),
    ...(this.isUserLoggedIn() ? [this.fetchEnrolledCoursesSection(), this.getLanguageChange()] : [])];

    const fetchContent$ = this.buildOption().pipe(mergeMap(this.fetchPageData.bind(this)));

    return merge(this.initLayout(), fetchContent$, combineLatest(...observables)
      .pipe(
        tap(res => {
          const { defaultFilters = {} } = _.get(this.getCurrentPageData(), 'metaData') || {};
          this.defaultFilters = { ...this.defaultFilterValues, ...(!this.isUserLoggedIn() && defaultFilters) };
          this.initFilters = true;
        }),
        catchError(err => {
          this.carouselMasterData = [];
          this.initFilters = false;
          this.pageSections = [];
          this.toasterService.error(this.resourceService.messages.fmsg.m0002);
          this.router.navigate(['']);
          return of({});
        })))
      .pipe(
        takeUntil(this.unsubscribe$)
      );
  }

  public getCurrentPageData() {
    return this.getPageData(_.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'course');
  }

  private buildOption() {
    return this.fetchContents$.pipe(
      switchMap((selectedFilters: object) => {
        let hashTagId;
        const currentPageData = this.getCurrentPageData();
        this.isPageAssemble = _.get(currentPageData, 'isPageAssemble');
        let filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
          if (_.includes(['appliedFilters', ...(this.isUserLoggedIn() ? ['sort_by', 'sortType'] : ['selectedTab'])], key)) {
            return false;
          }
          return value.length;
        });
        if (this.isUserLoggedIn()) {
          hashTagId = this.userService.hashTagId;
          const orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug');
          if (this.userService._isCustodianUser && orgDetailsFromSlug) {
            hashTagId = _.get(orgDetailsFromSlug, 'hashTagId');
          }
          filters = _.omit(filters, 'selectedTab');
        } else {
          hashTagId = this.hashTagId || '*';
          filters = _.omit(filters, ['utm_source']);
        }

        const option = {
          source: 'web',
          name: 'Course',
          organisationId: hashTagId || '*',
          filters: { ...filters, ...(selectedFilters || this.selectedFilters || {}), se_subjects: [] },
          facets: _.get(currentPageData, 'search.facets') || ['channel', 'gradeLevel', 'subject', 'medium'],
          params: _.get(this.configService, 'appConfig.CoursePageSection.contentApiQueryParams'),
          ...(!this.isUserLoggedIn() && {
            params: _.get(this.configService, 'appConfig.ExplorePage.contentApiQueryParams'),
            fields: _.get(currentPageData, 'search.fields') || _.get(this.configService, 'urlConFig.params.CourseSearchField'),
          })
        };

        if (!this.isUserLoggedIn()) {
          return of(option);
        } else {
          const usersProfile = this.userService.userProfile;
          const custodianOrgDetails = this.orgDetailsService.getCustodianOrgDetails();
          const getCourseSection = this.coursesService.getCourseSectionDetails();
          return forkJoin([custodianOrgDetails, getCourseSection])
            .pipe(
              map(result => {
                if (_.get(usersProfile, 'rootOrg.rootOrgId') !== _.get(result[0], 'result.response.value')) {
                  if (_.get(result[1], 'result.response.value')) {
                    const sectionId = _.get(result[1], 'result.response.value');
                    option['sections'] = {};
                    option['sections'][sectionId] = {
                      'filters': {
                        'batches.createdFor': [_.get(usersProfile, 'rootOrg.rootOrgId')]
                      }
                    };
                  }
                }
                return option;
              }));
        }
      })
    );
  }

  private fetchPageData(option: object) {
    // Courses are displayed based on section returned from assemble API. Executed iff `isPageAssemble` flag is set to `true`.
    const currentPageData = this.getPageData(_.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'course');
    if (this.isPageAssemble) {
      if (_.get(this.queryParams, 'sort_by') && this.isUserLoggedIn()) {
        option['sort_by'] = { [this.queryParams.sort_by]: this.queryParams.sortType };
      }

      return this.pageApiService.getPageData(option)
        .pipe(
          mergeMap(data => {
            let facetsList: any = this.utilService.processData(_.get(data, 'sections'), option['facets']);
            const rootOrgIds = this.processOrgData(facetsList.channel);
            return this.searchOrgDetails({
              filters: { isRootOrg: true, rootOrgId: rootOrgIds },
              fields: ['slug', 'identifier', 'orgName']
            }).pipe(
              tap(orgDetails => {
                this.showLoader = false;
                this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
                facetsList.channel = orgDetails;
                facetsList = this.utilService.removeDuplicate(facetsList);
                this._facets$.next(facetsList || {});
                if (!_.get(this.carouselMasterData, 'length')) {
                  return;
                }
                if (_.get(this.enrolledSection, 'contents.length')) {
                  this.pageSections = [this.carouselMasterData[0]];
                } else if (!_.get(this.enrolledSection, 'contents.length') && _.get(this.carouselMasterData, 'length') >= 2) {
                  this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
                } else if (_.get(this.carouselMasterData, 'length') >= 1) {
                  this.pageSections = [this.carouselMasterData[0]];
                }
              }));
          }),
          tap(null, err => {
            this.showLoader = false;
            this.carouselMasterData = [];
            this.pageSections = [];
            this.toasterService.error(this.resourceService.messages.fmsg.m0004);
          })
        );
    } else {
      return this.fetchCourses(currentPageData);
    }
  }

  private fetchCourses(currentPageData) {

    const { search: { facets = ['subject'], fields = _.get(this.configService, 'urlConFig.params.CourseSearchField'),
      filters: { contentType = 'Course' } = {} } = {}, metaData: { groupByKey = 'subject' } = {} } = currentPageData || {};
    let filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
      return (key === 'appliedFilters' || key === 'selectedTab') ? false : value.length;
    });
    filters = _.omit(filters, ['utm_source', 'publisher']);
    filters['contentType'] = contentType;
    const option = {
      source: 'web',
      name: 'Course',
      filters: this.contentSearchService.mapCategories({
        groupByKey,
        filters: {
          ...this.getSearchFilters(filters), ...(this.selectedFilters || {}),
          [groupByKey]: []
        }
      }),
      exists: ['batches.batchId'],
      sort_by: { 'me_averageRating': 'desc', 'batches.startDate': 'desc' },
      organisationId: this.hashTagId || '*',
      facets: facets || ['channel', 'gradeLevel', 'subject', 'medium'],
      fields
    };
    return this.searchService.contentSearch(option)
      .pipe(
        map((response) => {
          this._courseSearchResponse = response;
          const { subject: selectedSubjects = [] } = (this.selectedFilters || {}) as { subject: [] };
          _.forEach(_.get(response, 'result.content'), function (content) {
            if (!_.get(content, 'subject') || !_.size(_.get(content, 'subject'))) { content['subject'] = ['Others']; }
            if (!_.get(content, 'se_subjects') || !_.size(_.get(content, 'se_subjects'))) { content['se_subjects'] = ['Others']; }
          });
          const filteredContents = _.omit(_.groupBy(_.get(response, 'result.content') || [], groupByKey), ['undefined']);
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
              if (selectedSubjects.length && !(_.find(selectedSubjects, selectedSub => _.toLower(selectedSub) === _.toLower(section)))) {
                continue;
              }
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
        }),
        mergeMap(data => {
          let facetsList: any = this.utilService.processCourseFacetData(_.get(this._courseSearchResponse, 'result'), option.facets);
          const rootOrgIds = this.processOrgData(facetsList.channel);
          return this.orgDetailsService.searchOrgDetails({
            filters: { isRootOrg: true, rootOrgId: rootOrgIds },
            fields: ['slug', 'identifier', 'orgName']
          }).pipe(tap((orgDetails) => {
            this.showLoader = false;
            facetsList.channel = _.get(orgDetails, 'content');
            facetsList = this.utilService.removeDuplicate(facetsList);
            this._facets$.next(facetsList || {});
            const userProfileSubjects = _.get(this.userService, 'userProfile.framework.subject') || [];
            const [userSubjects, notUserSubjects] = _.partition(_.sortBy(data, ['name']), value => {
              const { name = null } = value || {};
              if (!name) { return false; }
              return _.find(userProfileSubjects, subject => _.toLower(subject) === _.toLower(name));
            });
            this.carouselMasterData = [...userSubjects, ...notUserSubjects];
            if (!this.carouselMasterData.length) {
              return;
            }
            this.pageSections = this.carouselMasterData.slice(0, 4);
          }));
        }));
  }

  getFormData() {
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    return this.formService.getFormConfig(formServiceInputParams)
      .pipe(
        map((data: any) => {
          _.forEach(data, value => {
            const { contentType, title, theme: { imageName = null } = {} } = value;
            if (_.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') === contentType) {
              this.pageTitle = _.get(this.resourceService, title);
              this.pageTitleSrc = this.resourceService.RESOURCE_CONSUMPTION_ROOT + title;
              this.svgToDisplay = imageName;
            } else if (Object.keys(_.get(this.activatedRoute, 'snapshot.queryParams')).length === 0) {
              if (contentType === 'course') {
                this.pageTitle = _.get(this.resourceService, title);
                this.svgToDisplay = imageName;
              }
            }
          });
          this.formData = data;
          return data;
        }));
  }
  private initLayout() {
    return this.layoutService.switchableLayout()
      .pipe(
        tap((layoutConfig: { layout: object }) => {
          if (layoutConfig != null) {
            this.layoutConfiguration = layoutConfig.layout;
          }
          this.redoLayout();
        })
      );
  }
  private redoLayout() {
    if (this.layoutConfiguration != null) {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
    } else {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
    }
  }

  public getFilters({ filters, status }) {
    if (!filters || status === 'FETCHING') { return; }
    this.showLoader = true;
    this.carouselMasterData = [];
    this.pageSections = [];
    this._courseSearchResponse = {};
    const currentPageData = this.getPageData(_.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'course');
    const filterData = filters && _.pick(filters, ['board', 'medium', 'gradeLevel', 'channel', 'subject', 'audience']) || {};
    if (_.has(filters, 'audience') || (localStorage.getItem('userType') && currentPageData.contentType !== 'all')) {
      const userTypes = _.get(filters, 'audience') || [localStorage.getItem('userType')];
      const audienceSearchFilterValue = _.get(filters, 'audienceSearchFilterValue');
      const userTypeMapping = _.get(this.configService, 'appConfig.userTypeMapping');
      filterData['audience'] = audienceSearchFilterValue || _.uniq(_.flatten(_.map(userTypes, userType => userTypeMapping[userType])));
    }
    if (JSON.stringify(this.selectedFilters) === JSON.stringify(filterData)) { return; }
    this.selectedFilters = filterData;
    this.fetchContents$.next(filterData);
  }

  public getSearchFilters(filters) {
    delete filters['selectedTab'];
    const filterObj = {
      'primaryCategory': ['Course', 'Course Assessment'],
      'status': ['Live'],
      'batches.enrollmentType': 'open',
      'batches.status': 1
    };
    return _.merge(filters, filterObj);
  }

  private getFrameWork() {
    if (this.isUserLoggedIn()) {
      const framework = this.frameworkService.getDefaultCourseFramework();
      if (framework) {
        return framework.pipe(
          tap(framework => {
            this.frameWorkName = framework as string;
          })
        );
      } else {
        return throwError({});
      }
    } else {
      const formServiceInputParams = {
        formType: 'framework',
        formAction: 'search',
        contentType: 'framework-code',
      };
      return this.formService.getFormConfig(formServiceInputParams, this.hashTagId)
        .pipe(
          map((data: ServerResponse) => {
            const framework = _.find(data, 'framework');
            if (framework) {
              this.frameWorkName = _.get(framework, 'framework');
            }
            return framework;
          })
        );
    }
  }

  public getPageData(data) {
    return _.find(this.formData, (o) => o.contentType === data);
  }

  private prepareCarouselData(sections = []) {
    const { constantData, metaData, dynamicFields, slickSize } = this.isUserLoggedIn() ? _.get(this.configService, 'appConfig.CoursePageSection.course') :
      _.get(this.configService, 'appConfig.CoursePage');
    const carouselData = _.reduce(sections, (collector, element) => {
      const contents = _.slice(_.get(element, 'contents'), 0, slickSize) || [];
      if (this.isUserLoggedIn()) {
        element.contents = _.map(contents, content => this.utilService.processContent(content, constantData, dynamicFields, metaData));
      } else {
        element.contents = this.utilService.getDataForCard(contents, constantData, dynamicFields, metaData);
      }
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
  public playContent(event, sectionType?) {
    if (!this.isUserLoggedIn()) {
      this.publicPlayerService.playContent(event);
    } else {
      if (sectionType) {
        event.section = this.resourceService.frmelmnts.lbl.mytrainings;
        event.data.identifier = _.get(event, 'data.metaData.courseId');
      }
      const { section, data } = event;
      const metaData = this.isPageAssemble ? _.get(data, 'metaData') : data;
      // if (section === this.resourceService.frmelmnts.lbl.mytrainings) { // play course if course is in My course section
      //   return this.playerService.playContent(metaData);
      // }

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
  }

  processOrgData(channels) {
    const rootOrgIds = [];
    _.forEach(channels, (channelData) => {
      if (channelData.name) {
        rootOrgIds.push(channelData.name);
      }
    });
    return rootOrgIds;
  }

  public viewAll(event) {
    let searchQuery;
    if (this.isUserLoggedIn() && !_.get(event, 'searchQuery')) {
      searchQuery = JSON.parse(this.myCoursesSearchQuery);
    } else {
      searchQuery = JSON.parse(event.searchQuery);
    }
    const searchQueryParams: any = {};
    _.forIn(searchQuery.request.filters, (value, key) => {
      if (_.isPlainObject(value)) {
        searchQueryParams.dynamic = JSON.stringify({ [key]: value });
      } else {
        searchQueryParams[key] = value;
      }
    });
    searchQueryParams.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQueryParams['exists'] = _.get(searchQuery, 'request.exists');
    if (this.isUserLoggedIn()) {
      this.cacheService.set('viewAllQuery', searchQueryParams, { maxAge: 600 });
    } else {
      this.cacheService.set('viewAllQuery', searchQueryParams);
    }
    this.cacheService.set('pageSection', event, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQueryParams, ...this.queryParams };
    const sectionUrl = _.get(this.router, 'url.split') && this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
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
        env: this.isUserLoggedIn() ? 'Course' : this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.pageId,
        uri: this.isUserLoggedIn() ? this.router.url : this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }
  private setNoResultMessage() {
    this.noResultMessage = {
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    };
  }

  private fetchEnrolledCoursesSection() {
    return this.coursesService.enrolledCourseData$
      .pipe(
        map(({ enrolledCourses, err }) => {
          this.enrolledCourses = _.orderBy(enrolledCourses, ['enrolledDate'], ['desc']);
          const enrolledSection = {
            name: _.get(this.resourceService, 'frmelmnts.lbl.mytrainings'),
            length: 0,
            count: 0,
            contents: []
          };
          if (err) {
            return enrolledSection;
          }
          const { constantData, metaData, dynamicFields, slickSize } = _.get(this.configService, 'appConfig.CoursePageSection.enrolledCourses');
          enrolledSection.contents = _.map(this.enrolledCourses, content => {
            const formatedContent = this.utilService.processContent(content, constantData, dynamicFields, metaData);
            formatedContent.metaData.mimeType = 'application/vnd.ekstep.content-collection';
            formatedContent.metaData.contentType = 'Course';
            const trackableObj = _.get(content, 'content.trackable');
            if (trackableObj) {
              formatedContent.metaData.trackable = trackableObj;
            }
            return formatedContent;
          });
          enrolledSection.count = enrolledSection.contents.length;
          return this.enrolledSection = enrolledSection;
        }));
  }

  private getLanguageChange() {
    return this.resourceService.languageSelected$
      .pipe(
        tap(selectedLanguage => {
          if (_.get(this.enrolledSection, 'name')) {
            this.enrolledSection.name = _.get(this.resourceService, 'frmelmnts.lbl.mytrainings');
          }
        })
      );
  }

  get pageId() {
    return this.isUserLoggedIn() ? 'learn' : _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  }

  get defaultFilterValues() {
    return this.userService.defaultFrameworkFilters;
  }

}
