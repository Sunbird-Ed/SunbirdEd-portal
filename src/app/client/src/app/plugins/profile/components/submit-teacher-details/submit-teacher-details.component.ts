import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import {IUserData, ResourceService, ToasterService} from '@sunbird/shared';
import { ProfileService } from './../../services';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import {ActivatedRoute, Router} from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { UserService, FormService, SearchService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-submit-teacher-details',
  templateUrl: './submit-teacher-details.component.html',
  styleUrls: ['./submit-teacher-details.component.scss']
})
export class SubmitTeacherDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal;
  showSuccessModal = false;
  userProfile: any;
  formAction: string;
  public unsubscribe = new Subject<void>();
  allStates: any;
  allDistricts: any;
  userDetailsForm: FormGroup;
  sbFormBuilder: FormBuilder;
  enableSubmitBtn = false;
  showDistrictDivLoader = false;
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
  submitInteractEdata: IInteractEventEdata;
  cancelInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  pageId = 'profile-read';
  udiseObj;
  teacherObj;
  schoolObj;
  userSubscription: Subscription;

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: FormBuilder,
    public userService: UserService, public formService: FormService, public router: Router,
    public searchService: SearchService, private activatedRoute: ActivatedRoute) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.formAction = queryParams.formaction;
    this.userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
      if (user.userProfile) {
        this.userProfile = user.userProfile;
        this.setFormDetails();
      }
    });
    this.setTelemetryData();
  }

  setTelemetryData() {
    this.submitInteractEdata = {
      id: 'submit-teacher-details',
      type: 'click',
      pageid: this.pageId
    };
    this.cancelInteractEdata = {
      id: `cancel-${this.formAction}-teacher-details`,
      type: 'click',
      pageid: this.pageId
    };
  }

  setFormDetails() {
    this.getFormDetails().subscribe((formData) => {
      this.formData = formData;
      this.initializeFormFields();
    }, (err) => {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      this.closeModal();
    });
  }

  getFormDetails(id?: string) {
    const formServiceInputParams = {
      formType: 'user',
      formAction: this.formAction,
      contentType: 'teacherDetails',
      component: 'portal'
    };
    return this.formService.getFormConfig(formServiceInputParams, id || this.userService.hashTagId);
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
    this.udiseObj = _.find(_.get(this.userProfile, 'externalIds'), (o) => o.idType === 'declared-school-udise-code');
    this.teacherObj = _.find(_.get(this.userProfile, 'externalIds'), (o) => o.idType === 'declared-ext-id');
    this.schoolObj = _.find(_.get(this.userProfile, 'externalIds'), (o) => o.idType === 'declared-school-name');
    if (this.udiseObj) { this.userDetailsForm.controls['udiseId'].setValue(this.udiseObj.id); }
    if (this.teacherObj) { this.userDetailsForm.controls['teacherId'].setValue(this.teacherObj.id); }
    if (this.schoolObj) { this.userDetailsForm.controls['school'].setValue(this.schoolObj.id); }
    this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    this.getState();
    this.showLoader = false;
    this.onStateChange();
    this.enableSubmitButton();
  }

  setValidations(data) {
    const returnValue = [];
    if (_.get(data, 'required')) {
      returnValue.push(Validators.required);
    }
    _.forEach(_.get(data, 'validation'), (validationData) => {
      switch (validationData.type) {
        case 'minlength':
          returnValue.push(Validators.minLength(validationData.value));
          break;
        case 'maxlength':
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
      locationExist ? this.userDetailsForm.controls['state'].setValue(locationExist) :
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
    this.stateControl = this.userDetailsForm.get('state');
    let stateValue = '';
    this.stateControl.valueChanges.subscribe(
      (data: string) => {
        if (_.get(this.stateControl, 'value.id')) {
          this.getFormDetails(_.get(this.stateControl, 'value.id')).subscribe((formData) => {
            this.formData = formData;
          });
        }
        if (this.stateControl.status === 'VALID' && stateValue !== this.stateControl.value.code) {
          const state = _.find(this.allStates, (states) => {
            return states.code === this.stateControl.value.code;
          });
          if (_.get(state, 'id')) { this.getDistrict(state.id); }
          stateValue = this.stateControl.value.code;
        }
      });
  }

  getDistrict(stateId) {
    this.districtControl = this.userDetailsForm.get('district');
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

  getUpdateTelemetry() {
    const fieldsChanged = [];
    if (this.forChanges.prevStateValue !== _.get(this.stateControl, 'value.code')) { fieldsChanged.push('State'); }
    if (this.forChanges.prevDistrictValue !== _.get(this.districtControl, 'value')) { fieldsChanged.push('District'); }
    if (_.get(this.schoolObj, 'id') !== _.get(this.userDetailsForm, 'value.school')) { fieldsChanged.push('School/ Org name'); }
    if (_.get(this.udiseObj, 'id') !== _.get(this.userDetailsForm, 'value.udiseId')) { fieldsChanged.push('School UDISE ID/ Org ID'); }
    if (_.get(this.teacherObj, 'id') !== _.get(this.userDetailsForm, 'value.teacherId')) { fieldsChanged.push('Teacher ID'); }
    const updateInteractEdata: IInteractEventEdata = {
      id: 'update-teacher-details',
      type: 'click',
      pageid: this.pageId
    };
    if (!_.isEmpty(fieldsChanged)) {
      updateInteractEdata['extra'] = { fieldsChanged };
    }
    return updateInteractEdata;
  }

  closeSuccessModal() {
    this.modal.deny();
    this.showSuccessModal = false;
    this.router.navigate(['/profile']);
  }

  onSubmitForm() {
    this.searchService.getOrganisationDetails({ locationIds: [_.get(this.userDetailsForm, 'value.state.id')] }).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (orgData: any) => {
          this.enableSubmitBtn = false;
          const locationCodes = [];
          if (_.get(this.userDetailsForm, 'value.state.code')) { locationCodes.push(_.get(this.userDetailsForm, 'value.state.code')); }
          if (_.get(this.userDetailsForm, 'value.district')) { locationCodes.push(_.get(this.userDetailsForm, 'value.district')); }
          const provider = _.get(orgData, 'result.response.content[0].channel');
          const operation = this.formAction === 'submit' ? 'add' : 'edit';
          const externalIds = [];
          if (_.get(this.userDetailsForm, 'value.school')) {
            externalIds.push({
              id: _.get(this.userDetailsForm, 'value.school'),
              operation, idType: 'declared-school-name', provider
            });
          }
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
            locationCodes,
            externalIds
          };
          this.updateProfile(data);
        },
        (err) => {
          this.closeModal();
          this.toasterService.error(this.resourceService.messages.emsg.m0018);
        }
      );
  }

  updateProfile(data) {
    this.profileService.updateProfile(data).subscribe(res => {
      if (this.formAction === 'update') {
        this.toasterService.success(this.resourceService.messages.smsg.m0037);
        this.closeModal();
      } else {
        this.showSuccessModal = true;
      }
    }, err => {
        this.closeModal();
        this.toasterService.error(this.formAction === 'submit' ? this.resourceService.messages.emsg.m0051 :
          this.resourceService.messages.emsg.m0052);
    });
  }

  closeModal() {
    this.router.navigate(['/profile']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
