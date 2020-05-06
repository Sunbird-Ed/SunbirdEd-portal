import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IImpressionEventInput, IInteractEventInput, TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { Subject } from 'rxjs';
import { TenantService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';

interface IGuestList {
  name: string;
  icon: string;
  isActive: boolean;
}
@Component({
  selector: 'app-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrls: ['./user-onboarding.component.scss']
})
export class UserOnboardingComponent implements OnInit {

  @Input() userLocationDetails: any;
  @Input() deviceProfile: any;
  @Input() isCustodianOrgUser: any;
  @Output() close = new EventEmitter<any>();

  @ViewChild('onboardingModal') onboardingModal;

  guestList: IGuestList[] = [];
  stage = 1;
  tenantInfo: any = {};
  private unsubscribe$ = new Subject<void>();

  constructor(
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    private telemetryService: TelemetryService,
    public popupControlService: PopupControlService,
    public tenantService: TenantService) {
  }

  ngOnInit() {
    this.tenantService.tenantData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (_.get(data, 'tenantData')) {
          this.tenantInfo.logo = data.tenantData.logo;
          this.tenantInfo.name = data.tenantData.titleName || this.resourceService.instance;
        }
      });
  }

  userTypeSubmit(event: Event) {
    this.stage = 2;
  }

  locationSubmit(event: Event) {
    this.popupControlService.changePopupStatus(true);
    this.onboardingModal.deny();
    this.close.emit();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
