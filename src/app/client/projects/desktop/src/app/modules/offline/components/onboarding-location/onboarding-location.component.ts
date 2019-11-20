import { takeUntil } from 'rxjs/operators';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnboardingService } from './../../services';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-onboarding-location',
  templateUrl: './onboarding-location.component.html',
  styleUrls: ['./onboarding-location.component.scss']
})
export class OnboardingLocationComponent implements OnInit {
  @Input() selectState;
  @Input() selectDistrict;
  allStates = [];
  allDistricts = [];
  @Output() selectedLocation = new EventEmitter();
  disableContinueBtn = true;
  telemetryImpressionData: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  continueLabel;
  @Input() userLocationData;
  constructor(public onboardingService: OnboardingService, public activatedRoute: ActivatedRoute, private router: Router,
    public resourceService: ResourceService) { }

  ngOnInit() {
    this.getAllStates();
    this.saveLocation();
  }

  onOptionChanges(option) {
    if (option.type === 'state') {
      this.getAllDistricts(option.id);
    }
    this.enableContinueButton();
  }

  getAllStates() {
    const requestData = { request: { filters: { type: 'state' } } };
    this.onboardingService.getUserLocation(requestData).subscribe(data => {
      this.allStates = _.get(data, 'result.response');
    });
  }

  getAllDistricts(parentId) {
    const requestData = { request: { filters: { type: 'district', parentId: parentId } } };
    this.onboardingService.getUserLocation(requestData).subscribe(data => {
      this.allDistricts = _.get(data, 'result.response');
    });
  }

  enableContinueButton() {
    setTimeout(() => {
      this.disableContinueBtn = _.isEmpty(this.allDistricts);
      const locationData = {
        type: 'location',
        data: {
          state: this.selectState,
          district: this.selectDistrict
        }
      };
      if (this.disableContinueBtn) { this.selectedLocation.emit(locationData); }
    }, 500);
  }
saveLocation() {
  this.userLocationData.subscribe(data => {
    console.log('userLocationData', data);
});
}
}
