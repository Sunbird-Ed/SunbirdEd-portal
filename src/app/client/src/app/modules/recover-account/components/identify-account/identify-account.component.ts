import { RecoverAccountService } from './../../services';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {RecaptchaService, ResourceService, ToasterService} from '@sunbird/shared';
import {TelemetryService} from '@sunbird/telemetry';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { IImpressionEventInput, IEndEventInput, IStartEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  templateUrl: './identify-account.component.html',
  styleUrls: ['./identify-account.component.scss']
})
export class IdentifyAccountComponent implements OnInit {

  disableFormSubmit = true;
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  googleCaptchaSiteKey: string;
  nameNotExist = false;
  identiferStatus = '';
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
    public recaptchaService: RecaptchaService, public telemetryService: TelemetryService) {
      try {
        this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
      } catch (error) {
        this.googleCaptchaSiteKey = '';
      }
  }

  ngOnInit() {
    this.initializeForm();
    this.setTelemetryImpression();
  }
  initializeForm() {
    this.form = this.formBuilder.group({
      identifier: new FormControl(null, [Validators.required,
        Validators.pattern(/^([6-9]\d{9}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4})$/)]),
        name: new FormControl(null, [Validators.required])
    });
    this.form.valueChanges.subscribe(val => {
      this.nameNotExist = false;
      if (this.form.status === 'VALID') {
        this.disableFormSubmit = false;
      } else {
        this.disableFormSubmit = true;
      }
    });
    this.form.controls.identifier.valueChanges.subscribe(val => this.identiferStatus = '');
  }
  handleNext(captchaResponse?: string) {
    if (captchaResponse) {
      this.disableFormSubmit = true;
      this.recaptchaService.validateRecaptcha(captchaResponse).subscribe((data: any) => {
        if (_.get(data, 'result.success')) {
          this.initiateFuzzyUserSearch();
        }
      }, (error) => {
        const telemetryErrorData = {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          errorMessage: _.get(error, 'error.params.errmsg') || '',
          errorType: 'SYSTEM', pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          stackTrace: JSON.stringify((error && error.error) || '')
        };
        this.telemetryService.generateErrorEvent(telemetryErrorData);
        this.resetGoogleCaptcha();
      });
    }
  }

  initiateFuzzyUserSearch() {
    this.recoverAccountService.fuzzyUserSearch(this.form.value).subscribe(response => {
      if (_.get(response, 'result.response.count') > 0) { // both match
        this.navigateToNextStep(response);
      } else { // both dint match
        this.identiferStatus = 'NOT_MATCHED';
        this.nameNotExist = true;
      }
    }, error => {
      this.resetGoogleCaptcha();
      if (error.responseCode === 'PARTIAL_SUCCESS_RESPONSE') {
        this.identiferStatus = 'MATCHED';
        this.handleError(error);
      } else {
        this.identiferStatus = 'NOT_MATCHED';
        this.nameNotExist = true;
      }
    });
  }

  resetGoogleCaptcha() {
    if (this.googleCaptchaSiteKey) {
      this.captchaRef.reset();
    }
  }

  navigateToNextStep(response) {
    this.recoverAccountService.fuzzySearchResults = _.get(response, 'result.response.content');
    this.router.navigate(['/recover/select/account/identifier'], {
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }
  handleError(error) {
    this.errorCount += 1;
    this.nameNotExist = true;
    if (this.errorCount >= 2) {
      const reqQuery = this.activatedRoute.snapshot.queryParams;
      let resQuery: any = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
      resQuery.error_message = 'You have exceeded maximum retry. Please try after some time';
      resQuery = Object.keys(resQuery).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(resQuery[key])).join('&');
      const redirect_uri = reqQuery.error_callback + '?' + resQuery;
      window.location.href = redirect_uri;
    } else {

    }
  }
  private setTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      }
    };
  }
}
