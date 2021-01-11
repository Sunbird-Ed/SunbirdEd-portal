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
import { catchError, retry, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';

@Component({
  selector: 'app-location-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})
export class LocationSelectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isClosable = true;
  @Input() deviceProfile: IDeviceProfile;
  @Output() close = new EventEmitter<void>();
  @ViewChild('onboardingModal') onboardingModal;

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
    protected formService: FormService,
    private profileService: ProfileService
  ) {
  }

  ngOnInit() {
    this.sbFormLocationSelectionDelegate = new SbFormLocationSelectionDelegate(
      this.userService,
      this.locationService,
      this.formService,
      this.deviceRegisterService,
      this.deviceProfile,
    );

    this.popupControlService.changePopupStatus(false);
    this.sbFormLocationSelectionDelegate.init()
      .catch(() => {
        this.closeModal();
        // TODO: edit message
        this.toasterService.error('Unable to load data');
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
        // const payload = {
        //   userId: _.get(this.userService, 'userid'),
        //   TODO: userType and firstName
        // };
        // await this.profileService.updateProfile(payload).toPromise();
      }
    } catch (e) {
      // TODO: edit message
      this.toasterService.error('Unable to load data');
    } finally {
      this.closeModal();
    }

    // TODO: check how telemetry data is populated
    // const locationCodes = [];
    // const locationDetails: any = {};
    // /* istanbul ignore else */
    // if (this.userDetailsForm.value.state) {
    //   locationCodes.push(this.userDetailsForm.value.state);
    //   locationDetails.stateCode = this.userDetailsForm.value.state;
    // }
    // /* istanbul ignore else */
    // if (this.userDetailsForm.value.district) {
    //   locationCodes.push(this.userDetailsForm.value.district);
    //   locationDetails.districtCode = this.userDetailsForm.value.district;
    // }
    // const data = { locationCodes: locationCodes };
    // let districtData, stateData, changeType = '';
    // /* istanbul ignore else */
    // if (locationDetails.stateCode) {
    //   stateData = _.find(this.allStates, (states) => {
    //     return states.code === locationDetails.stateCode;
    //   });
    // }
    // /* istanbul ignore else */
    // if (locationDetails.districtCode) {
    //   districtData = _.find(this.allDistricts, (districts) => {
    //     return districts.code === locationDetails.districtCode;
    //   });
    // }
    // /* istanbul ignore else */
    // if (stateData.name !== _.get(this.suggestedLocation, 'state.name')) {
    //   changeType = changeType + 'state-changed';
    // }
    //
    // /* istanbul ignore else */
    // if (districtData.name !== _.get(this.suggestedLocation, 'district.name')) {
    //   if (_.includes(changeType, 'state-changed')) {
    //     changeType = 'state-dist-changed';
    //   } else {
    //     changeType = changeType + 'dist-changed';
    //   }
    // }
    // this.isUserProfileUpdateAllowed = false;
    // this.isDeviceProfileUpdateAllowed = true;
    // const telemetryData = this.getTelemetryData(changeType);
    // this.generateInteractEvent(telemetryData);
    // this.updateLocation(data, { state: stateData, district: districtData });
  }

  // // TODO: check how telemetry data is populated
  // updateLocation(data, locationDetails) {
  //   let response1: any;
  //   response1 = this.updateDeviceProfileData(data, locationDetails);
  //   const response2 = this.updateUserProfileData(data);
  //   forkJoin([response1, response2]).subscribe((res) => {
  //     /* istanbul ignore else */
  //     if (!_.isEmpty(res[0])) {
  //       this.telemetryLogEvents('Device Profile', true);
  //     }
  //     /* istanbul ignore else */
  //     if (!_.isEmpty(res[1])) {
  //       this.telemetryLogEvents('User Profile', true);
  //     }
  //     this.closeModal();
  //   }, (err) => {
  //     /* istanbul ignore else */
  //     if (!_.isEmpty(err[0])) {
  //       this.telemetryLogEvents('Device Profile', false);
  //     }
  //     /* istanbul ignore else */
  //     if (!_.isEmpty(err[1])) {
  //       this.telemetryLogEvents('User Profile', false);
  //     }
  //     this.closeModal();
  //   });
  // }

  // // TODO: check how telemetry data is populated
  // updateDeviceProfileData(data, locationDetails) {
  //   /* istanbul ignore else */
  //   if (!this.shouldDeviceProfileLocationUpdate) {
  //     return of({});
  //   }
  //   return this.deviceRegisterService.updateDeviceProfile({
  //     state: _.get(locationDetails, 'state.name'),
  //     district: _.get(locationDetails, 'district.name')
  //   });
  // }

  // // TODO: check how telemetry data is populated
  // updateUserProfileData(data) {
  //   /* istanbul ignore else */
  //   if (!this.shouldUserProfileLocationUpdate || !this.isCustodianOrgUser) {
  //     return of({});
  //   }
  //   return this.locationService.updateProfile(data);
  // }

  // TODO:
  // private telemetryLogEvents(locationType: any, status: boolean) {
  //   let level = 'ERROR';
  //   let msg = 'Updation of ' + locationType + ' failed';
  //   /* istanbul ignore else */
  //   if (status) {
  //     level = 'SUCCESS';
  //     msg = 'Updation of ' + locationType + ' success';
  //   }
  //   const event = {
  //     context: {
  //       env: 'portal'
  //     },
  //     edata: {
  //       type: 'update-location',
  //       level: level,
  //       message: msg
  //     }
  //   };
  //   this.telemetryService.log(event);
  // }

  // TODO:
  // private getTelemetryData(changeType) {
  //   return {
  //     locationInteractEdata: {
  //       id: 'submit-clicked',
  //       type: changeType ? 'location-changed' : 'location-unchanged',
  //       subtype: changeType
  //     },
  //     telemetryCdata: [
  //       { id: 'user:state:districtConfirmation', type: 'Feature' },
  //       { id: 'SC-1373', type: 'Task' }
  //     ]
  //   };
  // }

  // TODO:
  // private generateInteractEvent(telemetryData) {
  //   const interactEData = telemetryData.locationInteractEdata;
  //   const telemetryInteractCdata = telemetryData.telemetryCdata;
  //   /* istanbul ignore else */
  //   if (interactEData) {
  //     const appTelemetryInteractData: IInteractEventInput = {
  //       context: {
  //         env: 'user-location',
  //         cdata: [
  //           { id: 'user:state:districtConfirmation', type: 'Feature' },
  //           { id: 'SC-1373', type: 'Task' }
  //         ],
  //       },
  //       edata: interactEData
  //     };
  //     /* istanbul ignore else */
  //     if (telemetryInteractCdata) {
  //       appTelemetryInteractData.object = telemetryInteractCdata;
  //     }
  //     this.telemetryService.interact(appTelemetryInteractData);
  //   }
  // }
}
