import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Custom service(s)
import { RendererService, CourseConsumptionService } from './../../services';
import { UserService, SearchService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash';

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

export class CourseConsumptionComponent {

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
   * Constructor to create injected service(s) object
   *
   * Default method of CourseConsumptionComponent class
   *
   * @param route
   * @param consumptionService
   * @param activatedRoute
   * @param searchService
   * @param rendererService
   * @param resourceService
   */
  constructor(private route: Router,
    private consumptionService: CourseConsumptionService,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private rendererService: RendererService,
    private resourceService: ResourceService) {
    this.activatedRoute.params.subscribe(params => {
      // Get content
      const myCourses = this.searchService.getSearchedContent();
      if (myCourses && myCourses.length) {
        this.myCoursesList = myCourses;
        this.validateIdentifier(params.id);
      } else {
        // Make api call to search my course
        this.getMyContent();
      }

      if (params.id && params.timePeriod) {
        this.isMultipleCourses = false;
        this.showDashboard = true;
        this.getDashboardData(params.timePeriod, params.id);
      }
    }
    );
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
    this.consumptionService.getDashboardData(params)
      .subscribe(data => {
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
        // TODO: Need to redirect to home page
        this.route.navigate(['groups']);
      }
    }
  }

  /**
   * Get published course(s) of logged-in user
   */
  getMyContent() {
    const searchParams = {
      status: ['Live'],
      contentType: ['Course'],
      params: { lastUpdatedOn: 'desc' }
    };
    this.searchService.searchContentByUserId(searchParams).subscribe(
      data => {
        if (data.result.count && data.result.content) {
          this.myCoursesList = data.result.content;
          this.searchService.setSearchedContent(this.myCoursesList);
          if (data.result.content.length === 1) {
            this.identifier = data.result.content[0].identifier;
            this.courseName = data.result.content[0].name;
            this.route.navigate(['dashboard/course/consumption', this.identifier, this.timePeriod]);
          } else {
            this.isMultipleCourses = true;
          }
        }
        this.showLoader = false;
        if (this.identifier) {
          this.validateIdentifier(this.identifier);
        }
      },
      err => {
      }
    );
  }

  /**
   * Function to change course selection and display selected course data
   *
   * @param {any} course course object containg course details
   *
   * @example onAfterCourseChange({name: Course 1, identifier: do_xxxxx})
   */
  onAfterCourseChange(course: any) {
    if (this.identifier === course.identifier) {
      console.log('same as previous');
      return false;
    }

    this.route.navigate(['dashboard/course/consumption', course.identifier, this.timePeriod]);
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

    this.route.navigate(['dashboard/course/consumption', this.identifier, timePeriod]);
  }

  /**
   * Function used to switch graph - from Number of user per day to Time spent by day and vice versa
   *
   * @param {string} step next / previous
   */
  graphNavigation(step: string) {
    step === 'next' ? this.showGraph++ : this.showGraph--;
  }
}
