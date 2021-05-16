import { Component, OnInit, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { combineLatest, Subject, of } from 'rxjs';
import { tap, catchError, filter, takeUntil, first, debounceTime, delay } from 'rxjs/operators';
import * as _ from 'lodash-es';
import {
    OfflineCardService, ResourceService, ToasterService, ConfigService, UtilService, ICaraouselData, 
    NavigationHelperService, ILanguage,  LayoutService, COLUMN_TYPE, ConnectionService
} from '@sunbird/shared';
import { SearchService, UserService, OrgDetailsService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ContentManagerService, SystemInfoService } from '../../services';
@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit, OnDestroy {

    public showLoader = true;
    public showSectionLoader = false;
    public queryParams: any;
    public hashTagId: string;
    public dataDrivenFilters: any = {};
    public slug: string;
    organisationId: string;
    public carouselMasterData: Array<ICaraouselData> = [];
    public pageSections: Array<ICaraouselData> = [];

    public sections: Array<any> = [];
    public initFilters = false;
    public userDetails: any = {};
    public selectedFilters: any;

    public dataDrivenFilterEvent = new EventEmitter();
    public unsubscribe$ = new Subject<void>();

    public modifiedFilters: any;

    isConnected = navigator.onLine;
    slideConfig = this.configService.appConfig.AllDownloadsSection.slideConfig;
    showExportLoader = false;
    showDownloadLoader = false;
    contentName: string;
    infoData;
    languageDirection = 'ltr';
    isFilterChanged = false;
    showModal = false;
    showLoadContentModal = false;
    downloadIdentifier: string;
    readonly MINIMUM_REQUIRED_RAM = 100;
    readonly MAXIMUM_CPU_LOAD = 90;
    showMinimumRAMWarning = false;
    showCpuLoadWarning = false;
    isDesktopApp = false;
    contentDownloadStatus = {};
    /* Telemetry */
    public viewAllInteractEdata: IInteractEventEdata;
    public telemetryImpression: IImpressionEventInput;
    public cardInteractObject: any;
    public cardInteractCdata: any;
    public contentData: any;

    layoutConfiguration: any;
    FIRST_PANEL_LAYOUT;
    SECOND_PANEL_LAYOUT;
    pageTitle;
    svgToDisplay;
    pageTitleSrc;
    facets;
    currentPageData;
    public channelId: string;
    public custodianOrg = true;
    public defaultFilters;
    public formData;
    public globalSearchFacets: Array<string>;

    @HostListener('window:scroll', []) onScroll(): void {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
            && this.pageSections.length < this.carouselMasterData.length) {
            this.pageSections.push(this.carouselMasterData[this.pageSections.length]);
            this.addHoverData();
        }
    }
    constructor(
        private activatedRoute: ActivatedRoute,
        public router: Router,
        private utilService: UtilService,
        private toasterService: ToasterService,
        private configService: ConfigService,
        public resourceService: ResourceService,
        private publicPlayerService: PublicPlayerService,
        public searchService: SearchService,
        private connectionService: ConnectionService,
        public navigationHelperService: NavigationHelperService,
        public telemetryService: TelemetryService,
        public contentManagerService: ContentManagerService,
        private offlineCardService: OfflineCardService,
        private systemInfoService: SystemInfoService,
        public layoutService: LayoutService,
        public userService: UserService,
        private orgDetailsService: OrgDetailsService
    ) {
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

    fetchCurrentPageData() {
        this.searchService.getContentTypes().pipe(takeUntil(this.unsubscribe$)).subscribe(formData => {
            this.currentPageData = _.find(formData, (o) => o.title === 'frmelmnts.lbl.desktop.mylibrary');
            const { contentType, title, theme: { imageName = null } = {} } = this.currentPageData;
            this.pageTitle = _.get(this.resourceService, title);
            this.pageTitleSrc = _.get(this.resourceService, 'RESOURCE_CONSUMPTION_ROOT') + title;
            this.formData = formData;
            this.svgToDisplay = imageName;
            this.globalSearchFacets = _.get(this.currentPageData, 'search.facets');
            this.globalSearchFacets = [
                'se_boards',
                'se_gradeLevels',
                'se_subjects',
                'se_mediums',
                'primaryCategory',
                'mimeType'
              ];
            this.getOrgDetails();
        }, error => {
            this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
            this.navigationHelperService.goBack();
        });
    }

    getOrgDetails() {
        this.orgDetailsService.getOrgDetails(this.userService.slug).pipe(
            tap((orgDetails: any) => {
                this.hashTagId = orgDetails.hashTagId;
                this.initFilters = true;
                return this.dataDrivenFilterEvent;
            }), first()
            ).subscribe((filters: any) => {
                this.dataDrivenFilters = filters;
                this.fetchContentOnParamChange();
            },
            error => {
                this.router.navigate(['']);
            }
        );
    }

    ngOnInit() {
        this.isDesktopApp = this.utilService.isDesktopApp;
        this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
            this.queryParams = { ...queryParams };
        });
        this.fetchCurrentPageData();
        this.initLayout();
        this.setTelemetryData();
        this.contentManagerService.contentDownloadStatus$.subscribe( contentDownloadStatus => {
            this.contentDownloadStatus = contentDownloadStatus;
            this.updateCardData();
        });
        this.systemInfoService.getSystemInfo().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
            let { availableMemory } = data.result;
            availableMemory = Math.floor(availableMemory / (1024 * 1024));
            const availableCpuLoad =  _.get(data.result, 'cpuLoad');
            this.showCpuLoadWarning = availableCpuLoad ? Boolean(availableCpuLoad > this.MAXIMUM_CPU_LOAD) : false;

            this.showMinimumRAMWarning = availableMemory ? Boolean(availableMemory < this.MINIMUM_REQUIRED_RAM) : false;
        }, error => {
            this.showCpuLoadWarning = false;
            this.showMinimumRAMWarning = false;
        });

        this.connectionService.monitor()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isConnected => {
                this.isConnected = isConnected;
            });

        this.contentManagerService.completeEvent
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                const url = this.router.url.split('?');
                if (url[0] === '/mydownloads') {
                    this.fetchContents(false);
                }
            });

        this.router.events
            .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
            .subscribe(x => { this.prepareVisits(); });

        this.utilService.languageChange
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((language: ILanguage) => {
                this.languageDirection = language.dir;
            });

        this.utilService.clearSearchQuery();
    }

    fetchContentOnParamChange() {
        combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
          .pipe(debounceTime(5),
            delay(10),
            tap(data => this.setTelemetryData()),
            takeUntil(this.unsubscribe$)
          ).subscribe(() => {
            this.showLoader = true;
            this.fetchContents();
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    public getFilters(filters) {
        let filterData = filters && filters.filters || {};
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

        if (_.get(this.facets, 'length')) {
            this.facets.forEach((item) => {
                if (_.has(filterData, item.name) && _.get(item, 'values.length')) {
                    item.values.forEach((element: any) => {
                        if (!filterData[item.name].includes(element.name)) {
                            filterData[item.name]  = filterData[item.name].filter(value => value === element.name);
                        }
                    });
                }
            });
        }
        this.selectedFilters = filterData;
        const defaultFilters = _.reduce(filters, (collector: any, element) => {
            if (element.code === 'board') {
                collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
            }
            return collector;
        }, {});
        this.dataDrivenFilterEvent.emit(defaultFilters);
        this.carouselMasterData = [];
    }

    constructSearchRequest() {

        const selectedMediaType = _.isArray(_.get(this.queryParams, 'mediaType')) ? _.get(this.queryParams, 'mediaType')[0] :
        _.get(this.queryParams, 'mediaType');
        const mimeType = _.find(_.get(this.currentPageData, 'search.filters.mimeType'), (o) => {
        return o.name === (selectedMediaType || 'all');
        });
        const pageType = _.get(this.queryParams, 'pageTitle');
        const filters: any = _.omit(this.queryParams, ['key', 'sort_by', 'sortType', 'appliedFilters', 'softConstraints', 'selectedTab', 'mediaType', 'contentType', 'board', 'medium', 'gradeLevel', 'subject']);
        if (!filters.channel) {
            filters.channel = this.hashTagId;
        }
        filters.mimeType = _.get(mimeType, 'values');

        // Replacing cbse/ncert value with cbse
        if (_.toLower(_.get(filters, 'board[0]')) === 'cbse/ncert' || _.toLower(_.get(filters, 'board')) === 'cbse/ncert') {
        filters.board = ['cbse'];
        }

        _.forEach(this.formData, (form, key) => {
        const pageTitle = _.get(this.resourceService, form.title);
        if (pageTitle && pageType && (pageTitle === pageType)) {
            filters.contentType = _.get(form, 'search.filters.contentType');
        }
        });
        const softConstraints = _.get(this.activatedRoute.snapshot, 'data.softConstraints') || {};
        if (this.queryParams.key) {
        delete softConstraints['board'];
        }
        const option: any = {
            filters: _.omitBy(filters || {}, value => _.isArray(value) ? (!_.get(value, 'length') ? true : false) : false),
            fields: _.get(this.currentPageData, 'search.fields'),
            query: this.queryParams.key,
            softConstraints: softConstraints,
            facets: this.globalSearchFacets,
            params: this.configService.appConfig.ExplorePage.contentApiQueryParams || {}
        };
        if (this.queryParams.softConstraints) {
            try {
                option.softConstraints = JSON.parse(this.queryParams.softConstraints);
            } catch {

            }
        }
        return option;
    }

    fetchContents(isFilterChange?: boolean) {
        const shouldGetAllDownloads = !(isFilterChange);
        const option = this.constructSearchRequest();
        this.searchService.contentSearch(option).subscribe(searchRes => {
            if (searchRes) {
                const facets = this.searchService.updateFacetsData(_.get(searchRes, 'result.facets'));
                this.facets = facets.filter(facet => facet.values.length > 0);
                const filteredContents = _.omit(_.groupBy(searchRes['result'].content, 'subject'), ['undefined']);
                const otherContents = _.filter(searchRes['result'].content, (content) => !content.subject );
                // Check for multiple subjects
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

                if (!shouldGetAllDownloads && this.sections[0]) {
                    this.sections.splice(1, this.sections.length);
                } else {
                    this.sections = [];
                }
                const contents = []; // to sort the contents/textbooks other than downloads
                for (const section in filteredContents) {
                    if (section) {
                        contents.push({
                            name: section,
                            contents: filteredContents[section].sort((a, b) => a.name.localeCompare(b.name))
                        });
                    }
                }
                // should not affect the download contents order(should be top)
                contents.sort((a, b) => a.name.localeCompare(b.name));
                contents.push({
                    name: this.resourceService.frmelmnts.lbl.other,
                    contents: otherContents.sort((a, b) => a.name.localeCompare(b.name))
                });
                this.sections.push(...contents);

                this.carouselMasterData = this.prepareCarouselData(this.sections);
                this.hideLoader();
                if (!this.carouselMasterData.length) {
                    return; // no page section
                }
                this.pageSections = _.cloneDeep(this.carouselMasterData);
                this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
                    this.addHoverData();
                    this.facets = this.searchService.updateFacetsData(this.facets);
                });
            } else {
                this.hideLoader();
                this.carouselMasterData = [];
                this.pageSections = [];
                this.toasterService.error(this.resourceService.messages.fmsg.m0004);
            }
        });
    }

    hideLoader() {
        this.showLoader = false;
        this.showSectionLoader = false;
    }

    addHoverData() {
        _.each(this.pageSections, (pageSection) => {
            _.forEach(pageSection.contents, contents => {
               if (this.contentDownloadStatus[contents.identifier]) {
                   contents['downloadStatus'] = this.contentDownloadStatus[contents.identifier];
               }
            });
            this.pageSections[pageSection] = this.utilService.addHoverData(pageSection.contents, false);
        });
    }

    private prepareCarouselData(sections = []) {
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.ExplorePage;
        const carouselData = _.reduce(sections, (collector, element) => {
            const contents = _.get(element, 'contents') || [];
            element.contents = this.utilService.getDataForCard(contents, constantData, dynamicFields, metaData);
            if (element.contents && element.contents.length) {
                element.contents.forEach((item) => {
                    item.cardImg = item.cardImg || item.courseLogoUrl || 'assets/images/book.png';
                });
                collector.push(element);
            }
            return collector;
        }, []);
        return carouselData;
    }

    setTelemetryData() {
        this.telemetryImpression = {
            context: {
                env: this.activatedRoute.snapshot.data.telemetry.env
            },
            edata: {
                type: this.activatedRoute.snapshot.data.telemetry.type,
                pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
                uri: this.router.url,
                subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
                duration: this.navigationHelperService.getPageLoadTime()
            }
        };
        this.viewAllInteractEdata = {
            id: `view-all-button`,
            type: 'click',
            pageid: 'library'
        };
    }

    prepareVisits() {
        const visits = [];
        _.map(this.sections, section => {
            _.forEach(section.contents, (content, index) => {
                visits.push({
                    objid: content.metaData.identifier,
                    objtype: content.metaData.contentType,
                    index: index,
                    section: section.name,
                });
            });
        });

        this.telemetryImpression.edata.visits = visits;
        this.telemetryImpression.edata.subtype = 'pageexit';
        this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }

    logTelemetry(content, actionId) {
        const telemetryInteractObject = {
            id: content.metaData.identifier || content.metaData.courseId,
            type: content.metaData.contentType || 'TextBook',
            ver: content.metaData.pkgVersion ? content.metaData.pkgVersion.toString() : '1.0'
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
                pageid: this.router.url.split('/')[1] || 'library'
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
                this.downloadIdentifier = _.get(event, 'content.metaData.identifier');
                this.showModal = this.offlineCardService.isYoutubeContent(this.contentData);
                if (!this.showModal) {
                    this.showDownloadLoader = true;
                    this.downloadContent(this.downloadIdentifier);
                }
                telemetryButtonId = this.contentData.mimeType ===
                    'application/vnd.ekstep.content-collection' ? 'download-collection' : 'download-content';
                this.logTelemetry(this.contentData, telemetryButtonId);
                break;
            case 'SAVE':
                this.showExportLoader = true;
                this.exportContent(_.get(event, 'content.metaData.identifier'));
                telemetryButtonId = this.contentData.mimeType ===
                    'application/vnd.ekstep.content-collection' ? 'export-collection' : 'export-content';
                this.logTelemetry(this.contentData, telemetryButtonId);
                break;
        }
    }

    playContent(event: any) {
        this.publicPlayerService.playContent(event);
    }

    exportContent(contentId) {
        this.contentManagerService.exportContent(contentId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.showExportLoader = false;
                this.toasterService.success(this.resourceService.messages.smsg.m0059);
            }, error => {
                this.showExportLoader = false;
                if (_.get(error, 'error.responseCode') !== 'NO_DEST_FOLDER') {
                    this.toasterService.error(this.resourceService.messages.fmsg.m0091);
                }
            });
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
                _.each(this.pageSections, (pageSection) => {
                    _.each(pageSection.contents, (pageData) => {
                        pageData['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
                    });
                });
                if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
                this.toasterService.error(this.resourceService.messages.fmsg.m0090);
                  }
            });
    }

    updateCardData() {
        _.each(this.pageSections, (pageSection) => {
            _.each(pageSection.contents, (pageData) => {
                this.publicPlayerService.updateDownloadStatus(this.contentDownloadStatus, pageData);
            });
        });
        this.addHoverData();
    }

    navigateToMyDownloads() {
        this.router.navigate(['/']);
    }
}
