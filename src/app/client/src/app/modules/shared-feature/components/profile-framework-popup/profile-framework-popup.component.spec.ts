import { FrameworkService, FormService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { of, throwError } from 'rxjs';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { _ } from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { PopupControlService } from '../../../../service/popup-control.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '@sunbird/profile';
import { Response } from './profile-framework-popup.component.spec.data';
import { ProfileFrameworkPopupComponent } from './profile-framework-popup.component';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { ConfigService } from '../../../shared/services/config/config.service';

describe('ProfileFrameworkPopupComponent', () => {
    let component: ProfileFrameworkPopupComponent;
    const router: Partial<Router> = {
        navigate: jest.fn()
    };
    const userService: Partial<UserService> = {
        loggedIn: true,
        slug: jest.fn().mockReturnValue("tn") as any,
        userData$: of({ userProfile: Response.userProfile as any }) as any,
        setIsCustodianUser: jest.fn(),
        userid: 'sample-uid',
        appId: 'sample-id',
        getServerTimeDiff: '',
        userProfile: Response.userProfile,
        setUserFramework: jest.fn(),
        createGuestUser: jest.fn()
    };
    const frameworkService: Partial<FrameworkService> = {};
    const formService: Partial<FormService> = {
        getFormConfig:jest.fn()
    };
    const resourceService: Partial<ResourceService> = {
        messages: {
            smsg: {
                m0058: 'User preference updated successfully',
            },
            emsg: {
                m0005: 'Something went wrong, try again later'
            }
        }
    };
    const cacheService: Partial<CacheService> = {
        set: jest.fn(),
        get: jest.fn()
    };
    const toasterService: Partial<ToasterService> = {
        success: jest.fn(),
        error: jest.fn()
    };
    const channelService: Partial<ChannelService> = {
        getFrameWork:jest.fn()
    };
    const orgDetailsService: Partial<OrgDetailsService> = {
        getOrgDetails: jest.fn(),
        getCustodianOrgDetails: jest.fn()
    };
    const popupControlService: Partial<PopupControlService> = {
        changePopupStatus: jest.fn()
    };
    const dialogRefData = {
        close: jest.fn()
    };
    const matDialog: Partial<MatDialog> = {
        getDialogById: jest.fn().mockReturnValue(dialogRefData)
    };
    const profileService: Partial<ProfileService> = {};
    const mockCslFrameworkService: Partial<CslFrameworkService> = {
        getFrameworkCategories: jest.fn(),
        getFrameworkCategoriesObject: jest.fn(),
        setFWCatConfigFromCsl: jest.fn(),
        transformSelectedData: jest.fn(),
        setTransFormGlobalFilterConfig: jest.fn()
    };
    const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
    beforeAll(() => {
        component = new ProfileFrameworkPopupComponent(
            router as Router,
            userService as UserService,
            frameworkService as FrameworkService,
            formService as FormService,
            resourceService as ResourceService,
            cacheService as CacheService,
            toasterService as ToasterService,
            channelService as ChannelService,
            orgDetailsService as OrgDetailsService,
            popupControlService as PopupControlService,
            matDialog as MatDialog,
            profileService as ProfileService,
            mockCslFrameworkService as CslFrameworkService,
            mockConfigService as ConfigService,
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should throw warning and navigate to resource if not in edit mode and fetching custodian org details fails', () => {
        component.dialogProps = {
            id: 'test'
        }
        component.isGuestUser = true
        component.isStepper = false
        matDialog.open = jest.fn();
        const nonCustodianOrg = { result: { response: { value: 'ROOT_ORG' } } }
        orgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
        orgDetailsService.getOrgDetails = jest.fn().mockReturnValue(of({})) as any;
        component.hashId = 1234
        component.ngOnInit();
        expect(component.guestUserHashTagId).toBe(1234)
    });
    it('should call navigateToLibrary method', () => {
        component.dialogRef = MatDialogRef as any
        component.dialogRef.close = jest.fn();
        component['navigateToLibrary']();
        expect(component).toBeTruthy();
        expect(cacheService.set).toHaveBeenCalledWith('showFrameWorkPopUp', 'installApp');
    });
    describe('new Describe of isCustodianOrgUser', () => {
        it('should call isCustodianOrgUser method', () => {
            const nonCustodianOrg = { result: { response: { value: 'ORG_001' } } }
            orgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
            userService.userProfile.rootOrg.rootOrgId = "ORG_OO1"
            let output = component['isCustodianOrgUser']();
            expect(output).toBeTruthy();
        });
        it('should call isCustodianOrgUser method with return as false', () => {
            const nonCustodianOrg = { result: { response: { value: 'ROOT_ORG' } } }
            userService.userProfile.rootOrg.rootOrgId = "ORG_OO1"
            orgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
            let output = component['isCustodianOrgUser']();
            expect(output).toBeTruthy();
        });
    });
    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component['unsubscribe'] = {
                unsubscribe: jest.fn(),
            } as any;
            component.dialogRef = MatDialogRef as any
            component.dialogRef.close = jest.fn();
            component.ngOnDestroy();
            expect(component['unsubscribe'].unsubscribe).toHaveBeenCalled();
        });
    });
    it('should call enableSubmitButton method', () => {
        component['_formFieldProperties'] = Response.formFields1;
        component['enableSubmitButton']();
        expect(component.showButton).toBeTruthy();
    });
    it('should call enableSubmitButton method with showButton as false', () => {
        component['_formFieldProperties'] = Response.formFields1;
        component.selectedOption = Response.selectedOption;
        component['enableSubmitButton']();
        expect(component.showButton).toBeFalsy();
    });
    it('should call onSubmitForm method', () => {
        const selectedData = { fw1: 'test1', fw2: 'test2'};
        const transformedData = { fw1: 'test1'};
        const cloneDeepMock = jest.spyOn(_, 'cloneDeep').mockReturnValue(selectedData);
        const codeValue = 'code1';
        jest.spyOn(userService, 'setUserFramework');
        profileService.updateProfile = jest.fn(() => of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        mockCslFrameworkService.transformSelectedData = jest.fn(() => of(transformedData));
        component.selectedOption = selectedData;
        component.frameworkCategoriesObject = {fw1: 'test1'}
        component.frameworkCategories = {
            fwCategory1: {
              code: codeValue,
            },
          };
        component.onSubmitForm();
        expect(cloneDeepMock).toHaveBeenCalledWith(component.selectedOption);
        expect(mockCslFrameworkService.transformSelectedData).toHaveBeenCalledWith(
            selectedData,
            component.frameworkCategoriesObject
          );
        expect(userService.setUserFramework).toBeCalled();
    });


    it('should call onSubmitForm method', () => {
        const selectedData = { fw1: 'test1', fw2: 'test2'};
        const transformedData = { fw1: 'test1'};
        const cloneDeepMock = jest.spyOn(_, 'cloneDeep').mockReturnValue(selectedData);
        const codeValue = 'code1';
        jest.spyOn(userService, 'setUserFramework');
        localStorage.setItem('userType', 'student');
        profileService.updateProfile = jest.fn(() => of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        userService.createGuestUser = jest.fn().mockReturnValue(of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        component.isStepper = true;
        component.isGuestUser = true;
        mockCslFrameworkService.transformSelectedData = jest.fn(() => of(transformedData));
        component.selectedOption = selectedData;
        component.frameworkCategoriesObject = {fw1: 'test1'}
        component.frameworkCategories = {
            fwCategory1: {
              code: codeValue,
            },
          };

        component.onSubmitForm();
        expect(cloneDeepMock).toHaveBeenCalledWith(component.selectedOption);
        expect(mockCslFrameworkService.transformSelectedData).toHaveBeenCalledWith(
            selectedData,
            component.frameworkCategoriesObject
          );

        expect(toasterService.success).toBeCalledWith(resourceService.messages.smsg.m0058);
    });
    it('should call onSubmitForm method with error', () => {
        const selectedData = { fw1: 'test1', fw2: 'test2'};
        const transformedData = { fw1: 'test1'};
        const cloneDeepMock = jest.spyOn(_, 'cloneDeep').mockReturnValue(selectedData);
        const codeValue = 'code1';
        jest.spyOn(userService, 'setUserFramework');
        localStorage.setItem('userType', 'student');
        profileService.updateProfile = jest.fn(() => of({
            'result': {
                'response': 'SUCCESS'
            }
        })) as any;
        userService.createGuestUser = jest.fn().mockReturnValue(throwError({
            'result': {
                'response': 'ERROR'
            }
        })) as any;
        component.isStepper = true;
        component.isGuestUser = true;
        mockCslFrameworkService.transformSelectedData = jest.fn(() => of(transformedData));
        component.selectedOption = selectedData;
        component.frameworkCategoriesObject = {fw1: 'test1'}
        component.frameworkCategories = {
            fwCategory1: {
              code: codeValue,
            },
          };
        component.onSubmitForm();
        expect(cloneDeepMock).toHaveBeenCalledWith(component.selectedOption);
        expect(mockCslFrameworkService.transformSelectedData).toHaveBeenCalledWith(
            selectedData,
            component.frameworkCategoriesObject
          );
        expect(toasterService.error).toBeCalledWith(resourceService.messages.emsg.m0005);
    });

    it('should call getFormDetails method', () => {
       component['_formFieldProperties'] = Response.formFields1;
       jest.spyOn(formService, 'getFormConfig').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'status'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
       component['getFormDetails']();
       expect(formService.getFormConfig).toHaveBeenCalled();
    });

    it('should call getFormDetails method with admin user', async () => {
        component['_formFieldProperties'] = Response.formFields1;
        localStorage.setItem('userType', 'administrator');
        jest.spyOn(formService, 'getFormConfig').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'status'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
        await component['getFormDetails']();
        expect(formService.getFormConfig).toHaveBeenCalled();
    });

    it('should handle error and return default value in catch block', async () => {
        const formServiceInputParams = {
            contentType: "admin_framework",
            formAction: "create",
            formType: "user",
            };
        const hashTagId = 1234;
        const mockError = new Error('Mocked error message');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(formService, 'getFormConfig').mockImplementation(() => throwError(mockError));
        const result = await component['getFormDetails']().toPromise();
        expect(formService.getFormConfig).toHaveBeenCalledWith(formServiceInputParams, hashTagId);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching form config:', expect.objectContaining({ message: 'Mocked error message' })
        );
        consoleErrorSpy.mockRestore();
        expect(result).toEqual(component.frameworkCategoriesObject);
    });

    it('should update frameworkCategories and frameworkCategoriesObject when setFWCatConfigFromCsl succeeds', async () => {
        const frameWorkId = 'sampleFrameworkId';
        const mockCategories = 'mockCategories';
        const mockCategoriesObject = 'mockCategoriesObject';
        jest.spyOn((component as any).cslFrameworkService, 'setFWCatConfigFromCsl').mockResolvedValueOnce(undefined);
        jest.spyOn((component as any).cslFrameworkService, 'getFrameworkCategories').mockReturnValueOnce(mockCategories);
        jest.spyOn((component as any).cslFrameworkService, 'getFrameworkCategoriesObject').mockReturnValueOnce(mockCategoriesObject);
        jest.spyOn((component as any).cslFrameworkService, 'setTransFormGlobalFilterConfig').mockResolvedValueOnce(undefined);
        await component['updateFrameworkCategories'](frameWorkId);
        expect((component as any).cslFrameworkService.setFWCatConfigFromCsl).toHaveBeenCalledWith(frameWorkId);
        expect((component as any).cslFrameworkService.setTransFormGlobalFilterConfig).toHaveBeenCalledWith();
        expect(component['frameworkCategories']).toEqual(mockCategories);
        expect(component['frameworkCategoriesObject']).toEqual(mockCategoriesObject);
    });

    it('should log an error when setFWCatConfigFromCsl fails', async () => {
        const frameWorkId = 'sampleFrameworkId';
        const mockError = new Error('Sample error message');
        jest.spyOn((component as any).cslFrameworkService, 'setFWCatConfigFromCsl').mockRejectedValueOnce(mockError);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await component['updateFrameworkCategories'](frameWorkId);
        expect((component as any).cslFrameworkService.setFWCatConfigFromCsl).toHaveBeenCalledWith(frameWorkId);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating framework categories:', mockError);
        consoleErrorSpy.mockRestore();
    });

    it('should set frameworkCategories, frameworkCategoriesObject, popup status, and guestUserHashTagId when ngOnInit is called', () => {
        jest.spyOn(mockCslFrameworkService, 'getFrameworkCategories').mockReturnValue('mock-framework-categories');
        jest.spyOn(mockCslFrameworkService, 'getFrameworkCategoriesObject').mockReturnValue('mock-framework-categories-object');
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockReturnValue(of({ result: { response: { value: 1234 } } }));
        component.ngOnInit();
        expect(component.frameworkCategories).toEqual('mock-framework-categories');
        expect(component.frameworkCategoriesObject).toEqual('mock-framework-categories-object');
        expect(component.popupControlService.changePopupStatus).toHaveBeenCalledWith(false);
        expect(component.guestUserHashTagId).toEqual(1234);
    });

    it('should get custodian org data for guest', (done) => {
        const mockChannelData = {
        result: {
            channel: {
            defaultFramework: 'channelDefaultFramework'
            }
        }
        };
        jest.spyOn(component['channelService'], 'getFrameWork').mockReturnValue(of(mockChannelData as any));
        component['getCustodianOrgDataForGuest']().subscribe((result) => {
        expect(result).toEqual( {"code": undefined, "index": 1, "label": undefined, "range": []});
        done();
        });
    });

    it('should handle getFormOptionsForCustodianOrgForGuestUser', () => {
        const sampleCustodianOrgData = {
            range: [
                { index: 1, label: 'Option 1' },
                { index: 2, label: 'Option 2' },
            ],
        };
        jest.spyOn(component, 'getCustodianOrgDataForGuest' as any).mockReturnValue(of(sampleCustodianOrgData));
        component['getFormOptionsForCustodianOrgForGuestUser']().subscribe((result) => {
        expect(result).toEqual({});
        });
    });

    xit('should handle update mode and update selectedOption, frameWorkId, _formFieldProperties, and call mergeBoard and getUpdatedFilters', async () => {
        component.frameworkCategories = {
            fwCategory1: { code: 'someCode', label: 'Some Label' },
        };

        const selectedOptionMock = {
            [component.frameworkCategories.fwCategory1.code]: ['value1'],
        };

        const custOrgFrameworksMock = [
            { name: 'value1', identifier: 'id1' },
            { name: 'value2', identifier: 'id2' },
        ];

        const formFieldPropertiesMock = {
            field1: 'value1',
            field2: 'value2',
        };

        const spyOnGet = jest.spyOn(_, 'get' as any).mockImplementation(() => 'value1');
        const spyOnFind = jest.spyOn(_, 'find' as any).mockReturnValue({ 'name': 'value1', 'identifier': 'id1' });
        const spyOnGetFormatedFilterDetails = jest.spyOn(component, 'getFormatedFilterDetails' as any).mockReturnValue(of(formFieldPropertiesMock));
        const spyOnGetUpdatedFilters = jest.spyOn(component, 'getUpdatedFilters' as any).mockReturnValue(of({}));

        component.selectedOption = selectedOptionMock;
        component['custOrgFrameworks'] = custOrgFrameworksMock;
        jest.spyOn(component['channelService'], 'getFrameWork').mockReturnValue(of({})as any);
        await component['getFormOptionsForCustodianOrgForGuestUser']().toPromise();

        expect(spyOnGet).toHaveBeenCalledWith(selectedOptionMock, `${component.frameworkCategories.fwCategory1.code}[0]`);
        expect(component.selectedOption[component.frameworkCategories.fwCategory1.code]).toEqual('value1');
        expect(spyOnFind).toHaveBeenCalledWith(component['custOrgFrameworks'], { 'name': 'value1' });
        expect(component['frameWorkId']).toEqual('value1');
        expect(spyOnGetFormatedFilterDetails).toHaveBeenCalled();
        expect(component['_formFieldProperties']).toEqual(formFieldPropertiesMock);
        expect(spyOnGetUpdatedFilters).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'someCode',
                index: 1,
                label: 'Some Label',
                range: expect.arrayContaining([
                    expect.any(String),
                ]),
            }),
            true
        );
    });

    it('should handle update mode and call getFormatedFilterDetails and mergeBoard', (done) => {
        const dataMock = {
            range: [
                { index: 1, label: 'Label 1' },
                { index: 2, label: 'Label 2' },
            ],
        };
        const formFieldPropertiesMock = {
            field1: 'value1',
            field2: 'value2',
        };
        jest.spyOn(component, 'getCustodianOrgData' as any).mockReturnValue(of(dataMock));
        jest.spyOn(_, 'cloneDeep').mockReturnValue(dataMock);
        jest.spyOn(_, 'sortBy').mockReturnValue(dataMock.range);
        jest.spyOn(_, 'get').mockReturnValue('value1');
        jest.spyOn(_, 'find').mockReturnValue({ name: 'value1', identifier: 'id1' });
        jest.spyOn(component, 'getFormatedFilterDetails' as any).mockReturnValue(of(formFieldPropertiesMock));
        jest.spyOn(component, 'mergeBoard' as any).mockImplementation(() => { });
        jest.spyOn(component, 'getUpdatedFilters' as any).mockReturnValue(of({}));
        component.selectedOption = {
        [component['frameworkCategories.fwCategory1.code']] : ['value1'],
        };
        component['custOrgFrameworks'] = [{ name: 'value1', identifier: 'id1' }];
        component['getFormOptionsForCustodianOrg']().subscribe(() => {
        expect(component.selectedOption[component['frameworkCategories.fwCategory1.code']]).toEqual('value1');
        expect(component['getFormatedFilterDetails']).toHaveBeenCalled();
        expect(component['mergeBoard']).toHaveBeenCalled();
        done();
        });
    });

    it('should handle non-update mode and return fieldOptions', () => {
        const formFieldPropertiesMock = [
            { code: 'value1', range: [] },
        ];
        const spyOnGetFormatedFilterDetails = jest.spyOn(component, 'getFormatedFilterDetails' as any).mockReturnValue(of(formFieldPropertiesMock));
        component['getFormOptionsForOnboardedUser']().subscribe(() => {
            expect(spyOnGetFormatedFilterDetails).toHaveBeenCalled();
        });
    });

    xit('should return custodian organization data', async () => {
        jest.spyOn(channelService, 'getFrameWork').mockReturnValue(of({} as any));
        component['userService'] = { hashTagId: 'mockedHashTagId' } as any;
        const getCustodianOrgDataSpy = jest.spyOn(component, 'getCustodianOrgData' as any);
        const result = await component['getCustodianOrgData']().toPromise();
        expect(result).toEqual({
        range: [],
        label: component.frameworkCategories?.fwCategory1?.label,
        code: component.frameworkCategories?.fwCategory1?.code,
        index: 1
        });
        expect(component['channelService'].getFrameWork).toHaveBeenCalledWith(component['userService'].hashTagId);
        expect(getCustodianOrgDataSpy).toHaveBeenCalled();
    });

});