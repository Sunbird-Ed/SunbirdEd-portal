
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import {
  ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, ICard
} from '@sunbird/shared';
import { SearchService, CoursesService, ICourses, SearchParam, ISort, PlayerService } from '@sunbird/core';
import { Component, OnInit, NgZone, ChangeDetectorRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { CatalogFiltersComponent } from '../catalog-filters/catalog-filters.component';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  inviewLogs: any = [];
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  closeIntractEdata: IInteractEventEdata;
  cardIntractEdata: IInteractEventEdata;
  sortIntractEdata: IInteractEventEdata;
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
  @ViewChild(CatalogFiltersComponent) catalogFiltersComponent: CatalogFiltersComponent;

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
    resourceService: ResourceService, toasterService: ToasterService, private changeDetectorRef: ChangeDetectorRef,
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

  populateCourseSearch() {
    this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
    const requestParams = {
      filters: _.pickBy(this.filters, value => value.length > 0),
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      query: this.queryParams.key,
      sort_by: { [this.queryParams.sort_by]: this.queryParams.sortType }
    };

    this.searchService.courseSearch(requestParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result.count && apiResponse.result.course) {
          this.showLoader = false;
          this.noResult = false;
          this.totalCount = apiResponse.result.count;
          this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
          this.searchList = this.processActionObject(apiResponse.result.course);
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
    const enrolledCoursesId = [];
    _.forEach(this.enrolledCourses, (value, index) => {
      enrolledCoursesId[index] = _.get(this.enrolledCourses[index], 'courseId');
    });
    _.forEach(course, (value, index) => {
      if (this.enrolledCourses && this.enrolledCourses.length > 0) {
        if (_.indexOf(enrolledCoursesId, course[index].identifier) !== -1) {
          const constantData = this.config.appConfig.CourseSearch.enrolledCourses.constantData;
          const metaData = { metaData: this.config.appConfig.Course.enrolledCourses.metaData };
          const dynamicFields = {};
          const enrolledCourses = _.find(this.enrolledCourses, ['courseId', course[index].identifier]);
          course[index] = this.utilService.processContent(enrolledCourses,
            constantData, dynamicFields, metaData);
        } else {
          const constantData = this.config.appConfig.CourseSearch.otherCourses.constantData;
          const metaData = this.config.appConfig.CourseSearch.metaData;
          const dynamicFields = {};
          course[index] = this.utilService.processContent(course[index],
            constantData, dynamicFields, metaData);
        }
      } else {
        const constantData = this.config.appConfig.CourseSearch.otherCourses.constantData;
        const metaData = this.config.appConfig.CourseSearch.metaData;
        const dynamicFields = {};
        course[index] = this.utilService.processContent(course[index],
          constantData, dynamicFields, metaData);
      }
    });
    return course;
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
    this.route.navigate(['/search/catalog', this.pageNumber], {
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
    observableCombineLatest(
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
        // load search filters from queryparams if any
        this.filters = {};
        _.forOwn(this.queryParams, (queryValue, queryParam) => {
          if (queryParam !== 'key' && queryParam !== 'sort_by' && queryParam !== 'sortType') {
            this.filters[queryParam] = queryValue;
          }
        });
        if (this.queryParams.sort_by && this.queryParams.sortType) {
          this.queryParams.sortType = this.queryParams.sortType.toString();
        }
        this.populateEnrolledCourse();
      });
    this.setInteractEventData();
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
  }
  setInteractEventData() {
    this.closeIntractEdata = {
      id: 'search-close',
      type: 'click',
      pageid: 'course-search'
    };
    this.cardIntractEdata = {
      id: 'course-card',
      type: 'click',
      pageid: 'course-search'
    };
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: 'course-search'
    };
  }
  playContent(event) {
    if (event.data.metaData.batchId) {
      event.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
      event.data.metaData.contentType = 'Course';
    }
    this.changeDetectorRef.detectChanges();
    this.playerService.playContent(event.data.metaData);
  }
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.metaData.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.metaData.identifier || inview.data.metaData.courseId,
          objtype: inview.data.metaData.contentType || 'content',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }


  getFiltersArray() {
    return Object.keys(this.filters).map((filter) => {
      return [filter, this.filters[filter]];
    });
  }

  checkForEmptyObject(obj) {
    return _.isEmpty(obj);
  }

  clearFilters() {
    this.filters = {};
    this.catalogFiltersComponent.resetFilters();
  }

}
