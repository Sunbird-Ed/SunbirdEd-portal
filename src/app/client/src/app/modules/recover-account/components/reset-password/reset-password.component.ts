import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { FormBuilder, Validators, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  disableFormSubmit = true;
  form: FormGroup;
  errorCount = 0;
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService, public formBuilder: FormBuilder,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) { }

  ngOnInit() {
    this.verifyState();
    this.initializeForm();
  }
  initializeForm() {
    this.form = this.formBuilder.group({
      password: new FormControl(null, [Validators.minLength(8)]),
      confirmPassword: new FormControl(null)
    }, { validator: this.checkPasswords });
    this.form.valueChanges.subscribe(val => {
      if (this.form.status === 'VALID') {
        this.disableFormSubmit = false;
      } else {
        this.disableFormSubmit = true;
      }
    });
  }
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }
  handleSubmit() {
    this.disableFormSubmit = true;
    const request = {
      request: {
        id: this.recoverAccountService.selectedAccountDetails.id,
        password: this.form.value.password
      }
    };
    this.recoverAccountService.resetPassword(request)
    .subscribe(response => {
      this.navigateToNextStep();
    }, error => {
      this.disableFormSubmit = false;
      this.handleError(error);
    });
  }
  navigateToNextStep() {
    const reqQuery = this.activatedRoute.snapshot.queryParams;
    let resQuery: any = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
    resQuery.success_message = 'Password has been reset, please login with new password';
    resQuery = Object.keys(resQuery).map(key =>
      encodeURIComponent(key) + '=' + encodeURIComponent(resQuery[key])).join('&');
    const redirect_uri = reqQuery.error_callback + '?' + resQuery;
    window.location.href = redirect_uri;
  }
  handleError(error) {
    this.errorCount += 1;
    if (this.errorCount >= 2) {
      const reqQuery = this.activatedRoute.snapshot.queryParams;
      let resQuery: any = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
      resQuery.error_message = 'Reset Password failed. Please try again';
      resQuery = Object.keys(resQuery).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(resQuery[key])).join('&');
      const redirect_uri = reqQuery.error_callback + '?' + resQuery;
      window.location.href = redirect_uri;
    } else {
      this.toasterService.error('Reset Password failed. Please try again');
    }
  }
  verifyState() {
    if (!_.get(this.recoverAccountService, 'fuzzySearchResults.length') || _.isEmpty(this.recoverAccountService.selectedAccountDetails)
    || !this.recoverAccountService.otpVerified) {
      this.navigateToIdentifyAccount();
    }
  }
  navigateToIdentifyAccount() {
    this.router.navigate(['/recover/identify/account'], {
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }
}
