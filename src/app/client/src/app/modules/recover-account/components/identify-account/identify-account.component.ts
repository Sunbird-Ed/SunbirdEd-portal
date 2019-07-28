import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-identify-account',
  templateUrl: './identify-account.component.html',
  styleUrls: ['./identify-account.component.scss']
})
export class IdentifyAccountComponent implements OnInit {

  disableFormSubmit = true;
  nameNotExist = false;
  identiferNotExist = false;
  form: FormGroup;
  errorCount = 0;
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService, public formBuilder: FormBuilder,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) {
  }

  ngOnInit() {
    this.initializeForm();
  }
  initializeForm() {
    this.form = this.formBuilder.group({
      identifier: new FormControl(null, [Validators.required, Validators.pattern(/^([6-9]\d{9}|\w+@\w+\.\w{2,3})$/)]),
      name: new FormControl(null, [Validators.required])
    });
    this.form.valueChanges.subscribe(val => {
      this.nameNotExist = false;
      this.identiferNotExist = false;
      if (this.form.status === 'VALID') {
        this.disableFormSubmit = false;
      } else {
        this.disableFormSubmit = true;
      }
    });
  }
  handleNext() {
    this.disableFormSubmit = true;
    const request = {
      request: this.form.value
    };
    this.recoverAccountService.fuzzyUserSearch(request)
    .subscribe(response => {
      this.navigateToNextStep(response);
    }, error => {
      this.handleError(error);
    });
  }
  navigateToNextStep(response) {
    this.recoverAccountService.fuzzySearchResults = _.get(response, 'result.account');
    this.router.navigate(['/recover/select/account/identifier'], {
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }
  handleError(error) {
    this.errorCount += 1;
    this.nameNotExist = true;
    this.identiferNotExist = true;
    if (this.errorCount >= 2) {
      const reqQuery = this.activatedRoute.snapshot.queryParams;
      let resQuery: any = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
      resQuery.error_message = 'You have exceeded maximum retry';
      resQuery = Object.keys(resQuery).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(resQuery[key])).join('&');
      const redirect_uri = reqQuery.error_callback + '?' + resQuery;
      window.location.href = redirect_uri;
    }
  }
}
