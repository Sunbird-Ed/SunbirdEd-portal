import { Subject, of } from 'rxjs';
import { UserService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { takeUntil, skipWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssessmentScoreService {

  private _courseId: string;
  private _batchId: string;
  private _contentId: string;
  private _assessmentTs;
  private _startEvent;
  private _endEvent;
  private _assessEvents = [];
  private initialized: Boolean = false;

  constructor(private userService: UserService) { }

  telemetryEvents(event) {
    if (this.initialized) {
      const eventData = _.get(event, 'detail.telemetryData');
      const eid = _.get(eventData, 'eid');
      if (eventData && eid === 'START') {
        this._startEvent = event;
        this._assessmentTs = _.get(eventData, 'ets');
        this._assessEvents = [];
      } else if (eventData && eid === 'END') {
        this._endEvent = event;
        this.processAssessEvents(); 
      } else if (eventData && eid === 'ASSESS') {
        this._assessEvents.push(eventData);
      }
    }
  }

  set courseDetails({ courseId, batchId, contentId }) {
    if (courseId && batchId && contentId) {
      this._courseId = courseId;
      this._batchId = batchId;
      this._contentId = contentId;
      this.initialized = true;
      this._assessEvents = [];
    }
  }

  processAssessEvents() {
    // this.generateAttemptId();
    // this.prepareRequestObject();
    this.updateAssessmentScore();
  }

  updateAssessmentScore() {
    if (this.initialized && this._endEvent) {
      // make api call 
    }
  }

  generateAttemptId(){
    const hash = this.hashFunction();
  }

  private hashFunction(){
    // return hash(contentId , batchId , courseId , userId)
  }

  prepareRequestObject() {
    const request = {
      request: {
        contents: [],
        assessments: [
          {
            assessmentTs: this._assessmentTs,
            batchId: this._batchId,
            courseId: this._courseId,
            userId: this.userService.userid,
            attemptId: "24323",
            contentId: this._contentId,
            events: this._assessEvents
          }
        ]
      }
    }
  }

}
