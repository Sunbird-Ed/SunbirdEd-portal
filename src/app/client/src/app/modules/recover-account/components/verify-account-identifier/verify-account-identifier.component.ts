import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ResourceService, ToasterService, ConfigService} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { IImpressionEventInput, IEndEventInput, IStartEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  templateUrl: './verify-account-identifier.component.html',
  styleUrls: ['./verify-account-identifier.component.scss']
})
export class VerifyAccountIdentifierComponent implements OnInit {
  disableFormSubmit = true;
  disableResendOtp = false;
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
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService,
              public configService: ConfigService) {
  }

  ngOnInit() {
    if (this.verifyState()) {
      this.initializeForm();
    }
    this.setTelemetryImpression();
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
        this.resetPassword();
      }, error => {
        this.disableFormSubmit = false;
        this.handleError(error);
      }
    );
  }
  resetPassword() {
    const request = {
      request: {
        type: this.recoverAccountService.selectedAccountIdentifier.type,
        key: this.recoverAccountService.selectedAccountIdentifier.value,
        userId: this.recoverAccountService.selectedAccountIdentifier.id
      }
    };
    this.recoverAccountService.resetPassword(request)
    .subscribe(response => {
      if (response.result.link) {
        window.location.href = response.result.link;
      } else {
        this.handleError(response);
      }
    }, error => {
      this.disableFormSubmit = false;
      this.handleError(error);
    });
  }
  handleError(error) {
    this.errorCount += 1;
    if (this.errorCount >= 2) {
      const reqQuery = this.activatedRoute.snapshot.queryParams;
      let resQuery: any = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
      resQuery.error_message = 'OTP validation failed.';
      resQuery = Object.keys(resQuery).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(resQuery[key])).join('&');
      const redirect_uri = reqQuery.error_callback + '?' + resQuery;
      window.location.href = redirect_uri;
    } else {
      this.toasterService.error('OTP validation failed.');
    }
  }
  handleResendOtp() {
    const request = {
      request: {
        type: this.recoverAccountService.selectedAccountIdentifier.type,
        key: this.recoverAccountService.selectedAccountIdentifier.value,
        userId: this.recoverAccountService.selectedAccountIdentifier.id,
        templateId: this.configService.constants.TEMPLATES.RESET_PASSWORD_TEMPLATE
      }
    };
    this.recoverAccountService.generateOTP(request).subscribe(response => {
      this.disableResendOtp = true;
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
