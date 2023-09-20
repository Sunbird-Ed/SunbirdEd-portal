import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subject, Subscription, throwError } from 'rxjs';
import { RegisterService } from '../../../../services/login/register.service';

import {
  ResourceService,
  NavigationHelperService
} from '@sunbird/shared';
import { TenantService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router, ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { catchError } from 'rxjs/operators';

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
  public unsubscribe = new Subject<void>();
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
  get Stage() { return SignUpStage; }
  slideIndex = 1;
  registerErrorMessage = '';
  registerSuccessMessage = '';
  firstNameFieldError = false;
  lastNameFieldError = false;
  emailFieldError = false;
  passwordFieldError = false;
  confirmPasswordFieldError = false;

  constructor(public resourceService: ResourceService, public tenantService: TenantService, public deviceDetectorService: DeviceDetectorService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public navigationhelperService: NavigationHelperService, private router: Router, private registerService: RegisterService) {
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
          this.tenantName = data.tenantData.titleName;
        }
      }
    );

    this.initializeFormFields();
    this.setInteractEventData();

    this.showSlides(this.slideIndex);
    setInterval(() => { this.plusSlides(1) }, 3000);
    let element = document.getElementsByTagName('body')[0];
    element.style.overflow = "hidden";

    // Telemetry Start
    this.signUpTelemetryStart();
  }

   // Next/previous controls
   plusSlides(n: any) {
    this.showSlides(this.slideIndex += n);
  }

  // Thumbnail image controls
  currentSlide(n: any) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: any) {
    let i: any;
    let slides: any = document.getElementsByClassName("mySlides");
    let dots: any = document.getElementsByClassName("dot");
    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex - 1].style.display = "block";
    dots[this.slideIndex - 1].className += " active";
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

  redirectToLogin () {
    window.location.href = '/resources';
  }

  register() {
    let firstName: any = document.getElementById("first_name");
    let lastName: any = document.getElementById("last_name");
    let email: any = document.getElementById("email");
    let username: any = document.getElementById("username");
    let password: any = document.getElementById("password");
    let confirmPassword: any = document.getElementById("confirm_password");

    // Validation block

    this.firstNameFieldError = false;
    this.lastNameFieldError = false;
    this.emailFieldError = false;
    this.passwordFieldError = false;
    this.confirmPasswordFieldError = false
    if (firstName.value === "" && lastName.value === "" && password.value === "") {
      this.registerErrorMessage = "All the fields are required";
      this.firstNameFieldError = true;
      this.lastNameFieldError = true;
      this.emailFieldError = true;
      this.passwordFieldError = true;
      this.confirmPasswordFieldError = true
    } else if (firstName.value === "") {
      this.firstNameFieldError = true;
      this.registerErrorMessage = "Please enter first name";
    } else if (lastName.value === "") {
      this.lastNameFieldError = true;
      this.registerErrorMessage = "Please enter last name";
    } else if (email.value === "") {
      this.emailFieldError = true;
      this.registerErrorMessage = "Please enter email id";
    } else if (password.value === "") {
      this.passwordFieldError = true;
      this.registerErrorMessage = "Please enter password";
    } else if (password.value === "") {
      this.confirmPasswordFieldError = true;
      this.registerErrorMessage = "Please confirm password";
    } else if (password.value !== confirmPassword.value) {
      this.passwordFieldError = true;
      this.confirmPasswordFieldError = true;
      this.registerErrorMessage = "Password & confirm password does not match";
    } else {
      this.registerErrorMessage = "";
    }

    if (this.registerErrorMessage !== "") {
      return;
    }

    const data = {
      request: {
        firstName: firstName.value,
        lastName: lastName.value,
        userName: email.value,
        email: email.value,
        emailVerified: true,
        password: password.value
      }
    }
    this.registerService.register(data).pipe(catchError(error => {
      // const statusCode = error.status;
      this.registerErrorMessage = error.error.params.errmsg;
      return throwError(error);
    })
    ).subscribe(res => {
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
      confirmPassword.value = "";
      this.registerSuccessMessage = "Registration successfull, please login."
      console.log('Register', res);
    })
  }
  
}
