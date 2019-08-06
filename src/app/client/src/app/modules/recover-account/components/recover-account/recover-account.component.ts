import { Component, OnInit } from '@angular/core';
import { RecoverAccountService } from './../../services';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.scss']
})
export class RecoverAccountComponent implements OnInit {

  constructor(public recoverAccountService: RecoverAccountService, public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
