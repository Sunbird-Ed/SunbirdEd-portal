import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';
import { ProfileService } from '@sunbird/profile';
@Component({
  selector: 'app-signup-onboarding-info',
  templateUrl: './signup-onboarding-info.component.html',
  styleUrls: ['./signup-onboarding-info.component.scss', '../signup/signup_form.component.scss']
})
export class SignupOnboardingInfoComponent implements OnInit {

  @Input() startingForm: object;
  @Output() subformInitialized: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() triggerNext: EventEmitter<boolean> = new EventEmitter<boolean>();
  showEditUserDetailsPopup = false;
  showFullScreenLoader = false;
  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public router: Router, private profileService: ProfileService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.sbformDOMManipulation();
    }, 500);
  }

  sbformDOMManipulation() {
    let formElement = document.getElementsByTagName('sb-form')[0];
    if (formElement) {
      let roleElement = formElement.getElementsByClassName('cfe-multiselect-container')[0];
      if (roleElement) {
        roleElement.classList.add('hide');
      }
    }
  }
  onRegisterSubmit(event) {
    // If user is minor and login mode is gmail, then continue accepting email / phone for verification
    if (_.get(this.startingForm, 'basicInfo.isMinor') && _.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      this.subformInitialized.emit(event);
      this.triggerNext.emit();
    } else if (!_.get(this.startingForm, 'basicInfo.isMinor') && _.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      // If user is not minor and login mode is gmail, then update basic info and redirect to resources page
      this.updateUserDetails();
    } else {
      this.subformInitialized.emit(event);
      this.triggerNext.emit();
    }
  }

  /**
   * @description This method is used to update user details and redirect user to resources page
   * If user is not minor and login mode is gmail, then update basic info and redirect to resources page
   * @since 4.10.1
   */
  updateUserDetails() {
    const req = {
      'firstName': _.trim(_.get(this.startingForm, 'basicInfo.name')),
      'dob': _.get(this.startingForm, 'basicInfo.yearOfBirth').toString(),
    };
    this.profileService.updateProfile(req).subscribe(res => {
      if (_.get(res, 'result.response') === 'SUCCESS') {
        this.toasterService.success(this.resourceService?.messages?.smsg?.m0046);
        setTimeout(() => {
          this.router.navigate(['/resources']);
        }, 1000);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0085);
      }
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    });
  }

  onSbFormValueChange(event) {
    this.sbformDOMManipulation();
  }
}
