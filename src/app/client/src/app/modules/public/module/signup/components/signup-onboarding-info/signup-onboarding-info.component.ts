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

  onRegisterSubmit(event) {
    console.log('user registration submit ', event);
  }
}
