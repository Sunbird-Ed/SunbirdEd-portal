import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { DeviceRegisterService, FormService, UserService } from '../../../../modules/core/services';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { IDeviceProfile } from '../../../../modules/shared-feature/interfaces/deviceProfile';
import { SbFormLocationSelectionDelegate } from '../delegate/sb-form-location-selection.delegate';
import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-location-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})
export class LocationSelectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isClosable = true;
  @Input() deviceProfile: IDeviceProfile;
  @Output() close = new EventEmitter<void>();
  @ViewChild('onboardingModal', { static: true }) onboardingModal;

  telemetryImpression: IImpressionEventInput;

  sbFormLocationSelectionDelegate: SbFormLocationSelectionDelegate;

  constructor(
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public locationService: LocationService,
    public router: Router,
    public userService: UserService,
    public deviceRegisterService: DeviceRegisterService,
    public navigationHelperService: NavigationHelperService,
    public popupControlService: PopupControlService,
    protected telemetryService: TelemetryService,
    protected formService: FormService
  ) {
    this.sbFormLocationSelectionDelegate = new SbFormLocationSelectionDelegate(
      this.userService,
      this.locationService,
      this.formService,
      this.deviceRegisterService,
      this.deviceProfile,
    );
  }

  ngOnInit() {
    this.popupControlService.changePopupStatus(false);
    this.sbFormLocationSelectionDelegate.init()
      .catch(() => {
        this.closeModal();
        this.toasterService.error(this.resourceService.messages.fmsg.m0049);
      });
  }

  ngOnDestroy() {
    this.sbFormLocationSelectionDelegate.destroy();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: 'user-location',
          cdata: [{ id: 'user:state:districtConfirmation', type: 'Feature' },
            { id: 'SH-40', type: 'Task' }
          ]
        },
        edata: {
          type: 'view',
          pageid: 'location-popup',
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  closeModal() {
    this.onboardingModal.deny();
    this.popupControlService.changePopupStatus(true);
    this.close.emit();
  }

  async updateUserLocation() {
    try {
      const updatedLocationDetails: SbLocation[] = await this.sbFormLocationSelectionDelegate.updateUserLocation();

      if (this.userService.loggedIn) {
        const payload = {
          userId: _.get(this.userService, 'userid'),
          firstName: this.sbFormLocationSelectionDelegate.formGroup.value['name'],
          userType: this.sbFormLocationSelectionDelegate.formGroup.value['persona'],
        };
        await this.locationService.updateProfile(payload).toPromise();
      }
    } catch (e) {
      this.toasterService.error(this.resourceService.messages.fmsg.m0049);
    } finally {
      this.closeModal();
    }
  }
}
