import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { FormGroup } from '@angular/forms';
import { DeviceRegisterService, FormService, UserService } from '@sunbird/core';
import { Router } from '@angular/router';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PopupControlService } from '../../../../service/popup-control.service';
import { IDeviceProfile } from '../../interfaces';
import { ITenantData } from '../../../core/services/tenant/interfaces';
import { FieldConfig } from 'common-form-elements';
import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import { LocationService } from '@sunbird/location';
import { SbFormLocationOptionsFactory } from './sb-form-location-options.factory';

@Component({
  selector: 'app-onboarding-location-selection',
  templateUrl: './onboarding-location-selection.component.html',
  styleUrls: ['./onboarding-location-selection.component.scss']
})
export class OnboardingLocationSelectionComponent implements OnInit, OnDestroy, AfterViewInit {
  private static readonly DEFAULT_PROFILE_CONFIG_FORM_REQUEST =
    { formType: 'profileConfig', contentType: 'default', formAction: 'get' };

  @Input() deviceProfile: IDeviceProfile;
  // TODO: may not be required anymore
  @Input() isCustodianOrgUser: boolean;

  @Input() tenantInfo: ITenantData;
  @Output() close = new EventEmitter<void>();
  @ViewChild('onboardingModal') onboardingModal;

  protected formSuggestionsStrategy: 'userLocation' | 'userDeclared' | 'ipLocation';
  protected formLocationSuggestions: Partial<SbLocation>[] = [];
  protected formLocationOptionsFactory: SbFormLocationOptionsFactory;
  protected formValue: {} = {};
  private stateChangeSubscription?: Subscription;

  telemetryImpression: IImpressionEventInput;

  shouldDeviceProfileLocationUpdate = false;
  shouldUserProfileLocationUpdate = false;
  // Form Configuration loaded from FormService
  locationFormConfig: FieldConfig<any>[];

