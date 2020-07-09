import { combineLatest, Subscription, Observable, Subject, of } from 'rxjs';

import { first, takeUntil, map, debounceTime, distinctUntilChanged, switchMap, delay, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UserService } from '@sunbird/core';
import {
  ResourceService, ToasterService, ServerResponse, PaginationService, ConfigService,
  NavigationHelperService, IPagination
} from '@sunbird/shared';
import { CourseProgressService, UsageService } from './../../services';
import { ICourseProgressData, IBatchListData } from './../../interfaces';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
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
   *  to store the current batch when updated;
   */
  currentBatch: any;

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
    * To display score report updated date
    */
  public scoreReportUpdatedOn;
  /**
    * To display progress report updated date
    */
  public progressReportUpdatedOn;

  /**
	 * telemetryImpression object for course progress page
	*/
  telemetryImpression: IImpressionEventInput;
  telemetryCdata: Array<{}>;
  subscription: Subscription;
  /**
	 * Constructor to create injected service(s) object
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
    courseProgressService: CourseProgressService, paginationService: PaginationService,
    config: ConfigService,
    public navigationhelperService: NavigationHelperService, private usageService: UsageService) {
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
          this.currentBatch = isBatchExist;
          this.populateCourseDashboardData(isBatchExist);
        } else if (this.batchlist.length === 1 && isBatchExist === undefined) {
          this.queryParams.batchIdentifier = this.batchlist[0].id;
          this.selectedOption = this.batchlist[0].id;
          this.currentBatch = this.batchlist[0];
          this.setCounts(this.currentBatch);
          this.populateCourseDashboardData(this.batchlist[0]);
        } else {
          this.showWarningDiv = true;
        }
        this.getReportUpdatedOnDate();
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
  setBatchId(batch?: any): void {
    this.showWarningDiv = false;
    this.queryParams.batchIdentifier = batch.id;
    this.queryParams.pageNumber = this.pageNumber;
    this.searchText = '';
    this.currentBatch = batch;
    this.setCounts(this.currentBatch);
    this.populateCourseDashboardData(batch);
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
 // TODO: This function will be removed. API got deprecated.
  populateCourseDashboardData(batch?: any): void {
    return ;
    if (!batch && this.currentBatch) {
      batch = this.currentBatch;
    }
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
          if (!apiResponse.result.count && _.get(apiResponse, 'result.data.length')) {
            apiResponse.result.count = _.get(apiResponse, 'result.data.length');
          } else {
            apiResponse.result.count = 0;
          }
          this.showLoader = false;
          this.dashboarData = apiResponse.result;
          this.showDownloadLink = apiResponse.result.showDownloadLink ? apiResponse.result.showDownloadLink : false;
          this.dashboarData.count = _.get(batch, 'participantCount') || _.get(apiResponse, 'result.data.length');
          this.totalCount = _.get(batch, 'participantCount') || _.get(apiResponse, 'result.data.length');
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
    if (this.currentBatch) {
      this.populateCourseDashboardData(this.currentBatch);
    }
  }

  /**
   * method to download course progress reports
   */
  private downloadCourseReport(reportType: string) {
    const batchId = this.queryParams.batchIdentifier;
    const url = `/courseReports/${reportType}/report-${batchId}.csv`;
    return this.usageService.getData(url)
      .pipe(
        tap(response => {
          if (_.get(response, 'responseCode') === 'OK') {
            const signedUrl = _.get(response, 'result.signedUrl');
            if (signedUrl) { window.open(signedUrl, '_blank'); }
          } else {
            this.toasterService.error(this.resourceService.messages.stmsg.m0141);
          }
        })
      );
  }

  /**
   * method to download assessment score reports
   */
  private downloadAssessmentReport() {
    const option = {
      batchIdentifier: this.queryParams.batchIdentifier,
    };

    return this.courseProgressService.downloadDashboardData(option).pipe(
      tap((apiResponse: ServerResponse) => {
        let downloadUrl;
        downloadUrl = _.get(apiResponse, 'result.reports.assessmentReportUrl');
        if (downloadUrl) {
          window.open(downloadUrl, '_blank');
        } else {
          this.toasterService.error(this.resourceService.messages.stmsg.m0141);
        }
      }));
  }

  /**
   * method to download assessment/course progress report
   * @param downloadAssessmentReport
   */
  downloadReport(downloadAssessmentReport: boolean) {
    of(downloadAssessmentReport)
      .pipe(
        switchMap((flag: boolean) => flag ? this.downloadCourseReport('assessment-reports') :
          this.downloadCourseReport('course-progress-reports')),
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => { }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0076);
      });
  }

  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.queryParams.pageNumber = this.pageNumber;
    this.navigate();
    if (this.currentBatch) {
      this.populateCourseDashboardData(this.currentBatch);
    }
  }
  keyup(event) {
    this.modelChanged.next(_.trim(event));
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
  getReportUpdatedOnDate() {
    const batchId = _.get(this.queryParams, 'batchIdentifier');
    const reportParams = {
      'course-progress-reports': `course-progress-reports/report-${batchId}.csv`,
      'assessment-reports': `assessment-reports/report-${batchId}.csv`
    };
    const requestParams = {
      params: {
        fileNames: JSON.stringify(reportParams)
      },
      telemetryData: this.activatedRoute
    };
    this.courseProgressService.getReportsMetaData(requestParams).subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        this.progressReportUpdatedOn =  _.get(response, 'result.course-progress-reports.lastModified') || null;
        this.scoreReportUpdatedOn = _.get(response, 'result.assessment-reports.lastModified') || null;
      }
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

  ngAfterViewInit() {
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

  /**
   * @since - #SH-601
   * @param  {} currentBatch
   * @description - This will set completedCount and participantCount to the currentBatch object;
   */
    setCounts(currentBatch) {
      this.currentBatch['completedCount'] = _.get(currentBatch, 'completedCount') ? _.get(currentBatch, 'completedCount') : 0;
      this.currentBatch['participantCount'] = _.get(currentBatch, 'participantCount') ? _.get(currentBatch, 'participantCount') : 0;
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
      this.telemetryCdata = [{ 'type': 'batch', 'id': this.queryParams.batchIdentifier }];
    } else {
      this.telemetryCdata = [{ 'type': 'course', 'id': this.courseId }];
    }
  }
}
