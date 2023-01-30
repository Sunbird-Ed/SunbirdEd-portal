import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {
  ResourceService,
  NavigationHelperService,
  ServerResponse
} from '@sunbird/shared';
import { TenantService, FormService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router, ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { takeUntil } from 'rxjs/operators';

export enum SignUpStage {
  BASIC_INFO = 'basic_info',
  ONBOARDING_INFO = 'onboarding_info',
  EMAIL_PASSWORD = 'email_password',
  OTP = 'otp'
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss','./signup_form.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  public unsubscribe$ = new Subject<void>();
  signUpForm;
  tenantDataSubscription: Subscription;
  logo: string;
  tenantName: string;
  resourceDataSubscription: any;
  telemetryStart: IStartEventInput;
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}>;
  instance: string;
  formInputType: string;
  isIOSDevice = false;
  signupStage: SignUpStage;
  routeParams: any;
  registerFormConfig: any = {};
  get Stage() { return SignUpStage; }
  secondaryLogo:string;

  constructor(public resourceService: ResourceService, public tenantService: TenantService, public deviceDetectorService: DeviceDetectorService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public navigationhelperService: NavigationHelperService, private router: Router, private formService: FormService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.routeParams = params;
    });
    this.signupStage = SignUpStage.BASIC_INFO;
    this.isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.secondaryLogo = data?.tenantData.secondaryLogo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );

    this.initializeFormFields();
    this.setInteractEventData();

    // Telemetry Start
    this.signUpTelemetryStart();
    this.getRegisterFormConfig();
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
      emailPassInfo: null,
      routeParams: this.routeParams
    };
  }

  subformInitialized(name: string, group: object) {
    this.signUpForm[name] = group
  }

  changeStep() {
    switch(this.signupStage) {
      case this.Stage.BASIC_INFO:
        this.signupStage = this.Stage.ONBOARDING_INFO;
        if (this.registerFormConfig?.skipStepTwo) {
          this.signupStage = this.Stage.EMAIL_PASSWORD;
        }
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  getRegisterFormConfig(): void {
    const formInputParams = {
      formType: 'config',
      contentType: 'register',
      formAction: 'display',
      component: 'portal',
    };

    this.formService.getFormConfig(formInputParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((responseData) => {
        this.registerFormConfig = responseData;
      })
  }

  redirectToLogin () {
    window.location.href = '/resources';
  }
  
}
