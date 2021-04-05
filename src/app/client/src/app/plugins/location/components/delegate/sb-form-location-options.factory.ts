import { FieldConfig, FieldConfigOptionsBuilder } from 'common-form-elements';
import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import { FormControl } from '@angular/forms';
import { concat, defer, iif, Observable, of } from 'rxjs';
import { distinctUntilChanged, mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash-es';

import { LocationService } from '../../services/location/location.service';
import { UserService } from '../../../../modules/core/services/user/user.service';
import { OrgDetailsService } from '@sunbird/core';

export class SbFormLocationOptionsFactory {
  private userLocationCache: {[request: string]: SbLocation[] | undefined} = {};

  constructor(
    private locationService: LocationService,
    private userService: UserService,
    private orgDetailsService: OrgDetailsService
  ) {}

  buildStateListClosure(config: FieldConfig<any>, initial = false): FieldConfigOptionsBuilder<SbLocation> {
    return (formControl: FormControl, __: FormControl, notifyLoading, notifyLoaded) => {
      return defer(async () => {
        notifyLoading();
        return this.fetchUserLocation({
          filters: {
            type: 'state',
          }
        }).then((stateLocationList: SbLocation[]) => {
            notifyLoaded();
            const list = stateLocationList.map((s) => ({ label: s.name, value: s }));
            if (config.default && initial) {
              const option = list.find((o) => o.value.id === config.default.id || o.label === config.default.name);
              formControl.patchValue(option ? option.value : null, { emitModelToViewChange: false });
              config.default['code'] = option ? option.value['code'] : config.default['code'];
            }
            return list;
          })
          .catch((e) => {
            notifyLoaded();
            console.error(e);
            return [];
          });
      });
    };
  }

  buildLocationListClosure(config: FieldConfig<any>, initial = false): FieldConfigOptionsBuilder<SbLocation> {
    const locationType = (() => {
      if (config.code === 'state') {
        return 'state';
      }
      return _.get(config, 'templateOptions.dataSrc.params.id');
    })();

    return (formControl: FormControl, contextFormControl: FormControl, notifyLoading, notifyLoaded) => {
      if (!contextFormControl) {
        return of([]);
      }
      return iif(
        () => initial,
        contextFormControl.valueChanges,
        concat(
          of(contextFormControl.value),
          contextFormControl.valueChanges
        )
      ).pipe(
        distinctUntilChanged((a: SbLocation, b: SbLocation) => {
          return !!(!a && !b ||
            !a && b ||
            !b && a ||
            a.code === b.code);
        }),
        mergeMap(async (value) => {
          if (!value) {
            return [];
          }
          notifyLoading();
          return this.getSchoolList(locationType, value).then((locationList: any) => {
              notifyLoaded();
              let list;
              if (locationType === 'school') {
                list = locationList.map((s) => ({ label: s.orgName, code: s.externalId, value: s }));
              } else {
               list = locationList.map((s) => ({ label: s.name, value: s }));
              }
              console.log('locationList', locationList);
              // school is fetched from userProfile.organisation instead of userProfile.userLocations
              if (config.code === 'school' && initial && !formControl.value) {
                const option = list.find((o) => {
                    return (_.get(this.userService, 'userProfile.organisations') || []).find((org) => org.orgName === o.label);
                });
                formControl.patchValue(option ? option.value : null, { emitModelToViewChange: false });
              } else if (config.default && initial && !formControl.value) {
                const option = list.find((o) => o.value.id === config.default.id || o.label === config.default.name);
                formControl.patchValue(option ? option.value : null, { emitModelToViewChange: false });
                config.default['code'] = option ? option.value['code'] : config.default['code'];
              }
              initial = false;
              return list;
            })
            .catch((e) => {
              notifyLoaded();
              console.error(e);
              return [];
            });
        })
      );
    };
  }

  getSchoolList(locationType, value): Promise<any> {
    console.log('Test cases', locationType);
    if (locationType === 'school') {
      return this.orgDetailsService.searchOrgDetails({
        filter: {
          'orgLocation.id': (value as SbLocation).id,
          isSchool: true
        }
      }).toPromise();
    } else {
      console.log('Test cases2');
      return this.fetchUserLocation({
        filters: {
          type: locationType,
          ...(value ? {
            parentId: (value as SbLocation).id
          } : {})
        }
      });
    }
  };

  private async fetchUserLocation(request: any): Promise<SbLocation[]> {
    const serialized = JSON.stringify(request);
    console.log('Test cases3');
    if (this.userLocationCache[serialized]) {
      return this.userLocationCache[serialized];
    }

    console.log('Test cases4');
    return this.locationService.getUserLocation(request).toPromise()
      .then((response) => {
        console.log('Test cases5');
        const result = response.result.response;
        this.userLocationCache[serialized] = result;
        return result;
      });
  }
}
