import { CourseProgressService } from '../courseProgress/course-progress.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import * as Md5 from 'md5';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
@Injectable()
export class AssessmentScoreService {
  /***
   * course details
   */
  private _batchDetails: any;
  private _courseDetails: any;
  private _contentDetails: any;

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
  private _userId: string;

  constructor(private courseProgressService: CourseProgressService) {
  }

  /**
   * initilize the assessment service
   */
  init({ batchDetails, courseDetails, contentDetails }) {
    this._batchDetails = batchDetails;
    this._courseDetails = courseDetails;
    this._contentDetails = contentDetails;
    this.checkContentForAssessment();
  }

  /**
   * public method which will receive telemetry events
   */
  receiveTelemetryEvents(event) {
    if (!this.initialized) {
      return;
    }
    this.processTelemetryEvents(event);
  }

  /**
   * process the telemetry Events
   */
  private processTelemetryEvents(event) {
    const eventData = _.get(event, 'detail.telemetryData');
    const eid = _.get(eventData, 'eid');
    if (eventData && eid === 'START') {
      this._startEvent = eventData;
      this._assessmentTs = _.get(eventData, 'ets');
      this._userId = _.get(eventData, 'actor.id');
      this._assessEvents = [];
    } else if (eventData && eid === 'ASSESS') {
      this._assessEvents.push(eventData);
    } else if (eventData && eid === 'END') {
      this._endEvent = eventData;
      // this.processAssessEvents();
    }
  }

  /**
   * checks if the course has assessment or not
   */
  private checkContentForAssessment() {
    if (_.get(this._batchDetails, 'batchId') && _.get(this._contentDetails, 'identifier') && _.get(this._batchDetails, 'courseId')) {
      if (this._contentDetails && _.get(this._contentDetails, 'contentType') === 'SelfAssess') {
        this.initialized = true;
      } else {
        this.initialized = false;
      }
    }
  }

  /**
   * processes the collected ASSESS events when END event is triggered
   */
  private processAssessEvents() {
    if (this.initialized) {
      const attpemtId = this.generateHash();
      const request = this.prepareRequestObject(attpemtId);
      this.updateAssessmentScore(request)
        .pipe(
          finalize(() => {
            this._assessEvents = [];
            this._startEvent = undefined;
            this._endEvent = undefined;
          })
        )
        .subscribe();
    }
  }

  /**
   * to make api call to server
   */
  private updateAssessmentScore(request) {
    const requestBody = request;
    const methodType = 'PATCH';
    return this.courseProgressService.sendAssessment({ requestBody, methodType });
  }

  /**
   * generates UUID for attemptId
   */
  private generateHash() {
    const string = _.join([_.get(this._batchDetails, 'courseId'), _.get(this._batchDetails, 'batchId'),
    _.get(this._contentDetails, 'identifier'),
    this._userId, (new Date()).getTime()], '-');
    const hash = Md5(string);
    return hash;
  }

  /**
   * prepares the request body to call the assessment score api
   */
  private prepareRequestObject(attemptId: string) {
    const request = {
      request: {
        userId: this._userId,
        contents: [{
          contentId: (_.get(this._contentDetails, 'identifier')),
          batchId: _.get(this._batchDetails, 'batchId'),
          status: 2, // because eid is END
          courseId: _.get(this._batchDetails, 'courseId'),
          lastAccessTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ')

        }],
        assessments: [
          {
            assessmentTs: this._assessmentTs,
            batchId: _.get(this._batchDetails, 'batchId'),
            courseId: _.get(this._batchDetails, 'courseId'),
            userId: this._userId,
            attemptId: attemptId,
            contentId: (_.get(this._contentDetails, 'identifier')),
            events: this._assessEvents
          }
        ]
      }
    };
    return request;
  }

  /**
   * handles submit button clicked in course player
   */
  handleSubmitButtonClickEvent(clicked: Boolean) {
    if (clicked && this._startEvent && this.initialized) {
      this.processAssessEvents();
    }
  }
}
