import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LearnerService } from './../learner/learner.service';
import { UserService } from './../user/user.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { IEnrolledCourses } from './../../interfaces/index';
/**
 *  Service for course API calls.
 */
@Injectable()
export class CoursesService {
  /**
   * To get details about user profile.
   */
  private userService: UserService;
  /**
   *  To do learner service api call.
   */
  private learnerService: LearnerService;
  /**
   *  To get url, app configs.
   */
  private config: ConfigService;
  /**
   * user id
   */
  userid: string;
  /**
   * BehaviorSubject Containing enrolled courses.
   */
  private _enrolledCourseData$ = new BehaviorSubject<IEnrolledCourses>(undefined);
  /**
   * Read only observable Containing enrolled courses.
   */
  public readonly enrolledCourseData$: Observable<IEnrolledCourses> = this._enrolledCourseData$.asObservable();
  /**
  * the "constructor"
  *
  * @param {LearnerService} learnerService Reference of LearnerService.
  * @param {UserService} userService Reference of UserService.
  * @param {ConfigService} config Reference of ConfigService
  */
  constructor(userService: UserService, learnerService: LearnerService, config: ConfigService) {
    this.config = config;
    this.userService = userService;
    this.learnerService = learnerService;
    this.userid = this.userService.userid;
  }
  /**
   *  api call for enrolled courses.
   */
  public getEnrolledCourses() {
    const option = {
      url: this.config.urlConFig.URLS.COURSE.GET_ENROLLED_COURSES + '/' + this.userid
    };
    this.learnerService.get(option).subscribe(
      (apiResponse: ServerResponse) => {
        this._enrolledCourseData$.next({ err: null, enrolledCourses: apiResponse.result.courses });
      },
      err => {
        this._enrolledCourseData$.next({ err: err, enrolledCourses: undefined });
      }
    );
  }
  public initialize() {
    this.getEnrolledCourses();
  }
}

