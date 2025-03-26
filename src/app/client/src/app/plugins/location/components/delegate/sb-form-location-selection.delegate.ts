import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import { FieldConfig, FieldConfigOption } from '@project-sunbird/common-form-elements-full';
import { UntypedFormGroup } from '@angular/forms';
import { delay, distinctUntilChanged, map, mergeMap, take } from 'rxjs/operators';
import { SbFormLocationOptionsFactory } from './sb-form-location-options.factory';
import { concat, defer, of, Subscription } from 'rxjs';
import { IDeviceProfile } from '@sunbird/shared-feature';
import * as _ from 'lodash-es';

import { LocationService } from '../../services/location/location.service';
import { UserService } from '../../../../modules/core/services/user/user.service';
import { DeviceRegisterService } from '../../../../modules/core/services/device-register/device-register.service';
import { FormService } from '../../../../modules/core/services/form/form.service';
import { OrgDetailsService } from '@sunbird/core';

type UseCase = 'SIGNEDIN_GUEST' | 'SIGNEDIN' | 'GUEST';

export class SbFormLocationSelectionDelegate {
  private static readonly DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST =
    { formType: 'profileConfig_v2', contentType: 'default', formAction: 'get' };
  private static readonly SUPPORTED_PERSONA_LIST_FORM_REQUEST =
    { formType: 'config', formAction: 'get', contentType: 'userType', component: 'portal' };

  shouldDeviceProfileLocationUpdate = false;
  shouldUserProfileLocationUpdate = false;

  locationFormConfig: FieldConfig<any>[];
  formGroup?: UntypedFormGroup;
  isLocationFormLoading = false;

  private formSuggestionsStrategy: 'userLocation' | 'userDeclared' | 'ipLocation';
  private formLocationSuggestions: Partial<SbLocation>[] = [];
  private formLocationOptionsFactory: SbFormLocationOptionsFactory;
  private prevFormValue: {} = {};
  private stateChangeSubscription?: Subscription;

