import { SbFormLocationOptionsFactory } from './sb-form-location-options.factory';
import {LocationService} from '../../services';
import {FormControl} from '@angular/forms';
import {FieldConfig} from 'common-form-elements';
import {take} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {FieldConfigOption} from 'common-form-elements/lib/common-form-config';
import {Location} from '@project-sunbird/client-services/models/location';
import {ServerResponse} from '@sunbird/shared';

describe('SbFormLocationOptionsFactory', () => {
  let sbFormLocationOptionsFactory: SbFormLocationOptionsFactory;
  const mockLocationService: Partial<LocationService> = {
    getUserLocation(request): Observable<ServerResponse> {
      return of({}) as any;
    }
  };

  beforeAll(() => {
    sbFormLocationOptionsFactory = new SbFormLocationOptionsFactory(
      mockLocationService as LocationService
    );
  });

  describe('constructor()', () => {
    it('should be able to create an instance', () => {
      expect(sbFormLocationOptionsFactory).toBeTruthy();
    });
  });

  describe('buildStateListClosure()', () => {
    it('should create a closure which in turn resolves a fieldConfig "state" options builder for sbForms', (done) => {
      // arrange
      spyOn(mockLocationService, 'getUserLocation').and.returnValue(of({
        result: {
          response: [
            {
              code: 'SOME_SELECTED_STATE_CODE_1',
              name: 'SOME_SELECTED_STATE_NAME_1',
              id: 'SOME_SELECTED_STATE_ID_1',
              type: 'state'
            },
            {
              code: 'SOME_SELECTED_STATE_CODE_2',
              name: 'SOME_SELECTED_STATE_NAME_2',
              id: 'SOME_SELECTED_STATE_ID_2',
              type: 'state'
            },
          ]
        }
      }));
      const stateFormConfig: any = {
        'code': 'state',
        'type': 'select',
        'default': { 'id': 'SOME_SELECTED_STATE_ID_1' },
        'templateOptions': {
          'labelHtml': {
            'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
            'values': {
              '$0': 'State'
            }
          },
          'placeHolder': 'Select State',
          'multiple': false,
          'dataSrc': {
            'marker': 'STATE_LOCATION_LIST',
            'params': {
              'useCase': 'SIGNEDIN_GUEST'
            }
          }
        },
        'validations': [
          {
            'type': 'required'
          }
        ]
      };
      const stateFormControl = new FormControl();
      const mockNotifyLoading = () => {};
      const mockNotifyLoaded = () => {};

      // act
      const closure = sbFormLocationOptionsFactory.buildStateListClosure(
        stateFormConfig as FieldConfig<any>,
        true
      );

      (closure(
        stateFormControl,
        undefined,
        mockNotifyLoading,
        mockNotifyLoaded
      ) as Observable<FieldConfigOption<Location>[]>).pipe(
        take(1)
      ).subscribe((options: FieldConfigOption<Location>[]) => {
        // assert
        expect(options).toEqual(jasmine.arrayContaining([
          jasmine.objectContaining({ label: 'SOME_SELECTED_STATE_NAME_1' }) as any,
          jasmine.objectContaining({ label: 'SOME_SELECTED_STATE_NAME_2' }) as any,
        ]));
        expect(mockLocationService.getUserLocation).toHaveBeenCalledWith({
          filters: {
            type: 'state',
          }
        });
        expect(stateFormControl.value).toEqual({
          code: 'SOME_SELECTED_STATE_CODE_1',
          name: 'SOME_SELECTED_STATE_NAME_1',
          id: 'SOME_SELECTED_STATE_ID_1',
          type: 'state'
        });
        done();
      });
    });
  });

  describe('buildLocationListClosure()', () => {
    it('should create a closure which in turn resolves a fieldConfig generic location options builder for sbForms', (done) => {
      // arrange
      spyOn(mockLocationService, 'getUserLocation').and.returnValue(of({
        result: {
          response: [
            {
              code: 'SOME_SELECTED_DISTRICT_CODE_1',
              name: 'SOME_SELECTED_DISTRICT_NAME_1',
              id: 'SOME_SELECTED_DISTRICT_ID_1',
              type: 'district'
            },
            {
              code: 'SOME_SELECTED_DISTRICT_CODE_2',
              name: 'SOME_SELECTED_DISTRICT_NAME_2',
              id: 'SOME_SELECTED_DISTRICT_ID_2',
              type: 'district'
            },
          ]
        }
      }));
      const districtFormConfig: any = {
        'code': 'district',
        'type': 'select',
        'context': 'state',
        'default': { 'id': 'SOME_SELECTED_DISTRICT_ID_1' },
        'templateOptions': {
          'labelHtml': {
            'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
            'values': {
              '$0': 'District'
            }
          },
          'placeHolder': 'Select District',
          'multiple': false,
          'dataSrc': {
            'marker': 'LOCATION_LIST',
            'params': {
              'id': 'district',
              'useCase': 'SIGNEDIN_GUEST'
            }
          }
        },
        'validations': [
          {
            'type': 'required'
          }
        ]
      };
      const districtFormControl = new FormControl();
      const stateFormControl = new FormControl({
        code: 'SOME_SELECTED_STATE_CODE_1',
        name: 'SOME_SELECTED_STATE_NAME_1',
        id: 'SOME_SELECTED_STATE_ID_1',
        type: 'state'
      });
      const mockNotifyLoading = () => {};
      const mockNotifyLoaded = () => {};

      // act
      const closure = sbFormLocationOptionsFactory.buildLocationListClosure(
        districtFormConfig as FieldConfig<any>,
        true
      );

      (closure(
        districtFormControl,
        stateFormControl,
        mockNotifyLoading,
        mockNotifyLoaded
      ) as Observable<FieldConfigOption<Location>[]>).pipe(
        take(1)
      ).subscribe((options: FieldConfigOption<Location>[]) => {
        // assert
        expect(options).toEqual(jasmine.arrayContaining([
          jasmine.objectContaining({ label: 'SOME_SELECTED_DISTRICT_NAME_1' }) as any,
          jasmine.objectContaining({ label: 'SOME_SELECTED_DISTRICT_NAME_2' }) as any,
        ]));
        expect(mockLocationService.getUserLocation).toHaveBeenCalledWith({
          filters: {
            type: 'district',
            parentId: 'SOME_SELECTED_STATE_ID_1'
          }
        });
        expect(districtFormControl.value).toEqual({
          code: 'SOME_SELECTED_DISTRICT_CODE_1',
          name: 'SOME_SELECTED_DISTRICT_NAME_1',
          id: 'SOME_SELECTED_DISTRICT_ID_1',
          type: 'district'
        });
        done();
      });
    });
  });
});
