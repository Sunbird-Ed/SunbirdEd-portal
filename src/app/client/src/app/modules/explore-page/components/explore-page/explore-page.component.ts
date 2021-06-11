import { forkJoin, Subject, Observable, BehaviorSubject, merge, of, concat, combineLatest } from 'rxjs';
import { OrgDetailsService, UserService, SearchService, FormService, PlayerService, CoursesService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import {
    ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService, COLUMN_TYPE, UtilService,
    OfflineCardService, BrowserCacheTtlService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep, get, find, map as _map, pick, omit, groupBy, sortBy, replace, uniqBy, forEach, has, uniq, flatten, each, isNumber, toString, partition, toLower, includes } from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { map, tap, switchMap, skipWhile, takeUntil, catchError, startWith } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
import { ContentManagerService } from '../../../public/module/offline/services';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';
import { ProfileService } from '@sunbird/profile';


@Component({
    selector: 'app-explore-page-component',
    templateUrl: './explore-page.component.html',
    styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('frameworkModal', { static: false }) frameworkModal;
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
    public selectedFilters = {};
    exploreMoreButtonEdata: IInteractEventEdata;
    public numberOfSections;
    public isLoading = true;
    public cardData: Array<{}> = [];
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
    private _facets$ = new Subject();
    public showBatchInfo = false;
    public enrolledCourses: Array<any>;
    public enrolledSection: any;
    public selectedCourseBatches: any;
    private myCoursesSearchQuery = JSON.stringify({
        'request': { "filters": { "contentType": ["Course"], "objectType": ["Content"], "status": ["Live"] }, "sort_by": { "lastPublishedOn": "desc" }, "limit": 10, "organisationId": _.get(this.userService.userProfile, 'organisationIds') }
    });
    public facets$ = this._facets$.asObservable().pipe(startWith({}), catchError(err => of({})));
    queryParams: { [x: string]: any; };
    _currentPageData: any;
    facetSections: any = [];
    instance: string;
    userPreference: any;
    searchResponse: any = [];
    selectedFacet: { facet: any; value: any; };
    showEdit = false;
    isFilterEnabled: boolean = true;
    defaultTab = 'Textbook'

    get slideConfig() {
        return cloneDeep(this.configService.appConfig.LibraryCourses.slideConfig);
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
        private browserCacheTtlService: BrowserCacheTtlService, private profileService: ProfileService) {
            this.instance = (<HTMLInputElement>document.getElementById('instance'))
            ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
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

    private _addFiltersInTheQueryParams() {
        this.getCurrentPageData();
        if (!_.get(this.activatedRoute, 'snapshot.queryParams["board"]')) {
            const queryParams = { ...this.defaultFilters, selectedTab: _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook' };
            this.router.navigate([], { queryParams, relativeTo: this.activatedRoute });
        }
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
                        this.defaultFilters = this.userService.defaultFrameworkFilters;
                    } else if (!this.isDesktopApp) {
                        let guestUserDetails: any = localStorage.getItem('guestUserDetails');
                        if (guestUserDetails) {
                            guestUserDetails = JSON.parse(guestUserDetails);
                            this.defaultFilters = guestUserDetails.framework ? guestUserDetails.framework : this.defaultFilters;
                        }
                    }
                    this._addFiltersInTheQueryParams();
                    return this.contentSearchService.initialize(this.channelId, this.custodianOrg, get(this.defaultFilters, 'board[0]'));
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
                    this.prepareVisits([])
                }
                this.queryParams = { ...params, ...queryParams };
            }))
    }

    ngOnInit() {
        this.isDesktopApp = this.utilService.isDesktopApp;
        this.userPreference = this.setUserPreferences();
        this.initConfiguration();

        const enrolledSection$ = this.getQueryParams().pipe(
                tap(() => {
                    const currentPage = this._currentPageData = this.getCurrentPageData();
                    this.pageTitleSrc = get(this.resourceService, 'RESOURCE_CONSUMPTION_ROOT') + get(currentPage, 'title');
                    this.isFilterEnabled = true;
                    if (_.get(currentPage, 'filter')) {
                        this.isFilterEnabled = _.get(currentPage, 'filter.isEnabled')
                    }
                    if ((_.get(currentPage, 'filter') && !_.get(currentPage, 'filter.isEnabled'))) {
                        this.fetchContents$.next(currentPage);
                    }
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

                    const enrolledSection = {
                        name: this.getSectionName(get(this.activatedRoute, 'snapshot.queryParams.selectedTab')),
                        length: 0,
                        count: 0,
                        contents: []
                    };
                    const { contentType: pageContentType = null, search: { filters: { primaryCategory: pagePrimaryCategories = [] } } } = this.getCurrentPageData();
                    if (err) return enrolledSection;
                    const enrolledContentPredicate = course => {
                        const { primaryCategory = null, contentType = null } = _.get(course, 'content') || {};
                        return pagePrimaryCategories.some(category => _.toLower(category) === _.toLower(primaryCategory)) || (_.toLower(contentType) === _.toLower(pageContentType));
                    };
                    const filteredCourses = _.filter(enrolledCourses || [], enrolledContentPredicate);
                    this.enrolledCourses = _.orderBy(filteredCourses, ['enrolledDate'], ['desc']);
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
        this.defaultTab = _.find(contentTypes, ['default', true]);
        return find(this.formData, data => data.contentType === input);
    }

    public getCurrentPageData() {
        return this.getPageData(get(this.activatedRoute, 'snapshot.queryParams.selectedTab')|| _.get(this.defaultTab, 'contentType') || 'textbook');
    }

    public getFilters({ filters, status }) {
        if (!filters || status === 'FETCHING') { return; }
        this.showLoader = true;
        const currentPageData = this.getCurrentPageData();
        this.selectedFilters = pick(filters, ['board', 'medium', 'gradeLevel', 'channel', 'subject', 'audience']);
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
                _.forEach(['board', 'medium', 'gradeLevel', 'subject'], (item) => {
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

                    this.redoLayout();
                    this.facetSections = [];
                    if (_.get(currentPageData, 'filter')) {
                        this.isFilterEnabled = _.get(currentPageData, 'filter.isEnabled')
                    }
                    if(_.get(currentPageData, 'contentType') === 'explore') {
                        return this.getExplorePageSections();
                    } else {
                        const { search: { fields = [], filters = {}, facets = ['subject'] } = {}, metaData: { groupByKey = 'subject' } = {} } = currentPageData || {};
                    let _reqFilters;
                    // If home or explore page; take filters from user preferences
                    if (_.get(currentPageData, 'contentType') === 'home') {
                        _reqFilters = this.contentSearchService.mapCategories({ filters: _.get(this.userPreference, 'framework') });
                        delete _reqFilters['id'];
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
                    return this.searchService.contentSearch(option)
                        .pipe(
                            map((response) => {
                                const { subject: selectedSubjects = [] } = (this.selectedFilters || {}) as { subject: [] };
                                this._facets$.next(request.facets ? this.utilService.processCourseFacetData(_.get(response, 'result'), _.get(request, 'facets')) : {});
                                this.searchResponse = get(response, 'result.content');
                                const filteredContents = omit(groupBy(get(response, 'result.content'), content => {
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
                                    const facetKeys = _.map(currentPageData.sections, (section) => { return section.facetKey });
                                    const facets = this.utilService.processCourseFacetData(_.get(response, 'result'), facetKeys);
                                    forEach(currentPageData.sections, facet => {
                                        if (_.get(facets, facet.facetKey) && _.get(facets, facet.facetKey).length > 0) {
                                            let _facetArray = [];
                                            forEach(facets[facet.facetKey], _facet => {
                                                _facetArray.push({
                                                    name: _facet['name'],
                                                    value: _facet['name'],
                                                    theme: this.utilService.getRandomColor(facet.theme.colorMapping)
                                                });
                                            });
                                            this.facetSections.push({
                                                name: facet.facetKey,
                                                data: _.sortBy(_facetArray, ['name']),
                                                section: facet
                                            });
                                        }
                                    });
                                }
                                return _map(sections, (section) => {
                                    forEach(section.contents, contents => {
                                        contents.cardImg = contents.appIcon || 'assets/images/book.png';
                                    });
                                    return section;
                                });
                            }), tap(data => {
                                this.userPreference = this.setUserPreferences();
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
                type: 'section',
                id: sectionName
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
        let { noBookfoundTitle: title, noBookfoundTitle: subTitle, noBookfoundTitle: buttonText, noContentfoundTitle, noContentfoundSubTitle, noContentfoundButtonText,
            desktop: { yourSearch = '', notMatchContent = '' } = {} } = get(this.resourceService, 'frmelmnts.lbl');
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
        this.router.navigate([sectionUrl, 1], { queryParams: queryParams, state: { currentPageData: this.getCurrentPageData()} });
    }

  private getSectionName(selectedTab) {
    let sectionName;
    switch (_.toLower(selectedTab)) {
      case 'textbook': {
        sectionName = _.get(this.resourceService, 'tbk.trk.frmelmnts.lbl.mytrainings');
        break;
      }
      case 'course': {
        sectionName = _.get(this.resourceService, 'crs.trk.frmelmnts.lbl.mytrainings');
        break;
      }
      case 'tvProgram': {
        sectionName = _.get(this.resourceService, 'tvc.trk.frmelmnts.lbl.mytrainings');
        break;
      }
      default: {
        sectionName = _.get(this.resourceService, 'frmelmnts.lbl.myEnrolledCollections')
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
            return this.isUserLoggedIn() ?
                { framework: this.userService.defaultFrameworkFilters } : JSON.parse(localStorage.getItem('guestUserDetails'));
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
        if(contentType === 'home') {
            params = _.omit(this.queryParams, ['id', 'selectedTab']);
        }
        params[facetName] = event.data[0].value.value;
        params['selectedTab'] = 'all';
        if(this.isUserLoggedIn()){
            this.router.navigate(['search/Library', 1], { queryParams: params });
        } else{
            this.router.navigate(['explore', 1], { queryParams: params });
        }
    }

    getSectionTitle (title) {
        return get(this.resourceService, 'frmelmnts.lbl.browseBy') + ' ' + get(this.resourceService, title);
    }

    getSelectedTab () {
        return get(this.activatedRoute, 'snapshot.queryParams.selectedTab');
    }

    updateProfile(event) {
        this.frameworkModal.modal.deny();
        this.showEdit = !this.showEdit;
        if (this.isUserLoggedIn()) {
            this.profileService.updateProfile({ framework: event }).subscribe(res => {
                this.userPreference.framework = event;
                this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
            }, err => {
                this.toasterService.warning(this.resourceService.messages.emsg.m0012);
            });
        } else {
            this.userPreference.framework = event;
            if (this.userPreference && _.get(this.userPreference, 'framework')) {
                localStorage.setItem('guestUserDetails', JSON.stringify(this.userPreference));
            }
            this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0058'));
        }
        this.setUserPreferences();
        this.fetchContents$.next(this._currentPageData);
    }

    getExplorePageSections () {
        return of(forEach(this.getCurrentPageData().sections, facet => {
            let _facetArray = [];
            forEach(facet.data, _facet => {
                _facetArray.push({
                    name: _facet['name'],
                    value: _facet['value']
                });
            });
            this.facetSections.push({
                name: facet.facetKey,
                data: _facetArray,
                section: facet
            });
        }));
    }
}
