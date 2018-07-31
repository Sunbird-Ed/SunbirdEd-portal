import { combineLatest as observableCombineLatest } from 'rxjs';
import {
    ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
    ILoaderMessage, UtilService, ICard, NavigationHelperService
} from '@sunbird/shared';
import { PublicPlayerService } from './../../../../services';
import {
    SearchService, CoursesService, PlayerService, ISort,
    OrgDetailsService
} from '@sunbird/core';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-explore-content',
    templateUrl: './explore-content.component.html',
    styleUrls: ['./explore-content.component.css']
})
export class ExploreContentComponent implements OnInit, OnDestroy {
    inviewLogs: any = [];
    /**
       * telemetryImpression
      */
    telemetryImpression: IImpressionEventInput;
    /**
     * To call searchService which helps to use list of courses
     */
    private searchService: SearchService;
    /**
    * To call resource service which helps to use language constant
    */
    private resourceService: ResourceService;
    /**
     * To get url, app configs
     */
    public config: ConfigService;
    /**
    * To show toaster(error, success etc) after any API calls
    */
    private toasterService: ToasterService;
    /**
     * To get enrolled courses details.
     */
    coursesService: CoursesService;
    /**
     * Contains channel id
     */
    hashTagId: any;
    /**
     * Contains list of published course(s) of logged-in user
     */
    searchList: Array<ICard> = [];
    /**
     * To navigate to other pages
     */
    private route: Router;
    /**
    * To send activatedRoute.snapshot to router navigation
    * service for redirection to parent component
    */
    private activatedRoute: ActivatedRoute;
    /**
     * For showing pagination on inbox list
     */
    private paginationService: PaginationService;
    /**
      * To show / hide no result message when no result found
     */
    noResult = false;
    /**
     * Contains slug which comes from the url
     */
    slug = '';
    selectedLanguage: string;
    /**
     * no result  message
    */
    noResultMessage: INoResultMessage;
    /**
      * totalCount of the list
    */
    totalCount: Number;
    /**
     * Current page number of inbox list
     */
    pageNumber = 1;
    /**
      * Contains page limit of outbox list
      */
    pageLimit: number;
    isSearchable = false;
    tempPageNumber: number;
    language = 'en';
    /**
     * This variable helps to show and hide page loader.
     * It is kept true by default as at first when we comes
     * to a page the loader should be displayed before showing
     * any data
     */
    showLoader = true;
    /**
       * loader message
      */
    loaderMessage: ILoaderMessage;
    /**
     * Contains returned object of the pagination service
     * which is needed to show the pagination on inbox view
     */
    pager: IPagination;
    /**
     *url value
     */
    queryParams: any;

    public filters: any;

    public filterType: any;

    public redirectUrl: string;
    public facetArray: Array<string>;
    public facets: any;
    sortingOptions: Array<ISort>;
    public unsubscribe$ = new Subject<void>();
    cardIntractEdata: IInteractEventEdata;
    filterIntractEdata: IInteractEventEdata;
    /**
       * Constructor to create injected service(s) object
       * Default method of Draft Component class
       * @param {SearchService} searchService Reference of SearchService
       * @param {Router} route Reference of Router
       * @param {PaginationService} paginationService Reference of PaginationService
       * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
       * @param {ConfigService} config Reference of ConfigService
       * @param {CoursesService} coursesService Reference of CoursesService
       * @param {ResourceService} resourceService Reference of ResourceService
       * @param {ToasterService} toasterService Reference of ToasterService
     */
    constructor(searchService: SearchService, route: Router, private playerService: PlayerService,
        activatedRoute: ActivatedRoute, paginationService: PaginationService,
        resourceService: ResourceService, toasterService: ToasterService,
        config: ConfigService, public utilService: UtilService, public orgDetailsService: OrgDetailsService,
        public navigationHelperService: NavigationHelperService, private publicPlayerService: PublicPlayerService) {
        this.searchService = searchService;
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.paginationService = paginationService;
        this.resourceService = resourceService;
        this.toasterService = toasterService;
        this.config = config;
        this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    }
    /**
     * This method sets the make an api call to get all search data with page No and offset
     */
    populateContentSearch() {
        this.showLoader = true;
        this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
        const filters = _.pickBy(this.filters, value => value.length > 0);
        filters.channel = this.hashTagId;
        const requestParams = {
            filters: filters,
            limit: this.pageLimit,
            pageNumber: this.pageNumber,
            query: this.queryParams.key,
            softConstraints: { badgeAssertions: 2, channel: 1 },
            facets: this.facetArray
        };
        this.searchService.contentSearch(requestParams).pipe(
            takeUntil(this.unsubscribe$))
            .subscribe(
                (apiResponse: ServerResponse) => {
                    if (apiResponse.result.count && apiResponse.result.content && apiResponse.result.content.length > 0) {
                        this.showLoader = false;
                        this.noResult = false;
                        this.searchList = apiResponse.result.content;
                        this.totalCount = apiResponse.result.count;
                        this.facets = apiResponse.result.facets;
                        this.processFilterData();
                        this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
                        const constantData = this.config.appConfig.LibrarySearch.constantData;
                        const metaData = this.config.appConfig.LibrarySearch.metaData;
                        const dynamicFields = this.config.appConfig.LibrarySearch.dynamicFields;
                        this.searchList = this.utilService.getDataForCard(apiResponse.result.content,
                            constantData, dynamicFields, metaData);
                    } else {
                        this.noResult = true;
                        this.showLoader = false;
                        this.noResultMessage = {
                            'message': this.resourceService.messages.stmsg.m0007,
                            'messageText': this.resourceService.messages.stmsg.m0006
                        };
                    }
                },
                err => {
                    this.showLoader = false;
                    this.noResult = true;
                    this.noResultMessage = {
                        'messageText': this.resourceService.messages.fmsg.m0077
                    };
                    this.toasterService.error(this.resourceService.messages.fmsg.m0051);
                }
            );
    }
    /**
    * This method helps to navigate to different pages.
    * If page number is less than 1 or page number is greater than total number
    * of pages is less which is not possible, then it returns.
    *
    * @param {number} page Variable to know which page has been clicked
    *
    * @example navigateToPage(1)
    */
    navigateToPage(page: number): undefined | void {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pageNumber = page;
        this.route.navigate(['explore', this.pageNumber], {
            queryParams: this.queryParams
        });
    }

