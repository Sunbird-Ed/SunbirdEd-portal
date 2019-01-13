import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './update-phone.component.html',
  styleUrls: ['./update-phone.component.scss']
})
export class UpdatePhoneComponent implements OnInit {
  public phoneNumber: number;
  public submitPhoneNumber = false;
  public showOtpValidation = false;
  public telemetryImpression;
  public submitPhoneInteractEdata;
  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.initializeForm();
    this.setTelemetryImpression();
    this.setInteractEventData();
  }
  initializeForm() {

  }
  handlePhoneValueChangeEvent() {
    // check for uniqueness of phone and show message if not unique enable submit button if unique.
  }
  handleSubmitEvent() {
    // generate otp and show otp validation component
  }
  handleOtpValidationFailed() {
    // show form to enter phone again
  }
  handleOtpValidationSuccess() {
    // navigate to phone verified route
    window.location.href = `/v1/sso/phone/verified?phone=${this.phoneNumber}&id=${this.activatedRoute.snapshot.queryParams.id}`;
  }
  setTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri
      }
    };
  }
  setInteractEventData() {
    this.submitPhoneInteractEdata = {
      id: 'submit-phone',
      type: 'click',
      pageid: 'sso-sign-in',
    };
  }
}
