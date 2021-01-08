import {Location as SbLocation} from '@project-sunbird/client-services/models/location';
import {FieldConfig, FieldConfigOption} from 'common-form-elements';
import {FormGroup} from '@angular/forms';
import {distinctUntilChanged, take} from 'rxjs/operators';
import {SbFormLocationOptionsFactory} from './sb-form-location-options.factory';
import {Subscription} from 'rxjs';
import {LocationService} from '@sunbird/location';
import {DeviceRegisterService, FormService, UserService} from '@sunbird/core';
import {IDeviceProfile} from '@sunbird/shared-feature';
import * as _ from 'lodash-es';

export class SbFormLocationSelectionDelegate {
  private static readonly DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST =
    { formType: 'profileConfig', contentType: 'default', formAction: 'get' };
  private static readonly SUPPORTED_PERSONA_LIST_FORM_REQUEST =
    { formType: 'config', formAction: 'get', contentType: 'userType', component: 'portal' };

  shouldDeviceProfileLocationUpdate = false;
  shouldUserProfileLocationUpdate = false;

  locationFormConfig: FieldConfig<any>[];
  formGroup?: FormGroup;
  isLocationFormLoading = false;

  private formSuggestionsStrategy: 'userLocation' | 'userDeclared' | 'ipLocation';
  private formLocationSuggestions: Partial<SbLocation>[] = [];
  private formLocationOptionsFactory: SbFormLocationOptionsFactory;
  private formValue: {} = {};
  private stateChangeSubscription?: Subscription;

  constructor(
    private deviceProfile: IDeviceProfile,
    private userService: UserService,
    private locationService: LocationService,
    private formService: FormService,
    private deviceRegisterService: DeviceRegisterService
  ) {
    this.formLocationOptionsFactory = new SbFormLocationOptionsFactory(locationService);
  }

  async init() {
    this.formLocationSuggestions = this.getFormSuggestionsStrategy();

    const formInputParams = _.cloneDeep(SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST);

    if (this.userService.loggedIn) {
      // override contentType to userLocation's state ID if available
      formInputParams['contentType'] = (() => {
        const loc: SbLocation = (this.userService.userProfile['userLocations'] || [])
          .find((l: SbLocation) => l.type === 'state');
        return (loc && loc.id) ?
          loc.id :
          SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST.contentType;
      })();
    }

    await this.loadForm(formInputParams, true);
  }

  async destroy() {
    if (this.stateChangeSubscription) {
      this.stateChangeSubscription.unsubscribe();
      this.stateChangeSubscription = undefined;
    }
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
              ...SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST,
              contentType: (newStateValue as SbLocation).id,
            },
            false
          ).catch((e) => {
            console.error(e);
            this.loadForm(
              SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST,
              true
            );
          });
        });
      }
    }
  }

  async updateUserLocation(): Promise<SbLocation[]> {
    const {locationCodes, locationDetails} = Object.keys(_.get(this.formGroup.value, 'children.persona'))
      .reduce<{ locationCodes: string[], locationDetails: SbLocation[] }>((acc, key) => {
        const locationDetail: SbLocation | null = _.get(this.formGroup.value, 'children.persona')[key];
        if (_.get(locationDetail, 'code')) {
          acc.locationCodes.push(locationDetail.code);
          acc.locationDetails.push(locationDetail);
        }
        return acc;
      }, {locationCodes: [], locationDetails: []});

    const tasks: Promise<any>[] = [];

    if (this.shouldDeviceProfileLocationUpdate) {
      const request = locationDetails.reduce<{ [locationType: string]: string }>((acc, l) => {
        acc[l.type] = l.name;
        return acc;
      }, {});
      const task = this.deviceRegisterService.updateDeviceProfile(request).toPromise();
      tasks.push(task);
    }

    if (this.shouldUserProfileLocationUpdate && this.userService.loggedIn) {
      const task = this.locationService.updateProfile({locationCodes})
        .toPromise();
      tasks.push(task);
    }

    await Promise.all(tasks);

    return locationDetails;
  }

  private async loadForm(
    formInputParams,
    initial = false
  ) {
    this.isLocationFormLoading = true;
    const tempLocationFormConfig: FieldConfig<any>[] = await this.formService.getFormConfig(formInputParams)
      .toPromise();

    for (const config of tempLocationFormConfig) {
      if (config.code === 'name') {
        if (this.userService.loggedIn) {
          config.templateOptions.hidden = false;
          config.default = (_.get(this.userService.userProfile, 'firstName') || '') || null;
        } else {
          config.validations = [];
        }
      }

      if (config.code === 'persona') {
        if (this.userService.loggedIn) {
          config.templateOptions.hidden = false;
          config.default = (_.get(this.userService.userProfile, 'userType') || '').toLowerCase() || null;
        } else {
          config.default = (localStorage.getItem('userType') || '').toLowerCase() || null;
        }
      }

      if (config.templateOptions['dataSrc'] && config.templateOptions['dataSrc']['marker'] === 'SUPPORTED_PERSONA_LIST') {
        config.templateOptions.options = (
          await this.formService.getFormConfig(
            SbFormLocationSelectionDelegate.SUPPORTED_PERSONA_LIST_FORM_REQUEST
          ).toPromise() as {
            code: string;
            name: string;
            visibility: boolean;
          }[]
        ).reduce<FieldConfigOption<string>[]>((acc, persona) => {
          if (persona.visibility) {
            acc.push({
              label: persona.name,
              value: persona.code
            });
          }
          return acc;
        }, []);

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

  private getFormSuggestionsStrategy(): Partial<SbLocation>[] {
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
}
