import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-merge-login',
  templateUrl: './merge-login.component.html',
  styleUrls: ['./merge-login.component.scss']
})
export class MergeLoginComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute) { }
  redirectUri: string;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const queryParam = {...queryParams};
      this.redirectUri = '/merge/account/u2/login/callback' + this.getQueryParams(queryParam);
      window.location.href = this.redirectUri;
    });
  }

  /**
   * gets query params
   * @param queryObj
   */
  getQueryParams = (queryObj) => {
    return '?' + Object.keys(queryObj).filter(key => queryObj[key])
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
      .join('&');
  }

}
