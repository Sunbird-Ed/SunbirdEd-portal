import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResourceService, ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-signup-onboarding-info',
  templateUrl: './signup-onboarding-info.component.html',
  styleUrls: ['./signup-onboarding-info.component.scss']
})
export class SignupOnboardingInfoComponent implements OnInit {

  @Input() startingForm: FormGroup;
  @Output() subformInitialized: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() triggerNext = new EventEmitter();
  showEditUserDetailsPopup = false;
  showFullScreenLoader = false;
  constructor(public resourceService: ResourceService, public toasterService: ToasterService) { }

  ngOnInit(): void {
  }

  onRegisterSubmit(event) {
    console.log('user registration submit ', event); //TODO
    this.triggerNext.emit();
  }
}
