import {
  Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-content-rating',
  templateUrl: './content-rating.component.html',
  styleUrls: ['./content-rating.component.scss']
})
export class ContentRatingComponent implements OnInit, OnDestroy {
  /**
  *Output for Sharelink;
  */
  @ViewChild('modal') modal;
  @Input() contentData?: any;
  public showContentRatingModal = true;
  public resourceService: ResourceService;
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  private telemetryService: TelemetryService;
    /**
   * To get url params
   */
  public activatedRoute: ActivatedRoute;
  contentRating: number;
  enableSubmitBtn: boolean;
  @Output() closeModal = new EventEmitter();
  /**
  * Constructor to create injected service(s) object
  *Default method of unpublished Component class
  *@param {ResourceService} SearchService Reference of SearchService
  */
  constructor(resourceService: ResourceService, toasterService: ToasterService,
    telemetryService: TelemetryService ,  activatedRoute: ActivatedRoute) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.telemetryService = telemetryService;
    this.activatedRoute = activatedRoute;
  }

  ngOnInit() {
  }
  ratingChange(event) {
    this.contentRating = event;
    this.enableSubmitBtn = true;
  }
  public submit() {
    if (this.contentRating) {
      const feedbackTelemetry = {
        context: {
          env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env')
        },
        object: {
          id: _.get(this.activatedRoute.snapshot.params, 'contentId') ||  _.get(this.activatedRoute.snapshot.params, 'collectionId') ||
          _.get(this.activatedRoute.snapshot.params, 'courseId'),
          type: _.get(this.contentData , 'contentType'),
          ver: this.contentData ? _.get(this.contentData , 'pkgVersion').toString() : '1.0'
        },
        edata: {
          rating: this.contentRating
        }
      };
      this.telemetryService.feedback(feedbackTelemetry);
      this.toasterService.success(this.resourceService.messages.smsg.m0050);
    }
    this.showContentRatingModal = false;
    this.closeModal.emit(true);
  }

  dismissModal() {
    this.showContentRatingModal = false;
    this.closeModal.emit(true);
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
