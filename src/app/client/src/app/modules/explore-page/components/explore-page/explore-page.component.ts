import { forkJoin, Subject, Observable, BehaviorSubject, merge } from 'rxjs';
import { OrgDetailsService, UserService, SearchService, FormService, PlayerService, CoursesService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import {
    ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService, COLUMN_TYPE, UtilService,
    OfflineCardService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep, get, find, map as _map, pick, omit, groupBy, sortBy, replace, uniqBy, forEach, has, uniq, flatten, each, isNumber, toString } from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { map, tap, switchMap, skipWhile, takeUntil } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
import { ContentManagerService } from '../../../public/module/offline/services';
import * as _ from 'lodash-es';
const DEFAULT_FRAMEWORK = 'CBSE';
@Component({
    selector: 'app-explore-page-component',
    templateUrl: './explore-page.component.html',
    styles: ['.course-card-width { width: 280px !important }']
})
export class ExplorePageComponent implements OnInit, OnDestroy, AfterViewInit {
    public initFilter = false;
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
    pageTitle;
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
        public contentManagerService: ContentManagerService) { }


    private initConfiguration() {
        const { userProfile: { framework = null } = {} } = this.userService;
        const userFramework = (this.isUserLoggedIn() && framework && pick(framework, ['medium', 'gradeLevel', 'board', 'subject'])) || {};
        this.defaultFilters = {
            board: [DEFAULT_FRAMEWORK], gradeLevel: this.isUserLoggedIn() ? [] : ['Class 10'], medium: [],
            ...userFramework
        };
        if (this.utilService.isDesktopApp) {
            const userPreferences: any = this.userService.anonymousUserPreference;
            if (userPreferences) {
                _.forEach(['board', 'medium', 'gradeLevel'], (item) => {
                    if (!_.has(this.selectedFilters, item)) {
                        this.defaultFilters[item] = _.isArray(userPreferences.framework[item]) ?
                            userPreferences.framework[item] : _.split(userPreferences.framework[item], ', ');
                    }
                });
            }
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

    private fetchChannelData() {
        return forkJoin(this.getChannelId(), this.getFormConfig())
            .pipe(
                switchMap(([channelData, formConfig]) => {
                    const { channelId, custodianOrg } = channelData;
                    this.channelId = channelId;
                    this.custodianOrg = custodianOrg;
                    this.formData = formConfig;
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

    ngOnInit() {
        this.isDesktopApp = this.utilService.isDesktopApp;
        this.initConfiguration();
        this.subscription$ = merge(this.fetchChannelData(), this.initLayout(), this.fetchContents())
            .pipe(
                takeUntil(this.unsubscribe$)
            );
        this.listenLanguageChange();
        this.contentManagerService.contentDownloadStatus$.subscribe( contentDownloadStatus => {
            this.contentDownloadStatus = contentDownloadStatus;
            this.addHoverData();
        });
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
        if (this.layoutConfiguration != null) {
            this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
            this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
        } else {
            this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
            this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
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
        return find(this.formData, data => data.contentType === input);
    }

    public getFilters({ filters, status }) {
        this.showLoader = true;
        if (!filters || status === 'FETCHING') { return; }
        const currentPageData = this.getPageData(get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'textbook');
        this.selectedFilters = pick(filters, ['board', 'medium', 'gradeLevel', 'channel', 'subject', 'audience']);
        if (has(filters, 'audience') || (localStorage.getItem('userType') && currentPageData.contentType !== 'all')) {
            const userTypes = get(filters, 'audience') || [localStorage.getItem('userType')];
            const audienceSearchFilterValue = _.get(filters, 'audienceSearchFilterValue');
            const userTypeMapping = get(this.configService, 'appConfig.userTypeMapping');
            this.selectedFilters['audience'] = audienceSearchFilterValue || uniq(flatten(_map(userTypes, userType => userTypeMapping[userType])));
        }
        if (this.utilService.isDesktopApp) {
            const userPreferences: any = this.userService.anonymousUserPreference;
            if (userPreferences) {
                _.forEach(['board', 'medium', 'gradeLevel'], (item) => {
                    if (!_.has(this.selectedFilters, item)) {
                        this.selectedFilters[item] = _.isArray(userPreferences.framework[item]) ?
                        userPreferences.framework[item] : _.split(userPreferences.framework[item], ', ');
                    }
                });
            }
        }
        this.apiContentList = [];
        this.pageSections = [];
        this.pageTitleSrc = get(this.resourceService, 'RESOURCE_CONSUMPTION_ROOT') + get(currentPageData, 'title');
        this.pageTitle = get(this.resourceService, get(currentPageData, 'title'));
        this.svgToDisplay = get(currentPageData, 'theme.imageName');
        this.fetchContents$.next(currentPageData);
    }

    private fetchContents() {
        return this.fetchContents$
            .pipe(
                skipWhile(data => data === undefined || data === null),
                switchMap(currentPageData => {
                    const { fields, filters } = currentPageData.search;
                    const request = {
                        filters: {...this.selectedFilters, ...filters},
                        fields,
                        isCustodianOrg: this.custodianOrg,
                        channelId: this.channelId,
                        frameworkId: this.contentSearchService.frameworkId,
                        ...(this.isUserLoggedIn() && { limit: get(currentPageData, 'limit') })
                    };
                    if (!this.isUserLoggedIn() && get(this.selectedFilters, 'channel') && get(this.selectedFilters, 'channel.length') > 0) {
                        request.channelId = this.selectedFilters['channel'];
                    }
                    const option = this.searchService.getSearchRequest(request, get(filters, 'primaryCategory'));
                    return this.searchService.contentSearch(option)
                        .pipe(
                            map((response) => {
                                const filteredContents = omit(groupBy(get(response, 'result.content'), 'subject'), ['undefined']);
                                for (const [key, value] of Object.entries(filteredContents)) {
                                    const isMultipleSubjects = key.split(',').length > 1;
                                    if (isMultipleSubjects) {
                                        const subjects = key.split(',');
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
                                        sections.push({
                                            name: section,
                                            contents: filteredContents[section]
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
                                this.showLoader = false;
                                this.apiContentList = sortBy(data, ['name']);
                                if (!this.apiContentList.length) {
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
                pageTitle: this.pageTitle,
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

}