    getChannelId() {
        this.orgDetailsService.getOrgDetails(this.slug).pipe(
            takeUntil(this.unsubscribe$))
            .subscribe(
                (apiResponse: any) => {
                    this.hashTagId = apiResponse.hashTagId;
                    this.setFilters();
                },
                err => {
                    this.route.navigate(['']);
                }
            );
    }

    compareObjects(a, b) {
        if (a !== undefined) {
            a = _.omit(a, ['language']);
        }
        if (b !== undefined) {
            b = _.omit(b, ['language']);
        }
        return _.isEqual(a, b);
    }

    setFilters() {
        this.filters = {};
        this.filterType = this.config.appConfig.explore.filterType;
        this.redirectUrl = this.config.appConfig.explore.searchPageredirectUrl;
        this.filters = {
            contentType: ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'Story', 'Worksheet', 'Game']
        };
        observableCombineLatest(
            this.activatedRoute.params,
            this.activatedRoute.queryParams,
            (params: any, queryParams: any) => {
                return {
                    params: params,
                    queryParams: queryParams
                };
            }).pipe(
                takeUntil(this.unsubscribe$))
            .subscribe(bothParams => {
                this.isSearchable = this.compareObjects(this.queryParams, bothParams.queryParams);
                if (bothParams.params.pageNumber) {
                    this.pageNumber = Number(bothParams.params.pageNumber);
                }
                this.queryParams = { ...bothParams.queryParams };
                this.filters = {
                    contentType: ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'Story', 'Worksheet', 'Game']
                };
                if (!_.isEmpty(this.queryParams)) {
                    _.forOwn(this.queryParams, (queryValue, queryParam) => {
                        this.filters[queryParam] = queryValue;
                    });
                    this.filters = _.omit(this.filters, ['key', 'sort_by', 'sortType']);
                }
                if (this.queryParams.sort_by && this.queryParams.sortType) {
                    this.queryParams.sortType = this.queryParams.sortType.toString();
                }
                if (this.tempPageNumber !== this.pageNumber || !this.isSearchable) {
                    this.tempPageNumber = this.pageNumber;
                    this.populateContentSearch();
                }
            });
    }

    ngOnInit() {
        this.slug = this.activatedRoute.snapshot.params.slug;
        this.getChannelId();
        this.activatedRoute.params.subscribe(params => {
            this.setTelemetryData();
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
                uri: this.route.url,
                subtype: this.activatedRoute.snapshot.data.telemetry.subtype
            }
        };
        this.cardIntractEdata = {
            id: 'content-card',
            type: 'click',
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid
        };
        this.filterIntractEdata = {
            id: 'filter',
            type: 'click',
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid
        };
    }

    public playContent(event) {
        this.publicPlayerService.playContent(event);
    }
    inview(event) {
        _.forEach(event.inview, (inview, key) => {
            const obj = _.find(this.inviewLogs, (o) => {
                return o.objid === inview.data.metaData.identifier;
            });
            if (obj === undefined) {
                this.inviewLogs.push({
                    objid: inview.data.metaData.identifier,
                    objtype: inview.data.metaData.contentType || 'content',
                    index: inview.id
                });
            }
        });
        this.telemetryImpression.edata.visits = this.inviewLogs;
        this.telemetryImpression.edata.subtype = 'pageexit';
        this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    filterData(event) {
        this.facetArray = event;
    }
    processFilterData() {
        const facetObj = {};
        _.forEach(this.facets, (value) => {
            if (value) {
                let data = {};
                data = value.values;
                facetObj[value.name] = data;
                this.facets = facetObj;
            }
        });
    }
}
