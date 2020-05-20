import {
    PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
    ICard, ILoaderMessage, UtilService, NavigationHelperService, IPagination
} from '@sunbird/shared';
import { SearchService, PlayerService, UserService, FrameworkService } from '@sunbird/core';
import { combineLatest, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, debounceTime, tap, delay } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
@Component({
    templateUrl: './library-search.component.html',
    styleUrls: ['./library-search.component.scss']
})
export class LibrarySearchComponent implements OnInit, OnDestroy, AfterViewInit {

    public showLoader = true;
    public noResultMessage;
    public filterType: string;
    public queryParams: any;
    public hashTagId: string;
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
    public contentList: Array<ICard> = [];
    public cardIntractEdata: IInteractEventEdata;
    public loaderMessage: ILoaderMessage;
    public sortingOptions;
    public redirectUrl;
    public frameworkData: object;
    public frameworkId;
    public closeIntractEdata;
    public numberOfSections = new Array(this.configService.appConfig.SEARCH.PAGE_LIMIT);

    constructor(public searchService: SearchService, public router: Router, private playerService: PlayerService,
        public activatedRoute: ActivatedRoute, public paginationService: PaginationService,
        public resourceService: ResourceService, public toasterService: ToasterService,
        public configService: ConfigService, public utilService: UtilService,
        public navigationHelperService: NavigationHelperService, public userService: UserService,
        public cacheService: CacheService, public frameworkService: FrameworkService,
        public navigationhelperService: NavigationHelperService) {
        this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.filterType = this.configService.appConfig.library.filterType;
        this.redirectUrl = this.configService.appConfig.library.searchPageredirectUrl;
        this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    }
    ngOnInit() {
        this.frameworkService.channelData$.pipe(takeUntil(this.unsubscribe$)).subscribe((channelData) => {
            if (!channelData.err) {
              this.frameworkId = _.get(channelData, 'channelData.defaultFramework');
            }
          });
        this.userService.userData$.subscribe(userData => {
            if (userData && !userData.err) {
                this.frameworkData = _.get(userData.userProfile, 'framework');
            }
          });
        this.initFilters = true;
        this.dataDrivenFilterEvent.pipe(first()).
            subscribe((filters: any) => {
                this.dataDrivenFilters = filters;
                this.fetchContentOnParamChange();
                this.setNoResultMessage();
            });
    }
    public getFilters(filters) {
        this.facets = filters.map(element => element.code);
        const defaultFilters = _.reduce(filters, (collector: any, element) => {
            if (element.code === 'board') {
                collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
            }
            return collector;
        }, {});
        this.dataDrivenFilterEvent.emit(defaultFilters);
    }
    private fetchContentOnParamChange() {
        combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
            .pipe(debounceTime(5), // wait for both params and queryParams event to change
                tap(data => this.inView({ inview: [] })), // trigger pageexit if last filter resulted 0 contents
                delay(10), // to trigger pageexit telemetry event
                tap(data => {
                this.setTelemetryData();
                }),
                map(result => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
                takeUntil(this.unsubscribe$)
            ).subscribe(({ params, queryParams }) => {
                this.showLoader = true;
                this.paginationDetails.currentPage = params.pageNumber;
                this.queryParams = { ...queryParams };
                this.contentList = [];
                this.fetchContents();
            });
    }
    private fetchContents() {
        let filters: any = _.omit(this.queryParams, ['key', 'sort_by', 'sortType', 'appliedFilters', 'softConstraints']);
        if (_.isEmpty(filters)) {
            filters = _.omit(this.frameworkData, ['id']);
        }
        filters.channel = this.hashTagId;
        filters.contentType = filters.contentType || this.configService.appConfig.CommonSearch.contentType;
        const option: any = {
          filters: filters,
          limit: this.configService.appConfig.SEARCH.PAGE_LIMIT,
          pageNumber: this.paginationDetails.currentPage,
          query: this.queryParams.key,
          mode: 'soft',
          facets: this.facets,
          params: this.configService.appConfig.ExplorePage.contentApiQueryParams || {}
        };
        if (this.frameworkId) {
          option.params.framework = this.frameworkId;
        }
        this.searchService.contentSearch(option)
            .subscribe(data => {
                this.showLoader = false;
                this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
                this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
                    this.configService.appConfig.SEARCH.PAGE_LIMIT);
                this.contentList = data.result.content || [];
            }, err => {
                this.showLoader = false;
                this.contentList = [];
                this.facetsList = [];
                this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
                    this.configService.appConfig.SEARCH.PAGE_LIMIT);
                this.toasterService.error(this.resourceService.messages.fmsg.m0051);
            });
    }
    public navigateToPage(page: number): void {
        if (page < 1 || page > this.paginationDetails.totalPages) {
            return;
        }
        const url = this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString());
        this.router.navigate([url], { queryParams: this.queryParams });
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
    private setTelemetryData() {
        this.inViewLogs = [];
        this.cardIntractEdata = {
            id: 'content-card',
            type: 'click',
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid
        };
        this.closeIntractEdata = {
            id: 'search-close',
            type: 'click',
            pageid: 'library-search'
        };
        this.sortIntractEdata = {
            id: 'sort',
            type: 'click',
            pageid: 'library-search'
        };
    }
    public playContent(event) {
        this.playerService.playContent(event.data);
    }
    public inView(event) {
        _.forEach(event.inview, (elem, key) => {
            const obj = _.find(this.inViewLogs, { objid: elem.data.identifier });
            if (!obj) {
                this.inViewLogs.push({
                    objid: elem.data.identifier,
                    objtype: elem.data.contentType || 'content',
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
    ngAfterViewInit () {
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
        this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$))
            .subscribe(item => {
                this.noResultMessage = {
                    'title': this.resourceService.frmelmnts.lbl.noBookfoundTitle,
                    'subTitle': this.resourceService.frmelmnts.lbl.noBookfoundSubTitle,
                    'buttonText': this.resourceService.frmelmnts.lbl.noBookfoundButtonText,
                    'showExploreContentButton': false
                };
            });
    }
}
