// Import Module
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// Import Services
import { LearnerService } from './../learner/learner.service';
import { UserService } from './../user/user.service';
// import json
import { ConfigService } from '@sunbird/shared';
/**
 * This service is a enrolled course service
 */
@Injectable()
export class CoursesService {

  /**
   * Property of UserService to render userid.
   */
  userService: UserService;
  /**
   * Property of LearnerService to call api.
   */
  learnerService: LearnerService;
  /**
   *  config json file
  */
  public config: ConfigService;
  /**
   * api call
  */
  enrolledCoursesUrl: string;
  /**
   *  user id
    */
  userid: string;
  /**
   * contains all the enrolled courses details
   */
  enrolledCourses: any[] = [];

  private _enrolledCourseData$ = new BehaviorSubject<any>(undefined);
  public readonly enrolledCourseData$: Observable<any> = this._enrolledCourseData$.asObservable();

  /**
  * the "constructor"
  *
  * @param {LearnerService} learnerService  to call the prefix url
  * @param {UserService} userService  details about user profile
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
  *  api call
  */
  public getEnrolledCourses() {
    this.enrolledCourses = undefined;
    const option = {
      url: this.enrolledCoursesUrl + '/' + this.userid
    };
    this.learnerService.get(option).subscribe(
      data => {
        this.enrolledCourses = data.result.courses;
      this._enrolledCourseData$.next({ err: null, enrolledCourses: this.enrolledCourses  });
      },
      err => {
        this._enrolledCourseData$.next({ err: err, enrolledCourses: this.enrolledCourses });
        console.log('error in getting courses', err);
      }
    );
  }

}

