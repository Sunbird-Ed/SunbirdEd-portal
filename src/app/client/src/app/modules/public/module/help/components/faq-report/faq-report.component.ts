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
      this.formStatus = undefined;
      this.faqReportConfig = formConfig;
    }, error => {
      console.error('Unable to fetch form', error);
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    });
  }

  valueChanged(event) {
    this.formValues = event;
    if (!(_.get(this.faqReportConfig, '1.templateOptions'))) {
      return;
    }
    if (event.category === 'otherissues') {
      this.faqReportConfig[1].templateOptions.hidden = true;
    } else {
      this.faqReportConfig[1].templateOptions.hidden = false;
    }
  }

  statusChanged(event) {
    this.formStatus = event;
  }

  faqReportSubmit() {
    if (!this.formStatus || !this.formStatus.isValid) {
      return false;
    }

    const params = [];
    for (const [key, value] of Object.entries(this.formValues)) {
      if (key === 'children') {
        for (const [childKey, childValue] of this.formValues[key]) {
          params.push({[childKey]: childValue});
        }
      } else {
        params.push({[key]: value});
      }
    }

    const telemetryContextObj = { env: 'portal', cdata: []};
    const edata = { type: 'system', pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') };

    const interactEvent = { context: telemetryContextObj, edata: { id: 'submit-clicked', ...edata, type: 'support' } }
    const logEvent = {
      context: telemetryContextObj,
      edata: {
        level: "INFO",
        message: "faq",
        params,
        ...edata
      }
    };

    this.telemetryService.log(logEvent);
    this.telemetryService.interact(interactEvent);
    const message: string = _.get(this.faqData, 'constants.thanksForFeedbackMsg');
    this.toasterService.custom({
      message: message.replace('{{app_name}}', _.get(this.resourceService, 'instance')),
      class: 'sb-toaster sb-toast-success sb-toast-normal'
    });
    this.faqReportConfig = undefined;
    this.fetchFaqReportConfig()
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
