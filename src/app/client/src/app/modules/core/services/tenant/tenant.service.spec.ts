
import {of as observableOf,  Observable } from 'rxjs';
import { response } from './tenant.service.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LearnerService } from '../learner/learner.service';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { TenantService } from './tenant.service';
import { } from 'jasmine';
import { UserService } from '../user/user.service';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';

describe('TenantService', () => {
  let userService: UserService;
  const UserServiceStub = {
    userid: '874ed8a5-782e-4f6c-8f36-e0288455711e',
    userProfile: {
      firstName: 'Creator',
      lastName: 'ekstep'
    }
  };
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TenantService, ConfigService,
        LearnerService, ResourceService, ToasterService, CacheService,
        { provide: UserService, useValue: UserServiceStub }]
    });
    userService = TestBed.get(UserService);
  });

  it('should call get tenant config', () => {
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(response.defaultTenant);
    const res = service.get();
    expect(res).toEqual(response.defaultTenant);
  });

  it('Should make get API call and set tenant data', () => {
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(observableOf(response.success));
    service.getTenantInfo('Sunbird');
    service.tenantData$.subscribe(
      data => {
        expect(data.tenantData).toEqual(response.success.result);
      });
  });

  it('Should return default data when get API call is triggered with wrong orgSlug value', () => {
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(observableOf(response.success));
    service.getTenantInfo('test');
    service.tenantData$.subscribe(
      data => {
        expect(data.tenantData).toEqual(response.default);
      });
  });

  it('Should emit error on get api failure', () => {
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(observableOf(response.failure));
    service.getTenantInfo('Sunbird');
    service.tenantData$.subscribe(
      data => {
        expect(data.err).toBeDefined();
        expect(data.tenantData).toBeUndefined();
      });
  });

  it('should make api call to get tenant config invalid case', inject([LearnerService], (
    learnerService: LearnerService) => {
    const service = TestBed.get(TenantService);
    const learnerServiceBed = TestBed.get(LearnerService);
    const params = 'test';
    spyOn(learnerServiceBed, 'get').and.returnValue(observableOf(response.tenantConfigInvalid));
    service.getTenantConfig(params).subscribe((result) => {
      expect(result).toEqual({});
    });
  }));

  it('should make api call to get tenant config valid', inject([LearnerService], (
    learnerService: LearnerService) => {
    const service = TestBed.get(TenantService);
    const learnerServiceBed = TestBed.get(LearnerService);
    const params = 'test';
    spyOn(learnerServiceBed, 'get').and.returnValue(observableOf(response.tenantConfigValid));
    service.getTenantConfig(params).subscribe((result) => {
      expect(result).toBeTruthy();
    });
  }));

  it('should return api call to get tenant config', inject([LearnerService], (
    learnerService: LearnerService) => {
    const service = TestBed.get(TenantService);
    const learnerServiceBed = TestBed.get(LearnerService);
    const params = 'test';
    spyOn(learnerServiceBed, 'get').and.returnValue(observableOf(response.tenantConfigValid));
    service.getSlugDefaultTenantInfo(params).subscribe((result) => {
      expect(result).toBeTruthy();
    });
  }));

  it('should call initialize', inject([LearnerService], (
    learnerService: LearnerService) => {
    const service = TestBed.get(TenantService);
    const learnerServiceBed = TestBed.get(LearnerService);
    const cacheServiceBed = TestBed.get(CacheService);
    const params = 'test';
    spyOn(cacheServiceBed, 'exists').and.returnValue(true);
    spyOn(cacheServiceBed, 'get').and.returnValue(response.tenantConfigValid);
    spyOn(learnerServiceBed, 'get').and.returnValue(observableOf(response.tenantConfigValid));
    service.initialize();
    service._tenantSettings$.subscribe(
      data => {
       expect(data).toBeDefined();
      }
    );
  }));

});
