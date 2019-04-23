import { first } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormService } from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from '@sunbird/core';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';

@Component({
  templateUrl: './select-org.component.html',
  styleUrls: ['./select-org.component.scss']
})
export class SelectOrgComponent implements OnInit, AfterViewInit {
  public selectedOrg: any;
  public orgList: Array<any>;
  public errorUrl = '/sso/sign-in/error';
  public telemetryImpression;
  public tenantInfo: any = {};
  public disableSubmitBtn = true;
  public submitOrgInteractEdata;
  constructor(private formService: FormService, public activatedRoute: ActivatedRoute, private tenantService: TenantService,
    public resourceService: ResourceService, public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
    this.setTenantInfo();
    this.setTelemetryData();
    this.getSsoOrgList().subscribe(formData => this.orgList = formData,
    error => console.log('no org configured in form')); // show toaster message
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
  public handleOrgChange(event) {
    this.disableSubmitBtn = false;
  }
  private getSsoOrgList() {
    const formServiceInputParams = {
      formType: 'organization',
      formAction: 'sign-in',
      contentType: 'organization'
    };
    return this.formService.getFormConfig(formServiceInputParams);
  }
  public handleOrgSelection(event) {
    window.location.href = this.selectedOrg;
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
    this.submitOrgInteractEdata = {
      id: 'submit-org',
      type: 'click',
      pageid: 'sso-sign-in',
    };
  }
}
