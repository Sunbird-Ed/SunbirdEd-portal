import { combineLatest,  Subscription ,  Observable ,  Subject, of } from 'rxjs';

import {first, takeUntil, map, debounceTime, distinctUntilChanged, switchMap, delay} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService, ServerResponse, PaginationService, ConfigService,
  NavigationHelperService } from '@sunbird/shared';
import { CourseProgressService } from './../../services';
import { ICourseProgressData, IBatchListData } from './../../interfaces';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import { IPagination } from '@sunbird/announcement';
/**
 * This component shows the course progress dashboard
 */
@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.scss']
})
export class CourseProgressComponent implements OnInit, OnDestroy, AfterViewInit {
  modelChanged: Subject<string> = new Subject<string>();
  /**
   * Variable to gather and unsubscribe all observable subscriptions in this component.
   */
  public unsubscribe = new Subject<void>();

  interactObject: any;
  /**
	 * This variable helps to show and hide page loader.
	 */
  showLoader = true;
  /**
	 * This variable sets the batch list data related to the given course
	 */
  batchlist: Array<IBatchListData>;
  /**
	 * This variable sets the course id
	 */
  courseId: string;
  userDataSubscription: Subscription;
  batchId: string;
  /**
	 * This variable sets the user id
	 */
  userId: string;
    /**
   * value typed
   */
  searchText: string;
  /**
	 * This variable sets the dashboard result related to the given batch
	 */
  dashboarData: ICourseProgressData;
  /**
	 * This variable is set to true when the length of batch is 0.
   * It helps to show a message div on html
	 */
  showNoBatch = false;
  /**
	 * This variable helps to show the download modal after successful download API call
	 */
  showDownloadModal = false;
  /**
	 * This variable sets the filter description which is displayed inside the dashboard
	 */
  filterText: string;
  /**
	 * This variable sets the name of the field which is to be sorted
	 */
  order: string;
  /**
	 * This variable sets the order to true or false
	 */
  reverse = true;
  /**
	 * This variable sets the queryparams on url
	 */
  queryParams: any;
  /**
	 * This variable sets selected batch id, if exist
	 */
  selectedOption: string;
  /**
	 * This variable helps to unsubscribe the params and queryparams
	 */
  paramSubcription: any;
  /**
	 * This variable helps to show the warning div
	 */
  showWarningDiv = false;
   /**
	 * This variable helps to show the csv downloadURl
	 */
  showDownloadLink = true;
  /**
   * To navigate to other pages
   */
  route: Router;
   /**
       * Contains page limit of inbox list
    */
   pageLimit: number;

   /**
     * Current page number of inbox list
   */
   pageNumber = 1;

   /**
     * totalCount of the list
   */
   totalCount: Number;

   /**
     * Contains returned object of the pagination service
   * which is needed to show the pagination on inbox view
     */
   pager: IPagination;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to parent component
   */
  private activatedRoute: ActivatedRoute;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
  * To get user profile of logged-in user
  */
  public user: UserService;
  /**
  * To get user profile of logged-in user
  */
  public courseProgressService: CourseProgressService;
  /**
  * For showing pagination on draft list
  */
   private paginationService: PaginationService;
  /**
    * To get url, app configs
    */
  public config: ConfigService;
  /**
	 * telemetryImpression object for course progress page
	*/
  telemetryImpression: IImpressionEventInput;
  telemetryCdata: Array<{}>;
  subscription: Subscription;
  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of AnnouncementService class
	 *
   * @param {UserService} user Reference of UserService
   * @param {Router} route Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {CourseProgressService} courseProgressService Reference of CourseProgressService
	 */
  constructor(user: UserService,
    route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    courseProgressService: CourseProgressService,  paginationService: PaginationService,
    config: ConfigService,
    public navigationhelperService: NavigationHelperService) {
    this.user = user;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.courseProgressService = courseProgressService;
    this.paginationService = paginationService;
    this.config = config;
    this.route.onSameUrlNavigation = 'ignore';
    this.pageLimit = this.config.appConfig.DASHBOARD.PAGE_LIMIT;
  }

  /**
  * To method helps to get all batches related to the course.
  * Then it helps to set flag dependeing on number of batches.
  */
  populateBatchData(): void {
    this.showLoader = true;
    const searchParamsCreator = {
      courseId: this.courseId,
      status: ['0', '1', '2'],
      createdBy: this.userId
    };
    const searchParamsMentor = {
      courseId: this.courseId,
      status: ['0', '1', '2'],
      mentors: [this.userId]
    };
    combineLatest(
      this.courseProgressService.getBatches(searchParamsCreator),
      this.courseProgressService.getBatches(searchParamsMentor),
    ).pipe(takeUntil(this.unsubscribe))
     .subscribe((results) => {
        this.batchlist = _.union(results[0].result.response.content, results[1].result.response.content);
        this.showLoader = false;
        const isBatchExist = _.find(this.batchlist, (batch) => batch.id === this.queryParams.batchIdentifier);
        if (this.batchlist.length === 0) {
          this.showNoBatch = true;
        } else if (isBatchExist) {
          this.selectedOption = this.queryParams.batchIdentifier;
          this.populateCourseDashboardData();
        } else if (this.batchlist.length === 1 && isBatchExist === undefined) {
          this.queryParams.batchIdentifier = this.batchlist[0].id;
          this.selectedOption =  this.batchlist[0].id;
          this.populateCourseDashboardData();
        } else {
          this.showWarningDiv = true;
        }
        this.paramSubcription.unsubscribe();
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
        this.showNoBatch = true;
      });
  }

