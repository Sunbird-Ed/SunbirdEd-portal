import {ResourceService} from '@sunbird/shared';
import {TenantService} from '@sunbird/core';
import { SsoMergeConfirmationComponent } from '..';
import { of } from 'rxjs';

xdescribe('SsoMergeConfirmation component', ()=> {
  let ssoMergeConfirmationComponent: SsoMergeConfirmationComponent;
  const mockResourceService: Partial<ResourceService> = {};
  const ObservableData = {
    err: true,
    tenantData: {
      logo: 'logo',
      titleName: 'title'
    }
  }
  const mockTenantService: Partial<TenantService> = {
    tenantData$: of(ObservableData) as any
  };

  beforeAll(() => {
    ssoMergeConfirmationComponent = new SsoMergeConfirmationComponent(
      mockResourceService as ResourceService,
      mockTenantService as TenantService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should  create an instance of ssoMergeConfirmationComponent", () => {
    expect(ssoMergeConfirmationComponent).toBeTruthy();
  });

  it('should set instance property when instance of component is created', ()=> {
    expect(ssoMergeConfirmationComponent.instance).toBeDefined();
    expect(ssoMergeConfirmationComponent.instance).toEqual('SUNBIRD');
  });

  it("should not set logo and tenantName on ngOnInit call if any of the conditions are false", () => {
    ssoMergeConfirmationComponent.ngOnInit();
    expect(ssoMergeConfirmationComponent.logo).toBeUndefined();
    expect(ssoMergeConfirmationComponent.tenantName).toBeUndefined();
  });

  it("should set logo and tenantName on ngOnInit call if conditions are true", () => {
    ObservableData.err = false;
    ssoMergeConfirmationComponent.ngOnInit();
    expect(ssoMergeConfirmationComponent.tenantDataSubscription).toBeDefined();
    expect(ssoMergeConfirmationComponent.logo).toBeDefined();
    expect(ssoMergeConfirmationComponent.tenantName).toBeDefined();
    expect(ssoMergeConfirmationComponent.logo).toEqual('logo');
    expect(ssoMergeConfirmationComponent.tenantName).toEqual('title');
  });

  it('should create new user', ()=> {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: ''
        }
    });
    ssoMergeConfirmationComponent.identifierType = 'type1';
    ssoMergeConfirmationComponent.identifierValue = 1;
    ssoMergeConfirmationComponent.isTncAccepted = true;
    ssoMergeConfirmationComponent.tncVersionAccepted = 'true';
    ssoMergeConfirmationComponent.userDetails = { id: 1};
    const assignedData = 'v1/sso/create/user?userId=1&identifier=type1&identifierValue=1&freeUser=true&tncAccepted=true&tncVersion=true';
    ssoMergeConfirmationComponent.createNewUser();
    expect(window.location.href).toEqual(assignedData);
  });

  it('should migrate user', ()=> {
    const assignedData = '/v1/sso/migrate/account/initiate?userId=1&identifier=type1&identifierValue=1&freeUser=true&tncAccepted=true&tncVersion=true';
    ssoMergeConfirmationComponent.migrateUser();
    expect(window.location.href).toEqual(assignedData);
  });

  it('should unsubscribe the tenantDataSubscription on ngOnDestroy call', ()=> {
    ssoMergeConfirmationComponent.tenantDataSubscription = {
      unsubscribe: jest.fn()
    } as any;
    ssoMergeConfirmationComponent.ngOnDestroy();
    expect(ssoMergeConfirmationComponent.tenantDataSubscription.unsubscribe).toBeCalled();
  });
})