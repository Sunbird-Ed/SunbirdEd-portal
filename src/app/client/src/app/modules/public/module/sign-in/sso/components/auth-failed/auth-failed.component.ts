import {Component, OnInit} from '@angular/core';
import {ResourceService} from '@sunbird/shared';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-auth-failed',
  templateUrl: './auth-failed.component.html',
  styleUrls: ['./auth-failed.component.scss']
})
export class AuthFailedComponent implements OnInit {
  instance: string;

  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService) {
    this.instance = (<HTMLInputElement>document.getElementById('instance'))
      ? (<HTMLInputElement>document.getElementById('instance')).value.toUpperCase() : 'SUNBIRD';
  }

  queryParam: any;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.queryParam = {...queryParams};
    });
  }

  createNewUser() {
    const queryParams = '&identifier=' + this.queryParam.identifierType + '&identifierValue=' +
      this.queryParam.identifierValue + '&freeUser=true';
    window.location.href = 'v1/sso/create/user?userId=' + this.queryParam.userId + queryParams;
  }

}
