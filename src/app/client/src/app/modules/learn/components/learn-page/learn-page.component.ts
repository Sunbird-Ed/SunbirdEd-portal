import { PageApiService, CoursesService, ICourses, ISort} from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, ICaraouselData, IContents, IAction, ConfigService,
  UtilService } from '@sunbird/shared';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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
    * To show / hide no result message when no result found
   */
  noResult = false;
  /**
* Contains config service reference
*/
  public configService: ConfigService;
  /**
  * Contains result object returned from getPageData API.
  */
  caraouselData: Array<ICaraouselData> = [];
  private router: Router;
  public filterType: string;
  public redirectUrl: string;
  public filters: any;
  public queryParams: any = {};
  sortingOptions: Array<ISort>;
  content: any;
  courses: any;
  /**
	 * Constructor to create injected service(s) object
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {CoursesService} courseService  Reference of courseService.
	 */
  constructor(pageSectionService: PageApiService, coursesService: CoursesService,
    toasterService: ToasterService, resourceService: ResourceService, router: Router,
     private activatedRoute: ActivatedRoute, configService: ConfigService, public utilService: UtilService) {
    this.pageSectionService = pageSectionService;
    this.coursesService = coursesService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.configService = configService;
    this.router = router;
    this.router.onSameUrlNavigation = 'reload';
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }
  /**
     * This method calls the enrolled courses API.
     */
  populateEnrolledCourse() {
    this.showLoader = true;
    this.coursesService.enrolledCourseData$.subscribe(
      data => {
        if (data && !data.err) {
          if (data.enrolledCourses.length > 0) {
            this.enrolledCourses = data.enrolledCourses;
            const constantData = {
              action: {
                right: {
                  class: 'ui blue basic button',
                   eventName: 'Resume',
                   displayType: 'button',
                   text: 'Resume'},
                  onImage: { eventName: 'onImage' }
              }
          };
            const metaData = { metaData: ['identifier', 'mimeType', 'framework', 'contentType'] };
            const dynamicFields = {'maxCount': ['leafNodesCount'], 'progress': ['progress']};
            const courses = this.utilService.getDataForCard(data.enrolledCourses,
              constantData, dynamicFields, metaData);
            this.caraouselData.unshift({
              name: 'My Courses',
              length: courses.length,
              contents: courses
            });
          }
          console.log( this.caraouselData);
          this.populatePageData();
        } else if (data && data.err) {
          this.populatePageData();
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
      name: 'Course',
      filters: _.pickBy(this.filters, value => value.length > 0),
      sort_by: {[this.queryParams.sort_by]: this.queryParams.sortType}
    };
    this.pageSectionService.getPageData(option).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse && apiResponse.result.response.sections.length > 0) {
          this.showLoader = false;
          this.caraouselData = this.caraouselData.concat(apiResponse.result.response.sections);
          this.processActionObject();
        } else {
          this.noResult = true;
          this.showLoader = false;
        }

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
          this.content = this.caraouselData[index].contents;
          if (this.enrolledCourses && this.enrolledCourses.length > 0) {
            _.forEach(this.enrolledCourses, (value2, index2) => {
              if (this.caraouselData[index].contents[index1].identifier === this.enrolledCourses[index2].courseId) {
                const constantData = {
                  action: {
                    right: {
                      class: 'ui blue basic button',
                       eventName: 'Resume',
                       displayType: 'button',
                       text: 'Resume'},
                      onImage: { eventName: 'onImage' }
                  }
              };
                const metaData = { metaData: ['identifier', 'mimeType', 'framework', 'contentType'] };
                const dynamicFields = {};
                this.caraouselData[index].contents = this.utilService.getDataForCard(this.content,
                  constantData, dynamicFields, metaData);
              } else {
                const constantData = {
                  action: {
                      onImage: { eventName: 'onImage' }
                  }
              };
                const metaData = { metaData: ['identifier', 'mimeType', 'framework', 'contentType'] };
                const dynamicFields = {};
                this.caraouselData[index].contents = this.utilService.getDataForCard(this.content,
                  constantData, dynamicFields, metaData);
              }
            });
          } else {
            const constantData = {
              action: {
                  onImage: { eventName: 'onImage' }
              }
          };
            const metaData = { metaData: ['identifier', 'mimeType', 'framework', 'contentType'] };
            const dynamicFields = {};
            this.caraouselData[index].contents = this.utilService.getDataForCard(this.content,
              constantData, dynamicFields, metaData);
          }
        });
      }
    });
    console.log(this.caraouselData);
  }
  /**
 *This method calls the populateEnrolledCourse
 */
  ngOnInit() {
    this.filterType = this.configService.appConfig.course.filterType;
    this.redirectUrl = this.configService.appConfig.course.inPageredirectUrl;
    this.getQueryParams();
  }

  /**
   *  to get query parameters
   */
  getQueryParams() {
    Observable
      .combineLatest(
        this.activatedRoute.params,
        this.activatedRoute.queryParams,
        (params: any, queryParams: any) => {
          return {
            params: params,
            queryParams: queryParams
          };
        })
      .subscribe(bothParams => {
        this.queryParams = { ...bothParams.queryParams };
        this.filters = {};
        _.forIn(this.queryParams, (value, key) => {
          if (key !== 'sort_by' && key !== 'sortType') {
            this.filters[key] = value;
          }
        });
       this.populateEnrolledCourse();
      });
  }
}
