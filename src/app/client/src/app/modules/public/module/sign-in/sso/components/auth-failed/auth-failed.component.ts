import {Component, OnInit, OnDestroy} from '@angular/core';
import {ResourceService} from '@sunbird/shared';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TenantService} from '@sunbird/core';

@Component({
  selector: 'app-auth-failed',
  templateUrl: './auth-failed.component.html',
  styleUrls: ['./auth-failed.component.scss']
})
export class AuthFailedComponent implements OnInit, OnDestroy {
  instance: string;
  logo: string;
  tenantName: string;
  tenantDataSubscription: Subscription;

  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
              public tenantService: TenantService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  queryParam: any;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.queryParam = {...queryParams};
    });
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(data => {
      if (data && !data.err && data.tenantData) {
        this.logo = data.tenantData.logo;
        this.tenantName = data.tenantData.titleName;
      }
    });
  }

  createNewUser() {
    let queryParams = '&identifier=' + this.queryParam.identifierType + '&identifierValue=' +
      this.queryParam.identifierValue + '&freeUser=true' + '&tncAccepted=' + this.queryParam.tncAccepted;
    queryParams = queryParams + '&tncVersion=' + this.queryParam.tncVersion;
    window.location.href = 'v1/sso/create/user?userId=' + this.queryParam.userId + queryParams;
  }

  ngOnDestroy() {
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
  }

}
