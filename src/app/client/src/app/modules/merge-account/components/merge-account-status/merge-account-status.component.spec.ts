import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '@sunbird/shared';
import {TenantService} from '@sunbird/core';
import { MergeAccountStatusComponent } from './merge-account-status.component';
import { of } from 'rxjs';

xdescribe('MergeAccountStatus component', ()=> {
  let mergeAccountStatusComponent: MergeAccountStatusComponent;
  const mockActivatedRoute:Partial<ActivatedRoute>={
    queryParams: of({
      status:'success',
      merge_type:'test',
      redirect_uri:null,
      error_type:'404 error'
    }) as any
  };
  const mockResourceService:Partial<ResourceService>={};
  const mockTenantService:Partial<TenantService>={
    tenantData$: of({
      err:false,
      tenantData:{
        logo:'logo',
        titleName:'merge'
      }
    }) as any
  };

  beforeAll(() => {
    mergeAccountStatusComponent = new MergeAccountStatusComponent(
      mockActivatedRoute as ActivatedRoute,
      mockResourceService as ResourceService,
      mockTenantService as TenantService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should  create an instance of mergeAccountStatusComponent", () => {
    expect(mergeAccountStatusComponent).toBeTruthy();
  });

  describe('ngOnInit', ()=> {
    it('should set isMergeSuccess,mergeType,redirectUri and error_type properties', ()=> {
      mergeAccountStatusComponent.ngOnInit();
      expect(mergeAccountStatusComponent.isMergeSuccess).toBeDefined();
      expect(mergeAccountStatusComponent.mergeType).toBeDefined();
      expect(mergeAccountStatusComponent.redirectUri).toBeDefined();
      expect(mergeAccountStatusComponent.error_type).toBeDefined();
      expect(mergeAccountStatusComponent.isMergeSuccess).toEqual(true);
      expect(mergeAccountStatusComponent.mergeType).toEqual('test');
      expect(mergeAccountStatusComponent.redirectUri).toEqual('/resources');
      expect(mergeAccountStatusComponent.error_type).toEqual('404 error');
    });

    it('should set logo and tenantName properties', ()=> {
      mergeAccountStatusComponent.ngOnInit();
      expect(mergeAccountStatusComponent.logo).toBeDefined();
      expect(mergeAccountStatusComponent.tenantName).toBeDefined();
      expect(mergeAccountStatusComponent.logo).toEqual('logo');
      expect(mergeAccountStatusComponent.tenantName).toEqual('merge');
    });

    it('should set redirectUri with redirect_uri of queryParams if available', ()=> {
      mockActivatedRoute.queryParams= of({
        status:'success',
        merge_type:'test',
        redirect_uri:'/user',
        error_type:'404 error'
      }) as any;
      mergeAccountStatusComponent.ngOnInit();
      expect(mergeAccountStatusComponent.redirectUri).toEqual('/user');
    });
  })

  it('should handle closeModal method', ()=>{
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: ''
        }
    });
    mergeAccountStatusComponent.redirectUri='/resources';
    mergeAccountStatusComponent.modal={
      deny:jest.fn()
    };
    jest.spyOn(mergeAccountStatusComponent.modal,'deny');
    mergeAccountStatusComponent.closeModal();
    expect(window.location.href).toEqual('/resources');
    expect(mergeAccountStatusComponent.modal.deny).toBeCalled();
  });

  it('should destroy subscription on ngOnDestroy call', ()=> {
    mergeAccountStatusComponent.tenantDataSubscription={
      unsubscribe:jest.fn()
    } as any;
    jest.spyOn(mergeAccountStatusComponent.tenantDataSubscription,'unsubscribe');
    mergeAccountStatusComponent.ngOnDestroy();
    expect(mergeAccountStatusComponent.tenantDataSubscription.unsubscribe).toBeCalled();
  });
})