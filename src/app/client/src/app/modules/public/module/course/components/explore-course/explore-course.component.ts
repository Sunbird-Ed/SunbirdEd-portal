import { combineLatest as observableCombineLatest ,  Subject } from 'rxjs';
import {
    ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
    ILoaderMessage, UtilService, ICard, NavigationHelperService, BrowserCacheTtlService
} from '@sunbird/shared';
import { PublicPlayerService } from './../../../../services';
import {
    SearchService, CoursesService, PlayerService, ISort,
    OrgDetailsService, UserService, FormService
} from '@sunbird/core';
import { Component, OnInit, NgZone, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-explore-course',
  templateUrl: './explore-course.component.html',
  styleUrls: ['./explore-course.component.scss']
})
export class ExploreCourseComponent implements OnInit, OnDestroy {
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
    * Refrence of UserService
    */
    private userService: UserService;
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
    * To show / hide login popup on click of content
    */
    showLoginModal = false;

    /**
    *baseUrl;
    */
    public baseUrl: string;
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
    exploreRoutingUrl: string;
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
    dataDrivenFilter: object;
    frameWorkName: string;
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
        activatedRoute: ActivatedRoute, paginationService: PaginationService, private cacheService: CacheService,
        resourceService: ResourceService, toasterService: ToasterService, private browserCacheTtlService: BrowserCacheTtlService,
        config: ConfigService, public utilService: UtilService, public orgDetailsService: OrgDetailsService,
        private formService: FormService, public navigationHelperService: NavigationHelperService,
        private publicPlayerService: PublicPlayerService,
        userService: UserService) {
        this.searchService = searchService;
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.paginationService = paginationService;
        this.resourceService = resourceService;
        this.toasterService = toasterService;
        this.config = config;
        this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
        this.userService = userService;
    }
    /**
     * This method sets the make an api call to get all search data with page No and offset
     */
    populateCourseSearch() {
        this.showLoader = true;
        this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
        const filters = _.pickBy(this.filters, value => value.length > 0);
        const requestParams = {
            filters: filters,
            limit: this.pageLimit,
            pageNumber: this.pageNumber,
            query: this.queryParams.key,
            params : this.config.appConfig.ExplorePage.contentApiQueryParams
        };
        this.searchService.courseSearch(requestParams).pipe(
            takeUntil(this.unsubscribe$))
            .subscribe(
                (apiResponse: ServerResponse) => {
                    if (apiResponse.result.count && apiResponse.result.course && apiResponse.result.course.length > 0) {
                        this.showLoader = false;
                        this.noResult = false;
                        this.searchList = apiResponse.result.course;
                        this.totalCount = apiResponse.result.count;
                        this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
                        const constantData = this.config.appConfig.CoursePage.constantData;
                        const metaData = this.config.appConfig.CoursePage.metaData;
                        const dynamicFields = this.config.appConfig.CoursePage.dynamicFields;
                        this.searchList = this.utilService.getDataForCard(apiResponse.result.course,
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
        this.route.navigate([this.exploreRoutingUrl, this.pageNumber], {
            queryParams: this.queryParams
        });
    }
    getChannelId() {
        this.orgDetailsService.getOrgDetails(this.slug).pipe(
            takeUntil(this.unsubscribe$))
            .subscribe(
                (apiResponse: any) => {
                    this.hashTagId = apiResponse.hashTagId;
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
                this.filters = {};
                if (!_.isEmpty(this.queryParams)) {
                    _.forOwn(this.queryParams, (queryValue, queryParam) => {
                        this.filters[queryParam] = queryValue;
                    });
                    this.filters = _.omit(this.filters, ['key', 'sort_by', 'sortType']);
                }
                if (this.queryParams.sort_by && this.queryParams.sortType) {
                    this.queryParams.sortType = this.queryParams.sortType.toString();
                }
                if (this.tempPageNumber !== this.pageNumber || !this.isSearchable ) {
                    this.tempPageNumber = this.pageNumber;
                    this.populateCourseSearch();
                }
            });
    }
    getframeWorkData() {
        const framework = this.cacheService.get('framework' + 'search');
        if (framework) {
          this.frameWorkName = framework;
        } else {
          const formServiceInputParams = {
            formType: 'framework',
            formAction: 'search',
            contentType: 'framework-code',
          };
          this.formService.getFormConfig(formServiceInputParams, this.hashTagId).subscribe(
            (data: ServerResponse) => {
              this.frameWorkName = _.find(data, 'framework').framework;
              this.cacheService.set('framework' + 'search', this.frameWorkName ,
                {maxAge: this.browserCacheTtlService.browserCacheTtl});
            },
            (err: ServerResponse) => {
            this.toasterService.error(this.resourceService.messages.emsg.m0005);
            }
          );
        }
      }
    ngOnInit() {
            if (_.includes(this.route.url, '/explore-course')) {
              const url  = this.route.url.split('/');
              if (url.indexOf('explore-course') === 2) {
                this.exploreRoutingUrl = url[1] + '/' + url[2];
              } else {
                this.exploreRoutingUrl = url[1];
              }
            }
        this.filters = {};
        this.dataDrivenFilter = {};
        this.filterType = this.config.appConfig.exploreCourse.filterType;
        this.redirectUrl = this.config.appConfig.exploreCourse.searchPageredirectUrl;
        this.slug = this.activatedRoute.snapshot.params.slug;
        this.getChannelId();
        this.getframeWorkData();
        this.activatedRoute.params.subscribe(params => {
            this.setTelemetryData();
        });
        this.setFilters();
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
    }

    public playContent(event) {
        if (!this.userService.loggedIn) {
            this.showLoginModal = true;
            this.baseUrl = '/' + 'learn' + '/' + 'course' + '/' + event.data.metaData.identifier;
        } else {
            this.publicPlayerService.playContent(event);
        }
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
    closeModal() {
      this.showLoginModal = false;
    }
}