  formGroup?: FormGroup;
  isLocationFormLoading = false;

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
    this.formLocationOptionsFactory = new SbFormLocationOptionsFactory(locationService);
  }

  async ngOnInit() {
    this.popupControlService.changePopupStatus(false);
    this.formLocationSuggestions = this.getFormSuggestionsStrategy();
    await this.loadForm(
      OnboardingLocationSelectionComponent.DEFAULT_PROFILE_CONFIG_FORM_REQUEST,
      true
    );
  }

  ngOnDestroy() {
    if (this.stateChangeSubscription) {
      this.stateChangeSubscription.unsubscribe();
      this.stateChangeSubscription = undefined;
    }
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

  async onFormInitialize(formGroup: FormGroup) {
    this.isLocationFormLoading = false;
    this.formGroup = formGroup;
  }

  async onFormValueChange(value: any) {
    if (value['children'] && value['children']['persona']) {
      this.formValue = value['children']['persona'];
    }
  }

  async onDataLoadStatusChange($event) {
    if ('LOADING' === $event) {
      this.isLocationFormLoading = true;
    } else {
      this.isLocationFormLoading = false;

      // on state load
      if (!this.stateChangeSubscription) {
        this.stateChangeSubscription = this.formGroup.get('children.persona.state').valueChanges.pipe(
          distinctUntilChanged(),
          take(1)
        ).subscribe(async (newStateValue) => {
          // on state change
          if (!newStateValue) { return; }

          this.locationFormConfig = undefined;
          this.stateChangeSubscription = undefined;

          this.isLocationFormLoading = true;

          this.loadForm(
            {
              ...OnboardingLocationSelectionComponent.DEFAULT_PROFILE_CONFIG_FORM_REQUEST,
              subType: (newStateValue as SbLocation).id,
            },
            false
          ).catch((e) => {
            console.error(e);
            this.loadForm(
              OnboardingLocationSelectionComponent.DEFAULT_PROFILE_CONFIG_FORM_REQUEST,
              true
            );
          });
        });
      }
    }
  }

  private async loadForm(
    formInputParams,
    initial = false
  ) {
    this.isLocationFormLoading = true;
    const tempLocationFormConfig: FieldConfig<any>[] = await this.formService.getFormConfig(formInputParams)
      .toPromise()
      .catch((e) => {
        console.error(e);
        this.closeModal();
        // TODO: check messages
        this.toasterService.error('Unable to load data');
        return [];
      });

    for (const config of tempLocationFormConfig) {
      if (config.code === 'name' /* TODO: uncomment && !this.shouldDeviceProfileLocationUpdate */) {
        config.templateOptions.hidden = false;
      }

      if (config.code === 'persona' /* TODO: uncomment && !this.shouldDeviceProfileLocationUpdate */) {
        config.templateOptions.hidden = false;
        // TODO: userType
        config.default = 'other';
      }

      if (config.templateOptions['dataSrc'] && config.templateOptions['dataSrc']['marker'] === 'SUPPORTED_PERSONA_LIST') {
        // TODO: fetch supported userTypes
        config.templateOptions.options = [
          { label: 'Leader', value: 'administrator' },
          { label: 'Teacher', value: 'teacher' },
          { label: 'Student', value: 'student' },
          { label: 'Other', value: 'other' },
        ];

        for (const persona in config.children) {
          if (!(persona in config.children)) {
            continue;
          }

          for (const personaLocationConfig of config.children[persona]) {
            if (!personaLocationConfig.templateOptions['dataSrc']) {
              return personaLocationConfig;
            }

            if (initial) {
              personaLocationConfig.default = this.formLocationSuggestions.find(l => l.type === personaLocationConfig.code);
            } else {
              personaLocationConfig.default = this.formValue[personaLocationConfig.code];
            }

            switch (personaLocationConfig.templateOptions['dataSrc']['marker']) {
              case 'STATE_LOCATION_LIST': {
                personaLocationConfig.templateOptions.options = this.formLocationOptionsFactory.buildStateListClosure(
                  personaLocationConfig, initial
                );
                break;
              }
              case 'LOCATION_LIST': {
                personaLocationConfig.templateOptions.options = this.formLocationOptionsFactory.buildLocationListClosure(
                  personaLocationConfig, initial
                );
                break;
              }
            }
          }
        }
      }
    }

    this.locationFormConfig = tempLocationFormConfig;
  }

  getFormSuggestionsStrategy(): Partial<SbLocation>[] {
    let suggestions: Partial<SbLocation>[] = [];
    const userProfileData = this.userService.userProfile;
    const isDeviceProfileLocationUpdated = this.deviceProfile && this.deviceProfile.userDeclaredLocation;
    const isUserProfileLocationUpdated = userProfileData && userProfileData.userLocations &&
      Array.isArray(userProfileData.userLocations) && userProfileData.userLocations.length >= 1;

    if (this.userService.loggedIn) {
      /* istanbul ignore else */
      if (
        !isUserProfileLocationUpdated
      ) {
        /* istanbul ignore else */
        if (isDeviceProfileLocationUpdated) {
          // render using userDeclaredLocation
          // update user profile only
          this.formSuggestionsStrategy = 'userDeclared';
          this.shouldUserProfileLocationUpdate = true;
          this.shouldDeviceProfileLocationUpdate = false;

          suggestions = [
            { type: 'state', name: this.deviceProfile.userDeclaredLocation.state },
            { type: 'district', name: this.deviceProfile.userDeclaredLocation.district }
          ];
        }
      }

      /* istanbul ignore else */
      if (
        !isDeviceProfileLocationUpdated
      ) {
        if (isUserProfileLocationUpdated) {
          // render using user location
          // update only device profile
          this.formSuggestionsStrategy = 'userLocation';
          this.shouldUserProfileLocationUpdate = false;
          this.shouldDeviceProfileLocationUpdate = true;

          // TODO: cross-check
          suggestions = this.userService.userProfile.userLocations;
        } else {
          // render using ip
          // update device location and user location
          this.formSuggestionsStrategy = 'ipLocation';
          this.shouldUserProfileLocationUpdate = true;
          this.shouldDeviceProfileLocationUpdate = true;

          suggestions = [
            { type: 'state', name: this.deviceProfile.ipLocation.state },
            { type: 'district', name: this.deviceProfile.ipLocation.district }
          ];
        }
      }
    } else {
      if (!isDeviceProfileLocationUpdated) {
        // render using ip
        // update device profile only
        this.formSuggestionsStrategy = 'ipLocation';
        this.shouldUserProfileLocationUpdate = false;
        this.shouldDeviceProfileLocationUpdate = true;

        suggestions = [
          { type: 'state', name: this.deviceProfile.ipLocation.state },
          { type: 'district', name: this.deviceProfile.ipLocation.district }
        ];
      } else {
        // render using userDeclaredLocation
        // update user profile only
        this.formSuggestionsStrategy = 'userDeclared';
        this.shouldUserProfileLocationUpdate = true;
        this.shouldDeviceProfileLocationUpdate = false;

        suggestions = [
          { type: 'state', name: this.deviceProfile.userDeclaredLocation.state },
          { type: 'district', name: this.deviceProfile.userDeclaredLocation.district }
        ];
      }
    }

    return suggestions;
  }

  closeModal() {
    this.onboardingModal.deny();
    this.popupControlService.changePopupStatus(true);
    this.close.emit();
  }

  updateUserLocation() {
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

  // // TODO: check request data
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

  // // TODO: check request data
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

  // // TODO: check request data
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
