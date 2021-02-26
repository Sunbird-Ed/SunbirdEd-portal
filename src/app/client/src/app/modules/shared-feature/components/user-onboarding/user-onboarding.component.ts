import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { PopupControlService } from '../../../../service/popup-control.service';
import { Subject } from 'rxjs';
import { TenantService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { IDeviceProfile } from '../../interfaces';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';
import { CacheService } from 'ng2-cache-service';

export enum Stage {
  USER_SELECTION = 'user',
  LOCATION_SELECTION = 'location'
}

@Component({
  selector: 'app-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrls: ['./user-onboarding.component.scss']
})
export class UserOnboardingComponent implements OnInit {

  @Input() deviceProfile: IDeviceProfile;
  @Input() isCustodianOrgUser: boolean;
  @Output() close = new EventEmitter<void>();
  @ViewChild('onboardingModal', {static: false}) onboardingModal;

  get Stage() { return Stage; }
  stage = Stage.USER_SELECTION;
  tenantInfo: ITenantData;
  isIGotSlug = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public popupControlService: PopupControlService,
    public tenantService: TenantService,
    private cacheService: CacheService
    ) {
  }

  ngOnInit() {
    this.deviceProfile = { ipLocation: _.get(this.deviceProfile, 'ipLocation') };
    this.tenantService.tenantData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        /* istanbul ignore else*/
        if (_.get(data, 'tenantData')) {
          this.tenantInfo = data.tenantData;
          this.tenantInfo.titleName = data.tenantData.titleName || this.resourceService.instance;
          const orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug');

          /* istanbul ignore else */
          if (_.get(orgDetailsFromSlug, 'slug') === this.tenantService.slugForIgot) {
            this.tenantInfo.titleName = _.upperCase(orgDetailsFromSlug.slug);
            this.stage = Stage.LOCATION_SELECTION;
          }
        }
      });
  }

  userTypeSubmit() {
    this.stage = Stage.LOCATION_SELECTION;
  }

  locationSubmit() {
    this.popupControlService.changePopupStatus(true);
    this.onboardingModal && this.onboardingModal.deny();
    this.close.emit();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
