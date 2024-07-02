import {
    PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
    ICard, ILoaderMessage, UtilService, BrowserCacheTtlService, NavigationHelperService, IPagination,
    LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { SearchService, OrgDetailsService, UserService, FormService } from '@sunbird/core';
import { PublicPlayerService } from '../../../../services';
import { combineLatest, Subject, of } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, debounceTime, catchError, tap, delay } from 'rxjs/operators';
import { CacheService } from '../../../../../shared/services/cache-service/cache.service';
import { CslFrameworkService } from '../../../../services/csl-framework/csl-framework.service';

@Component({
    templateUrl: './explore-course.component.html'
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
    layoutConfiguration: any;
    FIRST_PANEL_LAYOUT: string;
    SECOND_PANEL_LAYOUT: string;
    public globalSearchFacets: Array<string>;
    public allTabData;
    public selectedFilters;
    public totalCount;
    public searchAll;
    public allMimeType;
    public frameworkCategoriesList;
    public categoryKeys;


    constructor(public searchService: SearchService, public router: Router,
        public activatedRoute: ActivatedRoute, public paginationService: PaginationService,
        public resourceService: ResourceService, public toasterService: ToasterService,
        public configService: ConfigService, public utilService: UtilService, public orgDetailsService: OrgDetailsService,
        private publicPlayerService: PublicPlayerService, public userService: UserService, public cacheService: CacheService,
        public formService: FormService, public browserCacheTtlService: BrowserCacheTtlService,
        public navigationhelperService: NavigationHelperService, public layoutService: LayoutService, public cslFrameworkService: CslFrameworkService) {
        this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.filterType = this.configService.appConfig.exploreCourse.filterType;
    }
    ngOnInit() {
        this.categoryKeys = this.cslFrameworkService.transformDataForCC();
        this.frameworkCategoriesList = this.cslFrameworkService.getAllFwCatName();
        this.searchService.getContentTypes().pipe(takeUntil(this.unsubscribe$)).subscribe(formData => {
            this.allTabData = _.find(formData, (o) => o.title === 'frmelmnts.tab.all');
            this.globalSearchFacets = _.get(this.allTabData, 'search.facets');
            this.setNoResultMessage();
            this.initFilters = true;
        }, error => {
            this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
            this.navigationhelperService.goBack();
        });
        this.layoutConfiguration = this.layoutService.initlayoutConfig();
        this.initLayout();
        combineLatest(
            this.orgDetailsService.getOrgDetails(this.userService.slug),
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
        this.searchAll = this.resourceService?.frmelmnts?.lbl?.allContent;
    }
    initLayout() {
        this.redoLayout();
        this.layoutService.switchableLayout().
            pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
                if (layoutConfig != null) {
                    this.layoutConfiguration = layoutConfig.layout;
                }
                this.redoLayout();
            });
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
    public getFilters(filters) {
        const filterData = filters && filters.filters || {};
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
        this.selectedFilters = filterData;
        const defaultFilters = _.reduce(filters, (collector: any, element) => {
            if (element.code === this.frameworkCategoriesList[0]) {
                collector[this.frameworkCategoriesList[0]] = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
            }
            return collector;
        }, {});
        this.dataDrivenFilterEvent.emit(defaultFilters);
    }
    private getFrameWork() {
        const formServiceInputParams = {
            formType: 'framework',
            formAction: 'search',
            contentType: 'framework-code',
        };
        return this.formService.getFormConfig(formServiceInputParams, this.hashTagId)
            .pipe(map((data) => {
                const frameWork = _.find(data, 'framework').framework;
                return frameWork;
            }), catchError((error) => {
                return of(false);
            }));
    }
    private fetchContentOnParamChange() {
        combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
            .pipe(debounceTime(5), // wait for both params and queryParams event to change
                tap(data => this.inView({ inview: [] })),
                delay(10),
                tap(data => this.setTelemetryData()),
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
        const selectedMediaType = _.isArray(_.get(this.queryParams, 'mediaType')) ? _.get(this.queryParams, 'mediaType')[0] :
            _.get(this.queryParams, 'mediaType');
        const mimeType = _.find(_.get(this.allTabData, 'search.filters.mimeType'), (o) => {
            return o.name === (selectedMediaType || 'all');
        });
        const filters: any = _.omit(this.queryParams, ['key', 'sort_by', 'sortType', 'appliedFilters', 'softConstraints', 'selectedTab', 'mediaType']);
        if (!filters.channel) {
            filters.channel = this.hashTagId;
        }
        filters.primaryCategory = filters.primaryCategory || _.get(this.allTabData, 'search.filters.primaryCategory');
        filters.mimeType = _.get(mimeType, 'values');
        const softConstraints = _.get(this.activatedRoute.snapshot, 'data.softConstraints') || {};
        if (this.queryParams.key) {
            delete softConstraints[this.frameworkCategoriesList[0]];
        }
        const option: any = {
            filters: filters,
            fields: _.get(this.allTabData, 'search.fields'),
            limit: _.get(this.allTabData, 'search.limit'),
            pageNumber: this.paginationDetails.currentPage,
            query: this.queryParams.key,
            mode: 'soft',
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
        this.searchService.contentSearch(option)
            .pipe(
                mergeMap(data => {
                    const channelFacet = _.find(_.get(data, 'result.facets') || [], facet => _.get(facet, 'name') === 'channel');
                    if (channelFacet) {
                        const rootOrgIds = this.orgDetailsService.processOrgData(_.get(channelFacet, 'values'));
                        return this.orgDetailsService.searchOrgDetails({
                            filters: { isTenant: true, id: rootOrgIds },
                            fields: ['slug', 'identifier', 'orgName']
                        }).pipe(
                            mergeMap(orgDetails => {
                                channelFacet.values = _.get(orgDetails, 'content');
                                return of(data);
                            })
                        );
                    }
                    return of(data);
                })
            )
            .subscribe(data => {
                this.showLoader = false;
                this.facets = this.searchService.updateFacetsData(_.get(data, 'result.facets'));
                this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
                this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
                    this.configService.appConfig.SEARCH.PAGE_LIMIT);
                this.contentList = data.result.content || [];
                this.totalCount = data.result.count;
            }, err => {
                this.showLoader = false;
                this.contentList = [];
                this.facetsList = [];
                this.totalCount = 0;
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
                uri: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
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
        this.publicPlayerService.playContent(event);
    }
    public inView(event) {
        _.forEach(event.inview, (elem, key) => {
            const obj = _.find(this.inViewLogs, { objid: elem.data.metaData.identifier });
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
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
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
