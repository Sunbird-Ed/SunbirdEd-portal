import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { CourseProgressService } from './../../services';

/**
 * This component shows the course progress dashboard
 */
@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent implements OnInit {

  showLoader = true;
  courseList: any;
  courseId: string;
  userId: string;
  timePeriod = '7d';
  batchIdentifier: string;
  dashboarData: any;
  showNoBatch = false;
  showDownloadModal = false;
  filterText: string;
  order: string;
  reverse: boolean;

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
  }

  /**
  * To method helps to get all batches related to the course.
  * Then it helps to set flag dependeing on number of batches.
  */
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

  /**
  * To method helps to set batch id and calls the populateCourseDashboardData
  */
 setBatchId(batchId: string) {
    this.batchIdentifier = batchId;
    this.populateCourseDashboardData();
  }

  /**
  * To method helps to set time period and calls the populateCourseDashboardData
  */
  setTimePeriod(timePeriod: string) {
    this.timePeriod = timePeriod;
    this.route.navigate(['dashboard/course', this.courseId, this.timePeriod]);
    this.populateCourseDashboardData();
  }

  /**
  * To method helps to set filter description
  */
  setFilterDescription () {
    const filterDesc = {
      '7d': this.resourceService.messages.imsg.m0022,
      '14d': this.resourceService.messages.imsg.m0023,
      '5w': this.resourceService.messages.imsg.m0024,
      'fromBegining': this.resourceService.messages.imsg.m0025
    };
    this.filterText = filterDesc[this.timePeriod];
  }

  /**
  * To method fetches the dashboard data with specific batch id and timeperiod
  */
  populateCourseDashboardData() {
    this.setFilterDescription();
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

  /**
  * To method helps to set order of a apecific field
  */
  setOrder(value: string) {
    this.order = value;
    this.reverse = !this.reverse;
    this.order = value;
  }

  /**
  * To method calls the download API with specific batch id and timeperiod
  */
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
  * To method subscribes the user data to get the user id.
  * It also subscribes the activated route params to get the
  * course id and timeperiod
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
