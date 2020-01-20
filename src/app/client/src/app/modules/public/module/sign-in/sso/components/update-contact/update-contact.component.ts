import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TenantService, UserService, OtpService, OrgDetailsService } from '@sunbird/core';
import { first, delay } from 'rxjs/operators';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Component({
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.scss']
})
export class UpdateContactComponent implements OnInit, AfterViewInit {
  @ViewChild('contactDetailsForm') private contactDetailsForm;
  public telemetryImpression;
  public submitPhoneInteractEdata;
  public tenantInfo: any = {};
  public showOtpComp = false;
  public showMergeConfirmation = false;
  public userBlocked = false;
  public userExist = false;
  public disableSubmitBtn = true;
  public otpData = {};
  public userDetails: any = {};
  public showError = false;
  public custodianOrgDetails;
  public isValidIdentifier;
  public validationPattern = {
    phone: /^[6-9]\d{9}$/,
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/
  };
  public contactForm = {
    value: '',
    type: 'phone'
  };
  constructor(public activatedRoute: ActivatedRoute, private tenantService: TenantService, public resourceService: ResourceService,
    public userService: UserService, public otpService: OtpService, public toasterService: ToasterService,
    public navigationHelperService: NavigationHelperService, private orgDetailsService: OrgDetailsService) { }

  ngOnInit() {
    this.setTenantInfo();
    this.setTelemetryData();
  }
  ngAfterViewInit () {
    this.handleFormChangeEvent();
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.activatedRoute.snapshot.data.telemetry.uri,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }
  handleFormChangeEvent() {
    this.contactDetailsForm.valueChanges.pipe(delay(1)).subscribe((data, data2) => {
      if (_.get(this.contactDetailsForm, 'controls.value.status') === 'VALID'
        && this.validationPattern[this.contactForm.type].test(this.contactForm.value)) {
        this.disableSubmitBtn = false;
         this.isValidIdentifier = true;
        this.userExist = false;
        this.userBlocked = false;
      } else {
        this.disableSubmitBtn = true;
        this.isValidIdentifier = false;
        this.userExist = false;
        this.userBlocked = false;
      }
    });
  }
  private checkUserExist() {
    const uri = this.contactForm.type + '/' + this.contactForm.value;
    combineLatest(this.userService.getUserByKey(uri), this.getCustodianOrgDetails())
    .pipe(map(data => ({
      userDetails: data[0], custOrgDetails: data[1]
    })))
    .subscribe(({userDetails, custOrgDetails}) => {
        if (_.get(userDetails, 'result.response.rootOrgId') === _.get(custOrgDetails, 'result.response.value')) {
          this.userDetails = userDetails.result.response;
          this.disableSubmitBtn = false;
          this.userExist = false;
          this.userBlocked =  false;
          this.generateOtp();
        } else {
          this.userExist = true;
          this.userBlocked =  false;
          this.disableSubmitBtn = true;
        }
      }, err => {
        this.userDetails = {};
        if (_.get(err, 'error.params.status') && err.error.params.status === 'USER_ACCOUNT_BLOCKED') {
          this.userBlocked =  true;
          this.userExist = false;
          this.disableSubmitBtn = true;
          return;
        }
        this.generateOtp();
        this.disableSubmitBtn = false;
        this.userExist = false;
        this.userBlocked = false;
    });
  }
  private getCustodianOrgDetails() {
    if (this.custodianOrgDetails) {
      return of(this.custodianOrgDetails);
    }
    return this.orgDetailsService.getCustodianOrg().pipe(map((custodianOrgDetails) => {
      this.custodianOrgDetails = custodianOrgDetails;
      return custodianOrgDetails;
    }));
  }

  public onFormUpdate() {
    this.checkUserExist();
  }

  private generateOtp() {
    const request = {
      request: {
        'key': this.contactForm.value,
        'type': this.contactForm.type
      }
    };
    this.otpService.generateOTP(request).subscribe((data) => {
        this.prepareOtpData();
        this.showOtpComp = true;
      }, (err) => {
        const errorMessage = (err.error.params.status === 'PHONE_ALREADY_IN_USE') || (err.error.params.status === 'EMAIL_IN_USE') ||
          (err.error.params.status === 'ERROR_RATE_LIMIT_EXCEEDED') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0085;
        this.toasterService.error(errorMessage);
      }
    );
  }
  resetForm(type = 'phone') {
    this.disableSubmitBtn = true;
    this.contactForm = {
      value: '',
      type: type
    };
    this.userDetails = {};
    this.userExist = false;
    this.userBlocked = false;
  }
  private prepareOtpData() {
    this.otpData = {
      type: this.contactForm.type,
      value: this.contactForm.value,
      instructions: this.contactForm.type === 'phone' ?
        this.resourceService.frmelmnts.instn.t0083 : this.resourceService.frmelmnts.instn.t0084,
      retryMessage: this.contactForm.type === 'phone' ?
        this.resourceService.frmelmnts.lbl.unableToUpdateMobile : this.resourceService.frmelmnts.lbl.unableToUpdateEmail,
      wrongOtpMessage: this.contactForm.type === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
        this.resourceService.frmelmnts.lbl.wrongEmailOTP
    };
  }
  public handleOtpValidationFailed() {
    this.showOtpComp = false;
    this.resetForm();
    setTimeout(() => this.handleFormChangeEvent(), 100);
  }
  getQueryParams(queryObj) {
    return '?' + Object.keys(queryObj).filter(key => queryObj[key])
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
      .join('&');
  }
  public handleOtpValidationSuccess() {
    const query: any = {
      type: this.contactForm.type,
      value: this.contactForm.value
    };
    if (!_.isEmpty(this.userDetails)) {
      if (this.userDetails.id) {
        this.showOtpComp = false;
        this.showMergeConfirmation = true;
      }
    } else {
      window.location.href = `/v1/sso/contact/verified` +
        this.getQueryParams({...this.activatedRoute.snapshot.queryParams, ...query});
    }
  }
  private setTelemetryData() {
    this.submitPhoneInteractEdata = {
      id: 'submit-phone',
      type: 'click',
      pageid: 'sso-sign-in',
    };
  }
  private setTenantInfo() {
    this.tenantService.tenantData$.pipe(first()).subscribe(data => {
      if (!data.err) {
        this.tenantInfo = {
          logo: data.tenantData.logo,
          tenantName: data.tenantData.titleName
        };
      }
    });
  }
}
