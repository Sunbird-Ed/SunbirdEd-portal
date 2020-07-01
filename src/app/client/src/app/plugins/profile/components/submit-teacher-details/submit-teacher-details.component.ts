import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import {
  IUserData,
  NavigationHelperService,
  ResourceService,
  ServerResponse,
  ToasterService,
  UtilService
} from '@sunbird/shared';
import { ProfileService } from './../../services';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import {ActivatedRoute, Router} from '@angular/router';
import {IInteractEventObject, IInteractEventEdata, TelemetryService} from '@sunbird/telemetry';
import {UserService, FormService, SearchService, TncService, OtpService} from '@sunbird/core';
import {takeUntil, distinctUntilChanged, debounceTime} from 'rxjs/operators';
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
  instance: string;
  showTncPopup = false;
  tncLatestVersion: any;
  termsAndConditionLink: any;
  otpData;
  isOtpVerificationRequired = false;
  prepopulatedValue = {email: '', phone: ''};
  validationType = {
    phone: {
      isVerified: false,
      isVerificationRequired: false
    },
    email: {
      isVerified: false,
      isVerificationRequired: false
    }
  };


  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public profileService: ProfileService, formBuilder: FormBuilder, private telemetryService: TelemetryService,
    public userService: UserService, public formService: FormService, public router: Router,
    public searchService: SearchService, private activatedRoute: ActivatedRoute,
    public navigationhelperService: NavigationHelperService, public otpService: OtpService,
    public tncService: TncService, public utilService: UtilService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.fetchTncData();
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.formAction = queryParams.formaction;
    this.telemetryImpressionEvent();
    this.userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
      if (user.userProfile) {
        this.userProfile = user.userProfile;
        this.setFormDetails();
      }
    });
    this.setTelemetryData();
  }

  fetchTncData() {
    this.tncService.getTncConfig().subscribe((data: ServerResponse) => {
        const response = _.get(data, 'result.response.value');
        if (response) {
          try {
            const tncConfig = this.utilService.parseJson(response);
            this.tncLatestVersion = _.get(tncConfig, 'latestVersion') || {};
            this.termsAndConditionLink = tncConfig[this.tncLatestVersion].url;
          } catch (e) {
            this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
          }
        }
      }, (err) => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      }
    );
  }

  showAndHidePopup(mode: boolean) {
    this.showTncPopup = mode;
  }

  telemetryImpressionEvent() {
    this.telemetryService.impression({
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        subtype: this.formAction,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    });
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
    this.setFormData();
    this.getState();
    this.showLoader = false;
    this.onStateChange();
    this.enableSubmitButton();
  }

  getExternalIdObject(key) {
    return _.find(_.get(this.userProfile, 'externalIds'), (o) => o.idType === key);
  }

  getExternalId(key) {
    const data = this.getExternalIdObject(key);
    return data && data.id;
  }

  setValidators(key) {
    this.userDetailsForm.addControl(key + 'Verified', new FormControl('', Validators.required));
    this.userDetailsForm.controls[key + 'Verified'].setValue(true);
  }

  setFormData() {
    this.prepopulatedValue.email = this.getExternalId('declared-email') || this.userProfile.maskedEmail;
    this.prepopulatedValue.phone = this.getExternalId('declared-phone') || this.userProfile.maskedPhone;
    if (this.prepopulatedValue.email) {
      this.userDetailsForm.controls['email'].setValue(this.prepopulatedValue.email);
      this.setValidators('email');
      this.validationType.email.isVerified = true;
    }
    if (this.prepopulatedValue.phone) {
      this.userDetailsForm.controls['phone'].setValue(this.prepopulatedValue.phone);
      this.setValidators('phone');
      this.validationType.phone.isVerified = true;
    }
    const fieldType = ['email', 'phone'];
    for (let index = 0; index < fieldType.length; index++) {
      const key = fieldType[index];
      const keyControl = this.userDetailsForm.controls[key];
      const userFieldValue = this.prepopulatedValue[key];
      keyControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((newValue) => {
        newValue = newValue.trim();
        if (userFieldValue === newValue) {
          this.validationType[key].isVerified = true;
          this.validationType[key].isVerificationRequired = false;
          this.setValidators(key);
          return;
        }
        if (newValue && keyControl.status === 'VALID') {
          this.userDetailsForm.addControl(key + 'Verified', new FormControl('', Validators.required));
          this.userDetailsForm.controls[key + 'Verified'].setValue('');
          this.validationType[key].isVerified = false;
          this.validationType[key].isVerificationRequired = true;
        } else {
          this.validationType[key].isVerified = false;
          this.validationType[key].isVerificationRequired = false;
          this.userDetailsForm.removeControl(key + 'Verified');
        }
      });
    }
  }

  generateOTP(fieldType) {
    const request = {
      request: {
        key: fieldType === 'phone' ?
          this.userDetailsForm.controls.phone.value.toString() : this.userDetailsForm.controls.email.value,
        type: fieldType
      }
    };
    this.otpService.generateOTP(request).subscribe((data: ServerResponse) => {
        this.otpData = this.prepareOtpData(fieldType);
        this.setOtpValidation(true);
      },
      (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      }
    );
  }

  onVerificationSuccess(data) {
    this.setOtpValidation(false);
    const fieldType = this.getFieldType(data);
    this.validationType[fieldType].isVerified = true;
    this.userDetailsForm.controls[fieldType + 'Verified'].setValue(true);
    this.validationType[fieldType].isVerificationRequired = false;
  }

  getFieldType(data) {
    return _.get(data, 'phone') ? 'phone' : 'email';
  }

  onOtpPopupClose() {
    this.setOtpValidation(false);
  }

  setOtpValidation(valueToSet) {
    this.isOtpVerificationRequired = valueToSet;
  }

  onOtpVerificationError(data) {
    this.setOtpValidation(false);
  }

  prepareOtpData(fieldType) {
    const otpData: any = {};
    switch (fieldType) {
      case 'phone':
        otpData.instructions = this.resourceService.frmelmnts.instn.t0083;
        otpData.retryMessage = this.resourceService.frmelmnts.lbl.unableToUpdateMobile;
        otpData.wrongOtpMessage = this.resourceService.frmelmnts.lbl.wrongPhoneOTP;
        break;
      case 'email':
        otpData.instructions = this.resourceService.frmelmnts.instn.t0084;
        otpData.retryMessage = this.resourceService.frmelmnts.lbl.unableToUpdateEmail;
        otpData.wrongOtpMessage = this.resourceService.frmelmnts.lbl.wrongEmailOTP;
        break;
    }
    otpData.type = fieldType;
    otpData.value = this.userDetailsForm.controls[fieldType].value;
    return otpData;
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
        case 'email':
          returnValue.push(Validators.email);
          break;
      }
    });
    return returnValue;
  }

  getState() {
    const requestData = { 'filters': { 'type': 'state' } };
    this.profileService.getUserLocation(requestData).subscribe(res => {
      this.allStates = res.result.response;
      const declaredState = this.getExternalIdObject('declared-state');
      if (declaredState) {
        declaredState.code = declaredState.id;
      }
      const location = declaredState || _.find(this.userProfile.userLocations, (locations) => {
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
      const declaredDistrict = this.getExternalIdObject('declared-district');
      if (declaredDistrict) {
        declaredDistrict.code = declaredDistrict.id;
      }
      const location = declaredDistrict || _.find(this.userProfile.userLocations, (locations) => {
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

  isStateChanged() {
    let isStateChanged = false;
    const stateData = this.getExternalIdObject('declared-state');
    if (stateData && stateData.id !== _.get(this.userDetailsForm, 'value.state.code')) {
      isStateChanged = true;
    }
    return isStateChanged;
  }

  getOperation(fieldType, provider, inputFieldValue) {
    let operation;
    if (this.formAction === 'submit' || this.formAction === 'update' && this.isStateChanged()) {
      operation = 'add';
    } else {
      const externalIdObj = this.findExternalIdObj(fieldType, provider);
      operation = externalIdObj ? inputFieldValue ? 'edit' : 'remove' : 'add';
    }
    return operation;
  }

  findExternalIdObj(fieldType, provider) {
    const externalIds = _.get(this.userProfile, 'externalIds');
    const externalIdObj = _.find(externalIds, (externalId) => {
      return (externalId.idType === fieldType && externalId.provider === provider);
    });
    return externalIdObj && externalIdObj.id;
  }

  onSubmitForm() {
    this.searchService.getOrganisationDetails({ locationIds: [_.get(this.userDetailsForm, 'value.state.id')] }).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (orgData: any) => {
          this.enableSubmitBtn = false;
          const provider = _.get(orgData, 'result.response.content[0].channel');
          let externalIds = [];
          if (this.formAction === 'update' && this.isStateChanged() || provider !== _.get(this.userProfile, 'externalIds[0].provider')) {
            const extIds = this.userProfile.externalIds || [];
            _.forEach(extIds, (externalId, index) => {
              extIds[index]['operation'] = 'remove';
            });
            externalIds = extIds.concat(externalIds);
          }
          const fields = new Map([['value.phone', 'declared-phone'], ['value.email', 'declared-email'], ['value.school', 'declared-school-name'],
            ['value.udiseId', 'declared-school-udise-code'], ['value.teacherId', 'declared-ext-id'],
            ['value.state.code', 'declared-state'], ['value.district', 'declared-district']]);
          fields.forEach((fieldKey, formKey) => {
            const id = _.get(this.userDetailsForm, formKey) || this.findExternalIdObj(fieldKey, provider);
            if (id) {
              externalIds.push({
                id,
                operation: this.getOperation(fieldKey, provider, _.get(this.userDetailsForm, formKey)),
                idType: fieldKey,
                provider
              });
            }
          });
          const data = {
            userId: this.userService.userid,
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
        if (_.get(this.userDetailsForm, 'value.tnc')) {
          this.logAuditEvent();
        }
        this.showSuccessModal = true;
      }
    }, err => {
        this.closeModal();
        this.toasterService.error(this.formAction === 'submit' ? this.resourceService.messages.emsg.m0051 :
          this.resourceService.messages.emsg.m0052);
    });
  }

  logAuditEvent() {
    this.telemetryService.audit({
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{id: 'teacher-self-declaration', type: 'FromPage'}]
      },
      object: {id: 'data-sharing', type: 'TnC', ver: this.tncLatestVersion},
      edata: {state: 'Updated', props: [], prevstate: '', type: 'tnc-data-sharing'}
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
