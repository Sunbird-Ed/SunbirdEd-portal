import { combineLatest, Subscription, Subject, of } from 'rxjs';

import { first, takeUntil, map, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UserService, FormService } from '@sunbird/core';
import {
  ResourceService, ToasterService, ServerResponse, PaginationService, ConfigService,
  NavigationHelperService, IPagination, OnDemandReportsComponent
} from '@sunbird/shared';
import { CourseProgressService, UsageService } from './../../services';
import { ICourseProgressData, IBatchListData, IForumContext } from './../../interfaces';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { OnDemandReportService } from './../../../shared/services/on-demand-report/on-demand-report.service';

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

  @ViewChild(OnDemandReportsComponent)
  public onDemandReports: OnDemandReportsComponent;
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

  // TODO: We have to remove this & use currentBatch.id
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
   * input data for fetchforum Ids
   */
   fetchForumIdReq: IForumContext;

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
  isDownloadReport = false;
  stateWiseReportData = [];
  public message = 'There is no data available';
  columns = [
    { name: 'State', isSortable: true, prop: 'state', placeholder: 'Filter state' },
    { name: 'District', isSortable: true, prop: 'district', placeholder: 'Filter district' },
    { name: 'No. of Enrolment', isSortable: false, prop: 'noOfEnrollments', placeholder: 'Filter enrollment' }];
  fileName: string;
  userConsent;
  reportTypes = [];
  userRoles;
  selectedTab = 2;
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
    public telemetryService: TelemetryService,
    courseProgressService: CourseProgressService, paginationService: PaginationService,
    config: ConfigService,
    public onDemandReportService: OnDemandReportService,
    public formService: FormService,
    public navigationhelperService: NavigationHelperService, private usageService: UsageService,
   ) {
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
          this.generateDataForDF(this.currentBatch);
          this.setBatchId(this.currentBatch);
          this.populateCourseDashboardData(this.batchlist[0]);
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

  summaryReport(tabNumber) {
    this.setInteractEventDataForTabs('summary-report');
    this.selectedTab = tabNumber;
    this.getSummaryReports();
  }

  /**
  * To method helps to set batch id and calls the populateCourseDashboardData
  *
	* @param {string} batchId batch identifier
  */
  setBatchId(batch?: any): void {
    this.fetchForumIdReq = null;
    this.showWarningDiv = false;
    this.queryParams.batchIdentifier = _.get(batch, 'value.id');
    this.queryParams.pageNumber = this.pageNumber;
    this.searchText = '';
    this.currentBatch = _.get(batch, 'value');;
    // this.currentBatch.lastUpdatedOn = dayjs(this.currentBatch.lastUpdatedOn).format('DD-MMM-YYYY hh:mm a');
    this.batchId = _.get(batch, 'value.id');
    this.setCounts(this.currentBatch);
    this.populateCourseDashboardData(_.get(batch, 'value'));
    if (this.selectedTab === 1) {
      this.summaryReport(1);
    } else {
      this.loadOndemandReports(2);
    }
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
  * To method helps to set time period and calls the populateCourseDashboardData
  *
	* @param {string} timePeriod time period
  */
  setTimePeriod(timePeriod: string): void {
    this.queryParams.timePeriod = timePeriod;
    this.populateCourseDashboardData();
  }

  setInteractEventDataForTabs(id) {
    const telemetryObj = {
      context: {
        env: 'reports',
        cdata: [
          {id: _.get(this.currentBatch , 'courseId'), type: 'Course'},
          {id: _.get(this.currentBatch , 'batchId'), type: 'Batch'}
        ]
      },
      edata: {
        id: id,
        type: 'click',
        pageid: id
      }
    };
    this.telemetryService.interact(telemetryObj);
  }

  getSummaryReports() {
    if (_.get(this.currentBatch, 'collectionId') || _.get(this.currentBatch, 'courseId')) {
      const request = {
        'request': {
          'filters': {
            'collectionId': _.get(this.currentBatch, 'collectionId') || _.get(this.currentBatch, 'courseId'),
            'batchId': _.get(this.currentBatch, 'batchId')
          },
          'groupBy': ['dist', 'state'],
          'granularity': 'ALL' // data conformation
        }
      };
      this.onDemandReportService.getSummeryReports(request).subscribe((reports: any) => {
        if (reports && reports.result && !_.isEmpty(reports.result)) {
          const result = _.get(reports, 'result');
          const groupData = _.get(result, 'groupBy');
          this.stateWiseReportData = _.map(groupData, (x) => {
            return {
              state: x.state,
              district: x.district,
              noOfEnrollments: this.getFieldValue(x.values, 'enrolment')
            };
          });
          this.stateWiseReportData = [...this.stateWiseReportData];
          const metrics = _.get(result, 'metrics');
          this.currentBatch.participantCount = this.getFieldValue(metrics, 'enrolment');
          this.currentBatch.completedCount = this.getFieldValue(metrics, 'complete');
          this.currentBatch.lastUpdatedOn = _.get(result, 'lastUpdatedOn') || '';
        }
        this.generateDataForDF(this.currentBatch);
      }, error => {
        this.stateWiseReportData = [
          {
            state: 'Andhra Pradesh',
            district: 'Chittoor',
            noOfEnrollments: 20
          },
          {
            state: 'Andhra Pradesh',
            district: 'Vishakapatanam',
            noOfEnrollments: 50
          },
          {
            state: 'Andhra Pradesh',
            district: 'Guntur',
            noOfEnrollments: 70
          },
          {
            state: 'Andhra Pradesh',
            district: 'Kadapa',
            noOfEnrollments: 65
          },
          {
            state: 'Andhra Pradesh',
            district: 'Nellore',
            noOfEnrollments: 100
          },
          {
            state: 'Telengana',
            district: 'Hydrabad',
            noOfEnrollments: 45
          }
        ];
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
        this.generateDataForDF(this.currentBatch);
      });
    }
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
          if (Number(this.totalCount) >= 10000) {
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


  getFieldValue(array, field) {
    if (_.find(array, {'type': field})) {
      return _.find(array, {'type': field}).count;
    } else {
      return;
    }
  }

  /**
  * To method subscribes the user data to get the user id.
  * It also subscribes the activated route params to get the
  * course id and timeperiod
  */
  ngOnInit() {
    this.fileName = 'State wise report';
    this.isDownloadReport = true;
    // this.searchFields = ['state', 'district'];
    // ----- Mock date end -------------
    this.userDataSubscription = this.user.userData$.pipe(first()).subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.userRoles = _.get(userdata, 'userProfile.userRoles');
        this.paramSubcription = combineLatest(this.activatedRoute.parent.params,
          this.activatedRoute.params, this.activatedRoute.queryParams,
          (parentParams: any, params: any, queryParams: any) => {
            return {
              params: parentParams || params,
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

  /**
   * Load on demand reports
   */
  loadOndemandReports(tabNumber) {
    this.getSummaryReports();
    setTimeout(() => {
      if (this.onDemandReports) {
      this.setInteractEventDataForTabs('on-demand-reports');
      this.selectedTab = tabNumber;
      if (_.isEmpty(this.reportTypes)) {
        this.getFormData();
      }
      this.onDemandReports.loadReports(this.currentBatch);
    }
      }, 500);
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
      if (currentBatch) {
        this.currentBatch['completedCount'] = _.get(currentBatch, 'completedCount') ? _.get(currentBatch, 'completedCount') : 0;
        this.currentBatch['participantCount'] = _.get(currentBatch, 'participantCount') ? _.get(currentBatch, 'participantCount') : 0;
      }
    }

  setInteractEventData() {
    if (_.get(this.queryParams, 'batchIdentifier')) {
      this.telemetryCdata = [{ 'type': 'batch', 'id': this.queryParams.batchIdentifier }];
    } else {
      this.telemetryCdata = [{ 'type': 'course', 'id': this.courseId }];
    }
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getFormData() {
    const isCourseCreator = _.includes(this.userRoles, 'CONTENT_CREATOR');
    const formReadInputParams = {
      formType: 'batch',
      formAction: 'list',
      contentType: 'report_types'
    };
    this.formService.getFormConfig(formReadInputParams).subscribe((formResponsedata) => {
      if (formResponsedata) {
        const options = formResponsedata;
        if (isCourseCreator) {
          this.reportTypes = options;
        } else {
          this.reportTypes = _.filter(options, (report) => report.title !== 'User profile exhaust');
        }
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }
  generateDataForDF(batchId) {
    this.fetchForumIdReq = null;
    if (batchId) {
      this.fetchForumIdReq = {
        type: 'batch',
        identifier: [batchId.id]
      };
    }
  }
  /**
     * @description - navigate to the DF Page when the event is emited from the access-discussion component
     * @param  {} routerData
     */
   assignForumData(routerData) {
    this.route.navigate(['/discussion-forum'], {
      queryParams: {
        categories: JSON.stringify({ result: routerData.forumIds }),
        userId: routerData.userId
      }
    });
  }
  selectedTabChange(event) {
    const { index } = _.get(event, 'tab.textLabel');
    if (index == 2) {
      this.loadOndemandReports(2);
    }
  }
}
