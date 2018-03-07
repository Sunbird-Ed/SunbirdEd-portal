// Import Module
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http/src/params';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// Import Services
import { LearnerService } from './../learner/learner.service';
import { UserService } from './../user/user.service';
import { ConfigService } from '@sunbird/shared';
/**
 * The CoursesService is used to render course details
 */
@Injectable()
export class CoursesService {
  /**
   * To inject UserService.
   */
  private userService: UserService;
  /**
   * To inject LearnerService.
   */
  private learnerService: LearnerService;
  /**
   * To inject ConfigService
   */
  private config: ConfigService;
  /**
   * api call
   */
  enrolledCoursesUrl: string;
  /**
   * user id
   */
  userid: string;
  /**
   * BehaviorSubject Containing enrolled courses.
   */
  private _enrolledCourseData$ = new BehaviorSubject<any>(undefined);
  /**
   * Read only observable Containing enrolled courses.
   */
  public readonly enrolledCourseData$: Observable<any> = this._enrolledCourseData$.asObservable();
  /**
  * the "constructor"
  *
  * @param {LearnerService} learnerService  to call the prefix url "v1/learner"
  * @param {UserService} userService  details about user profile
  * @param {ConfigService} config ConfigService reference
  */
  constructor(userService: UserService, learnerService: LearnerService, config: ConfigService) {
    this.config = config;
    this.enrolledCoursesUrl = this.config.urlConFig.URLS.COURSE.GET_ENROLLED_COURSES;
    this.userService = userService;
    this.learnerService = learnerService;
    this.userid = this.userService.userid;
    this.getEnrolledCourses();
  }
  /**
   *  api call for enrolled courses.
   */
  public getEnrolledCourses() {
    const option = {
      url: this.enrolledCoursesUrl + '/' + this.userid
    };
    this.learnerService.get(option).subscribe(
      data => {
        this._enrolledCourseData$.next({ err: null, enrolledCourses: data.result.courses });
      },
      err => {
        this._enrolledCourseData$.next({ err: err, enrolledCourses: undefined });
        console.log('error in getting courses', err);
      }
    );
  }
}

