import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { CoursesService, UserService, PlayerService } from '@sunbird/core';
import { ResourceService, ToasterService, ServerResponse, ConfigService, UtilService} from '@sunbird/shared';
import {  IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';
/**
 * This component contains 3 sub components
 * 1)ProfileCard: It displays user profile details.
 * 2)ActionCard: It displays enrolled courses details.
 * 3)HomeAnnouncement: It displays announcement inbox details.
 */
@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})

export class MainHomeComponent implements OnInit, OnDestroy {
  /**
  * inviewLogs
 */
  inviewLogs = [];
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
	 * profileUpdateIntractEdata
	*/
  profileUpdateIntractEdata: IInteractEventEdata;
  /**
	 * telemetryInteractObject
	*/
  telemetryInteractObject: IInteractEventObject;
  courseSubscription: ISubscription;
  userSubscription: ISubscription;
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
   * To get user details.
   */
  private userService: UserService;
  /**
   * To get enrolled courses details.
   */
  public courseService: CoursesService;
  /**
   * To call resource service which helps to use language constant.
   */
  public resourceService: ResourceService;
  /**
   * To show toaster(error, success etc) after any API calls.
   */
  private toasterService: ToasterService;

  public utilService: UtilService;
  /**
   * Contains details of userprofile and enrolled courses.
   */
  toDoList: Array<object> = [];
/**
* Contains config service reference
*/
public configService: ConfigService;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  /**
  * Slider setting to display number of cards on the slider.
  */
  slideConfig = {
    'slidesToShow': 4,
    'slidesToScroll': 4,
    'responsive': [
      {
        'breakpoint': 2800,
        'settings': {
          'slidesToShow': 8,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 2200,
        'settings': {
          'slidesToShow': 6,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 2000,
        'settings': {
          'slidesToShow': 5,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 1400,
        'settings': {
          'slidesToShow': 4,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 1200,
        'settings': {
          'slidesToShow': 4,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 800,
        'settings': {
          'slidesToShow': 3,
          'slidesToScroll': 3,
        }
      },
      {
        'breakpoint': 600,
        'settings': {
          'slidesToShow': 2,
          'slidesToScroll': 2
        }
      },
      {
        'breakpoint': 425,
        'settings': {
          'slidesToShow': 1,
          'slidesToScroll': 1
        }
      }
    ],
    infinite: false,
  };
  /**
   * The "constructor"
   *
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {UserService} userService Reference of userService.
   * @param {CoursesService} courseService  Reference of courseService.
   * @param {ToasterService} iziToast Reference of toasterService.
   */
  constructor(resourceService: ResourceService, private playerService: PlayerService,
    userService: UserService, courseService: CoursesService, toasterService: ToasterService,
    route: Router, activatedRoute: ActivatedRoute, configService: ConfigService, utilService: UtilService) {
    this.userService = userService;
    this.courseService = courseService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.configService = configService;
    this.utilService = utilService;
  }
  /**
   * This method calls the user API.
  */
  public populateUserProfile() {
    const profile = 'profile';
    this.userSubscription = this.userService.userData$.subscribe(
      user => {
        if (user && !user.err) {
          this.showLoader = false;
          if (user.userProfile.completeness < 100) {
            const missingField = [];
            _.forEach( user.userProfile.missingFields, (val, key) => {
              val = val.match(/([A-Z]?[^A-Z]*)/g).join(' ');
              missingField.push(_.capitalize(val));
            });
            this.toDoList.unshift({
              type: profile,
              missingFields: missingField,
              value: user.userProfile.completeness,
              image: user.userProfile.avatar
            });
          }
        } else if (user && user.err) {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0004);
        }
      }
    );
  }
  /**
   * This method calls the course API.
   */
  public populateEnrolledCourse() {
    this.courseSubscription = this.courseService.enrolledCourseData$.subscribe(
      data => {
        if (data && !data.err) {
          this.showLoader = false;
          // const constantData = this.configService.appConfig.Home.enrolledCourses.constantData;
          let constantData;
          const courses = [];
            const metaData = { metaData: this.configService.appConfig.Home.enrolledCourses.metaData };
            const dynamicFields = {
              'maxCount': this.configService.appConfig.Home.enrolledCourses.maxCount,
              'progress': this.configService.appConfig.Home.enrolledCourses.progress
            };
            // const courses = this.utilService.getDataForCard(data.enrolledCourses,
            //   constantData, dynamicFields, metaData);
            for (const enrolledCourse of data.enrolledCourses) {
              if (enrolledCourse.progress === 0 ) {
                const newCourses = [];
                newCourses.push(enrolledCourse);
                constantData = this.configService.appConfig.Course
                .enrolledCourses.startData;
                const testCourses = this.utilService.getDataForCard(
                  newCourses,
                  constantData,
                  dynamicFields,
                  metaData
                );
                for (const course of testCourses) {
                  courses.push (course);
                }
              } else
              if ( enrolledCourse.progress > 0 && enrolledCourse.progress  < enrolledCourse.leafNodesCount) {
                constantData = this.configService.appConfig.Course
                .enrolledCourses.constantData;
                const continueCourses = [];
                continueCourses.push(enrolledCourse);
                const testCourses = this.utilService.getDataForCard(
                  continueCourses,
                  constantData,
                  dynamicFields,
                  metaData
                );
                for (const course of testCourses) {
                  courses.push (course);
                }
              } else
              if ( enrolledCourse.progress === enrolledCourse.leafNodesCount ) {
                constantData = this.configService.appConfig.Course
                .enrolledCourses.viewData;
                const endedCourses = [];
                // endedCourses.push(enrolledCourse);
                const testCourses = this.utilService.getDataForCard(
                  endedCourses,
                  constantData,
                  dynamicFields,
                  metaData
                );
                for (const course of testCourses) {
                  courses.push (course);
                }
              }
            }
          this.toDoList = this.toDoList.concat(courses);
        } else if (data && data.err) {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0001);
        }
      },
    );
    this.setInteractEventData();
  }
  /**
   * Used to dispaly profile as a first element.
   *@param {number} index Give position for current entry
   *@param {number} item  Give postion
   */
  trackByFn(index, item) {
    return index;
  }

  playContent(event) {
    if (event.data.metaData.batchId) {
      event.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
      event.data.metaData.contentType = 'Course';
    }
    this.playerService.playContent(event.data.metaData);
  }
  /**
  *This method calls the populateUserProfile and populateCourse to show
  * user details and enrolled courses.
  */
  ngOnInit() {
    this.populateUserProfile();
    this.populateEnrolledCourse();
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
  }
  /**
   *ngOnDestroy unsubscribe the subscription
   */
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.courseSubscription.unsubscribe();
  }

  /**
   * get inview  Data
  */
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        if (inview.data.type !== 'profile') {
          return o.objid === inview.data.courseId  ;
        } else {
          return o.objid === this.userService.userid  ;
        }
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.courseId || this.userService.userid,
          objtype: 'home',
          index: inview.id,
          section: 'ToDo',
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  /**
   * get inviewChange
  */
  inviewChange(toDoList, event) {
    const slideData = toDoList.slice(event.currentSlide + 1, event.currentSlide + 5);
    _.forEach(slideData, (slide, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === slide.courseId;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: slide.courseId,
          objtype: 'home',
          index: event.currentSlide + key,
          section: 'ToDo'
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  public anouncementInview(event) {
    if (event) {
      _.forEach(event.inview, (inview, key) => {
        const obj = _.find(this.inviewLogs, (o) => {
          return o.objid === inview.data.id;
        });
        if (obj === undefined) {
          this.inviewLogs.push({
            objid: inview.data.id,
            objtype: 'announcement',
            index: inview.id,
            section: 'ToDo',
          });
        }
      });
      this.telemetryImpression.edata.visits = this.inviewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
    }
  }
  setInteractEventData() {
    this.profileUpdateIntractEdata = {
      id: 'home',
      type: 'click',
      pageid: 'home'
    };
    this.telemetryInteractObject =  {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }
}
