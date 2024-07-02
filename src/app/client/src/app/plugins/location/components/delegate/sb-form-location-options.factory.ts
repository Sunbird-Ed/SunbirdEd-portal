import { FieldConfig, FieldConfigOptionsBuilder } from '@project-sunbird/common-form-elements-full';
import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import { UntypedFormControl } from '@angular/forms';
import { concat, defer, iif, of } from 'rxjs';
import { distinctUntilChanged, mergeMap, map, catchError } from 'rxjs/operators';
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

  buildStateListClosure(config: FieldConfig<any>, initial = false) {
    return (formControl: UntypedFormControl, __: UntypedFormControl, notifyLoading, notifyLoaded) => {
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

  buildLocationListClosure(config: FieldConfig<any>, initial = false) {
    const locationType = (() => {
      if (config.code === 'state') {
        return 'state';
      }
      return _.get(config, 'templateOptions.dataSrc.params.id');
    })();

    return (formControl: UntypedFormControl, contextFormControl: UntypedFormControl, notifyLoading, notifyLoaded) => {
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
          return this.fetchLocationList(locationType, value).then((locationList: any) => {
              notifyLoaded();
              let list;
              if (locationType === 'school') {
                list = locationList;
              } else {
                list = locationList.map((s) => ({ label: s.name, value: s }));
              }
              // school is fetched from userProfile.organisation instead of userProfile.userLocations
              if (config.code === 'school' && initial && !formControl.value && !!config.default) {
                const option = list.find((o) => o.value.id === config.default.id || o.label === config.default.name);
                formControl.patchValue(option ? option.value : null, { emitModelToViewChange: false });
              } else if (!!config.default && initial && !formControl.value) {
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

  fetchLocationList(locationType, value): Promise<any> {
    if (locationType === 'school') {
      return this.orgDetailsService.searchOrgDetails({
        filters: {
          'orgLocation.id': (value as SbLocation).id,
          isSchool: true,
          'status': 1
        }
      }).pipe(
        map((list: any) => list.content.map(ele => {
          return {
            label: ele.orgName,
            value: {
              code: ele.externalId,
              parentId: value.id,
              type: locationType,
              name: ele.orgName,
              id: ele.identifier,
              identifier: ele.identifier
            }
          };
        })),
        catchError((error) => {
          return [];
        })
      ).toPromise();
    } else {
      return this.fetchUserLocation({
        filters: {
          type: locationType,
          ...(value ? {
            parentId: (value as SbLocation).id
          } : {})
        }
      });
    }
  }

  private async fetchUserLocation(request: any): Promise<SbLocation[]> {
    const serialized = JSON.stringify(request);
    if (this.userLocationCache[serialized]) {
      return this.userLocationCache[serialized];
    }

    return this.locationService.getUserLocation(request).toPromise()
      .then((response) => {
        const result = response.result.response;
        this.userLocationCache[serialized] = result;
        return result;
      });
  }
}
