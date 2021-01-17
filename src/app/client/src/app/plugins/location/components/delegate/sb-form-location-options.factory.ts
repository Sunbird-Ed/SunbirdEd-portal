import { FieldConfig, FieldConfigOptionsBuilder } from 'common-form-elements';
import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import { FormControl } from '@angular/forms';
import { defer, merge, of } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';

import { LocationService } from '../../services/location/location.service';

export class SbFormLocationOptionsFactory {
  private userLocationCache: {[request: string]: SbLocation[] | undefined} = {};

  constructor(
    private locationService: LocationService
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
      return contextFormControl.valueChanges.pipe(
        startWith(contextFormControl.value),
        distinctUntilChanged((a: SbLocation, b: SbLocation) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => {
          if (formControl.value) {
            formControl.patchValue(null, { onlySelf: true, emitEvent: false });
          }
        }),
        distinctUntilChanged((a: SbLocation, b: SbLocation) => {
          return !!(!a && !b ||
            !a && b ||
            !b && a ||
            a.code === b.code);
        }),
        switchMap(async (value) => {
          if (!value) {
            return [];
          }
          notifyLoading();
          return this.fetchUserLocation({
            filters: {
              type: locationType,
              ...(contextFormControl ? {
                parentId: (contextFormControl.value as SbLocation).id
              } : {})
            }
          }).then((locationList: SbLocation[]) => {
              notifyLoaded();
              const list = locationList.map((s) => ({ label: s.name, value: s }));
              if (config.default && initial && !formControl.value) {
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
        })
      );
    };
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
