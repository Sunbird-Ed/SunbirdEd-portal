import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '@sunbird/shared';

@Component({
  selector: 'app-merge-account-status',
  templateUrl: './merge-account-status.component.html',
  styleUrls: ['./merge-account-status.component.scss']
})
export class MergeAccountStatusComponent implements OnInit {
  @ViewChild('modal') modal;
  isMergeSuccess: any = {};
  redirectUri: string;
  mergeType: string;

  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const queryParam = {...queryParams};
      this.isMergeSuccess = queryParam.status === 'success';
      this.mergeType = queryParam.merge_type;
      this.redirectUri = queryParam.redirect_uri || '/resources';
    });
  }

  closeModal() {
    window.location.href = this.redirectUri;
    this.modal.deny();
  }
}
