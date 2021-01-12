import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ProfileService } from './../../services';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.scss']
})
export class UpdateUserDetailsComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<any>();
  @Input() userProfile: any;
  @ViewChild('userDetailsModal', {static: true}) userDetailsModal;
  allStates: any;
  allDistricts: any;
  userDetailsForm: FormGroup;
  sbFormBuilder: FormBuilder;
  enableSubmitBtn = false;
  showDistrictDivLoader = false;
  submitNameInteractEdata: IInteractEventEdata;
  submitStateInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  selectedState;
  selectedDistrict;
  stateControl: any;
  districtControl: any;
  forChanges = {
    prevStateValue: '',
    prevDistrictValue: ''
  };

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: FormBuilder,
    public userService: UserService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.initializeFormFields();
    this.getState();
  }

  initializeFormFields() {
    this.userDetailsForm = this.sbFormBuilder.group({
      name: new FormControl(this.userProfile.firstName, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      district: new FormControl(null, [Validators.required])
    }, {
        validator: (formControl) => {
          const nameCtrl = formControl.controls.name;
          if (_.trim(nameCtrl.value) === '') { nameCtrl.setErrors({ required: true }); }
          return null;
        }
      });
    this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    this.onStateChange();
    this.enableSubmitButton();
    this.setInteractEventData();
  }

  getState() {
    const requestData = { 'filters': { 'type': 'state' } };
    this.profileService.getUserLocation(requestData).subscribe(res => {
      this.allStates = res.result.response;
      const location = _.find(this.userProfile.userLocations, (locations) => {
        return locations.type === 'state';
      });
      let locationExist: any;
      if (location) {
        locationExist = _.find(this.allStates, (locations) => {
          this.forChanges.prevStateValue = location.code;
          return locations.code === location.code;
        });
      }
      this.selectedState = locationExist;
      locationExist ? this.userDetailsForm.controls['state'].setValue(locationExist.code) :
        this.userDetailsForm.controls['state'].setValue('');
    }, err => {
      this.closeModal();
      this.toasterService.error(this.resourceService.messages.emsg.m0016);
    });
  }

  enableSubmitButton() {
    this.userDetailsForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    });
  }

  onStateChange() {
    const stateControl = this.userDetailsForm.get('state');
    let stateValue = '';
    stateControl.valueChanges.subscribe(
      (data: string) => {
        if (stateControl.status === 'VALID' && stateValue !== stateControl.value) {
          const state = _.find(this.allStates, (states) => {
            return states.code === stateControl.value;
          });
          this.getDistrict(state.id);
          stateValue = stateControl.value;
        }
      });
  }

  getDistrict(stateId) {
    this.showDistrictDivLoader = true;
    const requestData = { 'filters': { 'type': 'district', parentId: stateId } };
    this.profileService.getUserLocation(requestData).subscribe(res => {
      this.allDistricts = res.result.response;
      this.showDistrictDivLoader = false;
      const location = _.find(this.userProfile.userLocations, (locations) => {
        return locations.type === 'district';
      });
      let locationExist: any;
      if (location) {
        locationExist = _.find(this.allDistricts, (locations) => {
          this.forChanges.prevDistrictValue = location.code;
          return locations.code === location.code;
        });
      }
      this.selectedDistrict = locationExist;
      locationExist ? this.userDetailsForm.controls['district'].setValue(locationExist.code) :
        this.userDetailsForm.controls['district'].setValue('');
    }, err => {
      this.closeModal();
      this.toasterService.error(this.resourceService.messages.emsg.m0017);
    });
  }

  onSubmitForm() {
    this.stateControl = this.userDetailsForm.get('state');
    this.districtControl = this.userDetailsForm.get('district');
    this.enableSubmitBtn = false;
    if ((this.forChanges.prevDistrictValue !== this.districtControl.value)
        || (this.forChanges.prevStateValue !== this.stateControl.value)) {
      document.getElementById('stateModifiedButton').click();
    }
    if (_.trim(this.userDetailsForm.value.name) !== this.userProfile.firstName) {
      document.getElementById('nameModifiedButton').click();
    }
    const locationCodes = [];
    if (this.userDetailsForm.value.state) { locationCodes.push(this.userDetailsForm.value.state); }
    if (this.userDetailsForm.value.district) { locationCodes.push(this.userDetailsForm.value.district); }
    const data = { firstName: _.trim(this.userDetailsForm.value.name), locationCodes: locationCodes };
    this.updateProfile(data);
  }

  updateProfile(data) {
    this.profileService.updateProfile(data).subscribe(res => {
      this.closeModal();
      this.toasterService.success(this.resourceService.messages.smsg.m0046);
    }, err => {
      this.closeModal();
      this.toasterService.error(this.resourceService.messages.emsg.m0018);
    });
  }

  closeModal() {
    this.userDetailsModal.deny();
    this.close.emit();
  }

  setInteractEventData() {
    this.submitNameInteractEdata = {
      id: 'submit-personal-details',
      type: 'click',
      pageid: 'profile-read'
    };
    this.submitStateInteractEdata = {
      id: 'profile-edit-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
  }

  ngOnDestroy() {
    this.userDetailsModal.deny();
  }
}
