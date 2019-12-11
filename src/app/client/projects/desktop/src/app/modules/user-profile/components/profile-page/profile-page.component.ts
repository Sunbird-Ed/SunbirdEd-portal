import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  locationComponent: any;
  userData: any;
  @Output() userLocationData = new EventEmitter<any>();

  constructor(
    public userService: OnboardingService,
    public resourceService: ResourceService,
  ) { }
  ngOnInit() {
    this.getUserDate();
  }
  getUserDate() {
    this.userService.getUser().subscribe(result => {
      this.userData = result;
    });
  }

  openModal(componentName) {
    this.locationComponent = componentName;
  }
  handleDismissEvent(eventStatus) {
    this.locationComponent = '';
    if (eventStatus === 'SUCCESS') {
      this.getUserDate();
    }
  }
}
