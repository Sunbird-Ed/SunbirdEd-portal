import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LearnerService } from './../learner/learner.service';
import { UserService } from './../user/user.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { IEnrolledCourses, ICourses } from './../../interfaces';
import { ContentService } from '../content/content.service';
import * as _ from 'lodash';
/**
 *  Service for course API calls.
 */
@Injectable()
export class CoursesService {
  private enrolledCourses: Array<ICourses>;
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
   * Notification message for external content onclick of Resume course button
   */
  showExtContentMsg = false;
  /**
  * the "constructor"
  *
  * @param {LearnerService} learnerService Reference of LearnerService.
  * @param {UserService} userService Reference of UserService.
  * @param {ConfigService} config Reference of ConfigService
  */
  constructor(userService: UserService, learnerService: LearnerService,
    config: ConfigService, contentService: ContentService) {
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
    return this.learnerService.get(option).pipe(
      map((apiResponse: ServerResponse) => {
        this.enrolledCourses = apiResponse.result.courses;
        this._enrolledCourseData$.next({ err: null, enrolledCourses: this.enrolledCourses });
        return apiResponse;
      }),
      catchError((err) => {
        this._enrolledCourseData$.next({ err: err, enrolledCourses: undefined });
        return err;
      }));
  }
  /**
   *  call enroll course api and subscribe. Behavior subject will emit enrolled course data
  */
  public initialize() {
    this.getEnrolledCourses().subscribe((date) => {
    });
  }

  public updateCourseProgress(courseId, batchId, Progress) {
    const index = _.findIndex(this.enrolledCourses, {courseId: courseId, batchId: batchId });
    if (this.enrolledCourses[index]) {
      this.enrolledCourses[index].progress = Progress;
      this._enrolledCourseData$.next({ err: null, enrolledCourses: this.enrolledCourses });
    }
  }
  public setExtContentMsg(isExtContent: boolean) {
    this.showExtContentMsg = isExtContent ? isExtContent : false;
  }
}
