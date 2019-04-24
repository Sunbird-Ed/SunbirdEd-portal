import {
    PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
    ICard, ILoaderMessage, UtilService, BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { SearchService, OrgDetailsService, UserService, FormService } from '@sunbird/core';
import { IPagination } from '@sunbird/announcement';
import { PublicPlayerService } from '../../../../services';
import { combineLatest, Subject, of } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, debounceTime, catchError, tap, delay } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';

@Component({
    templateUrl: './explore-course.component.html',
    styleUrls: ['./explore-course.component.scss']
})
export class ExploreCourseComponent implements OnInit, OnDestroy, AfterViewInit {
    public showLoader = true;
    public showLoginModal = false;
    public baseUrl: string;
    public noResultMessage: INoResultMessage;
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

    public frameWorkName: string;

    constructor(public searchService: SearchService, public router: Router,
        public activatedRoute: ActivatedRoute, public paginationService: PaginationService,
        public resourceService: ResourceService, public toasterService: ToasterService,
        public configService: ConfigService, public utilService: UtilService, public orgDetailsService: OrgDetailsService,
        private publicPlayerService: PublicPlayerService, public userService: UserService, public cacheService: CacheService,
        public formService: FormService, public browserCacheTtlService: BrowserCacheTtlService,
        public navigationhelperService: NavigationHelperService) {
        this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.filterType = this.configService.appConfig.exploreCourse.filterType;
    }
    ngOnInit() {
        combineLatest(
            this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug),
            this.getFrameWork()
        ).pipe(
            mergeMap((data: any) => {
                this.hashTagId = data[0].hashTagId;
                if (data[1]) {
                    this.initFilters = true;
                    this.frameWorkName = data[1];
                    return of({});
                    // return this.dataDrivenFilterEvent;
                } else {
                    return of({});
                }
            }), first()
        ).subscribe((filters: any) => {
            this.dataDrivenFilters = filters;
            this.fetchContentOnParamChange();
            this.setNoResultMessage();
            },
            error => {
                this.router.navigate(['']);
            }
        );
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
    private getFrameWork() {
        const framework = this.cacheService.get('framework' + 'search');
        if (framework) {
        return of(framework);
        } else {
        const formServiceInputParams = {
            formType: 'framework',
            formAction: 'search',
            contentType: 'framework-code',
        };
        return this.formService.getFormConfig(formServiceInputParams, this.hashTagId)
            .pipe(map((data) => {
                const frameWork = _.find(data, 'framework').framework;
                this.cacheService.set('framework' + 'search', frameWork, { maxAge: this.browserCacheTtlService.browserCacheTtl});
                return frameWork;
            }), catchError((error) => {
                return of(false);
            }));
        }
    }
    private fetchContentOnParamChange() {
        combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
        .pipe( debounceTime(5), // wait for both params and queryParams event to change
             tap(data => this.inView({inview: []})),
             delay(10),
             tap(data => this.setTelemetryData()),
            map(result => ({params: { pageNumber: Number(result[0].pageNumber)}, queryParams: result[1]})),
            takeUntil(this.unsubscribe$)
        ).subscribe(({params, queryParams}) => {
            this.showLoader = true;
            this.paginationDetails.currentPage = params.pageNumber;
            this.queryParams = { ...queryParams };
            this.contentList = [];
            this.fetchContents();
        });
    }
    private fetchContents() {
        let filters = _.pickBy(this.queryParams, (value: Array<string> | string) => value && value.length);
        // filters.channel = this.hashTagId;
        // filters.board = _.get(this.queryParams, 'board') || this.dataDrivenFilters.board;
        filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
        const option = {
            filters: filters,
            limit: this.configService.appConfig.SEARCH.PAGE_LIMIT,
            pageNumber: this.paginationDetails.currentPage,
            query: this.queryParams.key,
            // softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
            facets: this.facets,
            params: this.configService.appConfig.ExplorePage.contentApiQueryParams
        };
        if (this.frameWorkName) {
            option.params.framework = this.frameWorkName;
        }
        this.searchService.courseSearch(option)
        .subscribe(data => {
            this.showLoader = false;
            this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
            this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
                this.configService.appConfig.SEARCH.PAGE_LIMIT);
            const { constantData, metaData, dynamicFields } = this.configService.appConfig.CoursePage;
            this.contentList = this.utilService.getDataForCard(data.result.course, constantData, dynamicFields, metaData);
        }, err => {
            this.showLoader = false;
            this.contentList = [];
            this.facetsList = [];
            this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
                this.configService.appConfig.SEARCH.PAGE_LIMIT);
            this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        });
    }
    private setTelemetryData() {
        this.inViewLogs = [];
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
        this.cardIntractEdata = {
            id: 'content-card',
            type: 'click',
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid
        };
    }
    public playContent(event) {
        this.publicPlayerService.playExploreCourse(event.data.metaData.identifier);
    }
    public inView(event) {
        _.forEach(event.inview, (elem, key) => {
            const obj = _.find(this.inViewLogs, { objid: elem.data.metaData.identifier});
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
    public navigateToPage(page: number): void {
        if (page < 1 || page > this.paginationDetails.totalPages) {
            return;
        }
        const url = this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString());
        this.router.navigate([url], { queryParams: this.queryParams });
        window.scroll({
            top: 100,
            left: 100,
            behavior: 'smooth'
        });
    }
    ngAfterViewInit () {
        setTimeout(() => {
            this.setTelemetryData();
        });
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    closeModal() {
        this.showLoginModal = false;
    }
    private setNoResultMessage() {
        this.noResultMessage = {
            'message': 'messages.stmsg.m0007',
            'messageText': 'messages.stmsg.m0006'
        };
    }
}
