import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TenantService, UserService, OtpService } from '@sunbird/core';
import { first } from 'rxjs/operators';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  templateUrl: './update-phone.component.html',
  styleUrls: ['./update-phone.component.scss']
})
export class UpdatePhoneComponent implements OnInit, AfterViewInit {
  public phoneForm: FormGroup;
  public phoneNumber: number;
  public submitPhoneNumber = false;
  public telemetryImpression;
  public submitPhoneInteractEdata;
  public tenantInfo: any = {};
  public showOtpComp = false;
  public enableSubmitBtn = false;
  public showUniqueError;
  otpData = {};
  constructor(public activatedRoute: ActivatedRoute, private tenantService: TenantService, public resourceService: ResourceService,
    public userService: UserService, public otpService: OtpService, public toasterService: ToasterService,
    public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
    this.setTenantInfo();
    this.initializeForm();
    this.setTelemetryData();
  }
  private initializeForm() {
    this.phoneNumber = undefined;
    this.phoneForm = new FormGroup({
      'phone': new FormControl(null, [ Validators.required, Validators.pattern('^\\d{10}$')]),
      'uniquePhone': new FormControl(null, [Validators.required])
    });
    this.phoneForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.phoneForm.status === 'VALID');
    });
    this.phoneController.valueChanges.subscribe(phone => {
      if (this.phoneController.status === 'VALID' && this.phoneNumber !== this.phoneController.value) {
        this.phoneNumber = this.phoneController.value;
        this.phoneForm.controls.uniquePhone.setValue('');
        this.checkForPhoneUniqueness();
      }
    });
  }
  get phoneController() {
    return this.phoneForm.get('phone');
  }
  private checkForPhoneUniqueness() {
    const uri = 'phone' + '/' + this.phoneNumber;
    this.userService.getUserByKey(uri).subscribe(data => {
        this.showUniqueError = this.resourceService.frmelmnts.lbl.uniquePhone;
      },
      (err) => {
        if (_.get(err, 'error.params.status') && err.error.params.status === 'USER_ACCOUNT_BLOCKED') {
          this.showUniqueError = this.resourceService.frmelmnts.lbl.blockedUserError;
        } else {
          this.phoneForm.controls.uniquePhone.setValue(true);
          this.showUniqueError = '';
        }
      }
    );
  }
  public handlePhoneSubmitEvent() {
    const request = {
      'request': {
        'key': this.phoneNumber.toString(),
        'type': 'phone'
      }
    };
    this.otpService.generateOTP(request).subscribe((data) => {
        this.prepareOtpData();
        this.showOtpComp = true;
      },
      (err) => {
        const errorMessage = (err.error.params.status === 'PHONE_ALREADY_IN_USE') || (err.error.params.status === 'EMAIL_IN_USE') ||
          (err.error.params.status === 'ERROR_RATE_LIMIT_EXCEEDED') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0085;
        this.toasterService.error(errorMessage);
      }
    );
  }
  private prepareOtpData() {
    this.otpData = {
      'type': 'phone',
      'value': this.phoneNumber.toString(),
      'instructions': this.resourceService.frmelmnts.instn.t0083,
      'retryMessage': this.resourceService.frmelmnts.lbl.unableToUpdateMobile,
      'wrongOtpMessage': this.resourceService.frmelmnts.lbl.wrongPhoneOTP
    };
  }
  public handleOtpValidationFailed() {
    this.showOtpComp = false;
    this.phoneNumber = undefined;
    this.enableSubmitBtn = false;
    this.initializeForm();
  }
  getQueryParams(queryObj) {
    return '?' + Object.keys(queryObj).filter(key => queryObj[key])
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
      .join('&');
  }
  public handleOtpValidationSuccess() {
    window.location.href = `/v1/sso/phone/verified` +
    this.getQueryParams({ ...this.activatedRoute.snapshot.queryParams, ...{phone: this.phoneNumber}});
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.activatedRoute.snapshot.data.telemetry.uri,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
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
