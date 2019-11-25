import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { ToasterService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { OnboardingService } from './../../services';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  slide = 'location';
  constructor(public toasterService: ToasterService, public onboardingService: OnboardingService) {
  }
  ngOnInit() {
    document.body.classList.add('o-y-hidden');
  }
  handleLocationSaveEvent(event) {
    if (event === 'SUCCESS') {
    this.slide = 'contentPreference';
    }
  }
  handleContentPreferenceSaveEvent() {
    document.body.classList.remove('o-y-hidden');
    this.onboardingService.onboardCompletion.emit('SUCCESS');
  }
}
