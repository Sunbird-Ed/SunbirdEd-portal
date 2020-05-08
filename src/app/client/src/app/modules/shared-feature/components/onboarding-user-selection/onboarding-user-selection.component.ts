import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TenantService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationHelperService } from '@sunbird/shared';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';

interface IGuest {
  name: string;
  label: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-onboarding-user-selection',
  templateUrl: './onboarding-user-selection.component.html',
  styleUrls: ['./onboarding-user-selection.component.scss']
})
export class OnboardingUserSelectionComponent implements OnInit {

  @Input() tenantInfo: ITenantData;
  @Output() userSelect = new EventEmitter<boolean>();

  guestList: IGuest[] = [];
  selectedUserType: IGuest;
  telemetryImpression: IImpressionEventInput;
  userSelectionInteractEdata: IInteractEventEdata;

  constructor(
    public resourceService: ResourceService,
    public tenantService: TenantService,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    public telemetryService: TelemetryService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.guestList = [
      {
        name: 'teacher',
        label: this.resourceService.frmelmnts.lbl.teacher,
        icon: 'assets/images/guest-img1.svg',
        isActive: false
      },
      {
        name: 'student',
        label: this.resourceService.frmelmnts.lbl.student,
        icon: 'assets/images/guest-img2.svg',
        isActive: false
      },
      {
        name: 'other',
        label: this.resourceService.frmelmnts.lbl.other,
        icon: 'assets/images/guest-img3.svg',
        isActive: false
      }
    ];
    this.setPopupInteractEdata();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: 'user-type'
        },
        edata: {
          type: 'view',
          pageid: 'user-type-popup',
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  selectUserType(listIndex: number) {
    this.selectedUserType = this.guestList[listIndex];
    this.guestList.forEach((guest, index) => {
      guest.isActive = listIndex === index;
    });
  }

  submit() {
    localStorage.setItem('userType', this.selectedUserType.name);
    this.userSelect.emit(true);
  }

  setPopupInteractEdata() {
    this.userSelectionInteractEdata = {
      id: 'user-type-select',
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') || this.router.url.split('/')[1]
    };
  }
}
