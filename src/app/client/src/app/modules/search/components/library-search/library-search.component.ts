import {
  ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, IContents
} from '@sunbird/shared';
import { SearchService, CoursesService, ICourses, SearchParam } from '@sunbird/core';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.component.html',
  styleUrls: ['./library-search.component.css']
})
export class LibrarySearchComponent implements OnInit {
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
   * Contains list of published course(s) of logged-in user
   */
  searchList: Array<IContents> = [];
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
  /**
   * This variable hepls to show and hide page loader.
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
  constructor(searchService: SearchService, route: Router,
    activatedRoute: ActivatedRoute, paginationService: PaginationService,
    resourceService: ResourceService, toasterService: ToasterService,
    config: ConfigService) {
    this.searchService = searchService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.paginationService = paginationService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.config = config;
  }
  /**
   * This method sets the make an api call to get all search data with page No and offset
   */
  populateContentSearch() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
    const requestParams = {
      filters:  _.pickBy(this.filters, value => value.length > 0),
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      query: this.queryParams.key,
      softConstraints: { badgeAssertions: 1 },
      sort_by: {}
    };
    this.searchService.contentSearch(requestParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result.count && apiResponse.result.content.length > 0) {
          this.showLoader = false;
          this.noResult = false;
          this.searchList = apiResponse.result.content;
          this.totalCount = apiResponse.result.count;
          this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
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
    this.route.navigate(['search/Library', this.pageNumber], {
      queryParams: this.queryParams
    });
  }
  ngOnInit() {
    this.filterType = this.config.appConfig.library.filterType;
    this.redirectUrl = this.config.appConfig.library.searchPageredirectUrl;
    this.filters = {
      contentType: ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'Story', 'Worksheet', 'Game']
    };
    Observable
      .combineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params: any, queryParams: any) => {
        return {
          params: params,
          queryParams: queryParams
        };
      })
      .subscribe(bothParams => {
        if (bothParams.params.pageNumber) {
          this.pageNumber = Number(bothParams.params.pageNumber);
        }
        this.queryParams = { ...bothParams.queryParams };
        _.forOwn(this.queryParams, (queryValue, queryParam) => {
          if (queryParam !== 'key') {
            this.filters[queryParam] = queryValue;
          }
        });
        this.populateContentSearch();
      });
  }
}
