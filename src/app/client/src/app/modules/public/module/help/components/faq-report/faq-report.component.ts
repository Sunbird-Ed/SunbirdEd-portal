import { Component, Input, OnInit } from "@angular/core";
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ProfileService } from '@sunbird/profile';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import * as _ from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-faq-report',
  templateUrl: './faq-report.component.html',
  styleUrls: ['./faq-report.component.scss']
})
export class FaqReportComponent implements OnInit {

  @Input() faqData;
  faqReportConfig;
  unsubscribe = new Subject<void>();
  formValues: any;
  formStatus: any;

  constructor(
    private resourceService: ResourceService,
    private toasterService: ToasterService,
    private profileService: ProfileService,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    this.fetchFaqReportConfig();
  }

  fetchFaqReportConfig() {
    // FormAPI call    
    this.profileService.getFaqReportIssueForm().pipe(takeUntil(this.unsubscribe)).subscribe(formConfig => {
      this.faqReportConfig = formConfig;
    }, error => {
      console.error('Unable to fetch form', error);
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    });
  }

  valueChanged(event) {
    this.formValues = event;
  }

  statusChanged(event) {
    this.formStatus = event;
  }

  faqReportSubmit() {
    if (!this.formStatus || !this.formStatus.isValid) {
      return false;
    }

    const params = [];
    for (const [key, value] of this.formValues) {
      if (key === 'children') {
        for (const [childKey, childValue] of this.formValues[key]) {
          params.push({childKey: childValue});
        }    
      } else {
        params.push({key: value});
      }
    }

    const event = {
      context: {
        env: 'portal'
      },
      edata: {
        id: 'faq',
        type: 'system',
        level: "INFO",
        message: "faq",
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        params
      }
    };
    this.telemetryService.log(event);

    this.toasterService.custom({
      message: this.faqData && this.faqData.constants && this.faqData.constants.thanksForFeedbackMsg,
      class: 'sb-toaster sb-toast-success sb-toast-normal'
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
