import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TenantService, UserService, OtpService, OrgDetailsService, TncService } from '@sunbird/core';
import { first, delay } from 'rxjs/operators';
import {
  ResourceService, ToasterService, NavigationHelperService,
  ServerResponse, UtilService
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import {SignupService} from '../../../../signup/services';
import { map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.scss']
})
export class UpdateContactComponent implements OnInit, AfterViewInit {
  @ViewChild('contactDetailsForm', {static: false}) private contactDetailsForm;
  @ViewChild('captchaRef', {static: false}) captchaRef: RecaptchaComponent;
  public telemetryImpression;
  public tenantInfo: any = {};
  public showOtpComp = false;
  public showMergeConfirmation = false;
  public userBlocked = false;
  public userExist = false;
  public disableSubmitBtn = true;
  public otpData = {};
  public userDetails: any = {};
  public showError = false;
  public custodianOrgDetails;
  public isValidIdentifier;
  public validationPattern = {
    phone: /^[6-9]\d{9}$/,
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/
  };
  public contactForm = {
    value: '',
    type: 'phone',
    tncAccepted: false
  };
  tncLatestVersion: string;
  termsAndConditionLink: string;
  instance: string;
  showTncPopup = false;
  googleCaptchaSiteKey: string;
  isP1CaptchaEnabled: any;
  captchaValidationFailed = false;


