import { CoursesService, ManagedUserService, UserService } from '@sunbird/core';
import {
    ConfigService,
    ResourceService,
    ToasterService, ConnectionService,
    NavigationHelperService, UtilService, LayoutService
} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { of, Subscription } from 'rxjs';
import { ChooseUserComponent } from './choose-user.component';
import { mockData } from './choose-user.component.spec.data';

xdescribe("ChooseUserComponent", () => {
    let chooseUserComponent: ChooseUserComponent;
    const mockUserService: Partial<UserService> = {
        userData$: of({ userProfile: mockData.userProfile }) as any,
        userProfile: () => {
            return {
                managedBy: true
            }
        },
        initialize: jest.fn()
    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {
        setNavigationUrl: jest.fn(),
        goBack: jest.fn()

    };
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        custom: jest.fn()
    };
    const mockRouter: Partial<Router> = {
        navigate: jest.fn()
    };
    const mockUtilService: Partial<UtilService> = {
        isDesktopApp: true,
        redirect: jest.fn(),
    };
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            imsg: {
                m0095: 'message'
            },
            emsg: {
                m0005: 'Error'
            }
        }
    }
    const mockTelemetryService: Partial<TelemetryService> = {
        impression: jest.fn(),
        interact: jest.fn(),
        initialize: jest.fn(),
        syncEvents: jest.fn(),
        setInitialization: jest.fn()
    };
    const mockConfigService: Partial<ConfigService> = {
        constants: {
            SIZE: {
                MEDIUM: '4'
            },
            VIEW: {
                HORIZONTAL: true
            }
        },
        appConfig: {
            layoutConfiguration: 'joy',
            TELEMETRY: {
                PID: 'sample-page-id'
            }
        },
        urlConFig: {
            URLS: {
                BADGE: {
                    CREATE: 'badging/v1/issuer/badge/assertion/create'
                },
                TELEMETRY: {
                    SYNC: true
                },
                CONTENT_PREFIX: ''
            }
        }
    };
    const mockManagedUserService: Partial<ManagedUserService> = {
        getUserId: jest.fn(),
        processUserList: jest.fn(),
        initiateSwitchUser: jest.fn(),
        getMessage: jest.fn()
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
                telemetry: {
                    object: {
                        type: 'view'
                    }
                }
            }
        } as any,
    };
    const mockCoursesService: Partial<CoursesService> = {};
    const mockConnectionService: Partial<ConnectionService> = {
        monitor: jest.fn()

    };
    const mockLayoutService: Partial<LayoutService> = {};

    beforeAll(() => {
        chooseUserComponent = new ChooseUserComponent(
            mockUserService as UserService,
            mockNavigationHelperService as NavigationHelperService,
            mockToasterService as ToasterService,
            mockRouter as Router,
            mockUtilService as UtilService,
            mockResourceService as ResourceService,
            mockTelemetryService as TelemetryService,
            mockConfigService as ConfigService,
            mockManagedUserService as ManagedUserService,
            mockActivatedRoute as ActivatedRoute,
            mockCoursesService as CoursesService,
            mockConnectionService as ConnectionService,
            mockLayoutService as LayoutService
        );
    });
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(chooseUserComponent).toBeTruthy();
    });

    xdescribe('getManagedUserList', () => {
        it('should call managedUserList$ and getParentProfile when userProfile.managedBy is true', () => {
            //arrange
            mockUserService._userData$ = jest.fn(() => of(mockData.userReadApiResponse)) as any;
            mockUserService.userProfile.managedBy = true;
            mockManagedUserService.getParentProfile = jest.fn().mockReturnValue(of(mockData.managedUserList));
            mockManagedUserService.processUserList = jest.fn().mockImplementation();
            //act
            chooseUserComponent.getManagedUserList();
            //assert
            expect(mockManagedUserService.getParentProfile).toHaveBeenCalled();
            expect(mockManagedUserService.processUserList).toBeDefined();
            expect(mockUserService.userProfile.managedBy).toBeTruthy();


        });
    });

    xdescribe('initializeManagedUser', () => {
        it('should call syncEvents, setInitialization, initialize, and custom', () => {
            //arrange
            chooseUserComponent.selectedUser = {
                firstName: 'John'
            };
            jest.spyOn(window, 'setTimeout').mockImplementation();
            //act
            chooseUserComponent.initializeManagedUser();
            //arrange
            expect(mockTelemetryService.syncEvents).toHaveBeenCalledWith(false);
            expect(mockTelemetryService.setInitialization).toHaveBeenCalledWith(false);
            expect(mockTelemetryService.initialize).toHaveBeenCalledWith(chooseUserComponent.getTelemetryContext());
            expect(mockManagedUserService.getMessage).toHaveBeenCalledWith(mockResourceService.messages.imsg.m0095, chooseUserComponent.selectedUser.firstName);
        });
    });

    xdescribe('ngOnInit', () => {
        it('should fetch managed user list on init', () => {
            //arrange
            jest.spyOn(mockNavigationHelperService, 'setNavigationUrl').mockImplementation();
            const userData = mockData.userReadApiResponse;
            mockUserService._authenticated = true;
            userData.result.response['managedBy'] = 'mock managed by id';
            mockUserService._userData$ = jest.fn(() => of(mockData.userReadApiResponse)) as any;
            mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
            jest.spyOn(mockManagedUserService, 'getUserId').mockReturnValue('id');
            mockConnectionService.monitor = jest.fn(() => of(true));
            mockLayoutService.initlayoutConfig = jest.fn(() => { });
            mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
            jest.spyOn(mockManagedUserService, 'processUserList').mockReturnValue(mockData.userList);
            mockUserService.initialize(true);
            //act
            chooseUserComponent.ngOnInit();
            //assert
            expect(mockNavigationHelperService.setNavigationUrl).toHaveBeenCalled();
        });
    });

    xdescribe('switchUser', () => {
        it('should switch selected user', () => {
            //arrange
            chooseUserComponent.selectedUser = mockData.selectedUser;
            // @ts-ignore
            jest.spyOn(document, 'getElementById').mockImplementation((id) => {
                if (id === 'buildNumber') {
                    return { value: '1.1.12.0' };
                }
                if (id === 'deviceId') {
                    return { value: 'device' };
                }
                if (id === 'defaultTenant') {
                    return { value: 'defaultTenant' };
                }
                return { value: 'mock Id' };
            });
            chooseUserComponent.isConnected = false;
            jest.spyOn(mockManagedUserService, 'initiateSwitchUser').mockReturnValue(of(mockData.managedUserList));
            mockManagedUserService.setSwitchUserData = jest.fn(() => { return '' });
            jest.spyOn(chooseUserComponent, 'initializeManagedUser').mockImplementation();
            mockUserService._userData$ = jest.fn(() => of(mockData.userReadApiResponse)) as any;
            jest.spyOn(mockTelemetryService, 'initialize').mockImplementation();
            jest.spyOn(mockUtilService, 'redirect').mockImplementation(() => {
            });
            const switchUserRequest = {
                userId: mockData.selectedUser.identifier,
                isManagedUser: mockData.selectedUser.managedBy ? true : false
            };
            //act
            chooseUserComponent.switchUser();
            //assert
            expect(mockManagedUserService.initiateSwitchUser).toHaveBeenCalledWith(switchUserRequest);

        });
        it('should switch selected user if not connected', () => {
            //arrange
            chooseUserComponent.selectedUser = mockData.selectedUser;
            // @ts-ignore
            jest.spyOn(document, 'getElementById').mockImplementation((id) => {
                if (id === 'buildNumber') {
                    return { value: '1.1.12.0' };
                }
                if (id === 'deviceId') {
                    return { value: 'device' };
                }
                if (id === 'defaultTenant') {
                    return { value: 'defaultTenant' };
                }
                return { value: 'mock Id' };
            });
            chooseUserComponent.isConnected = true;
            jest.spyOn(mockManagedUserService, 'initiateSwitchUser').mockReturnValue(of(mockData.managedUserList));
            mockManagedUserService.setSwitchUserData = jest.fn(() => { return '' });
            jest.spyOn(chooseUserComponent, 'initializeManagedUser').mockImplementation();
            mockCoursesService.getEnrolledCourses = jest.fn().mockImplementation();
            mockUserService._userData$ = jest.fn(() => of(mockData.userReadApiResponse)) as any;
            jest.spyOn(mockTelemetryService, 'initialize').mockImplementation();
            jest.spyOn(mockUtilService, 'redirect').mockImplementation(() => {
            });
            const switchUserRequest = {
                userId: mockData.selectedUser.identifier,
                isManagedUser: mockData.selectedUser.managedBy ? true : false
            };
            //act
            chooseUserComponent.switchUser();
            //assert
            expect(mockManagedUserService.initiateSwitchUser).toHaveBeenCalledWith(switchUserRequest);

        });
    });

    xdescribe('selectUser', () => {
        it('should select user', () => {
            //arrange
            chooseUserComponent.userList = [mockData.selectUserData.data.data];
            //act
            chooseUserComponent.selectUser(mockData.selectUserData);
            //assert
            expect(chooseUserComponent.selectedUser).toEqual(mockData.selectUserData.data.data);
            expect(chooseUserComponent.userList).toEqual(mockData.selectedUserList);
        });

        it('should be select user if already selected', () => {
            //arrange
            chooseUserComponent.userList = [mockData.selectUserData.data.data];
            const mockEventData = mockData.selectUserData;
            mockEventData.data.data.selected = true;
            //act
            chooseUserComponent.selectUser(mockEventData);
            //assert
            expect(chooseUserComponent.selectedUser).toEqual(null);
            expect(chooseUserComponent.userList).toEqual(mockData.notSelectedUserList);
        });
    });

    xdescribe('ngOnDestroy', () => {
        it('should unsubscribe from subscription', () => {
            //arrange
            let subscription: Subscription;
            let telemetryEventSubscription$: Subscription;
            subscription = new Subscription();
            telemetryEventSubscription$ = new Subscription();
            chooseUserComponent.userDataSubscription = subscription;
            jest.spyOn(telemetryEventSubscription$, 'unsubscribe').mockImplementation();
            jest.spyOn(subscription, 'unsubscribe').mockImplementation();
            //act
            chooseUserComponent.ngOnDestroy();
            //assert
            expect(subscription.unsubscribe).toHaveBeenCalled();
        });
    });
    it('should goback to prev page', () => {
        //arrange
        mockNavigationHelperService.goBack = jest.fn().mockImplementation();
        //act
        chooseUserComponent.goBack();
    });
    it('should close the switched user', () => {
        //arrange
        mockNavigationHelperService.navigateToLastUrl = jest.fn().mockImplementation();
        //act
        chooseUserComponent.closeSwitchUser();
    });
    it('should navigate to create the user', () => {
        //act
        chooseUserComponent.navigateToCreateUser();
        //assert
        expect(mockRouter.navigate).toBeCalledWith(['/profile/create-managed-user']);
    });
});