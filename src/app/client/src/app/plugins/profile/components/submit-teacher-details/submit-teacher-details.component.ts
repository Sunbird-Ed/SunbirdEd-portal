import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ProfileService } from './../../services';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { UserService, FormService } from '@sunbird/core';

@Component({
  selector: 'app-submit-teacher-details',
  templateUrl: './submit-teacher-details.component.html',
  styleUrls: ['./submit-teacher-details.component.scss']
})
export class SubmitTeacherDetailsComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<any>();
  @Input() userProfile: any;
  @Input() formAction: string;
  @ViewChild('userDetailsModal') userDetailsModal;
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
  formData;
  showLoader = true;

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: FormBuilder,
    public userService: UserService, public formService: FormService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.getFormDetails();
  }

  getFormDetails() {
    const formServiceInputParams = {
      formType: 'user',
      formAction: this.formAction,
      contentType: 'teacherDetails',
      component: 'portal'
    };
    this.formService.getFormConfig(formServiceInputParams, this.userService.hashTagId).subscribe((formData) => {
      this.formData = formData;
      this.initializeFormFields();
    }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      this.closeModal();
    });
  }

  initializeFormFields() {
    const formGroupObj = {};
    for (const key of this.formData) {
      const validation = this.setValidations(key);
      if (key.visible) {
        formGroupObj[key.code] = new FormControl(null, validation);
      }
    }
    this.userDetailsForm = this.sbFormBuilder.group(formGroupObj);
    this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    this.getState();
    this.showLoader = false;
    this.onStateChange();
    this.enableSubmitButton();
    this.setInteractEventData();
  }

  setValidations(data) {
    const returnValue = [];
    if (_.get(data, 'required')) {
      returnValue.push(Validators.required);
    }
    _.forEach(_.get(data, 'validation'), (validationData) => {
      switch (validationData.type) {
        case 'min':
          returnValue.push(Validators.minLength(validationData.value));
          break;
        case 'max':
          returnValue.push(Validators.maxLength(validationData.value));
          break;
        case 'pattern':
          returnValue.push(Validators.pattern(validationData.value));
          break;
      }
    });
    return returnValue;
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
    console.log('this.userDetailsForm', this.userDetailsForm)
    this.stateControl = this.userDetailsForm.get('state');
    this.districtControl = this.userDetailsForm.get('district');
    this.enableSubmitBtn = false;
    const locationCodes = [];
    if (this.userDetailsForm.value.state) { locationCodes.push(this.userDetailsForm.value.state); }
    if (this.userDetailsForm.value.district) { locationCodes.push(this.userDetailsForm.value.district); }

    const externalIds = [];
    const provider = 'provider';
    const operation = this.formAction === 'submit' ? 'add' : 'edit';
    if (_.get(this.userDetailsForm, 'value.udiseId')) {
      externalIds.push({
        id: _.get(this.userDetailsForm, 'value.udiseId'),
        operation, idType: 'declared-school-udise-code', provider
      });
    }
    if (_.get(this.userDetailsForm, 'value.teacherId')) {
      externalIds.push({
        id: _.get(this.userDetailsForm, 'value.teacherId'),
        operation, idType: 'declared-ext-id', provider
      });
    }

    const data = {
      userId: this.userService.userid,
      locationCodes: locationCodes,
      externalIds
    };
    console.log('daad', JSON.stringify(data))
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

