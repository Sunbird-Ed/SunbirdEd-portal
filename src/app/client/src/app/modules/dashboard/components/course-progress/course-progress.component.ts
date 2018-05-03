import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { UserService } from '@sunbird/core';
import {
  ResourceService, ConfigService, PaginationService,
  ToasterService, DateFormatPipe, ServerResponse, FilterPipe
} from '@sunbird/shared';
import { IAnnouncementListData, IPagination } from '@sunbird/announcement';
import { CourseProgressService } from './../../services';
import { OrderPipe } from 'ngx-order-pipe';

/**
 * The announcement outbox component displays all
 * the announcement which is created by the logged in user
 * having announcement creator access
 */
@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent implements OnInit {

  isDesc: boolean;
  column: any;
  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  showLoader = true;
  courseList: any;
  courseId: string;
  userId: string;
  timePeriod = '7d';
  batchIdentifier: any;
  dashboarData: any;
  showNoBatch = false;
  showDownloadModal = false;

  /**
  * Contains returned object of the pagination service
  * which is needed to show the pagination on inbox view
  */
  pager: IPagination;

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
   * For showing pagination on inbox list
   */
  private paginationService: PaginationService;

  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;

  /**
   * To get url, app configs
   */
  public config: ConfigService;

  /**
  * To get user profile of logged-in user
  */
  public user: UserService;
  public courseProgressService: CourseProgressService;
  public filterText: string;

  public order: string;
  public reverse: boolean;
  private orderPipe: OrderPipe;
  // reverse = false;
  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of AnnouncementService class
	 *
   * @param {AnnouncementService} announcementService Reference of AnnouncementService
   * @param {Router} route Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {PaginationService} paginationService Reference of PaginationService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {ConfigService} config Reference of ConfigService
	 */
  constructor(user: UserService,
    route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    paginationService: PaginationService,
    toasterService: ToasterService,
    courseProgressService: CourseProgressService,
    config: ConfigService,
    orderPipe: OrderPipe
  ) {
    this.user = user;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.paginationService = paginationService;
    this.toasterService = toasterService;
    this.courseProgressService = courseProgressService;
    this.config = config;
  }

  populateBatchData() {
    this.showLoader = true;
    const option = {
      courseId: this.courseId,
      status: ['1', '2', '3'],
      createdBy: this.userId
    };
    this.courseProgressService.getBatches(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.courseList = apiResponse.result.response.content;
        this.showLoader = false;
        if (this.courseList.length === 0) {
          this.showNoBatch = true;
        } else if (this.courseList.length === 1) {
          this.batchIdentifier = this.courseList[0].id;
          this.populateCourseDashboardData();
        }
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
        this.showNoBatch = true;
      }
    );
  }

  setBatchId(batchId: string) {
    this.batchIdentifier = batchId;
    this.populateCourseDashboardData();
  }

  setTimePeriod(timePeriod: string) {
    const filterDesc = {
      '7d': this.resourceService.messages.imsg.m0022,
      '14d': this.resourceService.messages.imsg.m0023,
      '5w': this.resourceService.messages.imsg.m0024,
      'fromBegining': this.resourceService.messages.imsg.m0025
    };
    this.filterText = filterDesc[timePeriod];
    this.timePeriod = timePeriod;
    this.route.navigate(['dashboard/course', this.courseId, this.timePeriod]);
    this.populateCourseDashboardData();
  }

  populateCourseDashboardData() {
    this.showLoader = true;
    const option = {
      batchIdentifier: this.batchIdentifier,
      timePeriod: this.timePeriod
    };
    this.courseProgressService.getDashboardData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.dashboarData = this.courseProgressService.parseDasboardResponse(apiResponse.result);
        this.showLoader = false;
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
      }
    );
  }



  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  downloadReport() {
    const option = {
      batchIdentifier: this.batchIdentifier,
      timePeriod: this.timePeriod
    };
    this.courseProgressService.downloadDashboardData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.showDownloadModal = true;
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }

  /**
   * This method calls the populateOutboxData to show outbox list.
   * It also changes the status of a deleted announcement to cancelled.
	 */
  ngOnInit() {
    this.user.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.activatedRoute.params.subscribe(params => {
          this.courseId = params.courseId;
          this.timePeriod = params.timePeriod;
          this.populateBatchData();
        });
      }
    });
  }
}

