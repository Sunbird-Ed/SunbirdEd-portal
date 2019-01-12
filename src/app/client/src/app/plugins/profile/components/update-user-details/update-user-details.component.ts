import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { ProfileService } from './../../services';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.scss']
})
export class UpdateUserDetailsComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<any>();
  @Input() userProfile: any;
  @ViewChild('userDetailsModal') userDetailsModal;
  allStates: any;
  allDistricts: any;
  userDetailsForm: FormGroup;
  sbFormBuilder: FormBuilder;
  enableSubmitBtn = false;
  showDistricDivLoader = false;
  districtLoaderMessage = {
    'loaderMessage': this.resourceService.messages.stmsg.m0130,
  };

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: FormBuilder) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.initializeFormFields();
    this.getState();
  }

  initializeFormFields() {
    this.userDetailsForm = this.sbFormBuilder.group({
      name: new FormControl(this.userProfile.firstName, [Validators.required]),
      state: new FormControl(null),
      district: new FormControl(null)
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
  }

  getState() {
    const requestData = { 'filters': { 'type': 'state' } };
    this.profileService.getUserLocation(requestData).subscribe(res => {
      this.allStates = res.result.response;
      // this.userDetailsForm.controls['state'].setValue(this.allStates[4].id);
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
          this.getDistrict(stateControl.value);
          stateValue = stateControl.value;
        }
      });
  }

  getDistrict(stateId) {
    this.showDistricDivLoader = true;
    const requestData = { 'filters': { 'type': 'district', parentId: stateId } };
    this.profileService.getUserLocation(requestData).subscribe(res => {
      this.allDistricts = res.result.response;
      this.showDistricDivLoader = false;
      // this.userDetailsForm.controls['district'].setValue(this.allDistricts[4].id);
    }, err => {
      this.closeModal();
      this.toasterService.error(this.resourceService.messages.emsg.m0017);
    });
  }

  onSubmitForm() {
    console.log(this.userDetailsForm);
    const data = { firstName: this.userDetailsForm.value.name };
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

  ngOnDestroy() {
  }

}
