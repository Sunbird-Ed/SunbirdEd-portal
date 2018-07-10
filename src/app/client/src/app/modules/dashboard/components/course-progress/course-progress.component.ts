
import { combineLatest,  Subscription ,  Observable ,  Subject } from 'rxjs';

import {first, takeUntil} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { CourseProgressService } from './../../services';
import { ICourseProgressData, IBatchListData } from './../../interfaces';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';

/**
 * This component shows the course progress dashboard
 */
@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent implements OnInit, OnDestroy {
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
	 * This variable sets the dashboard result related to the given batch
	 */
  dashboarData: Array<ICourseProgressData>;
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
  reverse: boolean;
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
   * To navigate to other pages
   */
  route: Router;
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
	 * telemetryImpression object for course progress page
	*/
  telemetryImpression: IImpressionEventInput;
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
    courseProgressService: CourseProgressService) {
    this.user = user;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.courseProgressService = courseProgressService;
    this.route.onSameUrlNavigation = 'ignore';
  }

  /**
  * To method helps to get all batches related to the course.
  * Then it helps to set flag dependeing on number of batches.
  */
  populateBatchData(): void {
    this.showLoader = true;
    const option = {
      courseId: this.courseId,
      status: ['1', '2', '3'],
      createdBy: this.userId
    };
    this.courseProgressService.getBatches(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse: ServerResponse) => {
        this.batchlist = apiResponse.result.response.content;
        this.showLoader = false;
        const isBatchExist = _.find(this.batchlist, (batch) => batch.id === this.queryParams.batchIdentifier);
        if (this.batchlist.length === 0) {
          this.showNoBatch = true;
        } else if (isBatchExist) {
          this.selectedOption = this.queryParams.batchIdentifier;
          this.populateCourseDashboardData();
        } else if (this.batchlist.length === 1 && isBatchExist === undefined) {
          this.queryParams.batchIdentifier = this.batchlist[0].id;
          this.populateCourseDashboardData();
        } else {
          this.showWarningDiv = true;
        }
        this.paramSubcription.unsubscribe();
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
        this.showNoBatch = true;
      }
    );
  }

  /**
  * To method helps to set batch id and calls the populateCourseDashboardData
  *
	* @param {string} batchId batch identifier
  */
  setBatchId(batchId: string): void {
    this.queryParams.batchIdentifier = batchId;
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
    this.setFilterDescription();
    this.showLoader = true;
    const option = {
      batchIdentifier: this.queryParams.batchIdentifier,
      timePeriod: this.queryParams.timePeriod
    };
    this.telemetryImpression.edata.uri = '/learn/course/' + this.courseId + '/dashboard?timePeriod='
      + this.queryParams.timePeriod + '&batchIdentifier=' + this.queryParams.batchIdentifier;
    this.courseProgressService.getDashboardData(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse: ServerResponse) => {
        this.dashboarData = this.courseProgressService.parseDasboardResponse(apiResponse.result);
        this.showLoader = false;
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
  }

  /**
  * To method calls the download API with specific batch id and timeperiod
  */
  downloadReport(): void {
    const option = {
      batchIdentifier: this.queryParams.batchIdentifier,
      timePeriod: this.queryParams.timePeriod
    };
    this.courseProgressService.downloadDashboardData(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse: ServerResponse) => {
        this.showDownloadModal = true;
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
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
            this.queryParams.timePeriod = this.queryParams.timePeriod || '7d';

            // Create the telemetry impression event for course stats page
            this.telemetryImpression = {
              context: {
                env: this.activatedRoute.snapshot.data.telemetry.env
              },
              edata: {
                type: this.activatedRoute.snapshot.data.telemetry.type,
                pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
                uri: '/learn/course/' + this.courseId + '/dashboard'
              },
              object: {
                id: this.courseId,
                type: this.activatedRoute.snapshot.data.telemetry.object.type,
                ver: this.activatedRoute.snapshot.data.telemetry.object.ver
              }
            };
            this.interactObject = { id: this.courseId, type: 'course', ver: '1.0' };
            this.populateBatchData();
          });
      }
    });
  }
  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
