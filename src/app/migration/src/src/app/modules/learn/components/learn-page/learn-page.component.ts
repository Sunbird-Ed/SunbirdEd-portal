import { ICourses } from './../../../core/interfaces/enrolledCourses';
import { PageSectionService, CoursesService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService} from '@sunbird/shared';
import { ICaraouselData, IContents, IAction } from '@sunbird/shared';
import * as _ from 'lodash';
/**
 * This component contains 2 sub components
 * 1)PageSection: It displays carousal data.
 * 2)ContentCard: It displays course data.
 */
@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrls: ['./learn-page.component.css']
})
export class LearnPageComponent implements OnInit {
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
   /**
   * To call get course data.
   */
  pageSectionService: PageSectionService;
  /**
   * To get enrolled courses details.
   */
  coursesService: CoursesService;
   /**
   * Contains result object returned from enrolled course API.
   */
  enrolledCourses: any;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
   /**
   * Contains result object returned from getPageData API.
   */
  caraouselData: Array<ICaraouselData> = [];
   /**
   * Contains object send to api result.
   */
  action: IAction;

  /**
	 * Constructor to create injected service(s) object
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {PageSectionService} pageSectionService Reference of pageSectionService.
   * @param {CoursesService} courseService  Reference of courseService.
	 */
  constructor(pageSectionService: PageSectionService, coursesService: CoursesService,
    toasterService: ToasterService, resourceService: ResourceService) {
    this.pageSectionService = pageSectionService;
    this.coursesService = coursesService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  /**
  * This method calls the course API.
  */
  populatePageData() {
    const option = {
      source: 'web',
      name: 'Course'
    };
    this.pageSectionService.getPageData(option).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse) {
          this.showLoader = false;
          this.caraouselData = this.caraouselData.concat(apiResponse.result.response.sections);
          _.forEach(this.caraouselData, (value, index) => {
            if (value.name !== 'My Courses') {
              _.forEach(this.caraouselData[index].contents, (value1, index1) => {
                this.coursesService.enrolledCourseData$.subscribe(
                  data => {
                    if (apiResponse) {
                      _.forEach(this.enrolledCourses, (value2, index2) => {
                        if (this.caraouselData[index].contents[index1].identifier === this.enrolledCourses.courseId) {
                          this.action = this.action = {
                            type: { button: true, rating: true }, classes: { button: 'ui blue basic button' },
                            label: 'Resume'
                          };
                          this.caraouselData[index].contents[index1].action = this.action;
                        } else {
                          this.action = this.action = {
                            type: { button: false, rating: true }, classes: { button: 'ui blue basic button' },
                            label: 'Resume'
                          };
                          this.caraouselData[index].contents[index1].action = this.action;
                        }
                      });
                    }  else {
                      this.action = this.action = {
                        type: { button: false, rating: true }, classes: { button: 'ui blue basic button' },
                        label: 'Resume'
                      };
                      this.caraouselData[index].contents[index1].action = this.action;
                    }
                  }
                );
              });
            }
          });
        } else {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.stmsg.m0053);
        }
      }
    );
  }
  /**
  * This method calls the enrolled course API.
  */
  public populateEnrolledCourse() {
    this.coursesService.enrolledCourseData$.subscribe(
      data => {
        if (data) {
          this.showLoader = false;
          const action = this.action = {
            type: { button: true, rating: true }, classes: { button: 'ui blue basic button' },
            label: 'Resume'
          };
          this.enrolledCourses = data.enrolledCourses;
          _.forEach(this.enrolledCourses, (value, index) => {
            this.enrolledCourses[index].action = action;
          });
          this.caraouselData.unshift({
            name: 'My Courses',
            length: this.enrolledCourses.length,
            contents: this.enrolledCourses
          });
        } else {
          this.showLoader = false;
        }
      },
      err => {
        this.showLoader = false;
      }
    );
  }
  ngOnInit() {
    this.populateEnrolledCourse();
    this.populatePageData();
  }
}
