import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService } from '../../../../modules/core/services/framework/framework.service';
import { UtilService } from '@sunbird/shared';
import { UserService, OrgDetailsService, ChannelService, FormService, TncService, ManagedUserService } from '../../../../modules/core';
import { ResourceService, NavigationHelperService, LayoutService, ToasterService } from '../../../../modules/shared';
import { ProfileService } from '../../services';
import { CreateUserComponent } from './create-user.component';
import { of, throwError } from 'rxjs';
import { mockRes } from './create-user.component.spec.data'

describe('CreateUserComponent', () => {
    let createUserComponent: CreateUserComponent;
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            emsg: {
                m0005: 'Something went wrong, try again later',
            },
            fmsg: {
                m0085: 'There was a technical error. Try again.',
                m0100: 'Enter valid Address line 2'
            },
        },
    };
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        custom: jest.fn()

    };
    const mockProfileService: Partial<ProfileService> = {};
    const mockFormBuilder: Partial<FormBuilder> = {
        group: jest.fn()
    };
    const mockRouter: Partial<Router> = {
        url: 'sample-url' as any,
        navigate: jest.fn(),
    };
    const mockUserService: Partial<UserService> = {};
    const mockOrgDetailsService: Partial<OrgDetailsService> = {};
    const mockChannelService: Partial<ChannelService> = {};
    const mockFrameworkService: Partial<FrameworkService> = {};
    const mockUtilService: Partial<UtilService> = {};
    const mockFormService: Partial<FormService> = {
        getFormConfig: jest.fn(() => of({}))
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
                telemetry: { env: 'course', pageid: 'validate-certificate', type: 'view', subtype: '' }
            }
        } as any
    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {
        getPageLoadTime: jest.fn()
    };
    const mockTncService: Partial<TncService> = {};
    const mockManagedUserService: Partial<ManagedUserService> = {
        getUserId: jest.fn()
    };
    const mockLayoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn(() => of([{ layout: 'demo' }]))
    };
    const mockDomSanitizer: Partial<DomSanitizer> = {};
    beforeAll(() => {
        createUserComponent = new CreateUserComponent(
            mockResourceService as ResourceService,
            mockToasterService as ToasterService,
            mockProfileService as ProfileService,
            mockFormBuilder as FormBuilder,
            mockRouter as Router,
            mockUserService as UserService,
            mockOrgDetailsService as OrgDetailsService,
            mockChannelService as ChannelService,
            mockFrameworkService as FrameworkService,
            mockUtilService as UtilService,
            mockFormService as FormService,
            mockActivatedRoute as ActivatedRoute,
            mockNavigationHelperService as NavigationHelperService,
            mockTncService as TncService,
            mockManagedUserService as ManagedUserService,
            mockLayoutService as LayoutService,
            mockDomSanitizer as DomSanitizer
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of unroll batch component', () => {
        expect(createUserComponent).toBeTruthy();
    });

    describe('ngOnInit', () => {

        it('should be return create user details for web and Ios', () => {
            // arrange
            mockNavigationHelperService.setNavigationUrl = jest.fn();
            mockLayoutService.initlayoutConfig = jest.fn(() => Promise.resolve({}));
            // act
            createUserComponent.ngOnInit();
            // assert
            expect(mockNavigationHelperService.setNavigationUrl).toBeCalled();
            expect(mockLayoutService.initlayoutConfig).toHaveBeenCalled();
            expect(createUserComponent.instance).toBeDefined();

        });
    });
    describe('setTelemetryData', () => {
        it('should set telemetry data', () => {
            // arrange
            createUserComponent.telemetryImpression = {
                context: {
                    env: mockActivatedRoute.snapshot.data.telemetry.env
                },
                edata: {
                    type: mockActivatedRoute.snapshot.data.telemetry.type,
                    pageid: createUserComponent.pageId,
                    subtype: mockActivatedRoute.snapshot.data.telemetry.subtype,
                    uri: mockRouter.url,
                    duration: 10
                }
            };
            // act
            createUserComponent.setTelemetryData();
            // assert
            expect(createUserComponent.telemetryImpression).toBeDefined();
        });
        it('should return submiited interacted data', () => {
            // arrange
            createUserComponent.submitInteractEdata = {
                id: 'submit-create-managed-user',
                type: 'click',
                pageid: createUserComponent.pageId
            }
            // act
            createUserComponent.setTelemetryData();
            // assert
            expect(createUserComponent.submitInteractEdata).toBeDefined();
        });

        it('should return cancelled interacted data', () => {
            // arrange
            createUserComponent.submitCancelInteractEdata = {
                id: 'cancel-create-managed-user',
                type: 'click',
                pageid: createUserComponent.pageId
            };
            // act
            createUserComponent.setTelemetryData();
            // assert
            expect(createUserComponent.submitCancelInteractEdata).toBeDefined();

        });

    });
    describe('getFormDetails', () => {

        it('should call getFormDetails', () => {
            // arrange
            const formServiceInputParams = {
                formType: 'user',
                formAction: 'create',
                contentType: 'child',
                component: 'portal'
            };
            mockFormService.getFormConfig = jest.fn(() => (of(mockRes.formData))) as any;
            jest.spyOn(createUserComponent, 'initializeFormFields');
            mockFormBuilder.group = jest.fn().mockReturnValue({
                controls: {
                    name: '',
                    contactType: { value: 'phone' }
                },
                valueChanges: of({}),
            })

            // act
            createUserComponent.getFormDetails();
            // assert
            expect(mockFormService.getFormConfig).toHaveBeenCalled();
            expect(createUserComponent.formData).toEqual(mockRes.formData);
            expect(createUserComponent.initializeFormFields).toHaveBeenCalled();

        });


        it('should call when FormDetails response is failed', () => {
            // arrange
            const formServiceInputParams = {
                formType: '',
                formAction: '',
                contentType: '',
                component: ''
            };
            mockFormService.getFormConfig = jest.fn(() => throwError(of(formServiceInputParams))) as any;
            // act
            createUserComponent.getFormDetails();
            // assert
            expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.emsg.m0005);
            expect(createUserComponent.showLoader).toBeFalsy();
        });
    });
    describe('goBack', () => {
        it('return back to the navigation helper page', () => {
            // arrange
            mockNavigationHelperService.goBack = jest.fn();
            //act
            createUserComponent.goBack();
            // assert
            expect(mockNavigationHelperService.goBack).toHaveBeenCalled();

        });

    });
    describe('onCancel', () => {
        it('return back to the last navigation  page', () => {
            // arrange
            mockNavigationHelperService.navigateToLastUrl = jest.fn();
            //act
            createUserComponent.onCancel();
            // assert
            expect(mockNavigationHelperService.navigateToLastUrl).toHaveBeenCalled();

        });
    });

    describe('onSubmitForm', () => {
        it('should submit the form data', () => {
            // arrange  
            createUserComponent.userDetailsForm = new FormGroup({
                name: new FormControl('test-name'),
            });
            const createUserRequest = {
                request: {
                    firstName: createUserComponent.userDetailsForm.controls.value,
                    managedBy: mockManagedUserService.getUserId()
                }
            };
            const userProfileData = {
                userLocations: mockRes.userData.userLocations,
                // framework: mockRes.userData.framework
                framework: 'demo'
            };
            jest.spyOn(createUserComponent, 'registerUser');
            mockDomSanitizer.sanitize = jest.fn().mockReturnValue(createUserComponent.userDetailsForm.value.name);
            mockManagedUserService.getParentProfile = jest.fn().mockReturnValue(of(userProfileData)) as any;
            //act
            createUserComponent.onSubmitForm();
            //assert
            expect(createUserComponent.enableSubmitBtn).toBeFalsy();
            expect(createUserComponent.userDetailsForm.value).toBeDefined();
            expect(createUserComponent.userDetailsForm.value.name).toBeDefined();
        });
        it('should not submit the form data', () => {
            // arrange  
            createUserComponent.userDetailsForm = new FormGroup({
                name: new FormControl('test-name'),
            });
            createUserComponent.userDetailsForm.controls.name.setValue("");

            const createUserRequest = {
                request: {
                    firstName: createUserComponent.userDetailsForm.controls.value,
                    managedBy: mockManagedUserService.getUserId()
                }
            };
            const userProfileData = {
                userLocations: mockRes.userData.userLocations,
                // framework: mockRes.userData.framework
                framework: 'demo'
            };
            jest.spyOn(createUserComponent, 'registerUser');
            mockDomSanitizer.sanitize = jest.fn().mockReturnValue(createUserComponent.userDetailsForm.value.name);
            mockManagedUserService.getParentProfile = jest.fn().mockReturnValue(of(userProfileData)) as any;
            //act
            createUserComponent.onSubmitForm();
            //assert
            expect(createUserComponent.enableSubmitBtn).toBeFalsy();
            expect(createUserComponent.userDetailsForm.value).toBeDefined();
            expect(createUserComponent.userDetailsForm.value.name).toBeDefined();
        });
    });
    describe('registerUser', () => {

        it('return the registered  user', () => {
            //arrange
            const createUserRequest = {
                request: { firstName: createUserComponent.userDetailsForm.controls, managedBy: mockManagedUserService.getUserId() }
            };
            const userProfileData = { userLocations: mockRes.userData.userLocations, framework: 'demo' };
            const formServiceInputParams = { result: { value: 'demo', userId: 'demo' } };
            mockManagedUserService.updateUserList = jest.fn();
            mockUserService.registerUser = jest.fn(() => (of(formServiceInputParams))) as any;
            mockManagedUserService.updateUserList({
                firstName: createUserComponent.userDetailsForm.controls.value,
                identifier: formServiceInputParams.result.value,
                id: formServiceInputParams.result.userId,
                managedBy: mockManagedUserService.getUserId()
            });
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            //act
            createUserComponent.registerUser(createUserRequest, userProfileData);
            //assert
            expect(mockManagedUserService.updateUserList).toBeDefined();
            expect(mockToasterService.custom).toBeDefined();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile/choose-managed-user']);
        });
        it('should show alert message from params when all list fail', () => {
            // arrange
            const createUserRequest = { request: { firstName: createUserComponent.userDetailsForm.controls, managedBy: mockManagedUserService.getUserId() } };
            const userProfileData = { userLocations: mockRes.userData.userLocations, framework: 'demo' };
            mockUserService.registerUser = jest.fn(() => throwError({ error: { params: { status: 'MANAGED_USER_LIMIT_EXCEEDED' } } }));
            // act
            createUserComponent.registerUser(createUserRequest, userProfileData);
            // assert
            expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.fmsg.m0100);
            expect(createUserComponent.enableSubmitBtn).toBeTruthy();
        });
        it('should show alert message from params when all list fail & status unmatched', () => {
            // arrrange
            const createUserRequest = { request: { firstName: createUserComponent.userDetailsForm.controls, managedBy: mockManagedUserService.getUserId() } };
            const userProfileData = { userLocations: mockRes.userData.userLocations, framework: 'demo' };
            mockUserService.registerUser = jest.fn(() => throwError({ error: { params: { status: '' } } }));
            // act
            createUserComponent.registerUser(createUserRequest, userProfileData);
            // assert
            expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.fmsg.m0085);
            expect(createUserComponent.enableSubmitBtn).toBeTruthy();

        });
    });
});