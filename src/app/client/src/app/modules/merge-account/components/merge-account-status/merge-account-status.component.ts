import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NavigationHelperService} from '@sunbird/shared';

@Component({
  selector: 'app-merge-account-status',
  templateUrl: './merge-account-status.component.html',
  styleUrls: ['./merge-account-status.component.scss']
})
export class MergeAccountStatusComponent implements OnInit {
  @ViewChild('modal') modal;
  isMergeSuccess: any = {};
  redirectUri: string;

  constructor(public activatedRoute: ActivatedRoute,
              public navigationHelperService: NavigationHelperService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const queryParam = {...queryParams};
      this.isMergeSuccess = queryParam.status === 'success';
      this.redirectUri = queryParam.redirect_uri || '/resources';
    });
  }

  closeModal() {
    window.location.href = this.redirectUri;
    this.modal.deny();
  }
}
