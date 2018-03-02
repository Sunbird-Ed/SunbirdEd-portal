
// Import Module
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
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
  /**
   * parsing session storage
   */
  sessionData = JSON.parse(window.sessionStorage.getItem('sbConfig') || '{}');

  private _courseData$ = new BehaviorSubject<any>(undefined);
  public readonly courseData$: Observable<any> = this._courseData$.asObservable();

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
    console.log('[[[[[', this.userid);
    this.getEnrolledCourses();
  }
  /**
  *  api call
  */
  public getEnrolledCourses() {
    const option = {
      url: this.enrolledCoursesUrl + '/' + this.userid
    };
    this.learnerService.get(option).subscribe(
      data => {
        this.setEnrolledCourses(data);
      },
      err => {
        this._courseData$.next({ err: err, enrolledCourses: { ...this.enrolledCourses } });
        console.log('error in getting courses', err);
      }
    );
  }

  /**
   *  set the values of enrolled courses
   *
   * @param {object} res enrolled courses
   */
  public setEnrolledCourses(res) {
    this.setSessionData('ENROLLED_COURSES', undefined);
    if (res && res.responseCode === 'OK') {
      this.enrolledCourses = res.result.courses;
      this.setSessionData('ENROLLED_COURSES', {
        userid: this.userid,
        courseArr: this.enrolledCourses
      });
      this._courseData$.next({ err: null, enrolledCourses: { ...this.enrolledCourses } });
    } else {
      this.enrolledCourses = undefined;
      this.setSessionData('ENROLLED_COURSES', undefined);
    }
  }

  /**
   *  get session value
   *
   * @param {string} key to get session data
   */
  getSessionData(key) {
    return this.sessionData[key];
  }
  /**
   *  set the session value
   *
   * @param {string} key send by session value
   * @param {array} value session data
   */
  setSessionData(key, value) {
    this.sessionData[key] = value;
    window.sessionStorage
      .setItem('sbConfig', JSON.stringify(this.sessionData));
  }

}

