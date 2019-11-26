import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, map, tap, filter } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';

import { PublicPlayerService } from '@sunbird/public';
import {
    ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
    ILoaderMessage, UtilService, ICard, BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { SearchService, CoursesService, ISort, PlayerService, OrgDetailsService, UserService, FormService } from '@sunbird/core';
import { IPagination } from '@sunbird/announcement';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { ContentManagerService } from '../../services';

@Component({
    selector: 'app-desktop-view-all',
    templateUrl: './desktop-view-all.component.html',
    styleUrls: ['./desktop-view-all.component.scss']
})
export class DesktopViewAllComponent implements OnInit, OnDestroy, AfterViewInit {
    /**
       * telemetryImpression
      */
    public telemetryImpression: IImpressionEventInput;
    public closeInteractEdata: IInteractEventEdata;
    public cardInteractEdata: IInteractEventEdata;
    public sortInteractEdata: IInteractEventEdata;

    searchList: Array<ICard> = [];
    /**
      * To show / hide no result message when no result found
     */
    noResult = false;
    noResultMessage: INoResultMessage;
    totalCount: number;
    pageNumber: number;
    pageLimit: number;
    showLoader = true;
    public baseUrl: string;
    loaderMessage: ILoaderMessage;
    /**
     * Contains returned object of the pagination service
     * which is needed to show the pagination on inbox view
     */
    pager: IPagination;
    queryParams: any;
    filters: any;
    hashTagId: string;
    formAction: string;
    showFilter = false;
    showLoginModal = false;
    public showBatchInfo = false;
    public selectedCourseBatches: any;
    public frameworkData: object;
    public filterType: string;
    public frameWorkName: string;
    public sortingOptions: Array<ISort>;
    public closeUrl: string;
    public sectionName: string;
    public unsubscribe = new Subject<void>();
    showExportLoader = false;
    contentName: string;
    showDownloadLoader = false;


    constructor(
        public router: Router,
        public resourceService: ResourceService,
        public toasterService: ToasterService,
        public configService: ConfigService,
        public navigationhelperService: NavigationHelperService,
        public utilService: UtilService,
        public contentManagerService: ContentManagerService,
        private searchService: SearchService,
        private playerService: PlayerService,
        private formService: FormService,
        private activatedRoute: ActivatedRoute,
        private paginationService: PaginationService,
        private _cacheService: CacheService,
        private publicPlayerService: PublicPlayerService,
        private coursesService: CoursesService,
        private orgDetailsService: OrgDetailsService,
        private userService: UserService,
        private browserCacheTtlService: BrowserCacheTtlService,
    ) {
        this.router.onSameUrlNavigation = 'reload';
        this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    }

    ngOnInit() {
        if (!this.userService.loggedIn) {
            this.getChannelId();
        } else {
            this.showFilter = true;
            this.userService.userData$.subscribe(userData => {
                if (userData && !userData.err) {
                    this.frameworkData = _.get(userData.userProfile, 'framework');
                }
            });
        }
        this.formAction = _.get(this.activatedRoute.snapshot, 'data.formAction');
        this.filterType = _.get(this.activatedRoute.snapshot, 'data.filterType');
        this.pageLimit = this.configService.appConfig.ViewAll.PAGE_LIMIT;
        combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
            map(results => ({ params: results[0], queryParams: results[1] })),
            filter(res => this.pageNumber !== Number(res.params.pageNumber) || !_.isEqual(this.queryParams, res.queryParams)),
            tap(res => {
                this.showLoader = true;
                this.queryParams = res.queryParams;
                const route = this.router.url.split('/view-all');
                this.closeUrl = '/' + route[0].toString();
                this.sectionName = res.params.section.replace(/\-/g, ' ');
                this.pageNumber = Number(res.params.pageNumber);
            }),
            tap((data) => {
                this.getframeWorkData();
                this.manipulateQueryParam(data.queryParams);
                this.setInteractEventData();
            }),
            takeUntil(this.unsubscribe)
        ).subscribe((response: any) => {
            this.getContents(response);
        }, (error) => {
            this.showLoader = false;
            this.noResult = true;
            this.noResultMessage = {
                'messageText': 'messages.fmsg.m0077'
            };
            this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        });


        this.contentManagerService.downloadListEvent.pipe(
            takeUntil(this.unsubscribe)).subscribe((data) => {
                this.updateCardData(data);
            });

        this.contentManagerService.downloadEvent.pipe(tap(() => {
            this.showDownloadLoader = false;
        }), takeUntil(this.unsubscribe)).subscribe(() => { });
    }

    getContents(data) {
        this.getContentList(data).subscribe((response: any) => {
            this.showLoader = false;
            if (response.contentData.result.count && response.contentData.result.content) {
                this.noResult = false;
                this.totalCount = response.contentData.result.count;
                this.pager = this.paginationService.getPager(response.contentData.result.count, this.pageNumber, this.pageLimit);
                this.searchList = this.formatSearchresults(response);
            } else {
                this.noResult = true;
                this.totalCount = 0;
                this.noResultMessage = {
                    'message': 'messages.stmsg.m0007',
                    'messageText': 'messages.stmsg.m0006'
                };
            }
        }, (error) => {
            this.showLoader = false;
            this.noResult = true;
            this.totalCount = 0;
            this.noResultMessage = {
                'messageText': 'messages.fmsg.m0077'
            };
            this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        });
    }

    setInteractEventData() {
        this.closeInteractEdata = {
            id: 'close',
            type: 'click',
            pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
        };
        this.cardInteractEdata = {
            id: 'content-card',
            type: 'click',
            pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
        };
        this.sortInteractEdata = {
            id: 'sort',
            type: 'click',
            pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
        };
    }

    private manipulateQueryParam(results) {
        this.filters = {};
        const queryFilters = _.omit(results, [
            'key',
            'softConstraintsFilter',
            'appliedFilters',
            'sort_by',
            'sortType',
            'defaultSortBy',
            'exists',
            'dynamic'
        ]);
        if (!_.isEmpty(queryFilters)) {
            _.forOwn(queryFilters, (queryValue, queryKey) => {
                this.filters[queryKey] = queryValue;
            });
        }
        if (results && results.dynamic) {
            const fields = JSON.parse(results.dynamic);
            _.forIn(fields, (value, key) => {
                this.filters[key] = value;
            });
        }
    }

    private getContentList(request) {
        const softConstraintData = {
            filters: _.get(request.queryParams, 'softConstraintsFilter') ? JSON.parse(request.queryParams.softConstraintsFilter) : {},
            softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
            mode: 'soft'
        };
        let manipulatedData = {};
        if (_.get(this.activatedRoute.snapshot, 'data.applyMode')) {
            manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.queryParams, 'appliedFilters'),
                softConstraintData, this.frameworkData);
        }
        const requestParams = {
            filters: _.get(this.queryParams, 'appliedFilters') ? this.filters : { ..._.get(manipulatedData, 'filters'), ...this.filters },
            limit: this.pageLimit,
            pageNumber: Number(request.params.pageNumber),
            mode: _.get(manipulatedData, 'mode'),
            params: this.configService.appConfig.ViewAll.contentApiQueryParams
        };

        if (_.get(manipulatedData, 'filters')) {
            requestParams['softConstraints'] = _.get(manipulatedData, 'softConstraints');
        }
        if (_.get(this.activatedRoute.snapshot, 'data.baseUrl') === 'learn') {
            return combineLatest(
                this.searchService.contentSearch(requestParams),
                this.coursesService.enrolledCourseData$).pipe(map(data => ({ contentData: data[0], enrolledCourseData: data[1] })));
        } else {
            return this.searchService.contentSearch(requestParams).pipe(map(data => ({ contentData: data })));
        }
    }

    private formatSearchresults(response) {
        _.forEach(response.contentData.result.content, (value, index) => {
            const constantData = this.configService.appConfig.ViewAll.otherCourses.constantData;
            const metaData = this.configService.appConfig.ViewAll.metaData;
            const dynamicFields = this.configService.appConfig.ViewAll.dynamicFields;
            response.contentData.result.content[index] = this.utilService.processContent(response.contentData.result.content[index],
                constantData, dynamicFields, metaData);
        });
        return response.contentData.result.content;
    }

    navigateToPage(page: number): undefined | void {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        const url = decodeURI(this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString()));
        this.router.navigate([url], { queryParams: this.queryParams, relativeTo: this.activatedRoute });
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    playContent(event) {

        // For offline environment content will only play when event.action is open
        if (event.action === 'download') {
            this.startDownload(event.data.metaData.identifier);
            this.showDownloadLoader = true;
            this.contentName = event.data.name;
            return false;
        } else if (event.action === 'export') {
            this.showExportLoader = true;
            this.contentName = event.data.name;
            this.exportOfflineContent(event.data.metaData.identifier);
            return false;
        }


        if (_.includes(this.router.url, 'browse')) {
            this.publicPlayerService.playContentForOfflineBrowse(event);
        } else {
            this.publicPlayerService.playContent(event);
        }
    }

    getChannelId() {
        this.orgDetailsService.getOrgDetails().subscribe(
            (apiResponse: any) => {
                this.hashTagId = apiResponse.hashTagId;
                this.showFilter = true;
            });
    }

    private getframeWorkData() {
        if (_.get(this.activatedRoute.snapshot, 'data.frameworkName')) {
            const framework = this._cacheService.get('framework' + 'search');
            if (framework) {
                this.frameWorkName = framework;
            } else {
                const formServiceInputParams = {
                    formType: 'framework',
                    formAction: 'search',
                    contentType: 'framework-code',
                };
                this.formService.getFormConfig(formServiceInputParams).subscribe(
                    (data: ServerResponse) => {
                        this.frameWorkName = _.find(data, 'framework').framework;
                        this._cacheService.set('framework' + 'search', this.frameWorkName,
                            { maxAge: this.browserCacheTtlService.browserCacheTtl });
                    },
                    (err: ServerResponse) => {
                        this.toasterService.error(this.resourceService.messages.emsg.m0005);
                    }
                );
            }
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setTelemetryImpressionData();
        });
    }

    setTelemetryImpressionData() {
        this.telemetryImpression = {
            context: {
                env: _.get(this.activatedRoute.snapshot, 'data.telemetry.env')
            },
            edata: {
                type: _.get(this.activatedRoute.snapshot, 'data.telemetry.type'),
                pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
                uri: this.router.url,
                subtype: _.get(this.activatedRoute.snapshot, 'data.telemetry.subtype'),
                duration: this.navigationhelperService.getPageLoadTime()
            }
        };
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    startDownload(contentId) {
        this.contentManagerService.downloadContentId = contentId;
        this.contentManagerService.startDownload({}).subscribe(data => {
            this.contentManagerService.downloadContentId = '';
        }, error => {
            this.contentManagerService.downloadContentId = '';
            this.showDownloadLoader = false;

            _.each(this.searchList, (contents) => {
                contents['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
            });
            this.toasterService.error(this.resourceService.messages.fmsg.m0090);
        });
    }

    exportOfflineContent(contentId) {
        this.contentManagerService.exportContent(contentId).subscribe(data => {
            this.showExportLoader = false;
        }, error => {
            this.showExportLoader = false;
            if (error.error.responseCode !== 'NO_DEST_FOLDER') {
                this.toasterService.error(this.resourceService.messages.fmsg.m0091);
            }
        });
    }

    updateCardData(downloadListdata) {
        _.each(this.searchList, (contents) => {
            this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
        });
    }
}