  /**
  * To method helps to set batch id and calls the populateCourseDashboardData
  *
	* @param {string} batchId batch identifier
  */
  setBatchId(batchId: string): void {
    this.queryParams.batchIdentifier = batchId;
    this.queryParams.pageNumber = this.pageNumber;
    this.searchText = '';
    this.populateCourseDashboardData();
  }

  /**
  * To method helps to set time period and calls the populateCourseDashboardData
  *
	* @param {string} timePeriod time period
  */
  setTimePeriod(timePeriod: string): void {
    this.queryParams.timePeriod = timePeriod;
    this.populateCourseDashboardData();
  }

  /**
  * To method helps to set filter description
  */
  setFilterDescription(): void {
    const filterDesc = {
      '7d': this.resourceService.messages.imsg.m0022,
      '14d': this.resourceService.messages.imsg.m0023,
      '5w': this.resourceService.messages.imsg.m0024,
      'fromBegining': this.resourceService.messages.imsg.m0025
    };
    this.filterText = filterDesc[this.queryParams.timePeriod];
  }

  /**
  * Method to update the url with selected query params
  */
  navigate(): void {
    this.route.navigate([], { queryParams: this.queryParams });
  }
  redirect() {
    this.route.navigate(['/learn/course', this.courseId]);
  }
  /**
  * To method fetches the dashboard data with specific batch id and timeperiod
  */
  populateCourseDashboardData(): void {
    this.showWarningDiv = false;
    this.navigate();
    this.showLoader = true;
    const option: any = {
      batchIdentifier: this.queryParams.batchIdentifier,
      limit: this.pageLimit,
      offset: (this.pageNumber - 1) * (this.pageLimit),
    };
    if (this.order) {
      option.sortBy = this.order;
      option.sortOrder = this.reverse ? 'desc' : 'asc';
    }
    if (this.searchText) {
      option.username = this.searchText;
    }
    this.courseProgressService.getDashboardData(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.dashboarData = apiResponse.result;
        this.showDownloadLink = apiResponse.result.showDownloadLink ? apiResponse.result.showDownloadLink : false;
        this.totalCount = apiResponse.result.count;
        if (this.totalCount >= 10000) {
          this.pager = this.paginationService.getPager(10000, this.pageNumber, this.config.appConfig.DASHBOARD.PAGE_LIMIT);
        } else {
          this.pager = this.paginationService.getPager(
            apiResponse.result.count, this.pageNumber, this.config.appConfig.DASHBOARD.PAGE_LIMIT);
        }
      },
      err => {
        this.toasterService.error(err.error.params.errmsg);
        this.showLoader = false;
      }
    );
  }

  /**
  * To method helps to set order of a specific field
  *
	* @param {string} value Field name that is to be sorted
  */
  setOrder(value: string): void {
    this.order = value;
    this.reverse = !this.reverse;
    this.setInteractEventData();
    this.populateCourseDashboardData();
  }

  /**
  * To method calls the download API with specific batch id and timeperiod
  */
  downloadReport(): void {
    const option = {
      batchIdentifier: this.queryParams.batchIdentifier,
    };
    this.courseProgressService.downloadDashboardData(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse: ServerResponse) => {
        window.open(_.get(apiResponse, 'result.signedUrl'), '_parent');
      },
      err => {
        this.toasterService.error(this.resourceService.messages.imsg.m0045);
      }
    );
    this.setInteractEventData();
  }

  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    this.pageNumber = page;
    this.queryParams.pageNumber = this.pageNumber;
    this.navigate();
    this.populateCourseDashboardData();
  }
  keyup(event) {
    if (!_.isEmpty(_.trim(event))) {
      this.modelChanged.next(event);
    }
  }
  searchBatch() {
    this.modelChanged.pipe(debounceTime(1000),
    distinctUntilChanged(),
    switchMap(search => of(search))
    ).
    subscribe(query => {
      this.populateCourseDashboardData();
    });
  }
  /**
  * To method subscribes the user data to get the user id.
  * It also subscribes the activated route params to get the
  * course id and timeperiod
  */
  ngOnInit() {
    this.userDataSubscription = this.user.userData$.pipe(first()).subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.paramSubcription = combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams,
          (params: any, queryParams: any) => {
            return {
              params: params,
              queryParams: queryParams
            };
          })
          .subscribe(bothParams => {
            this.courseId = bothParams.params.courseId;
            this.batchId = bothParams.params.batchId;
            this.queryParams = { ...bothParams.queryParams };
            this.interactObject = { id: this.courseId, type: 'Course', ver: '1.0' };
            this.populateBatchData();
          });
      }
    });
    this.searchBatch();
    this.setInteractEventData();
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: [{ id: this.activatedRoute.snapshot.params.courseId, type: 'Course' }]
        },
        edata: {
          uri: '/learn/course/' + this.courseId + '/dashboard&batchIdentifier=' + this.activatedRoute.snapshot.params.batchId,
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          duration: this.navigationhelperService.getPageLoadTime()
        },
        object: {
          id: this.courseId,
          type: this.activatedRoute.snapshot.data.telemetry.object.type,
          ver: this.activatedRoute.snapshot.data.telemetry.object.ver
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  setInteractEventData() {
    if (_.get(this.queryParams, 'batchIdentifier')) {
      this.telemetryCdata = [{ 'type': 'batch', 'id': this.queryParams.batchIdentifier}];
    } else {
      this.telemetryCdata = [{ 'type': 'course', 'id': this.courseId}];
    }
  }
}