  constructor(public activatedRoute: ActivatedRoute, private tenantService: TenantService, public resourceService: ResourceService,
              public userService: UserService, public otpService: OtpService, public toasterService: ToasterService,
              public navigationHelperService: NavigationHelperService, private orgDetailsService: OrgDetailsService,
              public utilService: UtilService, public signupService: SignupService,
              public telemetryService: TelemetryService, public tncService: TncService) {
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.isP1CaptchaEnabled = (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled'))
      ? (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled')).value : 'true';
    try {
      this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
    } catch (error) {
      this.googleCaptchaSiteKey = '';
    }
    this.fetchTncConfiguration();
    this.setTenantInfo();
  }
  ngAfterViewInit () {
    this.handleFormChangeEvent();
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.activatedRoute.snapshot.data.telemetry.uri,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  /**
   * Toogles contact form value based on event data
   * @param e event data
   */
  toggleTncCheckBox(e) {
    this.contactForm.tncAccepted = e.target.checked;
    const cData = {
      env: 'sso-signup',
      cdata: [
        {id: 'user:tnc:accept', type: 'Feature'},
        {id: 'SB-16663', type: 'Task'}
      ]
    };
    const eData = {
      id: 'user:tnc:accept',
      type: 'click',
      subtype: this.contactForm.tncAccepted ? 'selected' : 'unselected',
      pageid: 'sso-signup'
    };
    this.generateInteractEvent(cData, eData);
  }

  /**
   * Used to generate interact telemetry
   * @param tncAcceptedStatus
   */
  private generateInteractEvent(cData, eData) {
    const interactData = {
      context: cData,
      edata: eData
    };
    this.telemetryService.interact(interactData);
  }

  /**
   * Fetches tnc related configuration
   */
  fetchTncConfiguration() {
    this.tncService.getTncConfig().subscribe((data: ServerResponse) => {
      this.telemetryLogEvents('fetch-terms-condition', true);
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
      this.telemetryLogEvents('fetch-terms-condition', false);
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      }
    );
  }

  handleFormChangeEvent() {
    this.contactDetailsForm.valueChanges.pipe(delay(1)).subscribe((data, data2) => {
      if (_.get(this.contactDetailsForm, 'status') === 'VALID' &&
        _.get(this.contactDetailsForm, 'controls.tncAccepted.value')) {
        this.disableSubmitBtn = false;
         this.isValidIdentifier = true;
        this.userExist = false;
        this.userBlocked = false;
      } else {
        this.disableSubmitBtn = true;
        this.isValidIdentifier = _.get(this.contactDetailsForm, 'controls.value.status') === 'VALID'
          && this.validationPattern[this.contactForm.type].test(this.contactForm.value);
        this.userExist = false;
        this.userBlocked = false;
      }
    });
  }
  private checkUserExist(captchaResponse?) {
    const uri = this.contactForm.type + '/' + this.contactForm.value + '?captchaResponse=' + captchaResponse;
    combineLatest(this.userService.getUserByKey(uri), this.orgDetailsService.getCustodianOrgDetails())
    .pipe(map(data => ({
      userDetails: data[0], custOrgDetails: data[1]
    })))
    .subscribe(({userDetails, custOrgDetails}) => {
        this.resetGoogleCaptcha();
        if (_.get(userDetails, 'result.response.rootOrgId') === _.get(custOrgDetails, 'result.response.value')) {
          this.userDetails = userDetails.result.response;
          this.disableSubmitBtn = false;
          this.userExist = false;
          this.userBlocked =  false;
          this.generateOtp();
        } else {
          this.userExist = true;
          this.userBlocked =  false;
          this.disableSubmitBtn = true;
        }
      }, err => {
        this.userDetails = {};
        if (_.get(err, 'error.params.status') && err.error.params.status === 'USER_ACCOUNT_BLOCKED') {
          this.userBlocked =  true;
          this.userExist = false;
          this.disableSubmitBtn = true;
          return;
        }
        if (_.get(err, 'error.params.status') && err.error.params.status === 'I\'m a teapot') {
          this.disableSubmitBtn = true;
          this.captchaValidationFailed = true;
          return;
        }
        this.generateOtp();
        this.disableSubmitBtn = false;
        this.userExist = false;
        this.userBlocked = false;
    });
  }

  public onFormUpdate(captchaResponse?) {
    this.checkUserExist(captchaResponse);
    const cData = {
      env: 'sso-signup',
      cdata: []
    };
    const eData = {
      id: this.contactForm.type === 'email' ? 'submit-email' : 'submit-phone',
      type: 'click',
      pageid: 'sso-sign-in',
    };
    this.generateInteractEvent(cData, eData);
  }

  private generateOtp() {
    const request = {
      request: {
        'key': this.contactForm.value,
        'type': this.contactForm.type
      }
    };
    this.otpService.generateOTP(request).subscribe((data) => {
        this.prepareOtpData();
        this.showOtpComp = true;
      }, (err) => {
        const errorMessage = (err.error.params.status === 'PHONE_ALREADY_IN_USE') || (err.error.params.status === 'EMAIL_IN_USE') ||
          (err.error.params.status === 'ERROR_RATE_LIMIT_EXCEEDED') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0085;
        this.toasterService.error(errorMessage);
      }
    );
  }
  resetForm(type = 'phone') {
    this.disableSubmitBtn = true;
    this.contactForm = {
      value: '',
      type: type,
      tncAccepted: false
    };
    this.userDetails = {};
    this.userExist = false;
    this.userBlocked = false;
  }
  private prepareOtpData() {
    this.otpData = {
      type: this.contactForm.type,
      value: this.contactForm.value,
      instructions: this.contactForm.type === 'phone' ?
        this.resourceService.frmelmnts.instn.t0083 : this.resourceService.frmelmnts.instn.t0084,
      retryMessage: this.contactForm.type === 'phone' ?
        this.resourceService.frmelmnts.lbl.unableToUpdateMobile : this.resourceService.frmelmnts.lbl.unableToUpdateEmail,
      wrongOtpMessage: this.contactForm.type === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
        this.resourceService.frmelmnts.lbl.wrongEmailOTP
    };
  }
  public handleOtpValidationFailed() {
    this.showOtpComp = false;
    this.resetForm();
    setTimeout(() => this.handleFormChangeEvent(), 100);
  }
  getQueryParams(queryObj) {
    return '?' + Object.keys(queryObj).filter(key => queryObj[key])
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
      .join('&');
  }
  public handleOtpValidationSuccess() {
    const query: any = {
      type: this.contactForm.type,
      value: this.contactForm.value,
      tncAccepted: this.contactForm.tncAccepted,
      tncVersion: this.tncLatestVersion
    };
    if (!_.isEmpty(this.userDetails)) {
      if (this.userDetails.id) {
        this.showOtpComp = false;
        this.showMergeConfirmation = true;
      }
    } else {
      window.location.href = `/v1/sso/contact/verified` +
        this.getQueryParams({...this.activatedRoute.snapshot.queryParams, ...query});
    }
  }
  private setTenantInfo() {
    this.tenantService.tenantData$.pipe(first()).subscribe(data => {
      if (!data.err) {
        this.tenantInfo = {
          logo: data.tenantData.logo,
          tenantName: data.tenantData.titleName
        };
      }
    });
  }

  telemetryLogEvents(api: any, status: boolean) {
    let level = 'ERROR';
    let msg = api + ' failed';
    if (status) {
      level = 'SUCCESS';
      msg = api + ' success';
    }
    const event = {
      context: {
        env: 'sso-signup'
      },
      edata: {
        type: api,
        level: level,
        message: msg
      }
    };
    this.telemetryService.log(event);
  }

  showAndHidePopup(mode: boolean) {
    this.showTncPopup = mode;
  }

  /**
   * @param  {string} captchaResponse - reCaptcha token
   * @description - Callback function for reCaptcha response
   * @since - release-3.1.0
   */
  resolved(captchaResponse: string) {
    if (captchaResponse) {
      this.onFormUpdate(captchaResponse);
    }
  }

  /**
   * @description - Function to reset reCaptcha
   * @since - release-3.1.0
   */
  resetGoogleCaptcha() {
    const element: HTMLElement = document.getElementById('resetGoogleCaptcha') as HTMLElement;
    element.click();
  }

  /**
   * @description - Function to be called on form submit
   * @since - release-3.1.0
   */
  submitForm() {
    if (this.isP1CaptchaEnabled === 'true') {
      this.resetGoogleCaptcha();
      this.captchaRef.execute();
    } else {
      this.onFormUpdate();
    }
  }
}
