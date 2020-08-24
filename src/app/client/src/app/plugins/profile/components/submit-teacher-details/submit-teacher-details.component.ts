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
  allTenants: any;
  allDistricts: any;
  userDetailsForm: FormGroup;
  sbFormBuilder: FormBuilder;
  enableSubmitBtn = false;
  showDistrictDivLoader = false;
  selectedState;
  selectedDistrict;
  tenantControl: any;
  districtControl: any;
  forChanges = {
    prevPersonaValue: '',
    prevTenantValue: '',
    prevPhoneValue: '',
    prevEmailValue: ''
  };
  formData;
  showLoader = true;
  submitInteractEdata: IInteractEventEdata;
  submitDetailsInteractEdata: IInteractEventEdata;
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
  prepopulatedValue = {'declared-email': '', 'declared-phone': ''};
  validationType = {
    'declared-phone': {
      isVerified: false,
      isVerificationRequired: false
    },
    'declared-email': {
      isVerified: false,
      isVerificationRequired: false
    }
  };
  personaList: any;
  formGroupObj = {};
  declaredDetails: any;

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
        if (_.get(this.userProfile, 'declarations') && this.userProfile.declarations.length > 0) {
          this.declaredDetails = _.get(this.userProfile, 'declarations')[0] ||  '';
        }
        this.formGroupObj['persona'] = new FormControl(null, Validators.required);
        this.formGroupObj['tenants'] = new FormControl(null, Validators.required);
        this.userDetailsForm = this.sbFormBuilder.group(this.formGroupObj);
        this.getPersona();
        this.getTenants();
        this.getLocations();
        this.showLoader = false;
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
    this.submitDetailsInteractEdata = {
      id: `teacher-details-submit-success`,
      type: 'click',
      pageid: this.pageId
    };
  }

  initializeFormFields() {
    for (const key of this.formData) {
      const validation = this.setValidations(key);
      if (key.visible && !_.includes(['state', 'district', 'name'], key.name)) {
        this.formGroupObj[key.code] = new FormControl(null, validation);
        if (this.formAction === 'update' && this.forChanges.prevTenantValue === this.userDetailsForm.controls.tenants.value) {
          this.formGroupObj[key.code].setValue(this.declaredDetails.info[key.code]);
        }
      }
    }
    this.userDetailsForm = this.sbFormBuilder.group(this.formGroupObj);
    this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    this.setFormData();
    this.showLoader = false;
    this.enableSubmitButton();
  }

  getPersona() {
    this.profileService.getPersonas().subscribe((personas) => {
      this.personaList = personas[0].range;
      const declaredPersona = _.get(this.declaredDetails, 'persona');
      if (declaredPersona && this.formAction === 'update') {
        this.forChanges.prevPersonaValue = declaredPersona;
        this.userDetailsForm.controls['persona'].setValue(declaredPersona);
      }
    });
  }

  getTenants() {
    this.profileService.getTenants().subscribe((tenants) => {
      this.allTenants = tenants[0].range;
      this.onTenantChange();
      const declaredTentant = _.get(this.declaredDetails, 'orgId');
      if (declaredTentant && this.formAction === 'update') {
        this.forChanges.prevTenantValue = declaredTentant;
        this.userDetailsForm.controls['tenants'].setValue(declaredTentant);
      }
    });
  }

  setValidators(key) {
    this.userDetailsForm.addControl(key + 'Verified', new FormControl('', Validators.required));
    this.userDetailsForm.controls[key + 'Verified'].setValue(true);
  }

  setFormData() {
    const fieldType = ['declared-email', 'declared-phone'];
    for (let index = 0; index < fieldType.length; index++) {
      const key = fieldType[index];
      if (this.formAction === 'update') {
        this.prepopulatedValue[key] = this.declaredDetails.info[key];
      } else {
        const profileKey = key === 'declared-email' ? 'email' : 'phone';
        const prevValue = key === 'declared-email' ? this.forChanges.prevEmailValue : this.forChanges.prevPhoneValue;
        this.prepopulatedValue[key] = this.userProfile[profileKey] || prevValue;
      }
      if (this.prepopulatedValue[key]) {
        this.userDetailsForm.controls[key].setValue(this.prepopulatedValue[key]);
        if (key === 'declared-phone' && this.prepopulatedValue[key].includes('**')) {
          this.userDetailsForm.get([key]).setValidators(Validators.pattern(''));
          this.userDetailsForm.get([key]).updateValueAndValidity();
        }
        this.setValidators(key);
        this.validationType[key].isVerified = true;
      }
      const keyControl = this.userDetailsForm.controls[key];
      let userFieldValue;
      if (this.prepopulatedValue[key]) {
        userFieldValue = this.prepopulatedValue[key];
      }
      keyControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((newValue) => {
        newValue = newValue.trim();
        if (key === 'declared-phone') {
          const field = this.formData.find((e) => e.code === 'declared-phone');
          this.userDetailsForm.get([key]).setValidators(this.setValidations(field));
          this.userDetailsForm.get([key]).updateValueAndValidity();
        }
        if (userFieldValue === newValue && keyControl.status === 'VALID') {
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

  generateTelemetry(fieldType) {
    const interactData = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {
        id: `validate-${fieldType}-${this.formAction}-teacher-details`,
        type: 'click',
        pageid: this.pageId
      }
    };
    this.telemetryService.interact(interactData);
  }

  generateOTP(fieldType) {
    this.generateTelemetry(fieldType);
    const request = {
      request: {
        key: fieldType === 'declared-phone' ?
          this.userDetailsForm.controls[fieldType].value.toString() : this.userDetailsForm.controls[fieldType].value,
        type: fieldType === 'declared-phone' ? 'phone' : 'email'
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
    if (fieldType === 'declared-phone') {
      this.forChanges.prevPhoneValue = this.userDetailsForm.controls[fieldType].value;
    } else {
      this.forChanges.prevEmailValue = this.userDetailsForm.controls[fieldType].value;
    }
  }

  getFieldType(data) {
    return _.get(data, 'phone') ? 'declared-phone' : 'declared-email';
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
      case 'declared-phone':
        otpData.instructions = this.resourceService.frmelmnts.instn.t0083;
        otpData.retryMessage = this.resourceService.frmelmnts.lbl.unableToUpdateMobile;
        otpData.wrongOtpMessage = this.resourceService.frmelmnts.lbl.wrongPhoneOTP;
        break;
      case 'declared-email':
        otpData.instructions = this.resourceService.frmelmnts.instn.t0084;
        otpData.retryMessage = this.resourceService.frmelmnts.lbl.unableToUpdateEmail;
        otpData.wrongOtpMessage = this.resourceService.frmelmnts.lbl.wrongEmailOTP;
        break;
    }
    otpData.type = fieldType === 'declared-phone' ? 'phone' : 'email';
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

  getLocations() {
    _.map(this.userProfile.userLocations, (locations) => {
      if (locations.type === 'state') {
        this.selectedState = locations.name;
      }
      if (locations.type === 'district') {
        this.selectedDistrict = locations.name;
      }
    });
  }

  enableSubmitButton() {
    this.userDetailsForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    });
  }

  onTenantChange() {
    this.tenantControl = this.userDetailsForm.get('tenants');
    this.tenantControl.valueChanges.subscribe(
      (data: string) => {
        if (_.get(this.tenantControl, 'value')) {
          this.profileService.getTeacherDetailForm(this.formAction, _.get(this.tenantControl, 'value')).subscribe((teacherForm) => {
            this.formData = teacherForm;
            this.initializeFormFields();
          });
        }
      });
  }

  getUpdateTelemetry() {
    const fieldsChanged = [];
    if (this.forChanges.prevPersonaValue !== _.get(this.userDetailsForm, 'value.persona')) { fieldsChanged.push('Persona'); }
    if (this.forChanges.prevTenantValue !== _.get(this.tenantControl, 'value.tenant')) { fieldsChanged.push('Tenant'); }
    if (this.declaredDetails && this.formData) {
      for (const key of this.formData) {
        if (!_.includes(['state', 'district', 'name'], key.name) &&
            this.declaredDetails.info[key.code] !== this.userDetailsForm.controls[key.code].value) {
          fieldsChanged.push(key.label);
        }
      }
    }
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

  isPersonaChanged() {
    return this.forChanges.prevPersonaValue !== this.userDetailsForm.controls.persona.value;
  }

  isTenantChanged() {
    return this.forChanges.prevTenantValue !== this.userDetailsForm.controls.tenants.value;
  }

  getOperation() {
    let operation;
    if (this.formAction === 'update' && (this.isTenantChanged() || this.isPersonaChanged())) {
      operation = 'remove';
    } else {
      operation = this.formAction === 'submit' ? 'add' : 'edit';
    }
    return operation;
  }

  onSubmitForm() {
    this.enableSubmitBtn = false;
    const declaredInfo = {};
      this.formData.map((field) => {
        const fieldValue = this.userDetailsForm.value[field.code] || false;
        if (field.code && fieldValue && !_.includes(['state', 'district', 'name', 'tnc'], field.name)) {
          Object.assign(declaredInfo, {[field.code]: fieldValue });
        }
      });
    const operation = this.getOperation();
    const data = {
      'declarations': [
        {
            'operation': operation === 'remove' ? 'add' : operation,
            'userId': this.userService.userid,
            'orgId':  _.get(this.userDetailsForm, 'value.tenants'),
            'persona': _.get(this.userDetailsForm, 'value.persona'),
            'info': declaredInfo
        }
      ]
    };
    if (operation === 'remove') {
      data.declarations.push({
        'operation': operation,
        'userId': this.userService.userid,
        'orgId':  _.get(this.declaredDetails, 'orgId'),
        'persona': _.get(this.declaredDetails, 'persona'),
        'info': this.declaredDetails.info
      });
    }
    this.updateProfile(data);
  }

  updateProfile(data) {
    this.profileService.declarations(data).subscribe(res => {
      this.enableSubmitBtn = true;
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
