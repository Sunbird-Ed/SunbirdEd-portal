import { Subject } from 'rxjs';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { ToasterService } from '@sunbird/shared';
import { Component, OnInit, Renderer2, Inject, Output, OnDestroy, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
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

  @ViewChild('location') location;
  activeSlide: number;
  slides: string[] = ['slide-1', 'slide-2'];
  telemetryImpressionData: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  userLocation;
  continueLabel;
  disableContinueBtn = true;
  @Output() saveUserLocation = new Subject<void>();
  @Input() deviceId;
  showLoader = false;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private renderer: Renderer2,
    public toasterService: ToasterService, public activatedRoute: ActivatedRoute, public resourceService: ResourceService
  ) {
    this.activeSlide = 0;
    this.continueLabel = _.upperCase(this.resourceService.frmelmnts.lbl.continue);
  }

  ngOnInit() {
    this.activeSlide = 0;
    this.setTelemetryData();

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

  getLocationData(event) {
    this.userLocation = event.data;
    this.disableContinueBtn = event.enable;
  }

  saveUserData() {
    this.location.saveLocation(this.userLocation);
    this.location.locationSaved.subscribe(isSaved => {
      if (!this.disableContinueBtn) {
        this.activeSlide = this.activeSlide + 1;
        this.disableContinueBtn = !this.disableContinueBtn;
      }
    });
  }

  ngOnDestroy() {
    this.saveUserLocation.next();
    this.saveUserLocation.complete();
  }
}
