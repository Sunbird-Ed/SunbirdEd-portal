import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { CoursesService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService , ServerResponse} from '@sunbird/shared';
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
  courseSubscription: ISubscription;
  userSubscription: ISubscription;
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
  /**
   * Contains details of userprofile and enrolled courses.
   */
  toDoList: Array<object> = [];
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
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };
  /**
   * The "constructor"
   *
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {UserService} userService Reference of userService.
   * @param {CoursesService} courseService  Reference of courseService.
   * @param {ToasterService} iziToast Reference of toasterService.
   */
  constructor(resourceService: ResourceService,
    userService: UserService, courseService: CoursesService, toasterService: ToasterService) {
    this.userService = userService;
    this.courseService = courseService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
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
            this.toDoList.unshift({
              type: profile,
              missingFields: user.userProfile.missingFields,
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
          this.toDoList = this.toDoList.concat(data.enrolledCourses);
        } else if (data && data.err) {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0001);
        }
      },
    );
  }
  /**
   * Used to dispaly profile as a first element.
   *@param {number} index Give position for current entry
   *@param {number} item  Give postion
   */
  trackByFn(index, item) {
    return index;
  }
  /**
  *This method calls the populateUserProfile and populateCourse to show
  * user details and enrolled courses.
  */
  ngOnInit() {
    this.populateUserProfile();
    this.populateEnrolledCourse();
  }
  /**
   *ngOnDestroy unsubscribe the subscription
   */
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.courseSubscription.unsubscribe();
  }
}

