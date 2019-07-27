import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
@Component({
  selector: 'app-identify-account',
  templateUrl: './identify-account.component.html',
  styleUrls: ['./identify-account.component.scss']
})
export class IdentifyAccountComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) {

  }

  ngOnInit() {
  }
  handleNext() {

  }
}
