import { Component, OnInit, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { combineLatest, Subject, of } from 'rxjs';
import { tap, catchError, filter, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

import {
    ResourceService, ToasterService, ConfigService, UtilService, ICaraouselData, INoResultMessage, NavigationHelperService
} from '@sunbird/shared';
import { SearchService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ConnectionService, ContentManagerService } from '../../services';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit, OnDestroy {

    public showLoader = true;
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

    public noResultMessage: INoResultMessage;

    isConnected = navigator.onLine;
    slideConfig = this.configService.appConfig.CourseBatchPageSection.slideConfig;
    isBrowse = false;
    showExportLoader = false;
    showDownloadLoader = false;
    contentName: string;
    infoData;

    /* Telemetry */
    public viewAllInteractEdata: IInteractEventEdata;
    public telemetryImpression: IImpressionEventInput;
    public cardInteractObject: any;
    public cardInteractCdata: any;

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
        public contentManagerService: ContentManagerService
    ) { }

    ngOnInit() {
        this.isBrowse = Boolean(this.router.url.includes('browse'));
        this.infoData = { msg: this.resourceService.frmelmnts.lbl.allDownloads, linkName: this.resourceService.frmelmnts.btn.myLibrary };
        this.getSelectedFilters();
        this.setNoResultMessage();
        this.setTelemetryData();

        this.connectionService.monitor()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isConnected => {
                this.isConnected = isConnected;
            });

        this.contentManagerService.completeEvent
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (this.router.url === '/') {
                    this.fetchContents();
                }
            });

        this.contentManagerService.downloadListEvent
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                this.updateCardData(data);
            });

        this.router.events
            .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
            .subscribe(x => { this.prepareVisits(); });
    }

    getSelectedFilters() {
        this.selectedFilters = this.publicPlayerService.libraryFilters;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onFilterChange(event) {
        this.showLoader = true;
        this.dataDrivenFilters = _.cloneDeep(event.filters);
        this.resetSections();
        this.fetchContents();
        this.publicPlayerService.libraryFilters = event.filters;
        this.hashTagId = event.channelId;
    }

    resetSections() {
        this.carouselMasterData = [];
        this.pageSections = [];
    }

    constructSearchRequest(addFilters) {
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
            facets: facets,
            params: _.cloneDeep(this.configService.appConfig.ExplorePage.contentApiQueryParams),
        };
        if (addFilters) {
            option.filters = _.get(this.dataDrivenFilters, 'appliedFilters') ? filters : manipulatedData.filters;
        }
        option.filters['contentType'] = filters.contentType || ['TextBook'];
        if (manipulatedData.filters) {
            option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
        }

        option.params.online = Boolean(this.isBrowse);
        return option;
    }

    fetchContents() {
        // First call - Search content with selected filters and API should call always.
        // Second call - Search content without selected filters and API should not call in browse page
        combineLatest(this.searchContent(true, false), this.searchContent(false, this.isBrowse))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                ([response1, response2]) => {
                    if (response1) {
                        this.showLoader = false;
                        const filteredContents = _.omit(_.groupBy(response1['result'].content, 'subject'), ['undefined']);
                        this.sections = [];

                        if (response2) {
                            this.sections.push({
                                contents: _.orderBy(_.get(response2, 'result.content'), ['desktopAppMetadata.updatedOn'], ['desc']),
                                name: 'Recently Added'
                            });
                        }

                        for (const section in filteredContents) {
                            if (section) {
                                this.sections.push({
                                    name: section,
                                    contents: filteredContents[section]
                                });
                            }
                        }

                        this.carouselMasterData = this.prepareCarouselData(this.sections);

                        if (!this.carouselMasterData.length) {
                            return; // no page section
                        }
                        if (this.carouselMasterData.length >= 2) {
                            this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
                        } else if (this.carouselMasterData.length >= 1) {
                            this.pageSections = [this.carouselMasterData[0]];
                        }
                        this.addHoverData();
                    } else {
                        this.showLoader = false;
                        this.carouselMasterData = [];
                        this.pageSections = [];
                        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
                    }
                }
            );
    }

    addHoverData() {
        _.each(this.pageSections, (pageSection) => {
            _.each(pageSection.contents, (value) => {
                value['hoverData'] = {
                    'note': this.isBrowse && _.get(value, 'downloadStatus') ===
                        'DOWNLOADED' ? this.resourceService.frmelmnts.lbl.goToMyDownloads : '',
                    'actions': [
                        {
                            'type': this.isBrowse ? 'download' : 'save',
                            'label': this.isBrowse ? _.capitalize(_.get(value, 'downloadStatus')) ||
                                this.resourceService.frmelmnts.btn.download :
                                this.resourceService.frmelmnts.lbl.saveToPenDrive,
                            'disabled': this.isBrowse && _.includes(['DOWNLOADED', 'DOWNLOADING', 'PAUSED'],
                                _.get(value, 'downloadStatus')) ? true : false
                        },
                        {
                            'type': 'open',
                            'label': this.resourceService.frmelmnts.lbl.open
                        }
                    ]
                };
            });
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

    private setNoResultMessage() {
        if (!(_.includes(this.router.url, 'browse'))) {
            this.noResultMessage = {
                message: 'messages.stmsg.m0007',
                messageText: 'messages.stmsg.m0133'
            };
        } else {
            this.noResultMessage = {
                message: 'messages.stmsg.m0007',
                messageText: 'messages.stmsg.m0006'
            };
        }
    }

    searchContent(addFilter: boolean, shouldCallAPI) {
        if (shouldCallAPI) {
            return of(undefined);
        }
        const option = this.constructSearchRequest(addFilter);
        return this.searchService.contentSearch(option).pipe(
            tap(data => {
            }), catchError(error => {
                return of(undefined);
            }));
    }

    onViewAllClick(event) {
        const queryParams = {
            channel: this.hashTagId,
            apiQuery: JSON.stringify(this.constructSearchRequest(false))
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
        const telemetryInteractCdata = [{
            id: content.metaData.identifier || content.metaData.courseId,
            type: content.metaData.contentType
        }];
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
        switch (event.hover.type.toUpperCase()) {
            case 'OPEN':
                this.playContent(event);
                this.logTelemetry(event.data, 'play-content');
                break;
            case 'DOWNLOAD':
                this.showDownloadLoader = true;
                this.downloadContent(_.get(event, 'content.metaData.identifier'));
                this.logTelemetry(event.data, 'download-content');
                break;
            case 'SAVE':
                this.showExportLoader = true;
                this.exportContent(_.get(event, 'content.metaData.identifier'));
                this.logTelemetry(event.data, 'export-content');
                break;
        }
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
        this.contentManagerService.startDownload({})
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.contentManagerService.downloadContentId = '';
                this.showDownloadLoader = false;
            }, error => {
                this.contentManagerService.downloadContentId = '';
                this.showDownloadLoader = false;
                _.each(this.pageSections, (pageSection) => {
                    _.each(pageSection.contents, (pageData) => {
                        pageData['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
                    });
                });
                this.toasterService.error(this.resourceService.messages.fmsg.m0090);
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

    updateCardData(downloadListdata) {
        _.each(this.pageSections, (pageSection) => {
            _.each(pageSection.contents, (pageData) => {
                this.publicPlayerService.updateDownloadStatus(downloadListdata, pageData);
            });
        });
        this.addHoverData();
    }

    navigateToMyDownloads() {
        this.router.navigate(['/']);
    }
}
