import { ResourceService, ToasterService, UtilService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { PopupControlService } from '../../../../service/popup-control.service';
import { Observable, of, Subject } from 'rxjs';
import { TenantService, UserService } from '@sunbird/core';
import { IDeviceProfile } from '../../interfaces';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { UserOnboardingComponent, Stage } from './user-onboarding.component'

describe('user-onboarding component spec', () => {
  let component: UserOnboardingComponent;

  const resourceService: Partial<ResourceService> = {
    messages: {
      emsg: {
        m0005: 'Something went wrong, try again later',
        m0017: 'Fetching districts failed. Try again later'
      }
    }
  };
  const toasterService: Partial<ToasterService> = {
    error: jest.fn(),
    success: jest.fn()
  };
  const popupControlService: Partial<PopupControlService> = {
    changePopupStatus: jest.fn()
  };
  const tenantService: Partial<TenantService> = {
    tenantData$: of({favicon: 'sample-favicon', tenantData:{ 'appLogo': '/appLogo.png', 'favicon': '/favicon.ico', 'logo': '/logo.png', 'titleName': 'SUNBIRD' }}) as any
  };
  const cacheService: Partial<CacheService> = {
    set: jest.fn(),
    get: jest.fn(),
  };
  const userService: Partial<UserService> = {
    loggedIn: true,
    userMigrate: jest.fn(),
    getUserProfile:jest.fn(),
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
    }) as any
  };
  const utilService: Partial<UtilService> = {
    isDesktopApp: true,
    isIos: true
  };
  beforeAll(() => {
    component = new UserOnboardingComponent(
      resourceService as ResourceService,
      toasterService as ToasterService,
      popupControlService as PopupControlService,
      tenantService as TenantService,
      cacheService as CacheService,
      userService as UserService,
      utilService as UtilService
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of component', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
  });
  it('should call ngOnInit with is desktopApp', () => {
    component['isDesktopApp']();
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
  });
  it('should call ngOnInit for igot instance', () => {
    jest.spyOn(cacheService, 'get').mockReturnValue({ slug: 'SUNBIRD' });
    tenantService.slugForIgot = 'SUNBIRD';
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
    expect(component.stage).toEqual('user');
  });
  it('should call userTypeSubmit', () => {
    component.userTypeSubmit();
    expect(component.stage).toBe(Stage.LOCATION_SELECTION);
  });
  it('should call locationSubmit', () => {
    jest.spyOn(popupControlService, 'changePopupStatus');
    jest.spyOn(component.close, 'emit');
    component.locationSubmit();
    expect(popupControlService.changePopupStatus).toHaveBeenCalledWith(true);
    expect(component.close.emit).toHaveBeenCalled();
  });
  it('should unsubscribe subject', () => {
    jest.spyOn(component['unsubscribe$'], 'next');
    jest.spyOn(component['unsubscribe$'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe$'].next).toHaveBeenCalled();
    expect(component['unsubscribe$'].complete).toHaveBeenCalled();
  });
  it('should userTypeSubmit method to be called', () => {
    component.modal={
      deny:jest.fn()
    };
    component.isGuestUser=true
    component.userTypeSubmit();
    jest.spyOn(component.modal,'deny'); 
    expect(component.modal.deny).toBeCalled();
  });
  it('should call getRoleFromDesktopGuestUser with is desktopApp', () => {
    userService.getGuestUser=jest.fn().mockReturnValue(of({userName:'abcd',isguest:'true',role:'public'})as any)as any
    component['isDesktopApp']();
    component['getRoleFromDesktopGuestUser']();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
  });
});