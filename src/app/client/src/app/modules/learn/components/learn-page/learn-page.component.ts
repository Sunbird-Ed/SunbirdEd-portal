import { PageApiService, CoursesService, ICourses } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService,  ICaraouselData, IContents, IAction } from '@sunbird/shared';
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
  pageSectionService: PageApiService;
  /**
   * To get enrolled courses details.
   */
  coursesService: CoursesService;
  /**
  * Contains result object returned from enrolled course API.
  */
  enrolledCourses: Array<ICourses>;
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
	 * Constructor to create injected service(s) object
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {CoursesService} courseService  Reference of courseService.
	 */
  constructor(pageSectionService: PageApiService, coursesService: CoursesService,
    toasterService: ToasterService, resourceService: ResourceService) {
    this.pageSectionService = pageSectionService;
    this.coursesService = coursesService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  /**
     * This method calls the enrolled courses API.
     */
  populateEnrolledCourse() {
    this.coursesService.enrolledCourseData$.subscribe(
      data => {
        if (data && !data.err) {
          if (data.enrolledCourses.length > 0) {
            this.showLoader = false;
            const action = { right: { displayType: 'button' ,
                 classes: 'ui blue basic button' ,
                 text: 'Resume' },
                 left: { displayType: 'rating' }
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
          }
          this.populatePageData();
          this.showLoader = false;
        } else if (data && data.err) {
          this.populatePageData();
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0001);
        }
      }
    );
  }
  /**
   * This method calls the page prefix API.
   */
  populatePageData() {
    const option = {
      source: 'web',
      name: 'Course'
    };
    this.pageSectionService.getPageData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.caraouselData = this.caraouselData.concat(apiResponse.result.response.sections);
        this.processActionObject();
      },
      err => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
      }
    );
  }
  /**
   * This method process the action object.
   */
  processActionObject() {
    _.forEach(this.caraouselData, (value, index) => {
      if (value.name !== 'My Courses') {
        _.forEach(this.caraouselData[index].contents, (value1, index1) => {
          if (this.enrolledCourses && this.enrolledCourses.length > 0) {
            _.forEach(this.enrolledCourses, (value2, index2) => {
              if (this.caraouselData[index].contents[index1].identifier === this.enrolledCourses[index2].courseId) {
                const action = { right: {displayType: 'button' ,
                 classes: 'ui blue basic button' ,
                 text: 'Resume' },
                 left: { displayType: 'rating' }
                };
                this.caraouselData[index].contents[index1].action = action;
              } else {
                const action = { left: { displayType: 'rating' } };
                this.caraouselData[index].contents[index1].action = action;
              }
            });
          } else {
            const action = { left: { displayType: 'rating' } };
            this.caraouselData[index].contents[index1].action = action;
          }
        });
      }
    });
  }
  /**
 *This method calls the populateEnrolledCourse
 */
  ngOnInit() {
    this.populateEnrolledCourse();
  }
}
