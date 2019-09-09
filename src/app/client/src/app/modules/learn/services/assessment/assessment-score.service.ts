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

  private _courseId: string;
  private _batchId: string;
  private _contentId: string;
  private _assessmentTs;
  private _startEvent;
  private _endEvent;
  private _assessEvents = [];
  private initialized: Boolean = false;
  private _md5;

  constructor(private userService: UserService, private courseProgressService: CourseProgressService,
    private configService: ConfigService, private resourceService: ResourceService, private toasterService: ToasterService) {
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
    } else if (eventData && eid === 'ASSESS') {
      if (this.initialized) {
        this._assessEvents.push(eventData);
      }
    } else if (eventData && eid === 'END') {
      this._endEvent = event;
      if (this.initialized) {
        this.processAssessEvents();
      }
    }
  }

  /**
   * initializes the service with course details on START event
   */
  set courseDetails({ courseId, batchId, contentId }) {
    if (courseId && batchId && contentId) {
      this._courseId = courseId;
      this._batchId = batchId;
      this._contentId = contentId;
      this.initialized = true;
      this._assessEvents = [];
    }
  }

  /**
   * processes the collected ASSESS events when END event is triggered
   */
  processAssessEvents() {
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
  updateAssessmentScore(request) {
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
  prepareRequestObject(attemptId: string) {
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
