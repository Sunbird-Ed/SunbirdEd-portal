
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Custom service(s)
import { RendererService, CourseConsumptionService } from './../../services';
import { UserService, SearchService } from '@sunbird/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';
// Interface
import { DashboardData } from './../../interfaces';
import { IInteractEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash';

import { Subject } from 'rxjs';

/**
 * The course consumption dashboard component
 *
 * Display course consumption dashboard
 */
@Component({
  selector: 'app-course-consumption',
  templateUrl: './course-consumption.component.html',
  styleUrls: ['./course-consumption.component.css']
})
export class CourseConsumptionComponent implements OnDestroy {
  /**
   * Variable to gather and unsubscribe all observable subscriptions in this component.
   */
  public unsubscribe = new Subject<void>();
  timePeriodInteractData: IInteractEventEdata;
  interactObject: any;
  /**
   * Contains time period - last 7days, 14days, and 5weeks
   */
  timePeriod = '7d';

  /**
   * Contains selected course identifier
   *
   * Identifier is needed to construct dashboard api url
   */
  identifier = '';

  /**
   * Contains list of published course(s) of logged-in user
   */
  myCoursesList: Array<any> = [];

  /**
   * Contains course name of selected course
   */
  courseName = '';

  /**
   * Selected course details
   */
  selectedCourse: any;

  /**
   * Contains course consumption line chart data
   */
  graphData: any;

  /**
   * Contains dashboard block data
   */
  blockData: Array<any> = [];

  /**
   * Contains Graph index to switch between two graphs
   */
  showGraph = 0;

  /**
   * To show / hide loader
   */
  showLoader = true;

  /**
   * Contains boolean value to hide / show course selection dropdown
   */
  isMultipleCourses = false;

  /**
   * To display graph legend
   */
  chartLegend = true;

  /**
   * Chart type
   */
  chartType = 'line';

  /**
   * To hide show graph canvas
   */
  showDashboard = false;

  /**
   * To get consumption dashboard data
   */
  public consumptionService: CourseConsumptionService;

  /**
   * Router to change url
   */
  public route: Router;

  /**
   * To get params from url
   */
  public activatedRoute: ActivatedRoute;

  /**
   * To get logged-in user published course(s)
   */
  searchService: SearchService;

  /**
   * Chart renderer to call chart service like Line chart service
   *
   * Currently it supports only line and bar chart
   */
  rendererService: RendererService;

  /**
   * To get language constant
   */
  resourceService: ResourceService;

  /**
	 * telemetryImpression object for course consumption dashboard page
	*/
  telemetryImpression: IImpressionEventInput;

  /**
   * Default method of CourseConsumptionComponent class
   *
   * @param {Router} route Url navigation
   * @param {CourseConsumptionService} consumption To get dashboard data
   * @param {ActivatedRoute} activatedRoute To get param(s) from url
   * @param {SearchService} searchService To get logged-in user published course(s)
   * @param {RendererService} rendererService To get chart service
   * @param {ResourceService} resourceService To get language constant
   */
  constructor(route: Router, consumption: CourseConsumptionService, activatedRoute: ActivatedRoute, searchService: SearchService,
    rendererService: RendererService, resourceService: ResourceService) {
    this.consumptionService = consumption;
    this.activatedRoute = activatedRoute;
    this.searchService = searchService;
    this.rendererService = rendererService;
    this.resourceService = resourceService;
    this.route = route;
    // init the default impression event
    this.initTelemetryImpressionEvent();
    this.activatedRoute.params.pipe(
    takeUntil(this.unsubscribe))
    .subscribe(params => {

      if (params.id && params.timePeriod) {

        // update the impression event after a course is selected
        this.telemetryImpression.edata.uri = '/activity/course/consumption/' + params.id + '/' + params.timePeriod;
        this.telemetryImpression.object = {
          id: params.id,
          type: 'course',
          ver: '1.0'
        };
        this.interactObject = { id: params.id, type: 'course', ver: '1.0' };
        this.isMultipleCourses = false;
        this.showDashboard = true;
        this.getDashboardData(params.timePeriod, params.id);
      }
    }
    );
    this.getMyContent();
  }

  /**
   * Function to get dashboard data for given time period and course unique identifier
   *
   * @param {string} timePeriod  timePeriod: last 7d/14d/5w
   * @param {string} identifier  course unique identifier
   *
   * @example getDashboardData(7d, do_xxxxx)
   */
  getDashboardData(timePeriod: string, identifier: string) {
    this.showLoader = true;
    this.timePeriod = timePeriod ? timePeriod : '7d';
    this.identifier = identifier;
    const params = {
      data: {
        identifier: this.identifier,
        timePeriod: this.timePeriod
      }
    };
    this.consumptionService.getDashboardData(params).pipe(
    takeUntil(this.unsubscribe))
      .subscribe((data: DashboardData) => {
        this.blockData = data.numericData;
        this.graphData = this.rendererService.visualizer(data, this.chartType);
        this.showLoader = false;
      },
      err => {
        this.showLoader = false;
      }
      );
  }

  /**
   * This function is used to validate given course identifier.
   *
   * User gets redirect to home page if url contains invalid identifier or
   * valid identifier but logged-in user is not a owner of that identifier
   *
   * @param {string} identifier course unique identifier
   *
   * @example validateIdentifier(do_xxxxx)
   */
  validateIdentifier(identifier: string) {
    if (identifier) {
      const selectedCourse = _.find(this.myCoursesList, ['identifier', identifier]);
      if (selectedCourse && selectedCourse.identifier) {
        this.courseName = selectedCourse.name;
        this.selectedCourse = selectedCourse;
      } else {
        this.route.navigate(['home']);
      }
    }
  }

  /**
   * Get published course(s) of logged-in user
   */
  getMyContent(): void {
    // First check local storage
    const response = this.searchService.searchedContentList;
    if (response && response.count) {
      this.myCoursesList = response.content;
      if (this.myCoursesList.length === 1) {
        this.identifier = this.myCoursesList[0].identifier;
        this.courseName = this.myCoursesList[0].name;
        this.route.navigate(['activity/course/consumption', this.identifier, this.timePeriod]);
      }
      this.validateIdentifier(this.identifier);
      this.showLoader = false;
    } else {
      // Make search api call
      const searchParams = { status: ['Live'], contentType: ['Course'], params: { lastUpdatedOn: 'desc' } };
      this.searchService.searchContentByUserId(searchParams).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (data: ServerResponse) => {
          if (data.result.count && data.result.content) {
            this.myCoursesList = data.result.content;
            if (data.result.content.length === 1) {
              this.identifier = data.result.content[0].identifier;
              this.courseName = data.result.content[0].name;
              this.route.navigate(['activity/course/consumption', this.identifier, this.timePeriod]);
            } else {
              this.isMultipleCourses = true;
            }
          }
          this.showLoader = false;
          if (this.identifier) {
            this.validateIdentifier(this.identifier);
          }
        },
        (err: ServerResponse) => {
          this.showLoader = false;
        }
      );
    }
  }

  /**
   * Function to change course selection and display selected course data
   *
   * @param {object} course course object containg course details
   *
   * @example onAfterCourseChange({name: Course 1, identifier: do_xxxxx})
   */
  onAfterCourseChange(course: { identifier: string }) {
    if (this.identifier === course.identifier) {
      return false;
    }

    this.route.navigate(['activity/course/consumption', course.identifier, this.timePeriod]);
  }

  /**
   * Function to change time filter and get selected time period data.
   *
   * As of now dashboard supports only to show last 7 days, 14 days, and 5 weeks data
   *
   * @param {string} timePeriod timePeriod: last 7d / 14d / 5w
   *
   * @example onAfterFilterChange(7d)
   */
  onAfterFilterChange(timePeriod: string) {
    if (this.timePeriod === timePeriod) {
      return false;
    }

    this.route.navigate(['activity/course/consumption', this.identifier, timePeriod]);
  }

  /**
   * Function used to switch graph - from Number of user per day to Time spent by day and vice versa
   *
   * @param {string} step next / previous
   */
  graphNavigation(step: string) {
    step === 'next' ? this.showGraph++ : this.showGraph--;
  }

  /**
   * Function to initialise the telemetry impression event for course consumption dashboard page
   */
  initTelemetryImpressionEvent() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: '/myActivity'
      }
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
