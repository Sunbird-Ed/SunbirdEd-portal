import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ResourceService, ToasterService, ConfigService} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IImpressionEventInput, IEndEventInput, IStartEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';


@Component({
  templateUrl: './select-account-identifier.component.html',
  styleUrls: ['./select-account-identifier.component.scss']
})
export class SelectAccountIdentifierComponent implements OnInit {
  selectedAccountIdentifier: any = {};
  validIdentifiers = [];
  errorCount = 0;
  disableFormSubmit = true;
  telemetryImpression: IImpressionEventInput;
  telemetryCdata = [{
    id: 'user:account:recovery',
    type: 'Feature'
  }, {
    id: 'SB-13755',
    type: 'Task'
  }];
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService,
              public configService: ConfigService) {
  }

  ngOnInit() {
    if (this.verifyState()) {
      this.initializeForm();
    }
    this.setTelemetryImpression();
  }
  setSelectIdentifier(selectedAccountIdentifier) {
    this.disableFormSubmit = false;
    this.selectedAccountIdentifier = selectedAccountIdentifier;
  }
  handleGenerateOtp() {
    const request = {
      request: {
        type: this.selectedAccountIdentifier.type,
        key: this.selectedAccountIdentifier.value,
        userId: this.selectedAccountIdentifier.id,
        templateId: this.configService.constants.TEMPLATES.RESET_PASSWORD_TEMPLATE
      }
    };
    this.recoverAccountService.generateOTP(request).subscribe(response => {
      this.navigateToNextStep();
    }, error => {
      this.handleError(error);
    });
  }
  verifyState() {
    if (!_.get(this.recoverAccountService, 'fuzzySearchResults.length')) {
      this.navigateToIdentifyAccount();
      return false;
    }
    return true;
  }
  navigateToNextStep() {
    this.recoverAccountService.selectedAccountIdentifier = this.selectedAccountIdentifier;
    this.router.navigate(['/recover/verify/account/identifier'], {
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }
  navigateToIdentifyAccount() {
    this.router.navigate(['/recover/identify/account'], {
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }
  handleError(error) {
    this.errorCount += 1;
    if (this.errorCount >= 2) {
      const reqQuery = this.activatedRoute.snapshot.queryParams;
      let resQuery: any = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
      resQuery.error_message = 'Generate OTP failed. Please try again after some time';
      resQuery = Object.keys(resQuery).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(resQuery[key])).join('&');
      const redirect_uri = reqQuery.error_callback + '?' + resQuery;
      window.location.href = redirect_uri;
    } else {
      this.toasterService.error('Generate OTP failed. Please try again');
    }
  }
  initializeForm() {
    _.forEach(this.recoverAccountService.fuzzySearchResults, element => {
      _.forIn(element, (value, key) => {
        if (['phone', 'email', 'prevUsedEmail', 'prevUsedPhone', 'recoveryEmail', 'recoveryPhone'].includes(key)) {
          if (value) {
            this.validIdentifiers.push({
              id: element.id,
              type: key,
              value: value
            });
          }
        }
      });
    });
    if (!this.validIdentifiers.length) {
      this.toasterService.error('No contact details found for linked account. Please try again');
      this.navigateToIdentifyAccount();
      return false;
    }
    return true;
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
        uri: this.router.url
       // ,extra: { linkerAccount: this.validIdentifiers }
      }
    };
  }
}
