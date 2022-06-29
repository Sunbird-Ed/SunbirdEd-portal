import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResourceService, ToasterService } from '@sunbird/shared';
import _ from 'lodash';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup-onboarding-info',
  templateUrl: './signup-onboarding-info.component.html',
  styleUrls: ['./signup-onboarding-info.component.scss' , '../signup/signup_form.component.scss']
})
export class SignupOnboardingInfoComponent implements OnInit {

  @Input() startingForm: object;
  @Output() subformInitialized: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() triggerNext: EventEmitter<boolean> = new EventEmitter<boolean>();
  showEditUserDetailsPopup = false;
  showFullScreenLoader = false;
  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public router: Router) { }

  ngOnInit(): void {
    console.log('Global Object data => ', this.startingForm); // TODO: log!
  }

  onRegisterSubmit(event) {
    if (_.get(this.startingForm, 'basicInfo.isMinor') && _.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      this.subformInitialized.emit(event);
      this.triggerNext.emit();
    } else if (!_.get(this.startingForm, 'basicInfo.isMinor') && _.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      this.router.navigate(['/resources']);
      // TODO - update basic info
    } else {
      this.subformInitialized.emit(event);
      this.triggerNext.emit();
    }
  }
}
