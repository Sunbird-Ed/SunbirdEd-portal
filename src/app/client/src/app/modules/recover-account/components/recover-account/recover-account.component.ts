import { Component } from '@angular/core';
import { RecoverAccountService } from './../../services';
import { ResourceService } from '@sunbird/shared';

@Component({
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.scss']
})
export class RecoverAccountComponent {

  constructor(public recoverAccountService: RecoverAccountService, public resourceService: ResourceService) { }

}
