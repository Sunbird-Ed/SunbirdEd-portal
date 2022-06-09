import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-signup-onboarding-info',
  templateUrl: './signup-onboarding-info.component.html',
  styleUrls: ['./signup-onboarding-info.component.scss']
})
export class SignupOnboardingInfoComponent implements OnInit {

  @Output() triggerNext = new EventEmitter();
  showEditUserDetailsPopup = false;
  showFullScreenLoader = false;
  constructor(public resourceService: ResourceService, public toasterService: ToasterService) { }

  ngOnInit(): void {
  }

  next() {
    this.triggerNext.emit();
  }

  public onLocationModalClose(event) {
    this.showEditUserDetailsPopup = !this.showEditUserDetailsPopup;
    this.showFullScreenLoader = !event?.isSubmitted ? false : true;
    setTimeout(() => {
      if (this.showFullScreenLoader) {
        this.showFullScreenLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    }, 5000);
  }

  onRegisterSubmit(event) {
    console.log('user registration submit ', event);
  }
}
