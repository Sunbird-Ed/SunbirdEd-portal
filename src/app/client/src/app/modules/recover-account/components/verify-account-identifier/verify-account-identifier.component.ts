import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  templateUrl: './verify-account-identifier.component.html',
  styleUrls: ['./verify-account-identifier.component.scss']
})
export class VerifyAccountIdentifierComponent implements OnInit {
  disableFormSubmit = true;
  disableResendOtp = false;
  form: FormGroup;
  errorCount = 0;
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService, public formBuilder: FormBuilder,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) { }

  ngOnInit() {
    if (this.verifyState()) {
      this.initializeForm();
    }
  }
  initializeForm() {
    this.form = this.formBuilder.group({
      otp: new FormControl(null, [Validators.required])
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
        this.navigateToNextStep();
      }, error => {
        this.handleError(error);
      }
    );
  }
  navigateToNextStep() {
    this.recoverAccountService.otpVerified = true;
    this.router.navigate(['/recover/reset/password'], {
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }
  handleError(error) {
    this.errorCount += 1;
    if (this.errorCount >= 2) {
      const reqQuery = this.activatedRoute.snapshot.queryParams;
      let resQuery: any = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
      resQuery.error_message = 'OTP validation failed. Please try again';
      resQuery = Object.keys(resQuery).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(resQuery[key])).join('&');
      const redirect_uri = reqQuery.error_callback + '?' + resQuery;
      window.location.href = redirect_uri;
    } else {
      this.toasterService.error('OTP validation failed. Please try again');
    }
  }
  handleResendOtp() {
    const request = {
      request: {
        type: this.recoverAccountService.selectedAccountIdentifier.type,
        key: this.recoverAccountService.selectedAccountIdentifier.value,
        userId: this.recoverAccountService.selectedAccountIdentifier.id
      }
    };
    this.recoverAccountService.generateOTP(request).subscribe(response => {
      this.disableResendOtp = true;
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
}
