import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  ResourceService,
  ConfigService,
  ServerResponse,
  ToasterService,
  NavigationHelperService,
  UtilService,
  RecaptchaService
} from '@sunbird/shared';
import { SignupService } from './../../services';
import { TenantService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router, ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';

export enum SignUpStage {
  BASIC_INFO = 'basic_info',
  ONBOARDING_INFO = 'onboarding_info',
  EMAIL_PASSWORD = 'email_password',
  OTP = 'otp'
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  public unsubscribe = new Subject<void>();
  signUpForm;
  sbFormBuilder: FormBuilder;
  showContact = 'phone';
  disableSubmitBtn = true;
  disableForm = true;
  showPassword = false;
  captchaResponse = '';
  googleCaptchaSiteKey: string;
  showSignUpForm = true;
  showUniqueError = '';
  tenantDataSubscription: Subscription;
  logo: string;
  tenantName: string;
  resourceDataSubscription: any;
  telemetryStart: IStartEventInput;
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}>;
  instance: string;
  passwordError: string;
  showTncPopup = false;
  formInputType: string;
  isP1CaptchaEnabled: any;
  isIOSDevice = false;
  signupStage: SignUpStage;
  get Stage() { return SignUpStage; }

  constructor(formBuilder: FormBuilder, public resourceService: ResourceService,
    public signupService: SignupService, public toasterService: ToasterService,
    public tenantService: TenantService, public deviceDetectorService: DeviceDetectorService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public navigationhelperService: NavigationHelperService, public utilService: UtilService,
    public configService: ConfigService, public recaptchaService: RecaptchaService, private router: Router) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.signupStage = SignUpStage.BASIC_INFO;
    this.isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );

    try {
      this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
    } catch (error) {
      this.googleCaptchaSiteKey = '';
    }
    this.initializeFormFields();
    this.setInteractEventData();

    // Telemetry Start
    this.signUpTelemetryStart();

    this.isP1CaptchaEnabled = (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled'))
      ? (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled')).value : 'true';

  }


  signUpTelemetryStart() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.telemetryStart = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: this.activatedRoute.snapshot.data.telemetry.mode,
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
  }

  signUpTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }

  initializeFormFields() {
    this.signUpForm = {
      basicInfo: null,
      onboardingInfo: null,
      emailPassInfo: null
    };
  }

  subformInitialized(name: string, group: object) {
    this.signUpForm[name] = group
  }

  changeStep() {
    switch(this.signupStage) {
      case this.Stage.BASIC_INFO:
        this.signupStage = this.Stage.ONBOARDING_INFO;
        break;
      case this.Stage.ONBOARDING_INFO:
        this.signupStage = this.Stage.EMAIL_PASSWORD;
        break;
      case this.Stage.EMAIL_PASSWORD:
        this.signupStage = this.Stage.OTP;
        break;
      default:
        this.signupStage = this.Stage.BASIC_INFO;
        break;
    }
  }

  submitForm() {
    const formValues = this.signUpForm.value;
    // submit the form with a service
    // TODO Complete submit function
    console.log(formValues);  
  }
 
  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryCdata = [{ 'type': 'signup', 'id': this.activatedRoute.snapshot.data.telemetry.uuid }];
      this.signUpTelemetryImpression();
    });
  }

  ngOnDestroy() {
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setInteractEventData() {
    this.submitInteractEdata = {
      id: 'submit-signup',
      type: 'click',
      pageid: 'signup',
      extra: {
        // 'contactType': this.signUpForm.controls.contactType.value.toString()
      }
    };
  }

  generateTelemetry(e) {
    const selectedType = e.target.checked ? 'selected' : 'unselected';
    const interactData = {
      context: {
        env: 'self-signup',
        cdata: [
          {id: 'user:tnc:accept', type: 'Feature'},
          {id: 'SB-16663', type: 'Task'}
        ]
      },
      edata: {
        id: 'user:tnc:accept',
        type: 'click',
        subtype: selectedType,
        pageid: 'self-signup'
      }
    };
    this.telemetryService.interact(interactData);
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
        env: 'self-signup'
      },
      edata: {
        type: api,
        level: level,
        message: msg
      }
    };
    this.telemetryService.log(event);
  }

  redirectToLogin () {
    this.router.navigate(['/resources/play/content']);
  }
  
}
