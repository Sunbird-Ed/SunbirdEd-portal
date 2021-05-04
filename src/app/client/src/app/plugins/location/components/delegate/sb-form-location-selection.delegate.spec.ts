import {SbFormLocationSelectionDelegate} from './sb-form-location-selection.delegate';
import {DeviceRegisterService, FormService, UserService, OrgDetailsService} from '@sunbird/core';
import {LocationService} from '../../services';
import {IDeviceProfile} from '@sunbird/shared-feature';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {sampleProfileConfig, sampleUserTypeConfig} from './sb-form-location-selection.delegate.spec.data';
import * as _ from 'lodash-es';
import {FormControl, FormGroup} from '@angular/forms';
import {Location} from '@project-sunbird/client-services/models/location';
import {ServerResponse} from '@sunbird/shared';

describe('SbFormLocationSelectionDelegate', () => {
  let sbFormLocationSelectionDelegate: SbFormLocationSelectionDelegate;
  const mockUserService: Partial<UserService> = {
    get userid(): string {
      return '';
    },
    get userProfile(): any {
      return {};
    },
    get loggedIn(): boolean {
      return true;
    },
    getGuestUser(): Observable<any> {
      return of({} as any);
    }
  };
  const mockLocationService: Partial<LocationService> = {
    updateProfile(request): Observable<ServerResponse> {
      return of({} as any);
    }
  };
  const mockFormService: Partial<FormService> = {
    getFormConfig(formInputParams, hashTagId?: string): Observable<any> {
      return of([]);
    }
  };
  const mockDeviceRegisterService: Partial<DeviceRegisterService> = {
    updateDeviceProfile(userDeclaredLocation): Observable<ServerResponse> {
      return of({} as any);
    }
  };
  const mockDeviceProfile: Partial<IDeviceProfile> = {};
  const mockOrgDetailsService: Partial<OrgDetailsService> = {};

  beforeAll(() => {
    sbFormLocationSelectionDelegate = new SbFormLocationSelectionDelegate(
      mockUserService as UserService,
      mockLocationService as LocationService,
      mockFormService as FormService,
      mockDeviceRegisterService as DeviceRegisterService,
      mockOrgDetailsService as OrgDetailsService,
      mockDeviceProfile as IDeviceProfile,
    );
  });

  describe('constructor()', () => {
    it('should be able to construct an instance', () => {
      expect(sbFormLocationSelectionDelegate).toBeTruthy();
    });
  });

  describe('init()', () => {
    describe('building suggestion strategy', () => {
      describe('when user logged out / is a guest use', () => {
        describe('and when location previously not registered on deviceProfile', () => {
          it('should suggest using ipLocation and on form submission update deviceProfile only', async () => {
            // arrange
            spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(false);
            mockDeviceProfile.userDeclaredLocation = undefined;
            mockDeviceProfile.ipLocation = {
              state: 'SOME_STATE_NAME',
              district: 'SOME_DISTRICT_NAME'
            };
            spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));

            // act
            await sbFormLocationSelectionDelegate.init();

            // assert
            expect(sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate).toBeTruthy();
            expect(sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate).toBeFalsy();
            expect(sbFormLocationSelectionDelegate['formSuggestionsStrategy']).toBe('ipLocation');
          });
        });

        describe('and when location previously registered on deviceProfile', () => {
          it('should suggest using ipLocation and on form submission update deviceProfile only', async () => {
            // arrange
            spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(false);
            mockDeviceProfile.userDeclaredLocation = {
              state: 'SOME_STATE_NAME',
              district: 'SOME_DISTRICT_NAME'
            };
            mockDeviceProfile.ipLocation = {
              state: 'SOME_STATE_NAME',
              district: 'SOME_DISTRICT_NAME'
            };
            spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));

            // act
            await sbFormLocationSelectionDelegate.init();

            // assert
            expect(sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate).toBeFalsy();
            expect(sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate).toBeTruthy();
            expect(sbFormLocationSelectionDelegate['formSuggestionsStrategy']).toBe('userDeclared');
          });
        });
      });

      describe('when user logged in', () => {
        describe('and when location previously not registered on userProfile', () => {
          describe('and when location previously registered on deviceProfile', () => {
            it('should suggest using deviceProfile and on form submission update userProfile only', async () => {
              // arrange
              spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
              spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
                userDeclaredLocation: [
                  // { type: 'state', code: 'SOME_STATE_CODE', id: 'SOME_STATE_ID' }
                ]
              });
              mockDeviceProfile.userDeclaredLocation = {
                state: 'SOME_STATE_NAME',
                district: 'SOME_DISTRICT_NAME'
              };
              mockDeviceProfile.ipLocation = {
                state: 'SOME_STATE_NAME',
                district: 'SOME_DISTRICT_NAME'
              };
              spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));

              // act
              await sbFormLocationSelectionDelegate.init();

              // assert
              expect(sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate).toBeFalsy();
              expect(sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate).toBeTruthy();
              expect(sbFormLocationSelectionDelegate['formSuggestionsStrategy']).toBe('userDeclared');
            });
          });
        });

        describe('and when location previously not registered on deviceProfile', () => {
          describe('and when location previously registered on userProfile', () => {
            it('should suggest using userProfile and on form submission update deviceProfile only', async () => {
              // arrange
              spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
              spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
                userLocations: [
                  { type: 'state', code: 'SOME_STATE_CODE', id: 'SOME_STATE_ID' }
                ]
              });
              mockDeviceProfile.userDeclaredLocation = undefined;
              mockDeviceProfile.ipLocation = {
                state: 'SOME_STATE_NAME',
                district: 'SOME_DISTRICT_NAME'
              };
              spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));

              // act
              await sbFormLocationSelectionDelegate.init();

              // assert
              expect(sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate).toBeTruthy();
              expect(sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate).toBeFalsy();
              expect(sbFormLocationSelectionDelegate['formSuggestionsStrategy']).toBe('userLocation');
            });
          });

          describe('and when location previously not registered on userProfile', () => {
            it('should suggest using userProfile and on form submission update deviceProfile only', async () => {
              // arrange
              spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
              spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
                userLocations: []
              });
              mockDeviceProfile.userDeclaredLocation = undefined;
              mockDeviceProfile.ipLocation = {
                state: 'SOME_STATE_NAME',
                district: 'SOME_DISTRICT_NAME'
              };
              spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));

              // act
              await sbFormLocationSelectionDelegate.init();

              // assert
              expect(sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate).toBeTruthy();
              expect(sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate).toBeTruthy();
              expect(sbFormLocationSelectionDelegate['formSuggestionsStrategy']).toBe('ipLocation');
            });
          });
        });
      });
    });

    describe('to loadForm', () => {
      describe('when user is loggedIn', () => {
        it('should attempt to load state specific form if declared in userLocations', async () => {
          // arrange
          spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
          spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));
          spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
            userLocations: [ { type: 'state', code: 'SOME_STATE_CODE', id: 'SOME_STATE_ID' } ]
          });

          // act
          await sbFormLocationSelectionDelegate.init();

          // assert
          expect(mockFormService.getFormConfig).toHaveBeenCalledWith(jasmine.objectContaining({
            formType: 'profileConfig', contentType: 'SOME_STATE_CODE', formAction: 'get'
          }));
        });

        it('should attempt to load default form if not declared in userLocations', async () => {
          // arrange
          spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
          spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));
          spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
            userLocations: []
          });

          // act
          await sbFormLocationSelectionDelegate.init();

          // assert
          expect(mockFormService.getFormConfig).toHaveBeenCalledWith(jasmine.objectContaining({
            formType: 'profileConfig', contentType: 'default', formAction: 'get'
          }));
        });

        it('should attempt to load default form if loading state specific form fails', async () => {
          // arrange
          spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
          const getFormConfigCallstack = [
            of([]),
            throwError('SOME_NETWORK_ERROR')
          ];
          spyOn(mockFormService, 'getFormConfig').and.callFake(() => {
            return getFormConfigCallstack.pop();
          });
          spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
            userLocations: [ { type: 'state', code: 'SOME_STATE_CODE', id: 'SOME_STATE_ID' } ]
          });

          // act
          await sbFormLocationSelectionDelegate.init();

          // assert
          expect((mockFormService.getFormConfig as jasmine.Spy).calls.argsFor(0)).toEqual([jasmine.objectContaining({
            formType: 'profileConfig', contentType: 'SOME_STATE_CODE', formAction: 'get'
          })]);
          expect((mockFormService.getFormConfig as jasmine.Spy).calls.argsFor(1)).toEqual([jasmine.objectContaining({
            formType: 'profileConfig', contentType: 'default', formAction: 'get'
          })]);
        });
      });

      describe('when user is not loggedIn', () => {
        it('should load default form', async () => {
          // arrange
          spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(false);
          spyOn(mockFormService, 'getFormConfig').and.returnValue(of([]));

          // act
          await sbFormLocationSelectionDelegate.init();

          // assert
          expect(mockFormService.getFormConfig).toHaveBeenCalledWith(jasmine.objectContaining({
            formType: 'profileConfig', contentType: 'default', formAction: 'get'
          }));
        });
      });
    });

    describe('to process form', () => {
      describe('field:name', () => {
        describe('when user is loggedIn', () => {
          it('should mark field visible and set default value to user\'s firstName', async () => {
            // arrange
            spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
            spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
              firstName: 'SOME_FIRST_NAME'
            });
            spyOn(mockFormService, 'getFormConfig').and.returnValue(of(_.cloneDeep(sampleProfileConfig)));

            // act
            await sbFormLocationSelectionDelegate.init();

            // assert
            expect(sbFormLocationSelectionDelegate.locationFormConfig).toEqual(jasmine.arrayContaining([
              {
                'code': 'name',
                'type': 'input',
                'default': 'SOME_FIRST_NAME',
                'templateOptions': {
                  'labelHtml': {
                    'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
                    'values': {
                      '$0': 'Name'
                    }
                  },
                  'hidden': false,
                  'placeHolder': 'Enter Name',
                  'multiple': false
                },
                'validations': [
                  {
                    'type': 'required'
                  }
                ]
              } as any
            ]));
          });
        });

        describe('when user is not loggedIn', () => {
          it('should mark field hidden and remove any validations', async () => {
            // arrange
            spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(false);
            spyOn(mockFormService, 'getFormConfig').and.returnValue(of(_.cloneDeep(sampleProfileConfig)));

            // act
            await sbFormLocationSelectionDelegate.init();

            // assert
            expect(sbFormLocationSelectionDelegate.locationFormConfig).toEqual(jasmine.arrayContaining([
              {
                'code': 'name',
                'type': 'input',
                'default': 'Guest',
                'templateOptions': {
                  'labelHtml': {
                    'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
                    'values': {
                      '$0': 'Name'
                    }
                  },
                  'hidden': false,
                  'placeHolder': 'Enter Name',
                  'multiple': false
                },
                'validations': [
                  {
                    'type': 'required'
                  }
                ]
              } as any
            ]));
          });
        });
      });

      describe('field:persona', () => {
        describe('when user is loggedIn', () => {
          it('should mark field visible and set default value to user\'s userType', async () => {
            // arrange
            spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(true);
            spyOnProperty(mockUserService, 'userProfile', 'get').and.returnValue({
              userType: 'teacher'
            });
            spyOn(mockFormService, 'getFormConfig').and.returnValue(of(_.cloneDeep(sampleProfileConfig)));

            // act
            await sbFormLocationSelectionDelegate.init();

            // assert
            expect(sbFormLocationSelectionDelegate.locationFormConfig).toEqual(jasmine.arrayContaining([
              jasmine.any(Object) as any,
              jasmine.objectContaining({
                'code': 'persona',
                'type': 'nested_select',
                'default': 'teacher',
                'templateOptions': {
                  'hidden': false,
                  'labelHtml': {
                    'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
                    'values': {
                      '$0': 'Role'
                    }
                  },
                  'placeHolder': 'Select Role',
                  'multiple': false,
                  'dataSrc': {
                    'marker': 'SUPPORTED_PERSONA_LIST'
                  },
                  'options': jasmine.any(Object)
                },
                'validations': [
                  {
                    'type': 'required'
                  }
                ],
                'children': jasmine.any(Object)
              }) as any
            ]));
          });
        });

        describe('when user is not loggedIn', () => {
          it('should mark field hidden and set default value to guest user\'s userType', async () => {
            // arrange
            spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(false);
            spyOn(localStorage, 'getItem').and.returnValue('teacher');
            spyOn(mockFormService, 'getFormConfig').and.returnValue(of(_.cloneDeep(sampleProfileConfig)));

            // act
            await sbFormLocationSelectionDelegate.init();

            // assert
            expect(sbFormLocationSelectionDelegate.locationFormConfig).toEqual(jasmine.arrayContaining([
              jasmine.any(Object) as any,
              jasmine.objectContaining({
                'code': 'persona',
                'type': 'nested_select',
                'default': 'teacher',
                'templateOptions': {
                  'hidden': false,
                  'labelHtml': {
                    'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
                    'values': {
                      '$0': 'Role'
                    }
                  },
                  'placeHolder': 'Select Role',
                  'multiple': false,
                  'dataSrc': {
                    'marker': 'SUPPORTED_PERSONA_LIST'
                  },
                  'options': jasmine.any(Object)
                },
                'validations': [
                  {
                    'type': 'required'
                  }
                ],
                'children': jasmine.any(Object)
              }) as any
            ]));
          });
        });

        it('should load persona options from a form configuration', async () => {
          // arrange
          spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(false);
          spyOn(localStorage, 'getItem').and.returnValue('teacher');
          spyOn(mockFormService, 'getFormConfig').and.callFake((arg) => {
            if (arg.formType === 'profileConfig') {
              return of(_.cloneDeep(sampleProfileConfig));
            } else {
              return of(_.cloneDeep(sampleUserTypeConfig));
            }
          });

          // act
          await sbFormLocationSelectionDelegate.init();

          // assert
          expect(sbFormLocationSelectionDelegate.locationFormConfig).toEqual(jasmine.arrayContaining([
            jasmine.any(Object) as any,
            jasmine.objectContaining({
              'code': 'persona',
              'type': 'nested_select',
              'default': 'teacher',
              'templateOptions': {
                'hidden': false,
                'labelHtml': {
                  'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
                  'values': {
                    '$0': 'Role'
                  }
                },
                'placeHolder': 'Select Role',
                'multiple': false,
                'dataSrc': {
                  'marker': 'SUPPORTED_PERSONA_LIST'
                },
                'options': jasmine.arrayContaining([
                  jasmine.objectContaining({ value: 'teacher' }),
                  jasmine.objectContaining({ value: 'student' }),
                  jasmine.objectContaining({ value: 'administrator' }),
                  jasmine.objectContaining({ value: 'other' }),
                ])
              },
              'validations': [
                {
                  'type': 'required'
                }
              ],
              'children': jasmine.any(Object)
            }) as any
          ]));
        });

        it('should configure closures for location options', async () => {
          // arrange
          spyOnProperty(mockUserService, 'loggedIn', 'get').and.returnValue(false);
          spyOn(localStorage, 'getItem').and.returnValue('teacher');
          spyOn(mockFormService, 'getFormConfig').and.callFake((arg) => {
            if (arg.formType === 'profileConfig') {
              return of(_.cloneDeep(sampleProfileConfig));
            } else {
              return of(_.cloneDeep(sampleUserTypeConfig));
            }
          });

          // act
          await sbFormLocationSelectionDelegate.init();

          // assert
          expect(sbFormLocationSelectionDelegate.locationFormConfig).toEqual(jasmine.arrayContaining([
            jasmine.any(Object) as any,
            jasmine.objectContaining({
              'code': 'persona',
              'type': 'nested_select',
              'default': 'teacher',
              'templateOptions': {
                'hidden': false,
                'labelHtml': {
                  'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
                  'values': {
                    '$0': 'Role'
                  }
                },
                'placeHolder': 'Select Role',
                'multiple': false,
                'dataSrc': {
                  'marker': 'SUPPORTED_PERSONA_LIST'
                },
                'options': jasmine.arrayContaining([
                  jasmine.objectContaining({ value: 'teacher' }),
                  jasmine.objectContaining({ value: 'student' }),
                  jasmine.objectContaining({ value: 'administrator' }),
                  jasmine.objectContaining({ value: 'other' }),
                ])
              },
              'validations': [
                {
                  'type': 'required'
                }
              ],
              'children': jasmine.objectContaining({
                'administrator': jasmine.arrayContaining([
                  jasmine.objectContaining({
                    code: 'state',
                    templateOptions: jasmine.objectContaining({
                      options: jasmine.any(Function)
                    })
                  }),
                  jasmine.objectContaining({
                    code: 'district',
                    templateOptions: jasmine.objectContaining({
                      options: jasmine.any(Function)
                    })
                  }),
                  jasmine.objectContaining({
                    code: 'block',
                    templateOptions: jasmine.objectContaining({
                      options: jasmine.any(Function)
                    })
                  }),
                  jasmine.objectContaining({
                    code: 'cluster',
                    templateOptions: jasmine.objectContaining({
                      options: jasmine.any(Function)
                    })
                  }),
                  jasmine.objectContaining({
                    code: 'school',
                    templateOptions: jasmine.objectContaining({
                      options: jasmine.any(Function)
                    })
                  }),
                ]),
              })
            }) as any
          ]));
        });
      });
    });
  });

  describe('onFormInitialize()', () => {
    it('should capture formGroup from sbForms', async () => {
      // arrange
      const mockSbFormsFormGroup = new FormGroup({});

      // act
      await sbFormLocationSelectionDelegate.onFormInitialize(mockSbFormsFormGroup);

      // assert
      expect(sbFormLocationSelectionDelegate.formGroup === mockSbFormsFormGroup).toBeTruthy();
      expect(sbFormLocationSelectionDelegate.isLocationFormLoading).toEqual(false);
    });
  });

  describe('onFormValueChange()', () => {
    it('should update both locations on UserProfile and DeviceProfile if applicable', async () => {
      // arrange
      const newFormValue = {
        'children': {
          'persona': {
            'state': 'SOME_SELECTED_STATE',
            'district': 'SOME_SELECTED_DISTRICT'
          }
        }
      };
      sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate = false;
      sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate = false;

      // act
      await sbFormLocationSelectionDelegate.onFormValueChange(newFormValue);

      // assert
      expect(sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate).toBeTruthy();
      expect(sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate).toBeTruthy();
    });
  });

  describe('onDataLoadStatusChange()', () => {
    describe('when status changed to "LOADED"', () => {
      it('should set loader indicator to true', async () => {
        // arrange
        sbFormLocationSelectionDelegate.isLocationFormLoading = true;
        sbFormLocationSelectionDelegate['stateChangeSubscription'] = EMPTY.subscribe();

        // act
        await sbFormLocationSelectionDelegate.onDataLoadStatusChange('LOADED');

        // assert
        expect(sbFormLocationSelectionDelegate.isLocationFormLoading).toBeFalsy();
      });

      it('subscribe to first "state" change and reload form with corresponding request', (done) => {
        // arrange
        sbFormLocationSelectionDelegate.isLocationFormLoading = true;
        sbFormLocationSelectionDelegate['stateChangeSubscription'] = undefined;
        const stateFormControl = new FormControl('');
        const personaFormControl = new FormControl('SOME_DEFAULT_PERSONA');
        sbFormLocationSelectionDelegate.formGroup = new FormGroup({
          'persona': personaFormControl,
          'children': new FormGroup({
            'persona': new FormGroup({
              'state': stateFormControl
            })
          })
        });


        spyOn(mockFormService, 'getFormConfig').and.callFake((arg) => {
          // assert
          expect(arg).toEqual({
            formType: 'profileConfig', contentType: 'SOME_SELECTED_STATE_CODE', formAction: 'get'
          });
          done();
          return of([]);
        });

        // act
        sbFormLocationSelectionDelegate.onDataLoadStatusChange('LOADED');
        personaFormControl.patchValue('SOME_PERSONA');
        setTimeout(() => {
          stateFormControl.patchValue({
            code: 'SOME_SELECTED_STATE_CODE',
            name: 'SOME_SELECTED_STATE_NAME',
            id: 'SOME_SELECTED_STATE_ID',
            type: 'SOME_SELECTED_STATE_TYPE'
          } as Location);
        }, 200);
      }, 500);
    });
  });

  describe('updateUserLocation', () => {
    let sbFormsFormGroup: FormGroup;

    beforeAll(() => {
      sbFormsFormGroup = new FormGroup({
        'children': new FormGroup({
          'persona': new FormGroup({
            'state': new FormControl({
              code: 'SOME_SELECTED_STATE_CODE',
              name: 'SOME_SELECTED_STATE_NAME',
              id: 'SOME_SELECTED_STATE_ID',
              type: 'state'
            }),
            'district': new FormControl({
              code: 'SOME_SELECTED_DISTRICT_CODE',
              name: 'SOME_SELECTED_DISTRICT_NAME',
              id: 'SOME_SELECTED_DISTRICT_ID',
              type: 'district'
            }),
          })
        })
      });
    });

    describe('when update strategy specifies to update deviceProfile', () => {
      it('should update declared location on deviceProfile', async () => {
        // arrange
        sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate = true;
        sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate = false;
        spyOn(mockDeviceRegisterService, 'updateDeviceProfile').and.callThrough();

        // act
        await sbFormLocationSelectionDelegate.onFormInitialize(sbFormsFormGroup);
        await sbFormLocationSelectionDelegate.updateUserLocation();

        // assert
        expect(mockDeviceRegisterService.updateDeviceProfile).toHaveBeenCalledWith({
          state: 'SOME_SELECTED_STATE_NAME',
          district: 'SOME_SELECTED_DISTRICT_NAME'
        });
      });
    });

    describe('when update strategy specifies to update userProfile', () => {
      it('should update declared location on userProfile', async () => {
        // arrange
        sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate = false;
        sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate = true;
        spyOnProperty(mockUserService, 'userid', 'get').and.returnValue('SOME_USER_ID');
        spyOn(mockLocationService, 'updateProfile').and.callThrough();

        // act
        await sbFormLocationSelectionDelegate.onFormInitialize(sbFormsFormGroup);
        await sbFormLocationSelectionDelegate.updateUserLocation();

        // assert
        expect(mockLocationService.updateProfile).toHaveBeenCalledWith({
          userId: 'SOME_USER_ID',
          profileLocation: [
            jasmine.objectContaining({code: 'SOME_SELECTED_STATE_CODE'}),
            jasmine.objectContaining({code: 'SOME_SELECTED_DISTRICT_CODE'})
          ]
        });
      });

      it('should update declared location on userProfile along with other selections if selected', async () => {
        // arrange
        sbFormsFormGroup = new FormGroup({
          'name': new FormControl('SOME_ENTERED_NAME'),
          'persona': new FormControl('SOME_SELECTED_PERSONA'),
          'children': new FormGroup({
            'persona': new FormGroup({
              'subPersona': new FormControl('SOME_SELECTED_SUB_PERSONA'),
              'state': new FormControl({
                code: 'SOME_SELECTED_STATE_CODE',
                name: 'SOME_SELECTED_STATE_NAME',
                id: 'SOME_SELECTED_STATE_ID',
                type: 'state'
              }),
              'district': new FormControl({
                code: 'SOME_SELECTED_DISTRICT_CODE',
                name: 'SOME_SELECTED_DISTRICT_NAME',
                id: 'SOME_SELECTED_DISTRICT_ID',
                type: 'district'
              }),
            })
          })
        });
        sbFormLocationSelectionDelegate.shouldDeviceProfileLocationUpdate = false;
        sbFormLocationSelectionDelegate.shouldUserProfileLocationUpdate = true;
        spyOnProperty(mockUserService, 'userid', 'get').and.returnValue('SOME_USER_ID');
        spyOn(mockLocationService, 'updateProfile').and.callThrough();

        // act
        await sbFormLocationSelectionDelegate.onFormInitialize(sbFormsFormGroup);
        await sbFormLocationSelectionDelegate.updateUserLocation();

        // assert
        expect(mockLocationService.updateProfile).toHaveBeenCalledWith({
          firstName: 'SOME_ENTERED_NAME',
          userType: 'SOME_SELECTED_PERSONA',
          userSubType: 'SOME_SELECTED_SUB_PERSONA',
          userId: 'SOME_USER_ID',
          profileLocation: [
            jasmine.objectContaining({code: 'SOME_SELECTED_STATE_CODE'}),
            jasmine.objectContaining({code: 'SOME_SELECTED_DISTRICT_CODE'})
          ]
        });
      });
    });
  });
});
