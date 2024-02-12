import { catchError, map, skipWhile } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LearnerService } from './../learner/learner.service';
import { UserService } from './../user/user.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { IEnrolledCourses, ICourses } from './../../interfaces';
import { ContentService } from '../content/content.service';
import {throwError as observableThrowError, of } from 'rxjs';
import * as _ from 'lodash-es';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
/**
 *  Service for course API calls.
 */
@Injectable({
  providedIn: 'root'
})
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

  sectionId: any;
  /**
   * BehaviorSubject Containing enrolled courses.
   */
  _enrolledCourseData$ = new BehaviorSubject<IEnrolledCourses>(undefined);
  /**
   * Read only observable Containing enrolled courses.
   */
  public readonly enrolledCourseData$: Observable<IEnrolledCourses> = this._enrolledCourseData$.asObservable()
  .pipe(skipWhile(data => data === undefined || data === null));
  /**
   * Notification message for external content onclick of Resume course button
   */
  showExtContentMsg = false;
  frameworkCategoriesList;
  public revokeConsent = new EventEmitter<void>();
  /**
  * the "constructor"
  *
  * @param {LearnerService} learnerService Reference of LearnerService.
  * @param {UserService} userService Reference of UserService.
  * @param {ConfigService} config Reference of ConfigService
  */
  constructor(userService: UserService, learnerService: LearnerService,
    config: ConfigService, contentService: ContentService, public cslFrameworkService: CslFrameworkService) {
    this.config = config;
    this.userService = userService;
    this.learnerService = learnerService;
  }
  /**
   *  api call for enrolled courses.
   */
  public getEnrolledCourses() {
    this.frameworkCategoriesList = this.cslFrameworkService.getAllFwCatName();
    let contentGetConfig = {
      "fields": `${this.config.urlConFig.params.enrolledCourses.fields},${this.frameworkCategoriesList.join(",")}`,
      "batchDetails": this.config.urlConFig.params.enrolledCourses.batchDetails
    };    
    const option = {
      url: this.config.urlConFig.URLS.COURSE.GET_ENROLLED_COURSES + '/' + this.userService.userid,
      param: { ...this.config.appConfig.Course.contentApiQueryParams, ...contentGetConfig }
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
  public getCourseSectionDetails() {
    if (this.sectionId) {
      return of(this.sectionId);
    }
    return this.getCourseSection().pipe(map(sectionId => {
      this.sectionId = sectionId;
      return sectionId;
    }));
  }
  public getCourseSection() {
    const systemSetting = {
      url: this.config.urlConFig.URLS.SYSTEM_SETTING.SSO_COURSE_SECTION,
    };
    return this.learnerService.get(systemSetting);
  }

   /**
   *  api call for getting course QR code CSV file.
   */
  public getQRCodeFile() {
    const userId = [this.userService.userid] ;
    const option = {
      url: this.config.urlConFig.URLS.COURSE.GET_QR_CODE_FILE,
      data: {
        'request': {
          'filter': {
            'userIds': userId
          }
        }
      }
    };
    return this.learnerService.post(option).pipe(
      map((apiResponse: ServerResponse) => {
        return apiResponse;
      }),
      catchError((err) => {
        return observableThrowError(err);
      }));
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
  findEnrolledCourses(courseId) {
    const enrInfo = _.reduce(this.enrolledCourses, (acc, cur) => {
      if (cur.courseId !== courseId) { // course donst match return
        return acc;
      }
      if (_.get(cur, 'batch.enrollmentType') === 'invite-only') { // invite-only batch
        if (_.get(cur, 'batch.status') === 2) { // && (!acc.invite.ended || latestCourse(acc.invite.ended.enrolledDate, cur.enrolledDate))
          acc.inviteOnlyBatch.expired.push(cur);
          acc.expiredBatchCount = acc.expiredBatchCount + 1;
        } else {
          acc.onGoingBatchCount = acc.onGoingBatchCount + 1;
          acc.inviteOnlyBatch.ongoing.push(cur);
        }
      } else {
        if (_.get(cur, 'batch.status') === 2) {
          acc.expiredBatchCount = acc.expiredBatchCount + 1;
          acc.openBatch.expired.push(cur);
        } else {
          acc.onGoingBatchCount = acc.onGoingBatchCount + 1;
          acc.openBatch.ongoing.push(cur);
        }
      }
      return acc;
    }, { onGoingBatchCount: 0, expiredBatchCount: 0,
      openBatch: { ongoing: [], expired: []}, inviteOnlyBatch: { ongoing: [], expired: [] }});
    return enrInfo;
  }
}
