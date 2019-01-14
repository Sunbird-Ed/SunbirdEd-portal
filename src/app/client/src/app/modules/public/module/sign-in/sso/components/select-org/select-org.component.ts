import { Component, OnInit } from '@angular/core';
import { FormService } from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './select-org.component.html',
  styleUrls: ['./select-org.component.scss']
})
export class SelectOrgComponent implements OnInit {
  public selectedOrg: any;
  public orgList: Array<any>;
  public errorUrl = '/sso/sign-in/error';
  public telemetryImpression;
  constructor(private formService: FormService, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.setTelemetryImpression();
    this.getSsoOrg().subscribe((formData) => {
      this.orgList = formData;
    }, err => {
      window.location.href = `${this.errorUrl}?error_message=fetch Org list failed`;
    });
  }
  private getSsoOrg() {
    const formServiceInputParams = {
      formType: 'organization',
      formAction: 'sign-in',
      contentType: 'sso-organization'
    };
    return this.formService.getFormConfig(formServiceInputParams);
  }
  handleOrgSelection(event) {
    window.location.href = this.selectedOrg.loginUrl;
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
}
