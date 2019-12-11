import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { OnboardingService } from '../../../offline/services/onboarding/onboarding.service';
import * as _ from 'lodash-es';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {
  @ViewChild('modal') modal;
  selectedState: any;
  selectedDistrict: any;
  stateList = [];
  districtList = [];
  @Output() dismissed = new EventEmitter<any>();
  @Input() userLocationData;
  constructor(
    public userService: OnboardingService,
    public resourceService: ResourceService,
  ) { }
  ngOnInit() {
    this.getAllStates();
  }
  closeModal(status) {
    this.modal.deny();
    this.dismissed.emit(status);
  }

  getAllStates() {
    this.userService.searchLocation({ type: 'state' })
      .subscribe(data => {
        this.stateList = _.get(data, 'result.response');
      });
  }

  onStateChanges(option) {
    this.userService.searchLocation({ type: 'district', parentId: option.id })
      .subscribe(data => {
        this.districtList = _.get(data, 'result.response');
      });
  }
  updateUserLocation() {
    const requestParams = {
      request: {
        state: this.selectedState,
        city: this.selectedDistrict
      }
    };
    this.userService.saveLocation(requestParams).subscribe(() => {
      this.closeModal('SUCCESS');

    }, error => {
      this.closeModal('ERROR');
    });
  }
}
