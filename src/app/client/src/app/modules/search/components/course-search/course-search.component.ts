import {
  ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, ICard
} from '@sunbird/shared';
import { SearchService, CoursesService, ICourses, SearchParam , ISort} from '@sunbird/core';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.css']
})
export class CourseSearchComponent implements OnInit {
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
  /**
 *search filters
 */
  filters: any;
  /**
  * Contains result object returned from enrolled course API.
  */
  enrolledCourses: Array<ICourses>;

  /**
   * contains the search filter type
   */
  public filterType: string;

  public redirectUrl: string;
  sortingOptions: Array<ISort>;

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
    config: ConfigService, coursesService: CoursesService, public utilService: UtilService) {
    this.searchService = searchService;
    this.route = route;
    this.coursesService = coursesService;
    this.activatedRoute = activatedRoute;
    this.paginationService = paginationService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.config = config;
    this.route.onSameUrlNavigation = 'reload';
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }
  /**
    * This method calls the enrolled courses API.
    */
  populateEnrolledCourse() {
    this.showLoader = true;
    this.coursesService.enrolledCourseData$.subscribe(
      data => {
        if (data && !data.err) {
          if (data.enrolledCourses.length > 0) {
            this.enrolledCourses = data.enrolledCourses;
          }
          this.populateCourseSearch();
        } else if (data && data.err) {
          this.populateCourseSearch();
        }
      });
  }
  /**
   * This method sets the make an api call to get all search data with page No and offset
   */
  populateCourseSearch() {
    this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
    const requestParams = {
      filters: _.pickBy(this.filters, value => value.length > 0),
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      query: this.queryParams.key,
      sort_by: {[this.queryParams.sort_by]: this.queryParams.sortType}
    };

    this.searchService.courseSearch(requestParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result.count && apiResponse.result.course.length > 0) {
          this.showLoader = false;
          this.noResult = false;
          this.totalCount = apiResponse.result.count;
          this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
          this.processActionObject(apiResponse.result.course);
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
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
      }
    );
  }
  /**
  * This method process the action object.
  */
  processActionObject(course) {
    _.forEach(course, (value, index) => {
      if (this.enrolledCourses && this.enrolledCourses.length > 0) {
        _.forEach(this.enrolledCourses, (value1, index1) => {
          if (course[index].identifier === this.enrolledCourses[index1].courseId) {
            const constantData = {
              action: {
                right: {
                  class: 'ui blue basic button',
                   eventName: 'Resume',
                   displayType: 'button',
                   text: 'Resume'},
                  onImage: { eventName: 'onImage' }
              }
          };
          const metaData = { metaData: ['identifier', 'mimeType', 'framework', 'contentType'] };
          const dynamicFields = {};
          this.searchList = this.utilService.getDataForCard(course, constantData, dynamicFields, metaData);
          } else {
            const constantData = {
              action: {
                  onImage: { eventName: 'onImage' }
              }
          };
          const metaData = { metaData: ['identifier', 'mimeType', 'framework', 'contentType'] };
          const dynamicFields = {};
          this.searchList = this.utilService.getDataForCard(course, constantData, dynamicFields, metaData);
          }
        });
      } else {
        const constantData = {
          action: {
              onImage: { eventName: 'onImage' }
          }
      };
      const metaData = { metaData: ['identifier', 'mimeType', 'framework', 'contentType'] };
      const dynamicFields = {};
      this.searchList = this.utilService.getDataForCard(course, constantData, dynamicFields, metaData);
      }
    });
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
    this.route.navigate(['search/Courses', this.pageNumber], {
      queryParams: this.queryParams
    });
  }

  ngOnInit() {
    this.filterType = this.config.appConfig.course.filterType;
    this.redirectUrl = this.config.appConfig.course.searchPageredirectUrl;
    this.filters = {
      objectType: ['Content']
    };
    const __self = this;
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
        console.log(this.queryParams);
        // load search filters from queryparams if any
        this.filters = {};
        _.forOwn(this.queryParams, (queryValue, queryParam) =>  {
          if (queryParam !== 'key' && queryParam !== 'sort_by' && queryParam !== 'sortType' ) {
            this.filters[queryParam] = queryValue;
          }
        });
        this.populateEnrolledCourse();
      });
  }
}
