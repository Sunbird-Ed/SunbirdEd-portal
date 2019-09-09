import { ActivatedRoute } from '@angular/router';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import { of } from 'rxjs';
import { UserService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { Md5 } from 'ts-md5/dist/md5';
import { mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class AssessmentScoreService {

  /***
   * course details
   */
  private _courseId: string;
  private _batchId: string;
  private _contentId: string;

  /**
   * timestamp of the first START event
   */
  private _assessmentTs;
  /**
   * start and end event objects
   */
  private _startEvent;
  private _endEvent;
  /**
   * batch of ASSESS events in b/w START and END event
   */
  private _assessEvents = [];
  private initialized: Boolean = false;
  /**
   * md5 class to generate hash from courseId , contentId , batchId and userId
   */
  private _md5;

  constructor(private userService: UserService, private courseProgressService: CourseProgressService,
    private configService: ConfigService, private resourceService: ResourceService, private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute) {
    this._md5 = new Md5();
  }

  /**
   * process the telemetry Events
   */
  telemetryEvents(event) {
    const eventData = _.get(event, 'detail.telemetryData');
    const eid = _.get(eventData, 'eid');
    if (eventData && eid === 'START') {
      this._startEvent = event;
      this._assessmentTs = _.get(eventData, 'ets');
      this._assessEvents = [];
      this.setCourseDetails();
    } else if (eventData && eid === 'ASSESS') {
      if (this.initialized) {
        this._assessEvents.push(eventData);
      }
    } else if (eventData && eid === 'END') {
      if (this.initialized) {
        this._endEvent = event;
        this.processAssessEvents();
      }
    }
  }

  /**
   * initializes the service with course details on START event
   */
  private setCourseDetails() {
    const routeParams = _.get(this.activatedRoute, 'snapshot.params');
    const routeQueryParams = _.get(this.activatedRoute, 'snapshot.queryParams');
    ({ courseId: this._courseId, batchId: this._batchId } = routeParams);
    this._contentId = _.get(routeQueryParams, 'contentId');
    if (this._startEvent && this._batchId && this._courseId && this._contentId) {
      this.initialized = true;
      this._assessEvents = [];
    }
  }

  /**
   * processes the collected ASSESS events when END event is triggered
   */
  private processAssessEvents() {
    if (this.initialized && this._startEvent && this._endEvent) {
      const attpemtId$ = this.generateHash();
      attpemtId$.pipe(
        mergeMap(attemptId => this.prepareRequestObject(attemptId)))
        .subscribe((apiResponse) => {
          this.initialized = false;
          this._assessEvents = [];
        }, (err) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        })
    }
  }

  /**
   * to make api call to server
   */
  private updateAssessmentScore(request) {
    const URL = this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_UPDATE;
    const requestBody = request;
    const methodType = 'PATCH';
    return this.courseProgressService.updateAssessmentScore({ URL, requestBody, methodType });
  }

  /**
   * generates md5 hash from four strings (courseId , batchId , contentId and userId)
   */
  private generateHash() {
    const hash = this._md5.appendStr(this._courseId)
      .appendStr(this._contentId)
      .appendStr(this._batchId)
      .appendStr(this.userService.userid)
      .end();
    return of(hash);
  }

  /**
   * prepares the request body to call the assessment score api
   */
  private prepareRequestObject(attemptId: string) {
    const request = {
      request: {
        contents: [{
          contentId: this._contentId,
          batchId: this._batchId,
          status: 2, // because eid is END
          courseId: this._courseId,
          lastAccessTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ')

        }],
        assessments: [
          {
            assessmentTs: this._assessmentTs,
            batchId: this._batchId,
            courseId: this._courseId,
            userId: this.userService.userid,
            attemptId: attemptId,
            contentId: this._contentId,
            events: this._assessEvents
          }
        ]
      }
    }
    return this.updateAssessmentScore(request)
  }

}
