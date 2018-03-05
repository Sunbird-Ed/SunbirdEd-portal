import { ISubscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
// services
import { CoursesService, UserService } from '@sunbird/core';
import { ResourceService} from '@sunbird/shared';
/**
 * The MainHomeComponent contains details about
 * user profile, enrolled courses and announcement inbox details.
 */
@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})

export class MainHomeComponent implements OnInit, OnDestroy {
  /**
   * Property of ISubscription used to unsubscribe userSubscription
   */
  private userSubscription: ISubscription;
  /**
   * Property of ISubscription used to unsubscribe courseSubscription
   */
  private courseSubscription: ISubscription;
  /**
   * Property of UserService used to render user profile data
   */
  public userService: UserService;
  /**
   * Property of CoursesService used to render enrolled courses
   */
  courseService: CoursesService;
  /**
   * Property of ResourceService used to render resourcebundels
   */
  resourceService: ResourceService;
  /**
   *  Store course api response in local
   */
  enrolledCourses: any = {};
  /**
   *  Contains userProfile missingfields value
   */
  profileMissingFields: Array<any> = [];
  /**
   *  Contains userProfile percentage of profile completeness
   */
  profileCompleteness: Number;
  /**
   *  Contains enrolled course details
   */
  enrolledList: Array<any> = [];
  /**
   *  Contains details of profileList and enrolledList
   */
  toDoList: Array<any> = [];
  /**
   *  Contains user profile details
   */
  profileList: any = {};
  /**
   * Flags to show loader
   */
  showLoader = true;
  /**
   * Flags to show error
   */
  showError: boolean;
  /**
   * Loader message
   */
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'We are Fetching Details ...'
  };
  /**
 * Slider setting
 */
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };
  /**
   * The "constructor"
   *
   * @param {ResourceService} resourceService  ResourceService is used to render resourcebundels
   * @param {UserService} userService  UserService used to render user profile data.
   * @param {CoursesService} courseService  CoursesService used to render enrolled courses.
   */
  constructor(resourceService: ResourceService,
    userService: UserService, courseService: CoursesService) {
    this.userService = userService;
    this.courseService = courseService;
    this.resourceService = resourceService;
  }
  /**
  * Subscribe to userService to get details about
  * user profile
  */
  public getDetails() {
    this.userService.userData$.subscribe(
      user => {
        if (user && !user.err) {
          this.showLoader = false;
          this.showError = false;
          this.profileCompleteness = user.userProfile['completeness'];
          this.profileMissingFields = user.userProfile['missingFields'];
          this.getProfileList();
        } else {
          this.showLoader = false;
          this.showError = true;
        }
      }
    );
  }

  /**
   * Subscribe to courseService to get enrolledCourses
   * by user
   */

  public getCourses() {
    this.courseSubscription = this.courseService.courseData$.subscribe(
      course => {
        if (course) {
          this.showLoader = false;
          this.enrolledCourses = course.enrolledCourses;
          this.showError = false;
          this.getCourseList();
        }
      },
      err => {
        this.showLoader = false;
        this.showError = true;
      }
    );
  }
  /**
   * getprofilelist checks profileCompleteness is less than 100
   * and push profilelist to toDoList
   */
  public getProfileList() {
    if (this.profileCompleteness < 100) {
      this.profileList = {
        missingFields: this.profileMissingFields,
        value: this.profileCompleteness,
        type: 'profile'
      };
    }
    this.toDoList.unshift(this.profileList);
  }

  /**
   * getCourseList push the enrolledlist
   * to toDoList
   */
  public getCourseList() {
    _.forIn(this.enrolledCourses, (value) => {
      this.enrolledList.push(value);
    });
    this.toDoList = this.toDoList.concat(this.enrolledList);
  }


  /**
   *To track any new entry
   *@param {number} index Give position for current entry
   *@param {number} item  Give postion
   */
  trackByFn(index, item) {
    return index;
  }

  /**
  *Initialize getDetails and getCourses.
  */
  ngOnInit() {
    this.getDetails();
    this.getCourses();
  }
  /**
   *ngOnDestroy unsubscribe the the subscription
   */
  ngOnDestroy() {
    console.log('destroy');
    this.userSubscription.unsubscribe();
    this.courseSubscription.unsubscribe();

  }

}

