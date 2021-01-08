import { LocationService } from '@sunbird/location';
import { FieldConfig, FieldConfigOptionsBuilder } from 'common-form-elements';
import { Location as SbLocation } from '@project-sunbird/client-services/models/location';
import { FormControl } from '@angular/forms';
import { defer, of } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';

export class SbFormLocationOptionsFactory {
  constructor(
    private locationService: LocationService
  ) {}

  buildStateListClosure(config: FieldConfig<any>, initial = false): FieldConfigOptionsBuilder<SbLocation> {
    return (formControl: FormControl, __: FormControl, notifyLoading, notifyLoaded) => {
      return defer(async () => {
        notifyLoading();
        return await this.locationService.getUserLocation({
          filters: {
            type: 'state',
          }
        }).toPromise()
          .then((response) => response.result.response)
          .then((stateLocationList: SbLocation[]) => {
            notifyLoaded();
            const list = stateLocationList.map((s) => ({ label: s.name, value: s }));
            if (config.default && initial) {
              const option = list.find((o) => o.value.id === config.default.id || o.label === config.default.name);
              formControl.patchValue(option ? option.value : null);
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
          if (formControl.value && !initial) {
            formControl.patchValue(null);
          }
        }),
        switchMap(async (value) => {
          if (!value) {
            return [];
          }
          notifyLoading();
          return await this.locationService.getUserLocation({
            filters: {
              type: locationType,
              ...(contextFormControl ? {
                parentId: (contextFormControl.value as SbLocation).id
              } : {})
            }
          }).toPromise()
            .then((response) => response.result.response)
            .then((locationList: SbLocation[]) => {
              notifyLoaded();
              const list = locationList.map((s) => ({ label: s.name, value: s }));
              if (config.default && initial) {
                const option = list.find((o) => o.value.id === config.default.id || o.label === config.default.name);
                formControl.patchValue(option ? option.value : null);
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
}
