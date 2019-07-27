import { RecoverAccountService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    public toasterService: ToasterService, public router: Router, public recoverAccountService: RecoverAccountService) { }

  ngOnInit() {
  }
  handleSubmit() {

  }
}
