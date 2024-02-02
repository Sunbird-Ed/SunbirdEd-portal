import { forkJoin, Subject, Observable, BehaviorSubject, merge, of, concat, combineLatest } from 'rxjs';
import { OrgDetailsService, UserService, SearchService, FormService, PlayerService, CoursesService, ObservationUtilService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {
    ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService, COLUMN_TYPE, UtilService,
    OfflineCardService, BrowserCacheTtlService, IUserData, GenericResourceService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep, get, find, map as _map, pick, omit, groupBy, sortBy, replace, uniqBy, forEach, has, uniq, flatten, each, isNumber, toString, partition, toLower, includes } from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { map, tap, switchMap, skipWhile, takeUntil, catchError, startWith } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
import { ContentManagerService } from '../../../public/module/offline/services';
import * as _ from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { ProfileService } from '@sunbird/profile';
import { SegmentationTagService } from '../../../core/services/segmentation-tag/segmentation-tag.service';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
    selector: 'app-explore-page-component',
    templateUrl: './explore-page.component.html',
    styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit, OnDestroy, AfterViewInit {
    public initFilter = false;
    public inViewLogs = [];
    public showLoader = true;
    public noResultMessage;
    public apiContentList: Array<any> = [];
    private unsubscribe$ = new Subject<void>();
    public telemetryImpression: IImpressionEventInput;
    public pageSections: Array<any> = [];
    public channelId: string;
    public custodianOrg = true;
    public defaultFilters;
    public userSelectedPreference;
    public selectedFilters = {};
    exploreMoreButtonEdata: IInteractEventEdata;
    public numberOfSections;
    public isLoading = true;
    public cardData: Array<{}> = [];
    bannerSegment: any;
    displayBanner: boolean;
    bannerList?: any[];
    layoutConfiguration: any;
    formData: any;
    FIRST_PANEL_LAYOUT;
    SECOND_PANEL_LAYOUT;
    svgToDisplay;
    pageTitleSrc;
    private fetchContents$ = new BehaviorSubject(null);
    public subscription$;
    isDesktopApp = false;
    contentName;
    contentData;
    showDownloadLoader = false;
    showModal = false;
    downloadIdentifier: string;
    contentDownloadStatus = {};
    isConnected = true;
    dataThemeAttribute: string;
    private _facets$ = new Subject();
    public showBatchInfo = false;
    public enrolledCourses: Array<any>;
    public enrolledSection: any;
    public selectedCourseBatches: any;
    frameworkCategories;
    frameworkCategoriesObject;
    transformUserPreference;
    globalFilterCategories;
    private myCoursesSearchQuery = JSON.stringify({
        'request': { 'filters': { 'contentType': ['Course'], 'objectType': ['Content'], 'status': ['Live'] }, 'sort_by': { 'lastPublishedOn': 'desc' }, 'limit': 10, 'organisationId': _.get(this.userService.userProfile, 'organisationIds') }
    });
    public facets$ = this._facets$.asObservable().pipe(startWith({}), catchError(err => of({})));
    queryParams: { [x: string]: any; };
    _currentPageData: any;
    facetSections: any = [];
    contentSections = [];
    instance: string;
    userPreference: any;
    searchResponse: any = [];
    selectedFacet: { facet: any; value: any; };
    showEdit = false;
    isFilterEnabled = true;
    defaultTab = 'Textbook';
    userProfile: any;
    targetedCategory: any = [];
    subscription: any;
    userType: any;
    targetedCategorytheme: any;
    showTargetedCategory = false;
    selectedTab: any;
    primaryBanner = [];
    secondaryBanner = [];
    Categorytheme: any;
    filterResponseData = {};
    refreshFilter: boolean = true;
    public categoryKeys;
    get slideConfig() {
        return cloneDeep(this.configService.appConfig.LibraryCourses.slideConfig);
    }

    get bannerSlideConfig() {
        return cloneDeep(this.configService.appConfig.Banner.slideConfig);
    }

    get secondaryBannerSlideConfig() {
        return cloneDeep(this.configService.appConfig.AdditionalBanner.slideConfig);
    }

    @HostListener('window:scroll', []) onScroll(): void {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
            && this.pageSections.length < this.apiContentList.length) {
            this.pageSections.push(this.apiContentList[this.pageSections.length]);
            this.addHoverData();
        }
    }

    constructor(private searchService: SearchService, private toasterService: ToasterService, public userService: UserService,
        public resourceService: ResourceService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
        private router: Router, private orgDetailsService: OrgDetailsService, private publicPlayerService: PublicPlayerService,
        private contentSearchService: ContentSearchService, private navigationhelperService: NavigationHelperService,
        public telemetryService: TelemetryService, public layoutService: LayoutService,
        private formService: FormService, private playerService: PlayerService, private coursesService: CoursesService,
        private utilService: UtilService, private offlineCardService: OfflineCardService,
        public contentManagerService: ContentManagerService, private cacheService: CacheService,
        private browserCacheTtlService: BrowserCacheTtlService, private profileService: ProfileService,
        private segmentationTagService: SegmentationTagService, private observationUtil: ObservationUtilService,
        private genericResourceService: GenericResourceService, private cdr: ChangeDetectorRef, private cslFrameworkService:CslFrameworkService) {
        this.genericResourceService.initialize();
        this.instance = (<HTMLInputElement>document.getElementById('instance'))
            ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
        this.subscription = this.utilService.currentRole.subscribe(async (result) => {
            if (result) {
                this.userType = result;
            }
        });
    }


    private initConfiguration() {
        this.defaultFilters = this.userService.defaultFrameworkFilters;
        if (this.utilService.isDesktopApp) {
            this.setDesktopFilters(true);
        }
        this.numberOfSections = [get(this.configService, 'appConfig.SEARCH.SECTION_LIMIT') || 3];
        this.layoutConfiguration = this.layoutService.initlayoutConfig();
        this.redoLayout();
    }

    public isUserLoggedIn(): boolean {
        return this.userService && (this.userService.loggedIn || false);
    }

    private getFormConfig(input = { formType: 'contentcategory', formAction: 'menubar', contentType: 'global' }): Observable<object> {
        return this.formService.getFormConfig(input);
    }

    private _addFiltersInTheQueryParams(updatedFilters = {}) {
        this.getCurrentPageData();
        const params = _.get(this.activatedRoute, 'snapshot.queryParams');
        const queryParams = { ...this.defaultFilters, selectedTab: _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook', ...updatedFilters, ...params };
        this.router.navigate([], { queryParams, relativeTo: this.activatedRoute });
    }

    private fetchChannelData() {
        return forkJoin(this.getChannelId(), this.getFormConfig())
            .pipe(
                switchMap(([channelData, formConfig]) => {
                    const { channelId, custodianOrg } = channelData;
                    this.channelId = channelId;
                    this.custodianOrg = custodianOrg;
                    this.formData = formConfig;
                    if (this.isUserLoggedIn()) {
                        // this.defaultFilters = this.cacheService.exists('searchFilters') ? this.getPersistFilters(true) : this.userService.defaultFrameworkFilters;
                        this.defaultFilters = this.userService.defaultFrameworkFilters;
                        this.userProfile = this.userService.userProfile;
                    } else {
                        this.userService.getGuestUser().subscribe((response) => {
                            const guestUserDetails: any = response;
                            if (guestUserDetails && !this.cacheService.exists('searchFilters')) {
                                this.userProfile = guestUserDetails;
                                this.userProfile['firstName'] = guestUserDetails.formatedName;
                                this.defaultFilters = guestUserDetails.framework ? guestUserDetails.framework : this.defaultFilters;
                            } else {
                                this.userProfile = guestUserDetails;
                                this.userProfile['firstName'] = guestUserDetails.formatedName;
                                // this.defaultFilters = this.getPersistFilters(true);
                            }
                        });
                    }
                    this._addFiltersInTheQueryParams();
                    return this.contentSearchService.initialize(this.channelId, this.custodianOrg, get(this.defaultFilters, this.frameworkCategories?.fwCategory1.code[0]));
                }),
                tap(data => {
                    this.initFilter = true;
                }, err => {
                    this.toasterService.error(get(this.resourceService, 'frmelmnts.lbl.fetchingContentFailed'));
                    this.navigationhelperService.goBack();
                })
            );
    }

    private getQueryParams = () => {
        const { queryParams, params } = this.activatedRoute;
        return combineLatest(queryParams, params).pipe(
            tap(([params = {}, queryParams = {}]) => {
                if (this.isUserLoggedIn()) {
                    this.prepareVisits([]);
                }
                this.queryParams = { ...params, ...queryParams };
            }));
    }

    ngOnInit() {
        this.cslFrameworkService?.setTransFormGlobalFilterConfig();
        this.frameworkCategories = this.cslFrameworkService?.getFrameworkCategories();
        this.frameworkCategoriesObject = this.cslFrameworkService?.getFrameworkCategoriesObject();
        this.categoryKeys = this.cslFrameworkService?.transformDataForCC();
        this.isDesktopApp = this.utilService.isDesktopApp;
        this.setUserPreferences();
        this.subscription$ = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.selectedTab = queryParams.selectedTab;
            this.showTargetedCategory = false;
            this.getFormConfigs();
        });
        this.initConfiguration();
        this.segmentationTagService.getSegmentCommand();
        const enrolledSection$ = this.getQueryParams().pipe(
            tap(() => {
                const currentPage = this._currentPageData = this.getCurrentPageData();
                this.pageTitleSrc = get(this.resourceService, 'RESOURCE_CONSUMPTION_ROOT') + get(currentPage, 'title');
                this.isFilterEnabled = true;
                if (_.get(currentPage, 'filter')) {
                    this.isFilterEnabled = _.get(currentPage, 'filter.isEnabled');
                }
                if ((_.get(currentPage, 'filter') && !_.get(currentPage, 'filter.isEnabled'))) {
                    this.fetchContents$.next(currentPage);
                }
                this.setFilterConfig(currentPage);
            }),
            switchMap(this.fetchEnrolledCoursesSection.bind(this))
        );

        this.subscription$ = merge(concat(this.fetchChannelData(), enrolledSection$), this.initLayout(), this.fetchContents())
            .pipe(
                takeUntil(this.unsubscribe$),
                catchError((err: any) => {
                    console.error(err);
                    return of({});
                })
            );
        this.listenLanguageChange();
        this.contentManagerService.contentDownloadStatus$.subscribe(contentDownloadStatus => {
            this.contentDownloadStatus = contentDownloadStatus;
            this.addHoverData();
        });
    }

    public fetchEnrolledCoursesSection() {
        return this.coursesService.enrolledCourseData$
            .pipe(
                tap(({ enrolledCourses, err }) => {
                    this.enrolledCourses = this.enrolledSection = [];
                    const sortingField = (get(this.getCurrentPageData(), 'sortingField')) ?
                        (get(this.getCurrentPageData(), 'sortingField')) : 'enrolledDate';
                    const sortingOrder = (get(this.getCurrentPageData(), 'sortingOrder')) ?
                        (get(this.getCurrentPageData(), 'sortingOrder')) : 'desc';
                    const enrolledSection = {
                        name: this.getSectionName(get(this.activatedRoute, 'snapshot.queryParams.selectedTab')),
                        length: 0,
                        count: 0,
                        contents: []
                    };
                    const { contentType: pageContentType = null, search: { filters: { primaryCategory: pagePrimaryCategories = [] } } } = this.getCurrentPageData();
                    if (err) { return enrolledSection; }
                    const enrolledContentPredicate = course => {
                        const { primaryCategory = null, contentType = null } = _.get(course, 'content') || {};
                        return pagePrimaryCategories.some(category =>
                            (_.toLower(category) === _.toLower(primaryCategory)) || (_.toLower(category) === _.toLower(contentType))) ||
                            (_.toLower(contentType) === _.toLower(pageContentType));
                    };
                    let filteredCourses = _.filter(enrolledCourses || [], enrolledContentPredicate);
                    filteredCourses = _.orderBy(filteredCourses, [sortingField], [sortingOrder]);
                    this.enrolledCourses = _.orderBy(filteredCourses, [sortingField], [sortingOrder]);
                    const { constantData, metaData, dynamicFields } = _.get(this.configService, 'appConfig.CoursePageSection.enrolledCourses');
                    enrolledSection.contents = _.map(filteredCourses, content => {
                        const formatedContent = this.utilService.processContent(content, constantData, dynamicFields, metaData);
                        formatedContent.metaData.mimeType = 'application/vnd.ekstep.content-collection';
                        formatedContent.metaData.contentType = _.get(content, 'content.primaryCategory') || _.get(content, 'content.contentType');
                        const trackableObj = _.get(content, 'content.trackable');
                        if (trackableObj) {
                            formatedContent.metaData.trackable = trackableObj;
                        }
                        return formatedContent;
                    });
                    enrolledSection.count = enrolledSection.contents.length;
                    this.enrolledSection = enrolledSection;
                }));
    }

    initLayout() {
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

    redoLayout() {
        const contentType = _.get(this.getCurrentPageData(), 'contentType');
        if (this.isDesktopApp) {
            this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
            this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
        } else {
            if (this.layoutConfiguration != null && (contentType !== 'home' && contentType !== 'explore')) {
                this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
                this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
            } else {
                this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
                this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
            }
        }
    }

    private getChannelId(): Observable<{ channelId: string, custodianOrg: boolean }> {
        if (this.isUserLoggedIn()) {
            return this.orgDetailsService.getCustodianOrgDetails()
                .pipe(
                    map(custodianOrg => {
                        const result = { channelId: this.userService.hashTagId, custodianOrg: false };
                        if (this.userService.hashTagId === get(custodianOrg, 'result.response.value')) {
                            result.custodianOrg = true;
                        }
                        return result;
                    }));
        } else {
            if (this.userService.slug) {
                return this.orgDetailsService.getOrgDetails(this.userService.slug)
                    .pipe(map(((orgDetails: any) => ({ channelId: orgDetails.hashTagId, custodianOrg: false }))));
            } else {
                return this.orgDetailsService.getCustodianOrgDetails()
                    .pipe(map(((orgDetails: any) => ({ channelId: get(orgDetails, 'result.response.value'), custodianOrg: true }))));
            }
        }
    }

    public getPageData(input) {
        const contentTypes = _.sortBy(this.formData, 'index');
        this.defaultTab = _.find(contentTypes, ['default', true]);
        return find(this.formData, data => data.contentType === input);
    }

    public getCurrentPageData() {
        return this.getPageData(get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook');
    }

    public getFilters({ filters, status }) {
        if (!filters || status === 'FETCHING') { return; }
        // If filter are available in cache; merge with incoming filters
        /* istanbul ignore if */
        // if (this.cacheService.exists('searchFilters')) {
        //     const _searchFilters = this.cacheService.get('searchFilters');
        //     const _cacheFilters = {
        //         gradeLevel: [..._.intersection(filters['gradeLevel'], _searchFilters['gradeLevel']), ..._.difference(filters['gradeLevel'], _searchFilters['gradeLevel'])],
        //         subject: [..._.intersection(filters['subject'], _searchFilters['subject']),
        //             ..._.difference(filters['subject'], _searchFilters['subject'])],
        //         medium: [..._.intersection(filters['medium'], _searchFilters['medium']), ..._.difference(filters['medium'], _searchFilters['medium'])],
        //         publisher: [..._.intersection(filters['publisher'], _searchFilters['publisher']), ..._.difference(filters['publisher'], _searchFilters['publisher'])],
        //         audience: [..._.intersection(filters['audience'], _searchFilters['audience']), ..._.difference(filters['audience'], _searchFilters['audience'])],
        //         channel: [..._.intersection(filters['channel'], _searchFilters['channel']), ..._.difference(filters['channel'], _searchFilters['channel'])],
        //         audienceSearchFilterValue: [..._.intersection(filters['audienceSearchFilterValue'], _searchFilters['audienceSearchFilterValue']),
        //             ..._.difference(filters['audienceSearchFilterValue'], _searchFilters['audienceSearchFilterValue'])],
        //         board: filters['board'],
        //         selectedTab: this.getSelectedTab()
        //     };
        //     filters = _cacheFilters;
        // }
        const currentPageData = this.getCurrentPageData();
        // const _cacheTimeout = _.get(currentPageData, 'metaData.cacheTimeout') || 86400000;
        //this.cacheService.set('searchFilters', filters, { expires: Date.now() + _cacheTimeout });
        this.showLoader = true;
        this.selectedFilters = pick(filters, _.get(currentPageData, 'metaData.filters'));
        if (has(filters, 'audience') || (localStorage.getItem('userType') && currentPageData.contentType !== 'all')) {
            const userTypes = get(filters, 'audience') || [localStorage.getItem('userType')];
            const audienceSearchFilterValue = _.get(filters, 'audienceSearchFilterValue');
            const userTypeMapping = get(this.configService, 'appConfig.userTypeMapping');
            this.selectedFilters['audience'] = audienceSearchFilterValue || uniq(flatten(_map(userTypes, userType => userTypeMapping[userType])));
        }
        if (this.utilService.isDesktopApp) {
            this.setDesktopFilters(false);
        }
        this.fetchContents$.next(currentPageData);
    }

    setDesktopFilters(isDefaultFilters) {
        const userPreferences: any = this.userService.anonymousUserPreference;
        if (userPreferences) {
            _.forEach([this.frameworkCategories?.fwCategory1?.code, this.frameworkCategories?.fwCategory2?.code, this.frameworkCategories?.fwCategory3?.code, this.frameworkCategories?.fwCategory4?.code], (item) => {
                if (!_.has(this.selectedFilters, item) || !_.get(this.selectedFilters[item], 'length')) {
                    const itemData = _.isArray(userPreferences.framework[item]) ?
                        userPreferences.framework[item] : _.split(userPreferences.framework[item], ', ');
                    if (isDefaultFilters) {
                        this.defaultFilters[item] = itemData;
                    } else {
                        this.selectedFilters[item] = itemData;
                    }
                }
            });
        }
    }

    private fetchContents() {
        return this.fetchContents$
            .pipe(
                skipWhile(data => data === undefined || data === null),
                switchMap(currentPageData => {
                    this.facetSections = [];
                    this.apiContentList = [];
                    this.pageSections = [];
                    this.svgToDisplay = get(currentPageData, 'theme.imageName');
                    this.displayBanner = (_.get(currentPageData, 'contentType') === 'home') ? true : false;

                    this.redoLayout();
                    this.facetSections = [];
                    if (_.get(currentPageData, 'filter')) {
                        this.isFilterEnabled = _.get(currentPageData, 'filter.isEnabled');
                    }
                    if (_.get(currentPageData, 'contentType') === 'explore') {
                        this.contentSections = [];
                        return this.getExplorePageSections();
                    } else {
                        const { search: { fields = [], filters = {}, facets = ['subject'] } = {}, metaData: { groupByKey = 'subject' } = {} } = currentPageData || {};
                        let _reqFilters;
                        // If home or explore page; take filters from user preferences
                        if (_.get(currentPageData, 'contentType') === 'home') {
                            _reqFilters = this.contentSearchService.mapCategories({ filters: { ..._.get(this.userPreference, 'framework') } });
                            delete _reqFilters['id'];
                            this.segmentationTagService.getUpdatedCommands().then(() => {
                                this.showorHideBanners();
                            });
                        } else {
                            _reqFilters = this.contentSearchService.mapCategories({ filters: { ...this.selectedFilters, ...filters } });
                        }
                        const request = {
                            filters: _reqFilters,
                            fields,
                            isCustodianOrg: this.custodianOrg,
                            channelId: this.channelId,
                            frameworkId: this.contentSearchService.frameworkId,
                            ...(this.isUserLoggedIn() && { limit: get(currentPageData, 'limit') }),
                            ...(get(facets, 'length') && { facets })
                        };
                        if (!this.isUserLoggedIn() && get(this.selectedFilters, 'channel') && get(this.selectedFilters, 'channel.length') > 0) {
                            request.channelId = this.selectedFilters['channel'];
                        }
                        const option = this.searchService.getSearchRequest(request, get(filters, 'primaryCategory'));
                        const params = _.get(this.activatedRoute, 'snapshot.queryParams');
                        _.filter(Object.keys(params),filterValue => { 
                            if (((_.get(currentPageData, 'metaData.filters').indexOf(filterValue) !== -1))) {
                                let param = {};
                                param[filterValue] = (typeof (params[filterValue]) === "string") ? params[filterValue].split(',') : params[filterValue];
                                if (param[filterValue].length === 1 && param[filterValue][0] === 'CBSE/NCERT') {
                                    param[filterValue][0] = "CBSE";
                                }
                                option.filters[filterValue] = (typeof (param[filterValue]) === "string") ? param[filterValue].split(',') : param[filterValue];
                            }
                        });
                        if (this.userService.loggedIn) {
                            option.filters['visibility'] = option.filters['channel'] = [];
                        }
                        return this.searchService.contentSearch(option)
                            .pipe(
                                map((response) => {
                                    const { subject: selectedSubjects = [] } = (this.selectedFilters || {}) as { subject: [] };
                                    this._facets$.next(request.facets ?
                                        this.utilService.processCourseFacetData(_.get(response, 'result'), _.get(request, 'facets')) : {});
                                    this.searchResponse = get(response, 'result.content');
                                    if (_.has(response, 'result.QuestionSet')) {
                                        this.searchResponse = _.merge(this.searchResponse, _.get(response, 'result.QuestionSet'));
                                    }
                                    const filteredContents = omit(groupBy(this.searchResponse, content => {
                                        return content[groupByKey] || content['subject'] || 'Others';
                                    }), ['undefined']);
                                    for (const [key, value] of Object.entries(filteredContents)) {
                                        const isMultipleSubjects = key && key.split(',').length > 1;
                                        if (isMultipleSubjects) {
                                            const subjects = key && key.split(',');
                                            subjects.forEach((subject) => {
                                                if (filteredContents[subject]) {
                                                    filteredContents[subject] = uniqBy(filteredContents[subject].concat(value), 'identifier');
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
                                            if (selectedSubjects.length && !(find(selectedSubjects, selectedSub => toLower(selectedSub) === toLower(section)))) {
                                                continue;
                                            }
                                            sections.push({
                                                name: section,
                                                contents: filteredContents[section]
                                            });
                                        }
                                    }
                                    // Construct data array for sections
                                    if (_.get(currentPageData, 'sections') && _.get(currentPageData, 'sections').length > 0) {
                                        const facetKeys = _.map(currentPageData.sections, (section) => section.facetKey);
                                        facetKeys.push(currentPageData.sections.find(section => section.merge).merge.destination);
                                        const facets = this.utilService.processCourseFacetData(_.get(response, 'result'), facetKeys);
                                        forEach(currentPageData.sections, facet => {
                                            if (_.get(facets, facet.facetKey)) {
                                                const _facetArray = [];
                                                forEach(facets[facet.facetKey], _facet => {
                                                    if (facet.filter) {
                                                        for (const key in facet.filter) {
                                                            if (facet.filter[key].includes(_facet['name'])) {
                                                                _facetArray.push({
                                                                    name: _facet['name'] === 'tv lesson' ? 'tv classes' : _facet['name'],
                                                                    value: _facet['name'],
                                                                    theme: this.utilService.getRandomColor(facet.theme.colorMapping),
                                                                    type: _facet.type ? _facet.type : '',
                                                                    landing: facet.landing ? facet.landing : '',
                                                                    search: facet.search
                                                                });
                                                            }
                                                        }
                                                    } else {
                                                        _facetArray.push({
                                                            name: _facet['name'],
                                                            value: _facet['name'],
                                                            theme: this.utilService.getRandomColor(facet.theme.colorMapping),
                                                            type: _facet.type ? _facet.type : '',
                                                            landing: facet.landing ? facet.landing : '',
                                                            search: facet.search
                                                        });
                                                    }
                                                });
                                                this.facetSections.push({
                                                    name: facet.facetKey,
                                                    data: _.sortBy(_facetArray, ['name']),
                                                    section: facet,
                                                    isEnabled: facet.isEnabled,
                                                    index: facet.index
                                                });
                                            }
                                        });
                                        this.facetSections = _.sortBy(this.facetSections, ['index']);
                                        if (facetKeys.indexOf('search') > -1) {
                                            this.contentSections = [];
                                            const searchSections = currentPageData.sections.filter(sec => sec.facetKey === 'search');
                                            searchSections.forEach((item) => {
                                                this.contentSections.push(this.getContentSection(item, option));
                                            });

                                        }
                                    }
                                    return _map(sections, (section) => {
                                        forEach(section.contents, contents => {
                                            contents.cardImg = contents.appIcon || 'assets/images/book.png';
                                        });
                                        return section;
                                    });
                                }), tap(data => {
                                    // this.userPreference = this.setUserPreferences();
                                    this.showLoader = false;
                                    const userProfileSubjects = _.get(this.userService, 'userProfile.framework.subject') || [];
                                    const [userSubjects, notUserSubjects] = partition(sortBy(data, ['name']), value => {
                                        const { name = null } = value || {};
                                        if (!name) { return false; }
                                        return find(userProfileSubjects, subject => toLower(subject) === toLower(name));
                                    });
                                    this.apiContentList = [...userSubjects, ...notUserSubjects];
                                    if (this.apiContentList !== undefined && !this.apiContentList.length) {
                                        return;
                                    }
                                    this.pageSections = this.apiContentList.slice(0, 4);
                                    this.addHoverData();
                                }, err => {
                                    this.showLoader = false;
                                    this.apiContentList = [];
                                    this.pageSections = [];
                                    this.toasterService.error(this.resourceService.messages.fmsg.m0004);
                                }));
                    }
                })
            );
    }

    getFormConfigs() {
        if (this.selectedTab === 'home') {
            if (!this.userType) {
                if (this.isUserLoggedIn()) {
                    this.userService.userData$.subscribe((profileData: IUserData) => {
                        if (profileData
                            && profileData.userProfile
                            && profileData.userProfile['profileUserType']) {
                            this.userType = profileData.userProfile['profileUserType']['type'];
                        }
                    });
                } else {
                    const user = localStorage.getItem('userType');
                    if (user) {
                        this.userType = user;
                    }
                }
            }
            this.observationUtil.browseByCategoryForm()
                .then((data: any) => {
                    let currentBoard;
                    if (this.userPreference && this.userPreference['framework'] && this.userPreference['framework']['id']) {
                        currentBoard = Array.isArray(this.userPreference?.framework?.id) ? (this.userPreference?.framework?.id[0]) : (this.userPreference?.framework?.id);
                    }
                    const currentUserType = this.userType?.toLowerCase();
                    if (currentUserType && currentBoard && data && data[currentBoard] &&
                        data[currentBoard][currentUserType]) {
                        this.showTargetedCategory = true;
                        this.dataThemeAttribute = document.documentElement.getAttribute('data-mode');
                        const pillBgColor = this.dataThemeAttribute === 'light'? "rgba(255,255,255,1)" :"rgba(36,37,36,1)" 
                        this.targetedCategory = data[currentBoard][currentUserType];
                        this.targetedCategorytheme = {
                            "iconBgColor": "rgba(255,255,255,1)",
                            "pillBgColor": pillBgColor
                        }
                        this.Categorytheme = {
                            "iconBgColor": "rgba(255,0,0,0)",
                            "pillBgColor": "rgba(255,0,0,0)"
                        }
                    }
                    else {
                        this.showTargetedCategory = false
                    }
                });
        }
    }

    private getContentSection(section, searchOptions) {
        this.globalFilterCategories = this.cslFrameworkService.getAlternativeCodeForFilter();
        const sectionFilters = _.get(section, 'apiConfig.req.request.filters');
        const requiredProps = [this.globalFilterCategories[0], this.globalFilterCategories[1], this.globalFilterCategories[2]];
        if (_.has(sectionFilters, ...requiredProps) && searchOptions.filters) {
            const preferences = _.pick(searchOptions.filters, requiredProps);
            section.apiConfig.req.request.filters = { ...section.apiConfig.req.request.filters, ...preferences };
        }
        return {
            isEnabled: Boolean(_.get(section, 'isEnabled')),
            searchRequest: _.get(section, 'apiConfig.req'),
            title: get(this.resourceService, section.title) ? section.title : section.defaultTitle
        };
    }

    addHoverData() {
        each(this.pageSections, (pageSection) => {
            forEach(pageSection.contents, contents => {
                if (this.contentDownloadStatus[contents.identifier]) {
                    contents['downloadStatus'] = this.contentDownloadStatus[contents.identifier];
                }
            });
            this.pageSections[pageSection] = this.utilService.addHoverData(pageSection.contents, true);
        });
    }

    public playContent(event, sectionName?) {
        const telemetryData = {
            cdata: [{
                type: 'Section',
                id: (sectionName && sectionName.includes('NCERT')) ? 'NCERT' : sectionName
            }],
            edata: {
                id: 'content-card',
            },
            object: {
                id: event.data.identifier,
                type: event.data.contentType || 'content',
                ver: event.data.pkgVersion ? event.data.pkgVersion.toString() : '1.0'
            }
        };
        this.getInteractEdata(telemetryData);
        this.moveToTop();
        if (this.isUserLoggedIn()) {
            this.playerService.playContent(event.data);
        } else {
            this.publicPlayerService.playContent(event);
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setTelemetryData();
        });
        if (this.isUserLoggedIn() && !(this.cacheService.get('reloadOnFwChange'))) {
            this.cacheService.set('reloadOnFwChange', true)
            window.location.reload();
        }

    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private setTelemetryData() {
        const uri = this.isUserLoggedIn() ? this.router.url : (this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url);
        this.exploreMoreButtonEdata = {
            id: 'explore-more-content-button',
            type: 'click',
            pageid: this.isUserLoggedIn() ? 'library' : this.activatedRoute.snapshot.data.telemetry.pageid
        };
        this.telemetryImpression = {
            context: {
                env: this.isUserLoggedIn() ? 'library' : this.activatedRoute.snapshot.data.telemetry.env
            },
            edata: {
                type: this.activatedRoute.snapshot.data.telemetry.type,
                pageid: this.isUserLoggedIn() ? 'library' : this.activatedRoute.snapshot.data.telemetry.pageid,
                uri,
                subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
                duration: this.navigationhelperService.getPageLoadTime()
            }
        };
    }

    private listenLanguageChange() {
        this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((languageData) => {
            this.setNoResultMessage();
            if (_.get(this.pageSections, 'length') && this.isDesktopApp) {
                this.addHoverData();
            }
        });
    }

    private setNoResultMessage() {
        const { key = null, selectedTab = null } = this.activatedRoute.snapshot.queryParams;
        let {
            noBookfoundTitle: title,
            noBookfoundTitle: subTitle,
            noBookfoundTitle: buttonText,
            noContentfoundTitle,
            noContentfoundSubTitle,
            noContentfoundButtonText,
            desktop: { yourSearch = '', notMatchContent = '' } = {}
        } = get(this.resourceService, 'frmelmnts.lbl');
        title = this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noBookfoundTitle'), 'frmelmnts.lbl.noBookfoundTitle', this.resourceService.selectedLang);
        subTitle = this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noBookfoundTitle'), 'frmelmnts.lbl.noBookfoundTitle', this.resourceService.selectedLang);
        buttonText = this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noBookfoundTitle'), 'frmelmnts.lbl.noBookfoundTitle', this.resourceService.selectedLang);
        noContentfoundSubTitle = this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noContentfoundSubTitle'), 'frmelmnts.lbl.noContentfoundSubTitle', this.resourceService.selectedLang);
        noContentfoundTitle = this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noContentfoundTitle'), 'frmelmnts.lbl.noContentfoundTitle', this.resourceService.selectedLang);

        if (key) {
            const title_part1 = replace(yourSearch, '{key}', key);
            const title_part2 = notMatchContent;
            title = title_part1 + ' ' + title_part2;
        } else if (selectedTab !== 'textbook') {
            title = noContentfoundTitle;
            subTitle = noContentfoundSubTitle;
            buttonText = noContentfoundButtonText;
        }
        this.noResultMessage = { title, subTitle, buttonText, showExploreContentButton: true };
    }

    public navigateToExploreContent() {
        const navigationUrl = this.isUserLoggedIn() ? 'search/Library' : 'explore';
        const queryParams = {
            ...this.selectedFilters,
            appliedFilters: false,
            ...(!this.isUserLoggedIn() && {
                pageTitle: get(this.resourceService, get(this.getCurrentPageData(), 'title')),
                softConstraints: JSON.stringify({ badgeAssertions: 100, channel: 99, gradeLevel: 98, medium: 97, board: 96 })
            })
        };
        this.router.navigate([navigationUrl, 1], { queryParams });
    }

    navigateToCourses(event) {
        const telemetryData = {
            cdata: [{
                type: 'library-courses',
                id: get(event, 'data.title'),
            }],
            edata: {
                id: 'course-card'
            },
            object: {}
        };
        this.getInteractEdata(telemetryData);
        if (get(event, 'data.contents.length') === 1) {
            if (!this.isUserLoggedIn()) {
                this.router.navigate(['explore-course/course', get(event, 'data.contents[0].identifier')]);
            } else {
                const metaData = pick(event.data.contents[0], ['identifier', 'mimeType', 'framework', 'contentType']);
                const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } =
                    this.coursesService.findEnrolledCourses(metaData.identifier);

                /* istanbul ignore else */
                if (!expiredBatchCount && !onGoingBatchCount) { // go to course preview page, if no enrolled batch present
                    return this.playerService.playContent(metaData);
                }

                if (onGoingBatchCount === 1) { // play course if only one open batch is present
                    metaData.batchId = openBatch.ongoing.length ? openBatch.ongoing[0].batchId : inviteOnlyBatch.ongoing[0].batchId;
                    return this.playerService.playContent(metaData);
                } else {
                    this.toasterService.error(this.resourceService.messages.fmsg.m0051);
                }
            }
        } else {
            this.searchService.subjectThemeAndCourse = event.data;
            const navigationUrl = this.isUserLoggedIn() ? 'resources/curriculum-courses' : 'explore/list/curriculum-courses';
            this.router.navigate([navigationUrl], {
                queryParams: {
                    title: get(event, 'data.title')
                },
            });
        }
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
                this.downloadIdentifier = get(event, 'content.identifier');
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

    callDownload() {
        this.showDownloadLoader = true;
        this.downloadContent(this.downloadIdentifier);
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
                each(this.pageSections, (pageSection) => {
                    each(pageSection.contents, (pageData) => {
                        pageData['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
                    });
                });
                if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
                    this.toasterService.error(this.resourceService.messages.fmsg.m0090);
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
                env: get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
                    get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
                    get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env')
            },
            edata: {
                id: actionId,
                type: 'click',
                pageid: this.router.url.split('/')[1] || 'explore-page'
            }
        };

        if (telemetryInteractObject) {
            if (telemetryInteractObject.ver) {
                telemetryInteractObject.ver = isNumber(telemetryInteractObject.ver) ?
                    toString(telemetryInteractObject.ver) : telemetryInteractObject.ver;
            }
            appTelemetryInteractData.object = telemetryInteractObject;
        }
        this.telemetryService.interact(appTelemetryInteractData);
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

    public playEnrolledContent(event, sectionType?) {
        if (!this.isUserLoggedIn()) {
            this.publicPlayerService.playContent(event);
        } else {
            if (sectionType) {
                event.section = this.getSectionName(get(this.activatedRoute, 'snapshot.queryParams.selectedTab'));
                event.data.identifier = _.get(event, 'data.metaData.courseId');
            }
            const { section, data } = event;
            const isPageAssemble = _.get(this.getCurrentPageData(), 'isPageAssemble');
            const metaData = isPageAssemble ? _.get(data, 'metaData') : data;

            const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } =
                this.coursesService.findEnrolledCourses(metaData.identifier);

            if (!expiredBatchCount && !onGoingBatchCount) { // go to course preview page, if no enrolled batch present
                return this.playerService.playContent(metaData);
            }
            if (sectionType) {
                metaData.batchId = _.get(metaData, 'metaData.batchId');
                metaData.trackable = {
                    enabled: 'Yes'
                };
                return this.playerService.playContent(metaData);
            }

            if (onGoingBatchCount === 1) { // play course if only one open batch is present
                metaData.batchId = _.get(openBatch, 'ongoing.length') ? _.get(openBatch, 'ongoing[0].batchId') : _.get(inviteOnlyBatch, 'ongoing[0].batchId');
                return this.playerService.playContent(metaData);
            } else if (onGoingBatchCount === 0 && expiredBatchCount === 1) {
                metaData.batchId = _.get(openBatch, 'expired.length') ? _.get(openBatch, 'expired[0].batchId') : _.get(inviteOnlyBatch, 'expired[0].batchId');
                return this.playerService.playContent(metaData);
            }
            this.selectedCourseBatches = { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch, courseId: metaData.identifier };
            this.showBatchInfo = true;
        }
    }


    logViewAllTelemetry(event) {
        const telemetryData = {
            cdata: [{
                type: 'Section',
                id: (event && event.name && event.name.includes('NCERT')) ? 'NCERT' : event.name
            }],
            edata: {
                id: 'view-all'
            }
        };
        this.getInteractEdata(telemetryData);
    }

    public viewAll(event, contentSection?) {
        this.moveToTop();
        let searchQuery;
        if (contentSection) {
            event = { contents: event.data, count: event.data.length, name: contentSection.title };
            searchQuery = contentSection.searchRequest;
        } else {
            if (this.isUserLoggedIn() && !_.get(event, 'searchQuery')) {
                searchQuery = JSON.parse(this.myCoursesSearchQuery);
            } else {
                searchQuery = JSON.parse(event.searchQuery);
            }
        }

        this.logViewAllTelemetry(event);
        const searchQueryParams: any = {};
        _.forIn(searchQuery.request.filters, (value, key) => {
            if (_.isPlainObject(value)) {
                searchQueryParams.dynamic = JSON.stringify({ [key]: value });
            } else {
                searchQueryParams[key] = value;
            }
        });
        searchQueryParams.defaultSortBy = _.get(searchQuery, 'request.sort_by') ? JSON.stringify(searchQuery.request.sort_by) : JSON.stringify({ lastPublishedOn: 'desc' });
        searchQueryParams['exists'] = _.get(searchQuery, 'request.exists');
        searchQueryParams['isContentSection'] = Boolean(contentSection);
        if (this.isUserLoggedIn()) {
            this.cacheService.set('viewAllQuery', searchQueryParams, { maxAge: 600 });
        } else {
            this.cacheService.set('viewAllQuery', searchQueryParams);
        }
        this.cacheService.set('pageSection', event, { maxAge: this.browserCacheTtlService.browserCacheTtl });
        const queryParams = contentSection ? { ...searchQueryParams, ...{ selectedTab: this.queryParams.selectedTab } } :
            { ...searchQueryParams, ...this.queryParams };
        const sectionUrl = _.get(this.router, 'url.split') && this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
        this.router.navigate([sectionUrl, 1], { queryParams: queryParams, state: { currentPageData: this.getCurrentPageData() } });
    }

    private getSectionName(selectedTab) {
        let sectionName;
        switch (_.toLower(selectedTab)) {
            case 'textbook': {
                sectionName = 'tbk.trk.frmelmnts.lbl.mytrainings';
                break;
            }
            case 'course': {
                sectionName = 'crs.trk.frmelmnts.lbl.mytrainings';
                break;
            }
            case 'tvprogram': {
                sectionName = 'tvc.trk.frmelmnts.lbl.mytrainings';
                break;
            }
            default: {
                sectionName = 'frmelmnts.lbl.myEnrolledCollections';
            }
        }
        return sectionName;
    }

    sectionViewAll() {
        const searchQueryParams: any = {};
        if (this.selectedFacet) {
            if (_.get(this._currentPageData.search.filters, 'filters.' + this.selectedFacet.facet)) {
                this._currentPageData.search.filters[this.selectedFacet.facet].push(this.selectedFacet.value);
            } else {
                this._currentPageData.search.filters[this.selectedFacet.facet] = [];
                this._currentPageData.search.filters[this.selectedFacet.facet].push(this.selectedFacet.value);
            }
        }
        _.forIn(this._currentPageData.search.filters, (value, key) => {
            if (_.isPlainObject(value)) {
                searchQueryParams.dynamic = JSON.stringify({ [key]: value });
            } else {
                searchQueryParams[key] = value;
            }
        });
        searchQueryParams.defaultSortBy = JSON.stringify({ lastPublishedOn: 'desc' });
        if (this.isUserLoggedIn()) {
            this.cacheService.set('viewAllQuery', searchQueryParams, { maxAge: 600 });
        } else {
            this.cacheService.set('viewAllQuery', searchQueryParams);
        }
        delete this.queryParams['id'];
        const queryParams = { ...searchQueryParams, ...this.queryParams };
        const sectionUrl = _.get(this.router, 'url.split') && this.router.url.split('?')[0] + '/view-all/' + 'Suggested'.replace(/\s/g, '-');
        this.router.navigate([sectionUrl, 1], { queryParams: queryParams, state: { currentPageData: this.getCurrentPageData() } });
    }

    setUserPreferences() {
        try {
            if (this.isUserLoggedIn()) {
                this.userPreference = { framework: this.userService.defaultFrameworkFilters };
                this.transformUserPreference = this.cslFrameworkService.frameworkLabelTransform(this.frameworkCategoriesObject,this.userPreference);
            } else {
                this.userService.getGuestUser().subscribe((response) => {
                    this.userPreference = response;
                    this.transformUserPreference = this.cslFrameworkService.frameworkLabelTransform(this.frameworkCategoriesObject,this.userPreference);
                });
            }
        } catch (error) {
            return null;
        }
    }

    convertToString(value) {
        return _.isArray(value) ? _.join(value, ', ') : undefined;
    }

    handlePillSelect(event, facetName) {
        if (!event || !event.data || !event.data.length) {
            return;
        }
        let params = {};
        const contentType = _.get(this.getCurrentPageData(), 'contentType');
        if (contentType === 'home') {
            params = _.omit(this.queryParams, ['id', 'selectedTab']);
        }
        params[event.data[0].value.type ? event.data[0].value.type : facetName] = event.data[0].value.value;
        params['selectedTab'] = 'all';
        params['showClose'] = 'true';
        params['isInside'] = event.data[0].value.name;
        params['returnTo'] = contentType;
        params['title'] = event.data[0].value.landing ? event.data[0].value.landing.title : '';
        params['description'] = event.data[0].value.landing ? event.data[0].value.landing.description : '';
        params['ignoreSavedFilter'] = true;

        const updatedCategoriesMapping = _.mapKeys(params, (_, key) => {
            const mappedValue = get(this.contentSearchService.getCategoriesMapping, [key]);
            return mappedValue || key;
        });

        const paramValuesInLowerCase = _.mapValues(updatedCategoriesMapping, value => {
            return Array.isArray(value) ? _.map(value, _.toLower) : _.toLower(value);
        });

        params = paramValuesInLowerCase;
        params['searchFilters'] = event.data[0].value.search ? JSON.stringify(event.data[0].value.search.facets) : '';

        if (this.isUserLoggedIn()) {
            this.router.navigate(['search/Library', 1], { queryParams: params });
        } else {
            this.router.navigate(['explore', 1], { queryParams: params });
        }
    }

    handleTargetedpillSelected(event) {
        if (!event || !event.data || !event.data.length) {
            return;
        }
        let pillData = event.data[0].value;
        if (_.isEmpty(pillData)) {
            return;
        }
        if (this.isUserLoggedIn()) {
            if (pillData.name === 'observations') {
                this.router.navigate(['observation']);
            }
        } else {
            window.location.href = pillData.name === 'observations' ? '/observation' : '/resources'
        }
    }


    getSectionTitle(title) {
        let _sectionTitle = this.utilService.transposeTerms(get(this.resourceService, title), get(this.resourceService, title) || '', this.resourceService.selectedLang);
        return get(this.resourceService, 'frmelmnts.lbl.browseBy') + ' ' + _sectionTitle;

    }

    getContentSectionTitle(title) {
        let _sectionTitle = this.utilService.transposeTerms(get(this.resourceService, title), get(this.resourceService, title) || '', this.resourceService.selectedLang) || title;
        return _sectionTitle;
    }

    getSectionCategoryTitle(title) {
        return get(this.resourceService, 'frmelmnts.lbl.browseOther') + ' ' + get(this.resourceService, title);
    }

    getBannerTitle(title) {
        return get(this.resourceService, title);
    }

    getSelectedTab() {
        return get(this.activatedRoute, 'snapshot.queryParams.selectedTab');
    }

    updateProfile(event) {
        if (this.isUserLoggedIn()) {
            this.profileService.updateProfile({ framework: event }).subscribe(res => {
                this.userPreference.framework = event;
                this.transformUserPreference = this.cslFrameworkService.frameworkLabelTransform(this.frameworkCategoriesObject,this.userPreference);
                this.getFormConfigs();
                this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
                this._addFiltersInTheQueryParams(event);
                this.showorHideBanners();
                if (window['TagManager']) {
                    window['TagManager'].SBTagService.pushTag(this.userPreference, 'USERFRAMEWORK_', true);
                }
            }, err => {
                this.toasterService.warning(this.resourceService.messages.emsg.m0012);
            });
        } else {
            const req = { ...this.userPreference, framework: event };
            this.userService.updateGuestUser(req).subscribe(res => {
                this.userPreference.framework = event;
                this.transformUserPreference = this.cslFrameworkService.frameworkLabelTransform(this.frameworkCategoriesObject,this.userPreference);
                this.getFormConfigs();
                this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
                this.showorHideBanners();
                if (window['TagManager']) {
                    window['TagManager'].SBTagService.pushTag(this.userPreference, 'USERFRAMEWORK_', true);
                }
            }, err => {
                this.toasterService.warning(_.get(this.resourceService, 'messages.emsg.m0012'));
            });
        }
        // this.setUserPreferences();
        // this.fetchContents$.next(this._currentPageData);
    }

    getExplorePageSections() {
        return of(forEach(this.getCurrentPageData().sections, facet => {
            const _facetArray = [];
            forEach(facet.data, _facet => {
                _facetArray.push({
                    name: _facet['name'],
                    value: _facet['value'],
                    landing: facet.landing ? facet.landing : '',
                    search: facet.search
                });
            });
            this.facetSections.push({
                name: facet.facetKey,
                data: _facetArray,
                section: facet
            });
        }));
    }

    showorHideBanners() {
        this.bannerSegment = [];
        this.segmentationTagService.exeCommands.find((cmd) => {
            if (cmd.controlFunction === 'BANNER_CONFIG') {
                const banners = _.get(cmd, 'controlFunctionPayload.values');
                forEach(banners, banner => {
                    this.bannerSegment.push(banner);
                });
            }
        });
        this.displayBanner = (this.bannerSegment && this.bannerSegment.length > 0) ? true : false;
        this.bannerList = [];
        if (this.bannerSegment && this.bannerSegment.length) {
            this.setBannerConfig();
        }
    }

    setBannerConfig() {
        this.bannerList = this.bannerSegment.filter((value) =>
            Number(value.expiry) > Math.floor(Date.now() / 1000)
        );
        this.primaryBanner = [];
        this.secondaryBanner = [];
        this.bannerList.forEach((banner) => {
            if (banner.type === 'secondary') {
                this.secondaryBanner.push(banner);
            } else {
                this.primaryBanner.push(banner);
            }
        });
    }

    navigateToSpecificLocation(data) {
        switch (data.code) {
            case 'banner_external_url':
                window.open(_.get(data.action, 'params.route'), '_blank');
                break;
            case 'banner_search':
                const queryParams = _.get(data.action, 'params.filter.filters');
                if (_.get(data.action, 'params.query')) {
                    queryParams['key'] = _.get(data.action, 'params.query');
                }
                const contentType = _.get(this.getCurrentPageData(), 'contentType');
                queryParams['showClose'] = 'true';
                queryParams['returnTo'] = contentType;
                queryParams['isInside'] = (data.ui && data.ui.landing && data.ui.text) || '';
                queryParams['selectedTab'] = 'all';
                queryParams['title'] = (data.ui && data.ui.landing && data.ui.landing.title) || '';
                queryParams['description'] = (data.ui && data.ui.landing && data.ui.landing.description) || '';
                if (this.isUserLoggedIn()) {
                    this.router.navigate(['search/Library', 1], { queryParams: queryParams });
                } else {
                    this.router.navigate(['explore', 1], { queryParams: queryParams });
                }
                break;
            case 'banner_internal_url':
                const route = _.get(data.action, 'params.route');
                const anonymousUrl = _.get(data.action, 'params.anonymousRoute');
                const url = (this.isUserLoggedIn()) ? route : anonymousUrl;
                if (url) {
                    this.router.navigate([url]);
                    this.moveToTop();
                } else {
                    this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
                }
                break;
            case 'banner_content':
                const contentId = _.get(data.action, 'params.identifier');
                const params = {};
                params['key'] = contentId;
                params['selectedTab'] = 'all';
                params['text'] = data.ui.text;
                this.router.navigate(['explore', 1], { queryParams: params });
                break;
        }
    }
    public moveToTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
    handleBannerClick(data) {
        const telemetryData = {
            context: {
                env: this.activatedRoute.snapshot.data.telemetry.env,
                cdata: [{
                    id: data.code,
                    type: (data.type && data.type === 'secondary') ? 'AdditionalBanner' : 'Banner'
                }]
            },
            edata: {
                id: data.code,
                type: 'click',
                pageid: this.activatedRoute.snapshot.data.telemetry.pageid
            }
        };
        this.telemetryService.interact(telemetryData);
    }

    getPersistFilters(defaultFilters?) {
        if (this.cacheService.exists('searchFilters')) {
            const _filter = this.cacheService.get('searchFilters');
            if (defaultFilters) {
                return {
                    [this.frameworkCategories?.fwCategory1?.code]: this.isUserLoggedIn() ? _.get(this.userService.defaultFrameworkFilters, this.frameworkCategories?.fwCategory1?.code) : _.get(_filter, this.frameworkCategories?.fwCategory1?.code),
                    [this.frameworkCategories?.fwCategory3?.code]: _.get(_filter, this.frameworkCategories?.fwCategory3?.code,),
                    [this.frameworkCategories?.fwCategory2?.code]: _.get(_filter, this.frameworkCategories?.fwCategory2?.code),
                    [this.frameworkCategories?.fwCategory4?.code]: _.get(_filter, this.frameworkCategories?.fwCategory4?.code)
                };
            }
        }
    }
    /**
     * Sets the filter configuration based on the current page data or retrieves it from the framework based data
     * @param currentPage - Optional parameter representing the current page data.
     */
    private setFilterConfig(currentPage) {
        this.filterResponseData = {};
        const currentPageData = currentPage ? currentPage : this.getCurrentPageData();
        if (currentPageData) {
            const filterResponseData = _.get(currentPageData, 'metaData.searchFilterConfig');
            this.filterResponseData = filterResponseData ? filterResponseData :
                this.cslFrameworkService.transformPageLevelFilter(this.frameworkCategoriesObject, this.frameworkCategories);
            this.userSelectedPreference = _.get(this, 'userPreference.framework');
            this.refreshFilter = false;
            this.cdr.detectChanges();
            this.refreshFilter = true;
        }
    }
    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
} 