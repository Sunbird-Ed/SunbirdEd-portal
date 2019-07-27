import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
@Component({
  selector: 'app-select-account-identifier',
  templateUrl: './select-account-identifier.component.html',
  styleUrls: ['./select-account-identifier.component.scss']
})
export class SelectAccountIdentifierComponent implements OnInit {
  accountIdentifier = 'first';
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) { }

  ngOnInit() {
  }
  handleGenerateOtp() {
  }
}
