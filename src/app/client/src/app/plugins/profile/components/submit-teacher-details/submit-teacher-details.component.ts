import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService, OtpService, TncService, UserService } from '@sunbird/core';
import { Consent, ConsentStatus } from '@project-sunbird/client-services/models';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import {
  IUserData,
  NavigationHelperService,
  ResourceService,
  ServerResponse,
  ToasterService,
  UtilService, LayoutService
} from '@sunbird/shared';
import { IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { FieldConfig } from '@project-sunbird/common-form-elements-full';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from './../../services';

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
  unsubscribe = new Subject<void>();
  layoutConfiguration: any;
  selectedState;
  selectedDistrict;
  forChanges = {
    prevPersonaValue: '',
    prevTenantValue: '',
    prevPhoneValue: '',
    prevEmailValue: ''
  };
  showLoader = true;
  submitInteractEdata: IInteractEventEdata;
  submitDetailsInteractEdata: IInteractEventEdata;
  cancelInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  instance: string;
  showTncPopup = false;
  tncLatestVersion: any;
  termsAndConditionLink: any;
  otpData;
  isOtpVerificationRequired = false;
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
  formGroupObj = {};
  declaredDetails: any;
  tenantPersonaForm;
  teacherDetailsForm;
  tenantPersonaLatestFormValue;
  declaredLatestFormValue;
  selectedTenant = '';
  selectedStateCode: any;
  isDeclarationFormValid = false;
  isTenantPersonaFormValid = false;
  otpConfirm;
  globalConsent = 'global-consent';
  isglobalConsent = true;
  consentConfig: { tncLink: string; tncText: any; };
  showGlobalConsentPopUpSection = false;
  profileInfo: {};
  isTenantChanged = false;
  previousOrgId;

  constructor(
    @Inject('CS_USER_SERVICE') private csUserService: CsUserService,
    private activatedRoute: ActivatedRoute,
    private telemetryService: TelemetryService,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public profileService: ProfileService,
    public userService: UserService,
    public formService: FormService,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    public otpService: OtpService,
    public tncService: TncService,
    public utilService: UtilService, public layoutService: LayoutService) { }

  ngOnInit() {

    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });

    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.consentConfig = { tncLink: this.resourceService.frmelmnts.lbl.tncLabelLink,
       tncText: this.resourceService.frmelmnts.lbl.nonCustodianTC };
    this.fetchTncData();
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.formAction = queryParams.formaction;
    this.telemetryImpressionEvent();
    this.userService.userData$.pipe(takeUntil(this.unsubscribe)).subscribe((user: IUserData) => {
      if (user.userProfile) {
        this.userProfile = user.userProfile;
        this.getLocations();
        if (_.get(this.userProfile, 'declarations.length')) {
          this.declaredDetails = _.get(this.userProfile, 'declarations')[0] || '';
          this.forChanges.prevPersonaValue = _.get(this.declaredDetails, 'persona');
          this.forChanges.prevTenantValue = _.get(this.declaredDetails, 'orgId');
        }
        this.getPersonaTenant();
        this.showLoader = false;
      }
    });
    this.setTelemetryData();
  }

  fetchTncData() {
    this.tncService.getTncConfig().pipe(takeUntil(this.unsubscribe)).subscribe((data: ServerResponse) => {
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
        duration: this.navigationHelperService.getPageLoadTime()
      }
    });
  }

  setTelemetryData() {
    this.submitInteractEdata = {
      id: 'submit-teacher-details',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.cancelInteractEdata = {
      id: `cancel-${this.formAction}-teacher-details`,
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.submitDetailsInteractEdata = {
      id: `teacher-details-submit-success`,
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
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
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    this.telemetryService.interact(interactData);
  }

  generateOTP(fieldType, value) {
    this.generateTelemetry(fieldType);
    const request = {
      request: {
        key: value.toString(),
        type: fieldType === 'declared-phone' ? 'phone' : 'email'
      }
    };
    this.otpService.generateOTP(request).pipe(takeUntil(this.unsubscribe)).subscribe((data: ServerResponse) => {
      this.otpData = this.prepareOtpData(fieldType, value);
      this.setOtpValidation(true);
    },
      (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      }
    );
  }

  onVerificationSuccess(event) {
    this.setOtpValidation(false);
    this.otpConfirm.next(true);
    this.otpConfirm.complete();
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

  prepareOtpData(fieldType, value) {
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
    otpData.value = value;
    return otpData;
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

  getUpdateTelemetry() {
    const fieldsChanged = [];
    if (this.forChanges.prevPersonaValue !== _.get(this.tenantPersonaLatestFormValue, 'persona')) { fieldsChanged.push('Persona'); }
    if (this.forChanges.prevTenantValue !== _.get(this.tenantPersonaLatestFormValue, 'tenant')) { fieldsChanged.push('Tenant'); }
    if (this.declaredDetails && _.get(this.declaredLatestFormValue, 'children.externalIds')) {
      const userDeclaredValues = _.get(this.declaredLatestFormValue, 'children.externalIds');
      for (const [key, value] of Object.entries(userDeclaredValues)) {
        if (!_.includes(['state', 'district', 'name'], key) &&
          this.declaredDetails.info[key] !== this.declaredLatestFormValue.children.externalIds[key]) {
          fieldsChanged.push(key);
        }
      }
    }

    const updateInteractEdata: IInteractEventEdata = {
      id: 'update-teacher-details',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    if (!_.isEmpty(fieldsChanged)) {
      updateInteractEdata['extra'] = { fieldsChanged };
    }
    return updateInteractEdata;
  }

  closeSuccessModal() {
    this.modal.deny();
    this.showSuccessModal = false;
    this.navigateToProfile();
  }


  updateProfile(data) {
    this.profileService.declarations(data).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      if (this.formAction === 'update') {
        this.toasterService.success(this.resourceService.messages.smsg.m0037);
        this.navigateToProfile();
      } else {
        if (_.get(this.declaredLatestFormValue, 'tnc')) {
          this.logAuditEvent();
        }
        this.showSuccessModal = true;
      }
    }, err => {
      this.navigateToProfile();
      this.toasterService.error(this.formAction === 'submit' ? this.resourceService.messages.emsg.m0051 :
        this.resourceService.messages.emsg.m0052);
    });
  }

  goBack() {
    this.navigationHelperService.goBack();
  }


  logAuditEvent() {
    this.telemetryService.audit({
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{ id: 'teacher-self-declaration', type: 'FromPage' }]
      },
      object: { id: 'data-sharing', type: 'TnC', ver: this.tncLatestVersion },
      edata: { state: 'Updated', props: [], prevstate: '', type: 'tnc-data-sharing' }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  getPersonaTenant() {
    this.profileService.getPersonaTenantForm().pipe(takeUntil(this.unsubscribe)).subscribe(response => {
      this.selectedTenant = (_.get(this.userProfile, 'declarations[0].orgId')) || '';

      response.forEach(config => {
        if (config.code === 'persona') {
          config.default = _.get(this.userProfile, 'declarations[0].persona');
        } else if (config.code === 'tenant') {
          config.default = _.get(this.userProfile, 'declarations[0].orgId');
        }
      });

      this.tenantPersonaForm = response;
      if (this.selectedTenant) {
        this.getTeacherDetailsForm();
      }
    }, error => {
      console.error('Unable to fetch form', error);
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
      this.navigateToProfile();
    });
  }

  tenantPersonaFormValueChanges(event) {
    this.tenantPersonaLatestFormValue = event;
    if (_.get(event, 'tenant')) {
      if (!this.selectedTenant || event.tenant !== this.selectedTenant) {
        this.previousOrgId = this.selectedTenant;
        this.isTenantChanged = this.selectedTenant ? true : false;
        this.selectedTenant = event.tenant;
        this.getTeacherDetailsForm();
      }
    }
  }

  linkClicked(event) {
    if (_.get(event, 'event.preventDefault')) {
      event.event.preventDefault();
      this.showTncPopup = true;
    }
  }

  declarationFormValueChanges(event) {
    this.declaredLatestFormValue = event;
    if (_.get(event, 'children.externalIds')) {
      if (!this.selectedStateCode && _.get(event, 'children.externalIds.declared-state')) {
        this.selectedStateCode = event.children.externalIds['declared-state'];
      }
      if (_.get(event, 'children.externalIds["declared-state"]') && this.selectedStateCode !== _.get(event, 'children.externalIds.declared-state')) {
        this.selectedStateCode = event.children.externalIds['declared-state'];
      }
    }
  }

  tenantPersonaFormStatusChanges(event) {
    this.isTenantPersonaFormValid = event.isValid || event.valid;
  }

  declarationFormStatusChanges(event) {
    this.isDeclarationFormValid = event.isValid;
  }

  getTeacherDetailsForm() {
    this.profileService.getSelfDeclarationForm(this.selectedTenant).pipe(takeUntil(this.unsubscribe)).subscribe(formConfig => {
      console.log('formConfig', formConfig);
      this.initializeFormData(formConfig);
    }, error => {
      console.error('Unable to fetch form', error);
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
    });
  }

  initializeFormData(formConfig) {
    this.teacherDetailsForm = formConfig.map((config: FieldConfig<any>) => {
      switch (config.code) {
        case 'name':
          config.templateOptions.labelHtml.values['$1'] = this.userProfile.firstName;
          break;
        case 'state':
          config.templateOptions.labelHtml.values['$1'] = this.selectedState || 'Enter location from Profile page';
          break;
        case 'district':
          config.templateOptions.labelHtml.values['$1'] = this.selectedDistrict || 'Enter location from Profile page';
          break;
        case 'externalIds':
          config.children = (config.children as FieldConfig<any>[]).map((childConfig: FieldConfig<any>) => {

            if (_.get(childConfig, `templateOptions['dataSrc'].marker`) === 'LOCATION_LIST') {
              if (childConfig.templateOptions['dataSrc'].params.id === 'state') {
                let stateCode;
                if (this.selectedState) {
                  stateCode = this.selectedState;
                } else {
                  let stateDetails;
                  if (_.get(this.userProfile, `declarations[0].info[${childConfig.code}]`)) {
                    stateDetails = this.userProfile.declarations[0].info[childConfig.code];
                  }
                  stateCode = _.get(stateDetails, 'id');
                }
              } else if (_.get(childConfig, 'templateOptions["dataSrc"].params.id') === 'district') {
                let districtDetails;
                if (_.get(this.userProfile, `declarations[0].info[${childConfig.code}]`)) {
                  districtDetails = this.userProfile.declarations[0].info[childConfig.code];
                }
              }
              return childConfig;
            }

            this.assignDefaultValue(childConfig);
            if (childConfig.asyncValidation) {
              childConfig = this.assignDefaultValue(childConfig);

              if (_.get(childConfig, 'asyncValidation.marker') === 'MOBILE_OTP_VALIDATION') {
                childConfig.asyncValidation.asyncValidatorFactory = this.mobileVerificationAsyncFactory(childConfig, this.userProfile, childConfig.default);
              } else if (_.get(childConfig, 'asyncValidation.marker') === 'EMAIL_OTP_VALIDATION') {
                childConfig.asyncValidation.asyncValidatorFactory = this.emailVerificationAsyncFactory(childConfig, this.userProfile, childConfig.default);
              }
              return childConfig;
            }
            return childConfig;
          });
          break;
        case 'tnc':
          if (this.formAction === 'update') {
            config = undefined;
          }
          break;
      }
      return config;
    }).filter((formData) => formData);
  }

  private assignDefaultValue(childConfig: FieldConfig<any>) {
    if (_.get(this.userProfile, `declarations[0].info[${childConfig.code}]`)) {
      childConfig.default = this.userProfile.declarations[0].info[childConfig.code];
    }

    if (this.formAction === 'submit') {
      if (childConfig.code === 'declared-phone') {
        childConfig.default = this.userProfile['maskedPhone'];
      }

      if (childConfig.code === 'declared-email') {
        childConfig.default = this.userProfile['maskedEmail'];
      }
    }

    return childConfig;
  }



  mobileVerificationAsyncFactory(formElement: FieldConfig<any>, profile: any, initialMobileVal): any {
    return (marker: string, trigger: HTMLElement) => {
      if (marker === 'MOBILE_OTP_VALIDATION') {
        return async (control: UntypedFormControl) => {
          if ((control && !control.value) || (initialMobileVal && initialMobileVal === control.value)) {
            return null;
          }
          return new Promise<ValidationErrors | null>(resolve => {
            if (trigger) {
              const that = this;
              this.otpConfirm = new Subject();
              trigger.onclick = (async () => {
                try {
                  that.generateOTP('declared-phone', control.value);
                  const isOtpVerified: boolean = await that.otpConfirm.toPromise();
                  if (isOtpVerified) {
                    resolve(null);
                  } else {
                    resolve({ asyncValidation: 'error' });
                  }
                } catch (e) {
                  console.error(e);
                }
              }).bind(this);
              return;
            }
            resolve(null);
          });
        };
      }
      return async () => null;
    };
  }

  emailVerificationAsyncFactory(formElement: FieldConfig<any>, profile: any, initialEmailVal): any {
    return (marker: string, trigger: HTMLElement) => {
      if (marker === 'EMAIL_OTP_VALIDATION') {
        return async (control: UntypedFormControl) => {
          if ((control && !control.value) || (initialEmailVal && initialEmailVal === control.value)) {
            return null;
          }
          return new Promise<ValidationErrors | null>(resolve => {
            if (trigger) {
              const that = this;
              this.otpConfirm = new Subject();
              trigger.onclick = (async () => {
                try {
                  that.generateOTP('declared-email', control.value);
                  const isOtpVerified: boolean = await that.otpConfirm.toPromise();
                  if (isOtpVerified) {
                    resolve(null);
                  } else {
                    resolve({ asyncValidation: 'error' });
                  }
                } catch (e) {
                  console.error(e);
                }
              }).bind(this);
              return;
            }
            resolve(null);
          });
        };
      }
      return async () => null;
    };
  }

  closeConsentPopUp() {
    this.showGlobalConsentPopUpSection = false;
    this.isglobalConsent = false;
    this.globalConsent = '';
  }

  async submit() {
    if (!this.declaredLatestFormValue || !this.tenantPersonaLatestFormValue) {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0051'));
      return;
    }
    const formValue = this.declaredLatestFormValue.children.externalIds;
    const declarations = [];
    const declaredDetails = this.declaredLatestFormValue.children && this.declaredLatestFormValue.children.externalIds;
    let operation = '';
    if (!this.userProfile.declarations || !_.get(this.userProfile, 'declarations.length')) {
      operation = 'add';
    } else if (this.tenantPersonaLatestFormValue.tenant === this.userProfile.declarations[0].orgId) {
      operation = 'edit';
    } else if (this.tenantPersonaLatestFormValue.tenant !== this.userProfile.declarations[0].orgId) {
      const tenantPersonaData = { persona: this.userProfile.declarations[0].persona, tenant: this.userProfile.declarations[0].orgId };
      declarations.push(this.getDeclarationReqObject('remove', this.userProfile.declarations[0].info, tenantPersonaData));
      operation = 'add';
    }
    declarations.push(this.getDeclarationReqObject(operation, declaredDetails, this.tenantPersonaLatestFormValue));

    const data = { declarations };
    this.getProfileInfo(declarations);
    this.updateProfile(data);
    if (this.formAction === 'submit') {
      this.updateUserConsent(declarations[0].orgId);
    } else if (this.formAction === 'update' && this.isTenantChanged) {
      this.updateUserConsent(declarations[1].orgId, this.previousOrgId);
    }
  }

  updateUserConsent(currentOrgId, previousOrgId?) {
    if (this.isTenantChanged && !!previousOrgId) {
      const requestFoRevoked: Consent = {
        status: ConsentStatus.REVOKED,
        userId: this.userService.userid,
        consumerId: previousOrgId,
        objectId: previousOrgId,
        objectType: 'Organisation'
      };
      this.csUserService.updateConsent(requestFoRevoked, { apiPath: '/learner/user/v1' })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
         // this.toasterService.success(_.get(this.resourceService, 'messages.smsg.dataSettingSubmitted'));
          if (response && response.consent) {
            this.isTenantChanged = false;
            const requestForActive: Consent = {
              status: ConsentStatus.ACTIVE,
              userId: this.userService.userid,
              consumerId: currentOrgId,
              objectId: currentOrgId,
              objectType: 'Organisation'
            };
            this.csUserService.updateConsent(requestForActive, { apiPath: '/learner/user/v1' })
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(() => {
                this.toasterService.success(_.get(this.resourceService, 'messages.smsg.dataSettingSubmitted'));
              }, error => {
                this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
                console.error('Error while updating user consent', error);
              });
          }
        }, error => {
          this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
          console.error('Error while updating user consent', error);
        });
    } else {
      const request: Consent = {
        status: ConsentStatus.ACTIVE,
        userId: this.userService.userid,
        consumerId: currentOrgId,
        objectId: currentOrgId,
        objectType: 'Organisation'
      };
      this.csUserService.updateConsent(request, { apiPath: '/learner/user/v1' })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.toasterService.success(_.get(this.resourceService, 'messages.smsg.dataSettingSubmitted'));
        }, error => {
          this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
          console.error('Error while updating user consent', error);
        });
    }
  }

  getProfileInfo(declarations) {
    this.profileInfo = {
      emailId: '',
      phone: '',
      schoolId: '',
      schoolName: ''
    };
    for (const [key, value] of Object.entries(declarations[0].info)) {
      switch (key) {
        case 'declared-email':
          this.profileInfo['emailId'] = value;
          break;
        case 'declared-phone':
          this.profileInfo['phone'] = value;
          break;
        case 'declared-school-udise-code':
          this.profileInfo['schoolId'] = value;
          break;
        case 'declared-school-name':
          this.profileInfo['schoolName'] = value;
          break;
      }
    }
  }

  private getDeclarationReqObject(operation, declaredDetails, tenantPersonaDetails) {
    return {
      operation,
      userId: this.userProfile.userId,
      orgId: tenantPersonaDetails.tenant,
      persona: tenantPersonaDetails.persona,
      info: declaredDetails
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (_.get(this.modal, 'deny')) {
      this.modal.deny();
    }
  }
}
