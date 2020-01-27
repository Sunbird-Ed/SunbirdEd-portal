import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';


import { OfflineReportIssuesService } from '../../services/offline-report-issues/offline-report-issues.service';
@Component({
  selector: 'app-offline-report-issues',
  templateUrl: './offline-report-issues.component.html',
  styleUrls: ['./offline-report-issues.component.scss']
})
export class OfflineReportIssuesComponent implements OnInit {
  issueReportedSuccessfully = false;
  openReportIssueModal = false;
  isDisplayLoader = false;
  descriptionCount: any;
  instance: string;
  reportOtherissueForm: FormGroup;
  raiseSupportTicketInteractEdata: IInteractEventEdata;
  onClickReportOtherIssueInteractEdata: IInteractEventEdata;
  constructor(
    private formBuilder: FormBuilder,
    public offlineReportIssuesService: OfflineReportIssuesService,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }
  ngOnInit() {
    this.createReportOtherissueForm();
    this.instance = _.upperCase(this.resourceService.instance);
    this.setTelemetryData();
  }
  createReportOtherissueForm() {
    this.reportOtherissueForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required])],
      'description': ['', Validators.compose([Validators.required])],
    }, {
      validator: (formControl) => {
        const emailControl = formControl.controls.email;
        let typedDescriptionCount = formControl.controls.description.value;
        typedDescriptionCount = typedDescriptionCount.trim();
        this.descriptionCount = 1000 - (typedDescriptionCount.length);
        if (_.trim(emailControl.value) === '') { emailControl.setErrors({ required: true }); }
      }
    });
    this.setValidators();
  }
  setValidators() {
    const emailControl = this.reportOtherissueForm.get('email');
    const descriptionControl = this.reportOtherissueForm.get('description');
    // tslint:disable-next-line: max-line-length
    emailControl.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
    descriptionControl.setValidators([Validators.required, Validators.pattern(/^[^\s]+([-a-zA-Z0-9 ])*$/)]);
  }

  openModal() {
    this.openReportIssueModal = !this.openReportIssueModal;
    this.issueReportedSuccessfully = false;
    this.createReportOtherissueForm();
  }
  submitIssue() {
    this.isDisplayLoader = true;
    this.offlineReportIssuesService.reportOtherIssue(this.reportOtherissueForm.getRawValue()).subscribe(result => {
      this.isDisplayLoader = false;
      this.issueReportedSuccessfully = !this.issueReportedSuccessfully;
    }, (error) => {
      this.isDisplayLoader = false;
      if (error['error']['params']['err'] === 'NETWORK_UNAVAILABLE') {
        this.toasterService.error(this.resourceService.messages.emsg.m0023);
      } else {
        this.toasterService.error(this.resourceService.frmelmnts.lbl.errorWhileGeneratingTicket);
      }
    });
  }
  setTelemetryData() {
    this.raiseSupportTicketInteractEdata = {
      id: 'submit_issue',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid

    };
    this.onClickReportOtherIssueInteractEdata = {
      id: 'report_other_issue',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
}
