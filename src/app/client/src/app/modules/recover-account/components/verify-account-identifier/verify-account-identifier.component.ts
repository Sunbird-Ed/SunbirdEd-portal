import { RecoverAccountService } from './../../services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ResourceService, ToasterService, ConfigService, InterpolatePipe, UtilService} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  templateUrl: './verify-account-identifier.component.html',
  styleUrls: ['./verify-account-identifier.component.scss']
})
export class VerifyAccountIdentifierComponent implements OnInit {
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  disableFormSubmit = true;
  disableResendOtp = false;
  form: UntypedFormGroup;
  errorCount = 0;
  counter;
  resendOTPbtn: string;
  resendOtpCounter = 1;
  maxResendTry = 4;
  errorMessage: string;
  telemetryImpression: IImpressionEventInput;
  telemetryCdata = [{
    id: 'user:account:recovery',
    type: 'Feature'
  }, {
    id: 'SB-13755',
    type: 'Task'
  }];
  googleCaptchaSiteKey: string;
  isCaptchaEnabled = true;
  isP2CaptchaEnabled: any;
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService, public formBuilder: UntypedFormBuilder,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService,
              public utilService: UtilService, public configService: ConfigService) {
  }

  ngOnInit() {
    if (this.verifyState()) {
      this.initializeForm();
    }
    this.resendOtpEnablePostTimer();
    this.setTelemetryImpression();
    try {
      this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
    } catch (error) {
      this.googleCaptchaSiteKey = '';
    }
    this.isP2CaptchaEnabled = (<HTMLInputElement>document.getElementById('p2reCaptchaEnabled'))
      ? (<HTMLInputElement>document.getElementById('p2reCaptchaEnabled')).value : 'true';
  }
  resendOtpEnablePostTimer() {
    this.counter = 20;
    this.disableResendOtp = false;
    setTimeout(() => {
      this.disableResendOtp = true;
    }, 22000);
    const interval = setInterval(() => {
      // this.resendOTPbtn = this.resourceService.frmelmnts.lbl.resendOTP + ' (' + this.counter + ')';
      this.counter--;
      if (this.counter < 0) {
        // this.resendOTPbtn = this.resourceService.frmelmnts.lbl.resendOTP;
        clearInterval(interval);
      }
    }, 1000);
  }
  initializeForm() {
    this.form = this.formBuilder.group({
      otp: new UntypedFormControl(null, [Validators.required])
    });
    this.form.valueChanges.subscribe(val => {
      if (this.form.status === 'VALID') {
        this.disableFormSubmit = false;
      } else {
        this.disableFormSubmit = true;
      }
    });
  }
  handleVerifyOtp() {
    this.disableFormSubmit = true;
    const request = {
      request: {
        type: this.recoverAccountService.selectedAccountIdentifier.type,
        key: this.recoverAccountService.selectedAccountIdentifier.value,
        otp: this.form.controls.otp.value,
        userId: this.recoverAccountService.selectedAccountIdentifier.id
      }
    };
    this.recoverAccountService.verifyOTP(request)
    .subscribe(response => {
        this.resetPassword(response);
      }, error => {
        this.form.controls.otp.reset();
        this.handleError(error);
      }
    );
  }
  resetPassword(data?: any) {
    const request = {
      request: {
        type: this.recoverAccountService.selectedAccountIdentifier.type,
        key: this.recoverAccountService.selectedAccountIdentifier.value,
        userId: this.recoverAccountService.selectedAccountIdentifier.id
      }
    };
    request.request['reqData'] = _.get(data, 'reqData');
    this.recoverAccountService.resetPassword(request)
    .subscribe(response => {
      if (response.result.link) {
        window.location.href = response.result.link;
      } else {
        this.handleError(response);
      }
    }, error => {
      this.handleError(error);
      this.disableFormSubmit = false;
    });
  }
  handleError(err) {
    if (_.get(err, 'error.result.remainingAttempt') === 0) {
      this.disableFormSubmit = true;
      this.utilService.redirectToLogin(this.resourceService.messages.emsg.m0050);
    } else {
      const filterPipe = new InterpolatePipe();
      const errorMessage =
        filterPipe.transform(this.resourceService.messages.imsg.m0086, '{remainingAttempt}', _.get(err, 'error.result.remainingAttempt'));
      this.toasterService.error(errorMessage);
    }
  }

  resolved(captchaResponse: string) {
    if (captchaResponse) {
      this.handleResendOtp(captchaResponse);
    }
  }

  submitResendOTP() {
    if (this.isP2CaptchaEnabled === 'true') {
      this.captchaRef.reset();
      this.captchaRef.execute();
    } else {
      this.handleResendOtp();
    }
  }

  handleResendOtp(captchaResponse?) {
    this.disableResendOtp = false;
    this.resendOtpCounter = this.resendOtpCounter + 1 ;
    if (this.resendOtpCounter >= this.maxResendTry) {
      this.disableResendOtp = false;
      this.errorMessage = this.resourceService.frmelmnts.lbl.OTPresendMaxretryreached;
      return false;
    }
    const request = {
      request: {
        type: this.recoverAccountService.selectedAccountIdentifier.type,
        key: this.recoverAccountService.selectedAccountIdentifier.value,
        userId: this.recoverAccountService.selectedAccountIdentifier.id,
        templateId: this.configService.constants.TEMPLATES.RESET_PASSWORD_TEMPLATE
      }
    };
    this.recoverAccountService.generateOTP(request, captchaResponse).subscribe(response => {
      this.resendOtpEnablePostTimer();
      this.toasterService.success('OTP sent successfully.');
    }, error => {
      this.toasterService.error('Resend OTP failed. Please try again');
    });
  }
  verifyState() {
    if (!_.get(this.recoverAccountService, 'fuzzySearchResults.length')
      || _.isEmpty(this.recoverAccountService.selectedAccountIdentifier)) {
      this.navigateToIdentifyAccount();
      return false;
    }
    return true;
  }
  navigateToIdentifyAccount() {
    this.router.navigate(['/recover/identify/account'], {
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }
  private setTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata
      },
      object: {
        id: this.recoverAccountService.selectedAccountIdentifier.id,
        type: 'user',
        ver: 'v1',
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      }
    };
  }
}
