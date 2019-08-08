import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { FormBuilder, Validators, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { IImpressionEventInput, IEndEventInput, IStartEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  disableFormSubmit = true;
  form: FormGroup;
  errorCount = 0;
  telemetryImpression: IImpressionEventInput;
  telemetryCdata = [{
    id: 'user:account:recovery',
    type: 'Feature'
  }, {
    id: 'SB-13755',
    type: 'Task'
  }];
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService, public formBuilder: FormBuilder,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) { }

  ngOnInit() {
    this.verifyState();
    this.initializeForm();
    this.setTelemetryImpression();
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
    const password = group.controls.password.value;
    const confirmPassword = group.controls.confirmPassword.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  handleSubmit() {
    this.disableFormSubmit = true;
    const request = {
      request: {
        userId: this.recoverAccountService.selectedAccountIdentifier.id,
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
    if (!_.get(this.recoverAccountService, 'fuzzySearchResults.length') || _.isEmpty(this.recoverAccountService.selectedAccountIdentifier)
    || !this.recoverAccountService.otpVerified) {
      this.navigateToIdentifyAccount();
    }
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
