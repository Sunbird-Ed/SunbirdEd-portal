import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { DeviceRegisterService, FormService, UserService } from '../../../../modules/core/services';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { IImpressionEventInput, IInteractEventInput, TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { IDeviceProfile } from '../../../../modules/shared-feature/interfaces/deviceProfile';
import { SbFormLocationSelectionDelegate } from '../delegate/sb-form-location-selection.delegate';

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
      this.deviceRegisterService
    );
  }

  ngOnInit() {
    this.popupControlService.changePopupStatus(false);
    this.sbFormLocationSelectionDelegate.init(this.deviceProfile)
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
      const result = await this.sbFormLocationSelectionDelegate.updateUserLocation();

      /* istanbul ignore else */
      if (result.userProfile) {
        this.telemetryLogEvents('User Profile', result.userProfile === 'success');
      }

      /* istanbul ignore else */
      if (result.deviceProfile) {
        this.telemetryLogEvents('Device Profile', result.userProfile === 'success');
      }

      this.generateSubmitInteractEvent(result.changes);
    } catch (e) {
      this.toasterService.error(this.resourceService.messages.fmsg.m0049);
    } finally {
      this.closeModal();
    }
  }

  async clearUserLocationSelections() {
    await this.sbFormLocationSelectionDelegate.clearUserLocationSelections();
    this.generateCancelInteractEvent();
  }

  private generateCancelInteractEvent() {
    this.telemetryService.interact({
      context: {
        env: 'user-location',
        cdata: [
          { id: 'user:location_capture', type: 'Feature' },
          { id: 'SB-21152', type: 'Task' }
        ],
      },
      edata: {
        id: 'cancel-clicked',
        type: 'TOUCH'
      }
    });
  }

  private generateSubmitInteractEvent(changes: string) {
    const interactEData = {
      id: 'submit-clicked',
      type: changes ? 'location-changed' : 'location-unchanged',
      subtype: changes
    };
    const telemetryCdata = [
      { id: 'user:location_capture', type: 'Feature' },
      { id: 'SB-21152', type: 'Task' }
    ];
    /* istanbul ignore else */
    if (interactEData) {
      const appTelemetryInteractData: IInteractEventInput = {
        context: {
          env: 'user-location',
          cdata: [
            { id: 'user:location_capture', type: 'Feature' },
            { id: 'SB-21152', type: 'Task' }
          ],
        },
        edata: interactEData
      };
      /* istanbul ignore else */
      if (telemetryCdata) {
        appTelemetryInteractData.object = telemetryCdata as any;
      }
      this.telemetryService.interact(appTelemetryInteractData);
    }
  }

  private telemetryLogEvents(locationType: any, isSuccessful: boolean) {
    const { level, msg } = (() => {
      if (isSuccessful) {
        return { level: 'SUCCESS', msg: 'Updation of ' + locationType + ' success' };
      }
      return { level: 'ERROR', msg: 'Updation of ' + locationType + ' failed' };
    })();
    const event = {
      context: {
        env: 'portal'
      },
      edata: {
        type: 'update-location',
        level: level,
        message: msg
      }
    };
    this.telemetryService.log(event);
  }
}
