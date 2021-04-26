import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '@sunbird/shared';
import {Subscription} from 'rxjs';
import {TenantService} from '@sunbird/core';

@Component({
  selector: 'app-merge-account-status',
  templateUrl: './merge-account-status.component.html',
  styleUrls: ['./merge-account-status.component.scss']
})
export class MergeAccountStatusComponent implements OnInit, OnDestroy {
  @ViewChild('modal', {static: false}) modal;
  isMergeSuccess: any = {};
  error_type: string;
  redirectUri: string;
  mergeType: string;
  logo: string;
  tenantName: string;
  tenantDataSubscription: Subscription;

  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
              public tenantService: TenantService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const queryParam = {...queryParams};
      this.isMergeSuccess = queryParam.status === 'success';
      this.mergeType = queryParam.merge_type;
      this.redirectUri = queryParam.redirect_uri || '/resources';
      this.error_type = queryParam.error_type;
    });
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(data => {
      if (data && !data.err && data.tenantData) {
        this.logo = data.tenantData.logo;
        this.tenantName = data.tenantData.titleName;
      }
    });
  }

  closeModal() {
    window.location.href = this.redirectUri;
    this.modal.deny();
  }

  ngOnDestroy() {
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
  }

}
