import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { ToasterService } from '@sunbird/shared';
import { Component, OnInit, Output, OnDestroy, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit, OnDestroy {

  @Output() onboardCompletion = new EventEmitter();
  slide = 'location';
  telemetryImpressionData: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  constructor(private router: Router, public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute, public resourceService: ResourceService) {
  }

  ngOnInit() {
    this.setTelemetryData();
  }
  handleLocationSaveEvent() {
    this.slide = 'contentPreference';
  }
  handleContentPreferenceSaveEvent() {
    this.onboardCompletion.emit('SUCCUSS');
  }
  setTelemetryData() {
    this.telemetryImpressionData = {
      context: { env: 'onboarding' },
      edata: {
        type: 'view',
        pageid: 'onboarding_location_setting',
        uri: this.router.url
      }
    };
    this.telemetryInteractEdata = {
      id: 'onboarding_location',
      type: 'click',
      pageid: 'onboarding_location_setting'
    };
  }

  ngOnDestroy() {

  }
}
