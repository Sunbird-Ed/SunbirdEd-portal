import { Subject } from 'rxjs';
import { OnboardingService } from './../../services';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { ToasterService } from '@sunbird/shared';
import { Component, OnInit, Renderer2, Inject, Output, EventEmitter, OnDestroy } from '@angular/core';
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

  activeSlide: number;
  slides: string[] = ['slide-1', 'slide-2'];
  telemetryImpressionData: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  userLocation;
  continueLabel;
  disableContinueBtn = true;
  @Output() saveUserLocation = new Subject<void>();
  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private renderer: Renderer2,
    public toasterService: ToasterService, public activatedRoute: ActivatedRoute,
    public onboardingService: OnboardingService, public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.continueLabel = _.upperCase(this.resourceService.frmelmnts.lbl.continue);
    this.activeSlide = 0;
    this.setTelemetryData();
  }

  setTelemetryData() {
    this.telemetryImpressionData = {
      context: { env: 'offline' },
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
  getLocationData(event) {
    this.userLocation = event.data;
    this.disableContinueBtn = !this.disableContinueBtn;
  }

  saveUserData() {
    this.saveUserLocation.next(this.userLocation);
  }

  ngOnDestroy() {
    this.saveUserLocation.next();
    this.saveUserLocation.complete();
  }

}
