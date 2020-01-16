import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from '@sunbird/shared';


@Component({
  selector: 'app-sso-merge-confirmation',
  templateUrl: './sso-merge-confirmation.component.html',
  styleUrls: ['./sso-merge-confirmation.component.scss']
})
export class SsoMergeConfirmationComponent implements OnInit {
  @Input() userDetails: any;
  @Input() identifierType: any;
  @Input() identifierValue: any;
  instance: string;
  telemetryCdata = [{
    id: 'user:account:migrate',
    type: 'Feature'
  }, {
    id: 'SB-13773',
    type: 'Task'
  }];
  constructor(public resourceService: ResourceService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  ngOnInit() {
  }

  createNewUser() {
    const queryParams = '&identifier=' + this.identifierType + '&identifierValue=' + this.identifierValue + '&freeUser=true';
    window.location.href = 'v1/sso/create/user?userId=' + this.userDetails.id + queryParams;
  }

  closeModal() {

  }

  migrateUser() {
    const queryParams = '&identifier=' + this.identifierType + '&identifierValue=' + this.identifierValue + '&freeUser=true';
    window.location.href = '/v1/sso/migrate/account/initiate?userId=' + this.userDetails.id + queryParams;
  }
}
