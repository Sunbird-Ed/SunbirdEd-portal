import { Component, Input, OnInit } from "@angular/core";
import { FaqReportData } from './faq-report-data';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ProfileService } from '@sunbird/profile';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import * as _ from 'lodash-es';

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
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public profileService: ProfileService
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
    
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
