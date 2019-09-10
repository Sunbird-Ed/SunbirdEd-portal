import { CourseProgressService } from '../courseProgress/course-progress.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { Md5 } from 'ts-md5/dist/md5';
import * as moment from 'moment';

@Injectable()
export class AssessmentScoreService {
  /***
   * course details
   */
  private _courseId: string;
  private _batchId: string;
  private _contentId: string;
  private _userId: string;
  
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
  private _batchDetails: any;
  private _courseDetails: any;
  private _contentDetails: any;
  private playerId;
  /**
   * md5 class to generate hash from courseId , contentId , batchId and userId
   */
  private _md5;

  constructor(private courseProgressService: CourseProgressService) {
    this._md5 = new Md5();
  }

  /**
   * initilize the assessment service
   */
  init({ batchDetails, courseDetails, contentDetails }) {
    this._batchDetails = batchDetails;
    this._courseDetails = courseDetails;
    this._contentDetails = contentDetails;
    ({ courseId: this._courseId, batchId: this._batchId } = this._batchDetails);
    this._contentId = _.get(this._contentDetails, 'identifier');
    this.checkContentForAssessment();
  }

  /**
   * process the telemetry Events
   */
  telemetryEvents(event) {
    const eventData = _.get(event, 'detail.telemetryData');
    const eid = _.get(eventData, 'eid');
    if (this.initialized) {
      if (eventData && eid === 'START') {
        this._startEvent = eventData;
        this._assessmentTs = _.get(eventData, 'ets');
        this._userId = _.get(eventData, 'actor.id');
        this._assessEvents = [];
      } else if (eventData && eid === 'ASSESS') {
        this._assessEvents.push(eventData);
      } else if (eventData && eid === 'END') {
        this._endEvent = eventData;
        this.processAssessEvents();
      }
    }
  }

  /**
   * checks if the course has assessment or not
   */
  private checkContentForAssessment() {
    if (this._courseId && this._contentId && this._batchId) {
      if (this._contentDetails && _.get(this._contentDetails, 'totalQuestions') > 0) {
        this.initialized = true;
      }
    }
  }

  /**
   * processes the collected ASSESS events when END event is triggered
   */
  private processAssessEvents() {
    if (this._startEvent && this._endEvent && this.initialized) {
      const attpemtId = this.generateHash();
      const request = this.prepareRequestObject(attpemtId);
      this.updateAssessmentScore(request);
    }
  }

  /**
   * to make api call to server
   */
  private updateAssessmentScore(request) {
    const requestBody = request;
    const methodType = 'PATCH';
    return this.courseProgressService.updateAssessmentScore({ requestBody, methodType });
  }

  /**
   * generates md5 hash from four strings (courseId , batchId , contentId and userId)
   */
  private generateHash() {
    const hash = this._md5.appendStr(this._courseId)
      .appendStr(this._contentId)
      .appendStr(this._batchId)
      .appendStr(this._userId)
      .end();
    return hash;
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
            userId: this._userId,
            attemptId: attemptId,
            contentId: this._contentId,
            events: this._assessEvents
          }
        ]
      }
    };
    return request;
  }

}
