
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IFeedbackEdata, IFeedbackObject, IFeedbackEventInput } from '@sunbird/telemetry';
import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import { ActivatedRoute } from '@angular/router';
import { ResourceService } from './../../services/resource/resource.service';

@Component({
  selector: 'app-content-rating',
  templateUrl: './content-rating.component.html',
  styleUrls: ['./content-rating.component.scss']
})
export class ContentRatingComponent {

  feedbackEdata: IFeedbackEdata;
  @Input() feedbackObject: IFeedbackObject;
  submitClicked: false;
  rating: number;
  comments: string;
  @Output('close')
  close = new EventEmitter<any>();
  appTelemetryFeedbackInput: IFeedbackEventInput;
  public telemetryService: TelemetryService;

  constructor(telemetryService: TelemetryService, private activatedRoute: ActivatedRoute, private resourceService: ResourceService) {
    this.telemetryService = telemetryService;
  }

  setFeedbackData() {
    this.feedbackEdata = {
      rating: this.rating,
      comments: this.comments,
    };
    console.log('rating feedback', this.rating, this.comments);
    this.generateFeedbackTelemetry();
  }

  generateFeedbackTelemetry() {
    if (this.feedbackEdata) {
      this.appTelemetryFeedbackInput = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        object: this.feedbackObject,
        edata: this.feedbackEdata
      };
      this.telemetryService.feedback(this.appTelemetryFeedbackInput);
    }
  }
  /**
* popDenys
*/
  popDeny(pop) {
    pop.close();
  }
  sendFeedback(contentFeedbackModal, submitClicked) {
    if (submitClicked) {
      this.setFeedbackData();
    }
    this.closeModal(contentFeedbackModal);
  }
  closeModal(contentFeedbackModal) {
    contentFeedbackModal.deny();
    this.close.emit();
  }
}
