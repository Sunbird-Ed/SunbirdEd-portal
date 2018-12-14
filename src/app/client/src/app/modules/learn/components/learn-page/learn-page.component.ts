import {
  combineLatest as observableCombineLatest,
  Subscription,
  Observable,
  Subject
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  PageApiService,
  CoursesService,
  ICourses,
  ISort,
  PlayerService
} from '@sunbird/core';
import { Component, OnInit, OnDestroy, Self } from '@angular/core';
import {
  ResourceService,
  ServerResponse,
  ToasterService,
  ICaraouselData,
  IContents,
  IAction,
  ConfigService,
  UtilService,
  INoResultMessage
} from '@sunbird/shared';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IInteractEventObject,
  IInteractEventEdata,
  IImpressionEventInput
} from '@sunbird/telemetry';
import { CourseBatchService } from '../../services';
import { forEach } from '@angular/router/src/utils/collection';
import { formatDate } from '@angular/common';
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
  today = new Date();
  jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
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
  newarr = [];
  unique = {};
  currentDate = new Date().toJSON().slice(0, 10);
  /**
   * Constructor to create injected service(s) object
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {CoursesService} courseService  Reference of courseService.
   */
  constructor(
    private batchData: CourseBatchService,
    pageSectionService: PageApiService,
    coursesService: CoursesService,
    toasterService: ToasterService,
    resourceService: ResourceService,
    router: Router,
    private playerService: PlayerService,
    private activatedRoute: ActivatedRoute,
    configService: ConfigService,
    public utilService: UtilService
  ) {
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
        const active = [];
        const inactive = [];
        const completed = [];
        if (data && !data.err) {
          if (data.enrolledCourses.length > 0) {
            this.enrolledCourses = data.enrolledCourses;
            for (const enrolledCourses of this.enrolledCourses) {
              this.batchData
                .getEnrolledBatchDetails(enrolledCourses.batchId)
                .subscribe(batch => {
                  let constantData;
                  const courses = [];
                  const metaData = {
                    metaData: this.configService.appConfig.Course
                      .enrolledCourses.metaData
                  };
                  const dynamicFields = {
                    maxCount: this.configService.appConfig.Course
                      .enrolledCourses.maxCount,
                    progress: this.configService.appConfig.Course
                      .enrolledCourses.progress
                  };

                  // This is View, Continue, Start part
                  if (
                    enrolledCourses.progress === 0 && this.currentDate <= batch.endDate
                  ) {
                    const newCourses = [];
                    newCourses.push(enrolledCourses);
                    constantData = this.configService.appConfig.Course
                      .enrolledCourses.startData;
                    const testCourses = this.utilService.getDataForCard(
                      newCourses,
                      constantData,
                      dynamicFields,
                      metaData
                    );
                    for (const course of testCourses) {
                      courses.push(course);
                      active.push(course);

                    }
                  }
                  // tslint:disable-next-line:max-line-length
                  // (batch.countDecrementStatus === false || batch.countDecrementStatus === true ) && ( batch.countIncrementStatus === true ) && (String(batch.endDate).localeCompare(this.currentDate)) && enrolledCourses.progress === 0
                  // tslint:disable-next-line:max-line-length
                  if (
                    enrolledCourses.progress > 0 &&
                    enrolledCourses.progress < enrolledCourses.leafNodesCount &&
                    this.currentDate <= batch.endDate
                  ) {
                    constantData = this.configService.appConfig.Course
                      .enrolledCourses.constantData;
                    const continueCourses = [];
                    continueCourses.push(enrolledCourses);
                    const testCourses = this.utilService.getDataForCard(
                      continueCourses,
                      constantData,
                      dynamicFields,
                      metaData
                    );
                    for (const course of testCourses) {
                      courses.push(course);
                      active.push(course);
                    }
                  }
                  // tslint:disable-next-line:max-line-length
                  if (
                    enrolledCourses.progress ===
                      enrolledCourses.leafNodesCount &&
                    this.currentDate <= batch.endDate
                  ) {
                    constantData = this.configService.appConfig.Course
                      .enrolledCourses.viewData;
                    const endedCourses = [];
                    endedCourses.push(enrolledCourses);
                    const testCourses = this.utilService.getDataForCard(
                      endedCourses,
                      constantData,
                      dynamicFields,
                      metaData
                    );
                    for (const course of testCourses) {
                      courses.push(course);
                      completed.push(course);
                   }
                  }
                  // tslint:disable-next-line:max-line-length
                  if (this.currentDate > batch.endDate) {
                    constantData = this.configService.appConfig.Course
                      .enrolledCourses.viewData;
                    const endedCourses = [];
                    endedCourses.push(enrolledCourses);
                    const testCourses = this.utilService.getDataForCard(
                      endedCourses,
                      constantData,
                      dynamicFields,
                      metaData
                    );
                    for (const course of testCourses) {
                      courses.push(course);
                      inactive.push(course);
                    }
                  }
                  if (batch.endDate === undefined && enrolledCourses.progress === 0) {
                    const newCourses = [];
                    newCourses.push(enrolledCourses);
                    constantData = this.configService.appConfig.Course
                      .enrolledCourses.startData;
                    const testCourses = this.utilService.getDataForCard(
                      newCourses,
                      constantData,
                      dynamicFields,
                      metaData
                    );
                    for (const course of testCourses) {
                      courses.push(course);
                      active.push(course);
                    }
                  }
                  // tslint:disable-next-line:max-line-length
                  if (batch.endDate === undefined && enrolledCourses.progress > 0 && enrolledCourses.progress < enrolledCourses.leafNodesCount) {
                    const newCourses = [];
                    newCourses.push(enrolledCourses);
                    constantData = this.configService.appConfig.Course
                      .enrolledCourses.constantData;
                    const testCourses = this.utilService.getDataForCard(
                      newCourses,
                      constantData,
                      dynamicFields,
                      metaData
                    );
                    for (const course of testCourses) {
                      courses.push(course);
                      active.push(course);
                    }
                  }
                });
            }
            this.caraouselData.unshift({
              name: 'Completed',
              length: completed.length,
              contents: completed
            });
            this.caraouselData.unshift({
              name: 'Inactive',
              length: inactive.length,
              contents: inactive
            });
            this.caraouselData.unshift({
              name: 'Active',
              length: active.length,
              contents: active
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
    this.pageSectionService
      .getPageData(option)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        apiResponse => {
          this.noResultMessage = {
            message: this.resourceService.messages.stmsg.m0007,
            messageText: this.resourceService.messages.stmsg.m0006
          };
          let noResultCounter = 0;
          if (apiResponse && apiResponse.sections) {
            this.showLoader = false;
            const sections = this.processActionObject(apiResponse.sections);
            this.caraouselData = this.caraouselData.concat(sections);
            if (this.caraouselData.length > 0) {
              _.forIn(this.caraouselData, (value, key) => {
                 if (
                  this.caraouselData[key].contents === null ||
                  this.caraouselData[key].contents === undefined ||
                  (this.caraouselData[key].name &&
                    this.caraouselData[key].name === 'Completed')
                ) {
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
            message: this.resourceService.messages.stmsg.m0007,
            messageText: this.resourceService.messages.stmsg.m0006
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
          if (
            _.indexOf(
              enrolledCoursesId,
              sections[index].contents[index2].identifier
            ) !== -1
          ) {
            const constantData = this.configService.appConfig.Course
              .enrolledCourses.constantData;
            const metaData = {
              metaData: this.configService.appConfig.Course.enrolledCourses
                .metaData
            };
            const dynamicFields = {};
            const enrolledCourses = _.find(this.enrolledCourses, [
              'courseId',
              sections[index].contents[index2].identifier
            ]);
            sections[index].contents[index2] = this.utilService.processContent(
              enrolledCourses,
              constantData,
              dynamicFields,
              metaData
            );
          } else {
            const constantData = this.configService.appConfig.Course.otherCourse
              .constantData;
            const metaData = this.configService.appConfig.Course.otherCourse
              .metaData;
            const dynamicFields = {};
            sections[index].contents[index2] = this.utilService.processContent(
              sections[index].contents[index2],
              constantData,
              dynamicFields,
              metaData
            );
          }
        } else {
          const constantData = this.configService.appConfig.Course.otherCourse
            .constantData;
          const metaData = this.configService.appConfig.Course.otherCourse
            .metaData;
          const dynamicFields = {};
          sections[index].contents[index2] = this.utilService.processContent(
            sections[index].contents[index2],
            constantData,
            dynamicFields,
            metaData
          );
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
          section: inview.section
        });
      } else if (inview.metaData.identifier) {
        this.inviewLogs.push({
          objid: inview.metaData.identifier,
          objtype: 'course',
          index: index,
          section: inview.section
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
      }
    )
      .pipe(takeUntil(this.unsubscribe))
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
      event.data.metaData.mimeType =
        'application/vnd.ekstep.content-collection';
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
