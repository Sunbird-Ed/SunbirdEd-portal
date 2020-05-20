import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {ResourceService} from '@sunbird/shared';
import {Subscription} from 'rxjs';
import {TenantService} from '@sunbird/core';


@Component({
  selector: 'app-sso-merge-confirmation',
  templateUrl: './sso-merge-confirmation.component.html',
  styleUrls: ['./sso-merge-confirmation.component.scss']
})
export class SsoMergeConfirmationComponent implements OnInit, OnDestroy {
  @Input() userDetails: any;
  @Input() identifierType: any;
  @Input() identifierValue: any;
  @Input() tncVersionAccepted: string;
  @Input() isTncAccepted: boolean;
  instance: string;
  logo: string;
  tenantName: string;
  tenantDataSubscription: Subscription;
  telemetryCdata = [{
    id: 'user:account:migrate',
    type: 'Feature'
  }, {
    id: 'SB-13773',
    type: 'Task'
  }];

  constructor(public resourceService: ResourceService, public tenantService: TenantService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  ngOnInit() {
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(data => {
      if (data && !data.err && data.tenantData) {
        this.logo = data.tenantData.logo;
        this.tenantName = data.tenantData.titleName;
      }
    });
  }

  createNewUser() {
    let queryParams = '&identifier=' + this.identifierType + '&identifierValue=' + this.identifierValue + '&freeUser=true';
    queryParams = queryParams + '&tncAccepted=' + this.isTncAccepted + '&tncVersion=' + this.tncVersionAccepted;
    window.location.href = 'v1/sso/create/user?userId=' + this.userDetails.id + queryParams;
  }

  closeModal() {

  }

  migrateUser() {
    let queryParams = '&identifier=' + this.identifierType + '&identifierValue=' + this.identifierValue + '&freeUser=true';
    queryParams = queryParams + '&tncAccepted=' + this.isTncAccepted + '&tncVersion=' + this.tncVersionAccepted;
    window.location.href = '/v1/sso/migrate/account/initiate?userId=' + this.userDetails.id + queryParams;
  }

  ngOnDestroy() {
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
  }

}
