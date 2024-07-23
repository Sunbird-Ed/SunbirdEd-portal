import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { DeviceRegisterService, FormService, OrgDetailsService, UserService } from '../../../../modules/core/services';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { IImpressionEventInput, IInteractEventInput, TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { IDeviceProfile } from '../../../../modules/shared-feature/interfaces/deviceProfile';
import { SbFormLocationSelectionDelegate } from '../delegate/sb-form-location-selection.delegate';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash-es';
import {Location as SbLocation} from '@project-sunbird/client-services/models/location';

@Component({
  selector: 'app-location-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})
export class LocationSelectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isClosable = true;
  @Input() showModal = true;
  @Input() deviceProfile: IDeviceProfile;
  @Output() close = new EventEmitter<any>();
  @Output() registerSubmit = new EventEmitter<any>();
  @Output() onFormValueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('onboardingModal', { static: true }) onboardingModal;
  telemetryImpression: IImpressionEventInput;
  sbFormLocationSelectionDelegate: SbFormLocationSelectionDelegate;
  isSubmitted = false;
  public locationSelectionModalId = 'location-selection';
  @Input() isStepper = false;
  @Input() showEditLocationDetailsPopup: boolean;
  public isLocationEnabled = true;

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
    public formService: FormService,
    private orgDetailsService: OrgDetailsService,
    private utilService: UtilService,
    private matDialog: MatDialog
  ) {
    this.sbFormLocationSelectionDelegate = new SbFormLocationSelectionDelegate(
      this.userService,
      this.locationService,
      this.formService,
      this.deviceRegisterService,
      this.orgDetailsService
    );
  }

  ngOnInit() {
    this.popupControlService.changePopupStatus(false);
    /**
      * @description - popupcontrol service returned value is used to enable/disable the location popup based on the isvisible value
    */
    this.popupControlService.getOnboardingData().subscribe((formResponsedata)=>{
      this.isLocationEnabled= formResponsedata?.locationPopup? formResponsedata?.locationPopup?.isVisible : true;
    })
    this.sbFormLocationSelectionDelegate.init(this.deviceProfile, this.showModal, this.isStepper )
      .catch(() => {
        this.closeModal();
        if(this.isLocationEnabled){
          this.toasterService.error(this.resourceService.messages.fmsg.m0049);
        }
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
    const dialogRef = this.matDialog.getDialogById(this.locationSelectionModalId);
    dialogRef && dialogRef.close();
    this.popupControlService.changePopupStatus(true);
    this.close.emit({isSubmitted: this.isSubmitted});
  }

  async updateUserLocation() {
    if (this.showModal) {
      try {
        const result: any = await this.sbFormLocationSelectionDelegate.updateUserLocation();
  
        /* istanbul ignore else */
        if (result.userProfile) {
          this.telemetryLogEvents('User Profile', result.userProfile === 'success');
          this.utilService.updateRoleChange(result.type);
        }
  
        /* istanbul ignore else */
        if (result.deviceProfile) {
          if (!result.type) {
            this.utilService.updateRoleChange(localStorage.getItem('userType'));
          }
          this.telemetryLogEvents('Device Profile', result.userProfile === 'success');
        }
  
        this.generateSubmitInteractEvent(result.changes);
      } catch (e) {
        this.toasterService.error(this.resourceService.messages.fmsg.m0049);
      } finally {
        this.isSubmitted = true;
        this.closeModal();
      }
    } else if (_.get(this.userService, 'loggedIn') && _.get(this.userService, 'userid')) {
      const result: any = await this.sbFormLocationSelectionDelegate.formGroup;
      const locationDetails: SbLocation[] = Object.keys(_.get(result, 'value.children.persona'))
        .reduce<SbLocation[]>((acc, key) => {
          const locationDetail: SbLocation | null = _.get(result, 'value.children.persona')[key];
          if (_.get(locationDetail, 'code')) {
            acc.push(locationDetail);
          }
          return acc;
        }, []);
      const userTypes = [{ type: 'teacher' }];
      const payload: any = {
        userId: _.get(this.userService, 'userid'),
        profileLocation: locationDetails,
        profileUserTypes: userTypes
      };
      this.locationService.updateProfile(payload).toPromise()
        .then((res) => {
          this.registerSubmit.emit(_.get(result, 'value'));
          this.toasterService.success(this.resourceService?.messages?.smsg?.m0057);
        }).catch((err) => {
          this.toasterService.error(this.resourceService?.messages?.emsg?.m0005);
        });
    } else {
      const result: any = await this.sbFormLocationSelectionDelegate.formGroup;
      this.registerSubmit.emit(_.get(result, 'value'));
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

  onSbFormValueChange(changes: any) {
    this.onFormValueChange.emit(true);
  }
}
