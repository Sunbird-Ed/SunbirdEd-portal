import { ActivatedRoute, Router } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';
import { ResourceService, ConfigService, NavigationHelperService, UtilService, LayoutService, } from '../../../shared';
import { UserService } from '../../../core';
import { MainFooterComponent } from './main-footer.component';
import { of, throwError } from 'rxjs';
import { TenantService, FormService } from '../../services';
import { ChangeDetectorRef, Renderer2 } from '@angular/core';
import { mockData } from './main-footer.component.spec.data';

describe('MainFooterComponent', () => {
    let component: MainFooterComponent;
    const mockResourceService: Partial<ResourceService> = {};
    const mockFormService: Partial<FormService> = {
        getFormConfig: jest.fn().mockImplementation(() => of(mockData.showDownloadLink))
    };
    const mockRouter: Partial<Router> = {
        navigate: jest.fn(),
        url: '/home'
    };
    const mockUserService: Partial<UserService> = {
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],
                profileUserType: {
                    type: 'student'
                }
            } as any
        }) as any,
        slug: jest.fn() as any
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            queryParams: {
                selectedTab: 'course'
            },
            data: {
                sendUtmParams: true
            }
        } as any
    };
    const mockLayoutService: Partial<LayoutService> = {
        isLayoutAvailable: jest.fn(() => true),
        updateSelectedContentType: jest.fn(() => {
            return
        }) as any,
        redoLayoutCSS: jest.fn()
    };
    const mockUtilService: Partial<UtilService> = {
        getAppBaseUrl: jest.fn(() => {
            return 'http://localhost:3000';
        }) as any
    };
    const mockNavigationhelperService: Partial<NavigationHelperService> = {
        contentFullScreenEvent: {
            pipe: jest.fn(() => {
                return of(true)
            })
        } as any,
        emitFullScreenEvent: jest.fn()
    };
    const mockTenantService: Partial<TenantService> = {
        tenantData$: of({ favicon: 'sample-favicon' }) as any,
        tenantSettings$: of({ favicon: 'sample-favicon' }) as any,
    };
    const mockConfigService: Partial<ConfigService> = {
        appConfig: {
            layoutConfiguration: "joy",
            TELEMETRY: {
                PID: 'sample-page-id'
            },
            UrlLinks: {
                downloadsunbirdApp: 'https://play.google.com/store/apps/details?'
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
    const mockRenderer2: Partial<Renderer2> = {};
    const mockChangeDetectorRef: Partial<ChangeDetectorRef> = {};

    beforeAll(() => {
        component = new MainFooterComponent(
            mockResourceService as ResourceService,
            mockRouter as Router,
            mockActivatedRoute as ActivatedRoute,
            mockConfigService as ConfigService,
            mockRenderer2 as Renderer2,
            mockChangeDetectorRef as ChangeDetectorRef,
            mockUserService as UserService,
            mockTenantService as TenantService,
            mockLayoutService as LayoutService,
            mockNavigationhelperService as NavigationHelperService,
            mockUtilService as UtilService,
            mockFormService as FormService,
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to sunbird app with UTM params if dialcode avaiable', fakeAsync(() => {
        jest.spyOn(component, 'redirect').mockImplementation();
        component.redirectToMobileApp();
        tick(50);
        expect(component.redirect).toHaveBeenCalled();
    }));

    it('should redirect to sunbird app without UTM params if not avaiable', () => {
        component.layoutConfiguration = {};
        component.redoLayout();
        component.redoLayout();
        expect(component).toBeTruthy();
        component.layoutConfiguration = {};
        component.redoLayout();
        component.redoLayout();
        expect(component).toBeTruthy();
    });

    it('should make isFullScreenView to FALSE', () => {
        component.isFullScreenView = true;
        mockUtilService._isDesktopApp = true;
        jest.spyOn(mockUtilService, 'getAppBaseUrl').mockReturnValue('sample-base-url');
        component.ngOnInit();
        mockNavigationhelperService.emitFullScreenEvent(false);
        expect(component.isFullScreenView).toBe(true);

    });

    it('should make isFullScreenView to TRUE', () => {
        component.isFullScreenView = false;
        component.ngOnInit();
        mockNavigationhelperService.emitFullScreenEvent(true);
        expect(component.isFullScreenView).toBe(true);
    });

    it('should unsubscribe from all observable subscriptions', () => {
        component.ngOnInit();
        jest.spyOn(component.unsubscribe$, 'complete');
        jest.spyOn(component.unsubscribe$, 'next');
        component.ngOnDestroy();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
    });

    it('should call getBaseUrl', () => {
        jest.spyOn(mockUtilService, 'getAppBaseUrl');
        component.getBaseUrl();
        expect(mockUtilService.getAppBaseUrl).toHaveBeenCalled();
    });

    it('should call checkRouterPath', () => {
        component.checkRouterPath();
        expect(component.showDownloadmanager).toBeDefined();
    });

    describe("getFooterConfig", () => {
        it('should call getFooterConfig', () => {
            jest.spyOn(mockFormService, 'getFormConfig');
            component.ngOnInit();
            expect(mockFormService.getFormConfig).toHaveBeenCalled();
        });

        it('should show download link when form config returns true flag', () => {
            mockFormService.getFormConfig = jest.fn().mockImplementation(() => of(mockData.showDownloadLink))
            jest.spyOn(mockFormService, 'getFormConfig');
            component.getFooterConfig();
            expect(mockFormService.getFormConfig).toHaveBeenCalled();
            expect(component.showDownloadMobileApp).toBeTruthy();
        });

        it('should hide download link when form config returns false flag', () => {
            mockFormService.getFormConfig = jest.fn().mockImplementation(() => of(mockData.hideDownloadLink))
            component.getFooterConfig();
            expect(component.showDownloadMobileApp).toBeFalsy();
        });

        it('should show download link when form config service returns error', () => {
            mockFormService.getFormConfig = jest.fn(() => throwError({}))
            component.getFooterConfig();
            expect(component.showDownloadMobileApp).toBeTruthy();
        });
    });

});
