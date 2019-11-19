import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { ResourceService, } from '@sunbird/shared';


import { OfflineReportIssuesService } from '../../services/offline-report-issues/offline-report-issues.service';
@Component({
  selector: 'app-offline-report-issues',
  templateUrl: './offline-report-issues.component.html',
  styleUrls: ['./offline-report-issues.component.scss']
})
export class OfflineReportIssuesComponent implements OnInit {
  issueReportedSuccessfully = false;
  openReportIssueModal = false;
  descriptionCount: any;
  instance: string;
  reportOtherissueForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private offlineReportIssuesService: OfflineReportIssuesService,
    public resourceService: ResourceService,
  ) { }
  ngOnInit() {
    this.createReportOtherissueForm();
    this.instance = _.upperCase(this.resourceService.instance);
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
    emailControl.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
    descriptionControl.setValidators([Validators.required, Validators.pattern(/^[^\s]+([-a-zA-Z0-9 ])*$/)]);
  }

  openModal() {
    this.openReportIssueModal = !this.openReportIssueModal;
    this.issueReportedSuccessfully = false;
  }
  submitIssue() {
    this.createReportOtherissueForm();
    this.issueReportedSuccessfully = !this.issueReportedSuccessfully;

  }
}
