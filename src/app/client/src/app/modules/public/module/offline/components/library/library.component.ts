import { Component, OnInit, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { combineLatest, Subject, of } from 'rxjs';
import { tap, catchError, filter, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

import {
    OfflineCardService, ResourceService, ToasterService, ConfigService, UtilService, ICaraouselData, 
    NavigationHelperService, ILanguage,  LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { SearchService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ConnectionService, ContentManagerService, SystemInfoService } from '../../services';

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
    isBrowse = false;
    showExportLoader = false;
    showDownloadLoader = false;
    contentName: string;
    infoData;
    languageDirection = 'ltr';
    isFilterChanged = false;
    showModal = false;
    downloadIdentifier: string;
    readonly MINIMUM_REQUIRED_RAM = 100;
    readonly MAXIMUM_CPU_LOAD = 90;
    showMinimumRAMWarning = false;
    showCpuLoadWarning = false;
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
        public layoutService: LayoutService
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

    ngOnInit() {
        this.initLayout();
        this.isBrowse = Boolean(this.router.url.includes('browse'));
        this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
            this.infoData = {
                msg: this.resourceService.frmelmnts.lbl.allDownloads,
                linkName: this.resourceService.frmelmnts.btn.myLibrary
            };
        });
        this.getSelectedFilters();
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

        if (!this.isBrowse) {
            this.navigationHelperService.clearHistory();
        }

        this.connectionService.monitor()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isConnected => {
                this.isConnected = isConnected;
            });

        this.contentManagerService.completeEvent
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (this.router.url === '/') {
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

    getSelectedFilters() {
        this.selectedFilters = this.publicPlayerService.libraryFilters;
        this.modifiedFilters = this.selectedFilters;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onFilterChange(event) {
        this.dataDrivenFilters = _.cloneDeep(event.filters);
        this.publicPlayerService.libraryFilters = event.filters;
        this.hashTagId = event.channelId;
        this.modifiedFilters = event.filters;

        if (this.isBrowse) {
            this.showLoader = true;
            this.resetSections();
            this.fetchContents();
        } else {
            this.fetchContents(this.isFilterChanged);
            if (!this.isFilterChanged) {
                this.isFilterChanged = true;
                this.showLoader = false;
                this.resetSections();
            } else {
                this.showLoader = false;
                this.showSectionLoader = true;
                this.pageSections.splice(1, this.sections.length);
            }
        }
    }

    resetSections() {
        this.carouselMasterData = [];
        this.pageSections = [];
    }

    constructSearchRequest(addFilters, isFacetsRequired?) {
        let filters = _.pickBy(this.dataDrivenFilters, (value: Array<string> | string) => value && value.length);
        filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
        const softConstraintData: any = {
            filters: {
                channel: this.hashTagId
            },
            softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
            mode: 'soft'
        };
        if (this.dataDrivenFilters.board) {
            softConstraintData.board = this.dataDrivenFilters.board;
        }
        const facets = ['board', 'medium', 'gradeLevel', 'subject'];
        const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.dataDrivenFilters, 'appliedFilters'),
            softConstraintData);
        const option = {
            filters: {},
            mode: _.get(manipulatedData, 'mode'),
            params: _.cloneDeep(this.configService.appConfig.ExplorePage.contentApiQueryParams),
        };
        if (isFacetsRequired) {
            option['facets']  = facets;
        }
        if (addFilters) {
            option.filters = _.get(this.dataDrivenFilters, 'appliedFilters') ? filters : manipulatedData.filters;
            option.filters['contentType'] = filters.contentType || ['TextBook'];
        }
        if (manipulatedData.filters) {
            option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
        }

        option.params.online = Boolean(this.isBrowse);
        return option;
    }

    fetchContents(isFilterChange?: boolean) {
        const shouldGetAllDownloads = !(this.isBrowse || isFilterChange);
        // First call - Search content with selected filters and API should call always.
        // Second call - Search content without selected filters and API should not call in browse page
        combineLatest(this.searchContent(true, true), this.searchContent(false, shouldGetAllDownloads))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                ([searchRes, allDownloadsRes]) => {

                    if (searchRes) {
                        const filteredContents = _.omit(_.groupBy(searchRes['result'].content, 'subject'), ['undefined']);
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

                        if (!shouldGetAllDownloads && this.sections[0] && !this.isBrowse) {
                            this.sections.splice(1, this.sections.length);
                        } else {
                            this.sections = [];
                        }
                        if (allDownloadsRes) {
                            this.sections.push({
                                contents: _.orderBy(_.get(allDownloadsRes, 'result.content'), ['desktopAppMetadata.updatedOn'], ['desc']),
                                name: 'Recently Added'
                            });
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
                        this.sections.push(...contents);

                        this.carouselMasterData = this.prepareCarouselData(this.sections);
                        this.hideLoader();
                        if (!this.carouselMasterData.length) {
                            return; // no page section
                        }
                        this.pageSections = _.cloneDeep(this.carouselMasterData);
                        this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
                            this.addHoverData();
                        });
                    } else {
                        this.hideLoader();
                        this.carouselMasterData = [];
                        this.pageSections = [];
                        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
                    }
                }
            );
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
            this.pageSections[pageSection] = this.utilService.addHoverData(pageSection.contents, this.isBrowse);
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

    searchContent(addFilter: boolean, shouldCallAPI: boolean) {
        if (!shouldCallAPI) {
            return of(undefined);
        }

        const params = _.cloneDeep(this.configService.appConfig.ExplorePage.contentApiQueryParams);
        params.online = false;
        const option = addFilter ? this.constructSearchRequest(addFilter) : { params };
        return this.searchService.contentSearch(option).pipe(
            tap(data => {
            }), catchError(error => {
                return of(undefined);
            }));
    }

    onViewAllClick(event) {
        const queryParams = {
            channel: this.hashTagId,
            apiQuery: JSON.stringify(this.constructSearchRequest(false, true))
        };

        this.router.navigate(['view-all'], {
            queryParams: queryParams
        });
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
            type: content.metaData.contentType || 'Course',
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

    callDownload() {
        this.showDownloadLoader = true;
        this.downloadContent(this.downloadIdentifier);
    }

    playContent(event: any) {
        if (this.isBrowse) {
            this.publicPlayerService.playContentForOfflineBrowse(event);
        } else {
            this.publicPlayerService.playContent(event);
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
