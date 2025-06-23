import {
  Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '@sunbird/core';
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
  public startext = '';
  public feedbackText = '';
  public feedbackObj;
  public showTextarea = false;
  public showContentRatingModal = true;
  public resourceService: ResourceService;
  public direction: string = "ltr";
  public rtlLanguages = ["ar"]
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
  constructor(resourceService: ResourceService, toasterService: ToasterService, public formService: FormService,
    telemetryService: TelemetryService ,  activatedRoute: ActivatedRoute) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.telemetryService = telemetryService;
    this.activatedRoute = activatedRoute;
  }

  ngOnInit() {
    this.resourceService.languageSelected$.subscribe(item => {
      this.startext = _.get(this.resourceService, 'frmelmnts.lbl.defaultstar');
      const formReadInputParams = {
        formType: 'contentfeedback',
        contentType: item.value,
        formAction: 'get'
      };      
      this.direction = (!item.language || this.rtlLanguages.includes(item.language)) ? "ltr" : "rtl";
      this.formService.getFormConfig(formReadInputParams).subscribe(
        (formResponsedata) => {
          this.feedbackObj = formResponsedata[0];
        }, (error) => {
          this.feedbackObj = { };
        });
    });
  }

  ratingChange(event) {
    this.contentRating = event;
    this.startext = this.feedbackObj[event]['ratingText'];
    this.enableSubmitBtn = true;
    this.showTextarea = false;
    _.forEach(this.feedbackObj[this.contentRating]['options'], (feedback) => {
      feedback['checked'] = false;
    });
  }

  public changeOptions(options) {
    if (options['key'] === 'OTHER' && !this.showTextarea) {
      this.showTextarea = true;
    } else if (options['key'] === 'OTHER' && this.showTextarea) {
      this.showTextarea = false;
    }
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
          ver: _.get(this.contentData , 'pkgVersion') ? _.get(this.contentData , 'pkgVersion').toString() : '1.0'
        },
        edata: { }
      };
      _.forEach(this.feedbackObj[this.contentRating]['options'], (feedback) => {
        if (feedback['checked']) {
          const feedbackTelemetryClone = _.clone(feedbackTelemetry);
          feedbackTelemetryClone['edata'] = { };
          feedbackTelemetryClone['edata']['commentid'] = feedback['key'];
          if (feedback['key'] === 'OTHER') {
            feedbackTelemetryClone['edata']['commenttxt'] = this.feedbackText;
          } else {
            feedbackTelemetryClone['edata']['commenttxt'] = feedback['value'];
          }
          this.telemetryService.feedback(feedbackTelemetryClone);
        }
      });
      feedbackTelemetry['edata'] = {
        rating: this.contentRating
      };
      this.telemetryService.feedback(feedbackTelemetry);
      this.toasterService.success(this.resourceService.messages.smsg.m0050);
    }
    this.startext = this.resourceService.frmelmnts.lbl.defaultstar;
    this.enableSubmitBtn = false;
    this.showContentRatingModal = false;
    this.closeModal.emit(true);
  }

  dismissModal() {
    this.startext = this.resourceService.frmelmnts.lbl.defaultstar;
    this.enableSubmitBtn = false;
    this.showContentRatingModal = false;
    this.closeModal.emit(true);
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