  private changesMap: {} = {};
  private guestUserDetails;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private formService: FormService,
    private deviceRegisterService: DeviceRegisterService,
    private orgDetailsService: OrgDetailsService,
    private deviceProfile?: IDeviceProfile
  ) {
    this.formLocationOptionsFactory = new SbFormLocationOptionsFactory(
      locationService,
      userService,
      orgDetailsService
    );
  }

  async init(deviceProfile?: IDeviceProfile, showModal = true, isStepper = false) {
    if (deviceProfile) {
      this.deviceProfile = deviceProfile;
    }

    try {
      if (!this.deviceProfile) {
        this.deviceProfile = await this.deviceRegisterService.fetchDeviceProfile().pipe(
          map((response) => _.get(response, 'result'))
        ).toPromise();
      }

      this.formLocationSuggestions = this.getFormSuggestionsStrategy();

      // try loading state specific form
      const formInputParams = _.cloneDeep(SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST);
      if (this.userService.loggedIn) {
        // override contentType to userLocation's state ID if available
        formInputParams['contentType'] = (() => {
          const loc: SbLocation = (this.userService.userProfile['userLocations'] || [])
            .find((l: SbLocation) => l.type === 'state');
          return (loc && loc.code) ?
            loc.code :
            SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST.contentType;
        })();
      }
      await this.loadForm(formInputParams, true, showModal, isStepper);
    } catch (e) {
      // load default form
      console.error(e);
      await this.loadForm(SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST, true, showModal, isStepper);
    }
  }

  async destroy() {
    if (this.stateChangeSubscription) {
      this.stateChangeSubscription.unsubscribe();
      this.stateChangeSubscription = undefined;
    }
  }

  async onFormInitialize(formGroup: UntypedFormGroup) {
    this.isLocationFormLoading = false;
    this.formGroup = formGroup;
  }

  async onFormValueChange(value: any) {
    if (value['children'] && value['children']['persona']) {
      this.shouldDeviceProfileLocationUpdate = true;
      this.shouldUserProfileLocationUpdate = true;
    }
  }

  async onDataLoadStatusChange($event, showModal = true, isStepper = false) {
    if ('LOADED' === $event) {
      this.isLocationFormLoading = false;

      const subPersonaFormControl = this.formGroup.get('children.persona.subPersona');
      if (subPersonaFormControl && !subPersonaFormControl.value) {
        subPersonaFormControl.patchValue((_.get(this.userService.userProfile.profileUserType, 'subType') || '') || null);
      }

      if (!this.stateChangeSubscription) {
        this.stateChangeSubscription = concat(
          of(this.formGroup.get('persona').value),
          this.formGroup.get('persona').valueChanges
        ).pipe(
          distinctUntilChanged(),
          delay(100),
          mergeMap(() => defer(() => {
            return this.formGroup?.get('children.persona.state')?.valueChanges.pipe(
              distinctUntilChanged(),
              take(1)
            );
          }))
        ).subscribe((newStateValue) => {
          // on state change
          if (!newStateValue) { return; }

          this.locationFormConfig = undefined;
          this.stateChangeSubscription = undefined;

          this.isLocationFormLoading = true;

          this.prevFormValue = _.cloneDeep(this.formGroup.value);

          this.loadForm(
            {
              ...SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST,
              contentType: (newStateValue as SbLocation).code,
            },
            false, showModal, isStepper
          ).catch((e) => {
            console.error(e);
            this.loadForm(
              SbFormLocationSelectionDelegate.DEFAULT_PERSONA_LOCATION_CONFIG_FORM_REQUEST,
              false, showModal, isStepper
            );
          });
        });
      }
    }
  }

  async updateUserLocation(): Promise<{ changes: string, deviceProfile?: 'success' | 'fail', userProfile?: 'success' | 'fail' }> {
    const changes: string = Object.keys(this.changesMap).reduce<string[]>((acc, code) => {
      const isChanged = !_.isEqualWith(_.get(this.formGroup.value, code), this.changesMap[code], (a, b) => {
        if (a && b) {
          return a === b || a.code === b.code;
        } else if (!a && !b) {
          return true;
        }
        return a === b;
      });

      if (isChanged) {
        acc.push(code + '::changed');
      }

      return acc;
    }, []).join('-');

    const locationDetails: SbLocation[] = Object.keys(_.get(this.formGroup.value, 'children.persona'))
      .reduce<SbLocation[]>((acc, key) => {
        const locationDetail: SbLocation | null = _.get(this.formGroup.value, 'children.persona')[key];
        if (_.get(locationDetail, 'code')) {
          acc.push(locationDetail);
        }
        return acc;
      }, []);

    const tasks: Promise<any>[] = [];

    if (this.shouldDeviceProfileLocationUpdate) {
      const request = locationDetails.reduce<{ [locationType: string]: string }>((acc, l) => {
        acc[l.type] = l.name;
        return acc;
      }, {});
      const task = this.deviceRegisterService.updateDeviceProfile(request).toPromise()
        .then(() => ({ deviceProfile: 'success' }))
        .catch(() => ({ deviceProfile: 'fail' }));
      tasks.push(task);
    }

    if (this.shouldUserProfileLocationUpdate && this.userService.loggedIn) {
      const formValue = this.formGroup.value;
      const profileUserTypes = [];
      let userType;
      const userTypeReq = {};
      if (_.get(formValue, 'children.persona.subPersona.length')) {
        if (typeof _.get(formValue, 'children.persona.subPersona') === 'string') {
          userType = {
            type: formValue.persona,
            subType: _.get(formValue, 'children.persona.subPersona')
          };
          profileUserTypes.push(userType);
        } else if (Array.isArray(_.get(formValue, 'children.persona.subPersona'))) {
          formValue.children.persona.subPersona.forEach(element => {
            profileUserTypes.push({ type: formValue.persona, subType: element });
          });
          userType = profileUserTypes[0];
        }
      } else {
        profileUserTypes.push({ type: formValue.persona });
      }
      const profileConfig = {
        ...(_.get(formValue, 'name') ? { firstName: _.get(formValue, 'name') } : {}),
        ...(_.get(formValue, 'category') ? { category: _.get(formValue, 'category') } : {}),
        ...(_.get(formValue, 'trainingGroup') ? { trainingGroup: _.get(formValue, 'trainingGroup') } : {}),
        ...(_.get(formValue, 'cin') ? { cin: _.get(formValue, 'cin') } : {}),
        ...(_.get(formValue, 'idFmps') ? { idFmps: _.get(formValue, 'idFmps') } : {}),
        ...(_.get(formValue, 'province') ? { province: _.get(formValue, 'province') } : {}),
      }
      const updatedFramework = this.userService.userProfile?.framework || {};

      const newProfileConfig = JSON.stringify(profileConfig);
      updatedFramework.profileConfig = [newProfileConfig];
      const payload: any = {
        "framework": updatedFramework,
        "userId": this.userService.userProfile?.userId
      }

      const task = this.locationService.updateProfile(payload).toPromise()
        .then(() => ({ userProfile: 'success', type: _.get(formValue, 'persona') }))
        .catch(() => ({ userProfile: 'fail' }));
      tasks.push(task);
    }

    if (!this.userService.loggedIn && this.guestUserDetails) {
      const formValue = this.formGroup.value;
      const user = { ...this.guestUserDetails, formatedName: _.get(formValue, 'name') };

      if (_.get(formValue, 'persona')) {
        localStorage.setItem('userType', formValue.persona);
        const guestUserType = (
          await this.formService.getFormConfig(
            SbFormLocationSelectionDelegate.SUPPORTED_PERSONA_LIST_FORM_REQUEST
          ).toPromise() as {
            code: string;
            name: string;
            visibility: boolean;
          }[]
        ).reduce<FieldConfigOption<string>[]>((data, persona) => {
          if (persona.code === formValue.persona) {
            data.push({
              label: persona.name,
              value: persona.code
            });
          }
          return data;
        }, []);
        localStorage.setItem('guestUserType', guestUserType[0].label);
      }
      this.userService.updateGuestUser(user, formValue).subscribe();
    }

    return await Promise.all(tasks).then((result) => {
      return result.reduce<{
        changes: string, deviceProfile?: 'success' | 'fail', userProfile?: 'success' | 'fail'
      }>((acc, v) => {
        acc = { ...acc, ...v };
        return acc;
      }, { changes });
    });
  }

  async clearUserLocationSelections() {
    const stateFormControl = this.formGroup.get('children.persona.state');
    /* istanbul ignore else */
    if (stateFormControl) {
      stateFormControl.setValue({
        name: '',
        type: '',
        code: ''
      });
    }
  }

  private async loadForm(formInputParams, initial = false, showModal = true, isStepper = false) {
    let useCases: UseCase[];
    // If user register workflow
    if (!showModal) {
      useCases = ['SIGNEDIN_GUEST', 'SIGNEDIN'];
    } else {
      useCases = this.userService.loggedIn ? ['SIGNEDIN_GUEST', 'SIGNEDIN'] : ['SIGNEDIN_GUEST', 'GUEST'];
    }
    this.isLocationFormLoading = true;
    let tempLocationFormConfig: FieldConfig<any>[];
    if (!showModal) {
      tempLocationFormConfig = await this.formService.getFormConfig(formInputParams, localStorage.getItem('orgHashTagId'))
        .toPromise();
    } else {
      tempLocationFormConfig = await this.formService.getFormConfig(formInputParams)
        .toPromise();
    }
    if (!this.userService.loggedIn && !isStepper) {
      this.guestUserDetails = await this.userService.getGuestUser().toPromise();
    }

    if (!showModal) {
      tempLocationFormConfig.splice(_.findIndex(tempLocationFormConfig, (e) => {
        return e.code === 'name';
      }), 1);
    }
    for (const config of tempLocationFormConfig) {
      if (config.code === 'name') {
        if (this.userService.loggedIn) {
          config.templateOptions.hidden = false;
          config.default = (_.get(this.userService.userProfile, 'firstName') || '') || null;
        } else if (this.guestUserDetails) {
          config.templateOptions.hidden = false;
          config.default = (_.get(this.guestUserDetails, 'formatedName') || 'Guest');
        } else if (!this.userService.loggedIn && !this.guestUserDetails && isStepper) {
          config.templateOptions.hidden = false;
          config.default = 'Guest';
        }
        else {
          config.validations = [];
        }
      }

      if (config.code === 'persona') {
        if (this.userService.loggedIn) {
          // config.templateOptions.hidden = false;
          config.default = (_.get(this.userService.userProfile.profileUserType, 'type') || '').toLowerCase() || 'teacher';
        } else {
          config.templateOptions.hidden = false;
          config.default = (localStorage.getItem('userType') || '').toLowerCase() || 'teacher';
        }
      }

      if (config.code === 'email') {
        if (this.userService.loggedIn) {
          config.templateOptions.hidden = false;
          config.editable = false;
          config.templateOptions.disabled = true;
          config.default = (_.get(this.userService.userProfile, 'email') || '') || null;
        }
      }
      const defaultValues = JSON.parse(this.userService.userProfile?.framework?.profileConfig?.[0] || "{}")
      if (defaultValues.hasOwnProperty(config.code)) {
        config.templateOptions.hidden = false;

        if (this.userService.loggedIn) {
          config.default =
            (_.get(this.userService.userProfile, config.code) || '').toLowerCase() ||
            defaultValues[config.code];
        } else {
          config.default =
            (localStorage.getItem(config.code) || '').toLowerCase() ||
            defaultValues[config.code];
        }
      }

      this.changesMap[config.code] = config.default;
      config.default = _.get(this.prevFormValue, config.code) || config.default;

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

            if (!useCases.includes(_.get(personaLocationConfig, 'templateOptions.dataSrc.params.useCase'))) {
              personaLocationConfig.templateOptions['hidden'] = true;
              personaLocationConfig.validations = [];
            }

            if (initial) {
              personaLocationConfig.default = this.formLocationSuggestions.find(l => l.type === personaLocationConfig.code);
            }

            switch (personaLocationConfig.templateOptions['dataSrc']['marker']) {
              case 'SUBPERSONA_LIST': {
                if (this.userService.loggedIn) {
                  if (personaLocationConfig.templateOptions.multiple) {
                    const defaultSubpersona = [];
                    if (this.userService.userProfile.profileUserTypes && this.userService.userProfile.profileUserTypes.length) {
                      this.userService.userProfile.profileUserTypes.forEach(element => {
                        if (element.subType) {
                          defaultSubpersona.push(element.subType);
                        }
                      });
                    } else {
                      if (_.get(this.userService, 'userProfile.profileUserType.subType')) {
                        defaultSubpersona.push(_.get(this.userService, 'userProfile.profileUserType.subType'));
                      }
                    }
                    personaLocationConfig.default = defaultSubpersona;
                  } else {
                    personaLocationConfig.default = _.get(this.userService, 'userProfile.profileUserType.subType');
                  }
                }
                break;
              }
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

            this.changesMap[`children.persona.${personaLocationConfig.code}`] = personaLocationConfig.default;
            personaLocationConfig.default =
              _.get(this.prevFormValue, `children.persona.${personaLocationConfig.code}`) ||
              personaLocationConfig.default;
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
      if (isUserProfileLocationUpdated) {
        this.formSuggestionsStrategy = 'userLocation';
        this.shouldUserProfileLocationUpdate = false;
        this.shouldDeviceProfileLocationUpdate = false;

        suggestions = this.userService.userProfile.userLocations;
      }

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
          { type: 'state', name: _.get(this.deviceProfile, 'ipLocation.state') },
          { type: 'district', name: _.get(this.deviceProfile, 'ipLocation.district') }
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
