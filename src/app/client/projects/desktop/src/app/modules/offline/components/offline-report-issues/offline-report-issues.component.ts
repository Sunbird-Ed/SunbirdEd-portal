import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
@Component({
 selector: 'app-offline-report-issues',
 templateUrl: './offline-report-issues.component.html',
 styleUrls: ['./offline-report-issues.component.scss']
})
export class OfflineReportIssuesComponent implements OnInit {
 issueReportText = false;
 showNormalModal = false;
 descriptionCount: any;
 reportOtherissueForm: FormGroup;
 constructor(private formBuilder: FormBuilder) { }
 ngOnInit() {
   this.createReportOtherissueForm();
 }
 createReportOtherissueForm() {
   this.reportOtherissueForm = this.formBuilder.group({
     'email': ['', Validators.compose([Validators.required])],
     'description': ['', Validators.compose([Validators.required,])],
   }, {
     validator: (formControl) => {
       const emailControl = formControl.controls.email;
       const typedDescriptionCount = formControl.controls.description.value;
       this.descriptionCount = 1000 - typedDescriptionCount.length;
       if (_.trim(emailControl.value) === '') { emailControl.setErrors({ required: true }); }
     }
   });
   this.setValidators();
 }
 setValidators() {
   const emailControl = this.reportOtherissueForm.get('email');
   emailControl.setValidators([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]);
 }
 submitIssue() {
   this.issueReportText = !this.issueReportText;
 }
}
