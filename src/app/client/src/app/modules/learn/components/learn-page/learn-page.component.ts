
import {combineLatest as observableCombineLatest,  Subscription ,  Observable ,  Subject } from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import { PageApiService, CoursesService, ICourses, ISort, PlayerService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ServerResponse, ToasterService, ICaraouselData, IContents, IAction, ConfigService,
  UtilService, INoResultMessage
} from '@sunbird/shared';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

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
export class LearnPageComponent implements OnInit, OnDestroy {
  /**
  * inviewLogs
  */
  inviewLogs = [];
  /**
   * telemetryImpression
  */
  telemetryImpression: IImpressionEventInput;
  filterIntractEdata: IInteractEventEdata;
  sortIntractEdata: IInteractEventEdata;

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
   * no result  message
  */
  noResultMessage: INoResultMessage;
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
  public unsubscribe = new Subject<void>();
  courseDataSubscription: Subscription;
  /**
	 * Constructor to create injected service(s) object
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {CoursesService} courseService  Reference of courseService.
	 */
  constructor(pageSectionService: PageApiService, coursesService: CoursesService,
    toasterService: ToasterService, resourceService: ResourceService, router: Router, private playerService: PlayerService,
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
    this.courseDataSubscription = this.coursesService.enrolledCourseData$.subscribe(
      data => {
        if (data && !data.err) {
          if (data.enrolledCourses.length > 0) {
            this.enrolledCourses = data.enrolledCourses;
            const constantData = this.configService.appConfig.Course.enrolledCourses.constantData;
            const metaData = { metaData: this.configService.appConfig.Course.enrolledCourses.metaData };
            const dynamicFields = {
              'maxCount': this.configService.appConfig.Course.enrolledCourses.maxCount,
              'progress': this.configService.appConfig.Course.enrolledCourses.progress
            };
            const courses = this.utilService.getDataForCard(data.enrolledCourses,
              constantData, dynamicFields, metaData);
            this.caraouselData.unshift({
              name: 'My Courses',
              length: courses.length,
              contents: courses
            });
          }
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
    this.noResult = false;
    const option = {
      source: 'web',
      name: 'Course',
      filters: _.pickBy(this.filters, value => value.length > 0),
      sort_by: { [this.queryParams.sort_by]: this.queryParams.sortType }
    };
    this.pageSectionService.getPageData(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse) => {
        this.noResultMessage = {
          'message': this.resourceService.messages.stmsg.m0007,
          'messageText': this.resourceService.messages.stmsg.m0006
        };
        let noResultCounter = 0;
        if (apiResponse && apiResponse.sections) {
          this.showLoader = false;
          const sections = this.processActionObject(apiResponse.sections);
          this.caraouselData = this.caraouselData.concat(sections);
          if (this.caraouselData.length > 0) {
            _.forIn(this.caraouselData, (value, key) => {
              if (this.caraouselData[key].contents === null || this.caraouselData[key].contents === undefined
                || (this.caraouselData[key].name && this.caraouselData[key].name === 'My Courses')) {
                noResultCounter++;
              }
            });
          }
          if (noResultCounter === this.caraouselData.length) {
            this.noResult = true;
          }
        } else {
          this.noResult = true;
          this.showLoader = false;
        }

      },
      err => {
        this.noResult = true;
        this.noResultMessage = {
          'message': this.resourceService.messages.stmsg.m0007,
          'messageText': this.resourceService.messages.stmsg.m0006
        };
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
      }
    );
  }
  /**
   * This method process the action object.
   */
  processActionObject(sections) {
    const enrolledCoursesId = [];
    _.forEach(this.enrolledCourses, (value, index) => {
      enrolledCoursesId[index] = _.get(this.enrolledCourses[index], 'courseId');
    });
    _.forEach(sections, (value, index) => {
      _.forEach(sections[index].contents, (value2, index2) => {
        if (this.enrolledCourses && this.enrolledCourses.length > 0) {
          if (_.indexOf(enrolledCoursesId, sections[index].contents[index2].identifier) !== -1) {
            const constantData = this.configService.appConfig.Course.enrolledCourses.constantData;
            const metaData = { metaData: this.configService.appConfig.Course.enrolledCourses.metaData };
            const dynamicFields = {};
            const enrolledCourses = _.find(this.enrolledCourses, ['courseId', sections[index].contents[index2].identifier]);
            sections[index].contents[index2] = this.utilService.processContent(enrolledCourses,
              constantData, dynamicFields, metaData);
          } else {
            const constantData = this.configService.appConfig.Course.otherCourse.constantData;
            const metaData = this.configService.appConfig.Course.otherCourse.metaData;
            const dynamicFields = {};
            sections[index].contents[index2] = this.utilService.processContent(sections[index].contents[index2],
              constantData, dynamicFields, metaData);
          }
        } else {
          const constantData = this.configService.appConfig.Course.otherCourse.constantData;
          const metaData = this.configService.appConfig.Course.otherCourse.metaData;
          const dynamicFields = {};
          sections[index].contents[index2] = this.utilService.processContent(sections[index].contents[index2],
            constantData, dynamicFields, metaData);
        }
      });
    });
    return sections;
  }
  /**
 *This method calls the populateEnrolledCourse
 */
  ngOnInit() {
    this.filterType = this.configService.appConfig.course.filterType;
    this.redirectUrl = this.configService.appConfig.course.inPageredirectUrl;
    this.getQueryParams();
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: 'course-page'
    };
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: 'course-page'
    };
  }
  prepareVisits(event) {
    _.forEach(event, (inview, index) => {
      if (inview.metaData.courseId) {
        this.inviewLogs.push({
          objid: inview.metaData.courseId,
          objtype: 'course',
          index: index,
          section: inview.section,
        });
      } else if (inview.metaData.identifier) {
        this.inviewLogs.push({
          objid: inview.metaData.identifier,
          objtype: 'course',
          index: index,
          section: inview.section,
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  /**
   *  to get query parameters
   */
  getQueryParams() {
    observableCombineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params: any, queryParams: any) => {
        return {
          params: params,
          queryParams: queryParams
        };
      }).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(bothParams => {
        this.queryParams = { ...bothParams.queryParams };
        this.filters = {};
        _.forIn(this.queryParams, (value, key) => {
          if (key !== 'sort_by' && key !== 'sortType') {
            this.filters[key] = value;
          }
        });
        this.caraouselData = [];
        if (this.queryParams.sort_by && this.queryParams.sortType) {
          this.queryParams.sortType = this.queryParams.sortType.toString();
        }
        this.populateEnrolledCourse();
      });
  }
  playContent(event) {
    if (event.data.metaData.batchId) {
      event.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
      event.data.metaData.contentType = 'Course';
    }
    this.playerService.playContent(event.data.metaData);
  }
  ngOnDestroy() {
    if (this.courseDataSubscription) {
      this.courseDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
