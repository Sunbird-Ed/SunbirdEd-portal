import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-select-account-identifier',
  templateUrl: './select-account-identifier.component.html',
  styleUrls: ['./select-account-identifier.component.scss']
})
export class SelectAccountIdentifierComponent implements OnInit {
  selectedAccountId: any;
  validIdentifiers = [];
  errorCount = 0;
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) { }

  ngOnInit() {
    this.verifyState();
    this.initializeForm();
  }
  setSelectIdentifier(selectedAccountId) {
    this.selectedAccountId = selectedAccountId;
  }
  handleGenerateOtp() {
    this.recoverAccountService.generateOTP(this.selectedAccountId).subscribe(response => {
      this.navigateToNextStep();
    }, error => {
      this.handleError(error);
    });
  }
  verifyState() {
    if (!this.recoverAccountService.fuzzySearchResults || !this.recoverAccountService.fuzzySearchResults.length) {
      this.navigateToIdentifyAccount();
    }
  }
  navigateToNextStep() {
    this.recoverAccountService.selectedAccountDetails = this.selectedAccountId;
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
      resQuery.error_message = 'Generate OTP failed';
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
      if (element.phone) {
        this.validIdentifiers.push({
          id: element.id,
          type: 'phone',
          value: element.phone
        });
      }
      if (element.email) {
        this.validIdentifiers.push({
          id: element.id,
          type: 'email',
          value: element.email
        });
      }
    });
    if (!this.validIdentifiers.length) {
      this.navigateToIdentifyAccount();
      return;
    }
    this.selectedAccountId = this.validIdentifiers[0];
  }
}
