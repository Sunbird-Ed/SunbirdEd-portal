import { ISubscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
// services
import { CoursesService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
/**
 * The MainHomeComponent contains details about
 * user profile like "how much profile is complete", "profilepic of user",
 * list of enrolled courses by the user and announcement list.
 */
@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})

export class MainHomeComponent implements OnInit, OnDestroy {
  /**
   * Property of ISubscription used to unsubscribe userSubscription.
   */
  private userSubscription: ISubscription;
  /**
   * Property of ISubscription used to unsubscribe courseSubscription.
   */
  private courseSubscription: ISubscription;
  /**
   * To inject userService.
   */
  private userService: UserService;
  /**
   * To inject courseService.
   */
  public courseService: CoursesService;
  /**
   * To inject resourceService.
   */
  private resourceService: ResourceService;
  /**
   * To inject toasterService.
   */
  private iziToast: ToasterService;
  /**
   * Contains details of userprofile and  to get the length of the slider.
   */
  toDoList: Array<any> = [];
  /**
   * Flags to show loader have default value true because till it get all the data
   * or get a error it should be in waiting process.
   */
  showLoader = true;
  /**
   * Loader message is the message shown in the loader giving details about loading reason.
   */
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'We are Fetching Details ...'
  };
  /**
  * Slider setting is used to display number of cards in the slider.
  */
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };
  /**
   * The "constructor"
   *
   * @param {ResourceService} resourceService  ResourceService is used to render resourcebundels
   * @param {UserService} userService  UserService used to render user profile data.
   * @param {CoursesService} courseService  CoursesService used to render enrolled courses.
   * @param {ToasterService} iziToast ToasterService used to show popup messages.
   */
  constructor(resourceService: ResourceService,
    userService: UserService, courseService: CoursesService, iziToast: ToasterService) {
    this.userService = userService;
    this.courseService = courseService;
    this.resourceService = resourceService;
    this.iziToast = iziToast;
  }
  /**
  * Subscribe to userService to get details about
  * user profile like missingFields, completeness.
  */
  public subscribeUserProfile() {
    const profile = 'profile';
    this.userSubscription = this.userService.userData$.subscribe(
      user => {
        if (user && !user.err) {
          this.showLoader = false;
          if (user.userProfile.completeness < 100) {
            this.toDoList.unshift({
              type: profile,
              missingFields: user.userProfile.missingFields,
              value: user.userProfile.completeness
            });
          }
        } else {
          this.showLoader = false;
        }
      }
    );
  }
  /**
   * Subscribe to courseService to get enrolledCourses details
   * by user like Title,description, progress of course.
   */
  public subscribeCourse() {
    this.courseSubscription = this.courseService.enrolledCourseData$.subscribe(
      course => {
        if (course) {
          this.showLoader = false;
          this.toDoList = this.toDoList.concat(course.enrolledCourses);
        }
      },
      err => {
        this.showLoader = false;
        this.iziToast.error(this.resourceService.messages.fmsg.m0001);
      }
    );
  }
  /**
   *To track any new entry in the array.
   *@param {number} index Give position for current entry
   *@param {number} item  Give postion
   */
  trackByFn(index, item) {
    return index;
  }
  /**
  *Initialize subscribeUserProfile and subscribeCourse.
  */
  ngOnInit() {
    this.subscribeUserProfile();
    this.subscribeCourse();
  }
  /**
   *ngOnDestroy unsubscribe the subscription
   */
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.courseSubscription.unsubscribe();
  }
}

