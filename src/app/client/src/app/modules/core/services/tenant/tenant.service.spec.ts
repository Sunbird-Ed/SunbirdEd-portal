
import {of as observableOf,  Observable } from 'rxjs';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { response } from './tenant.service.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LearnerService } from '../learner/learner.service';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { TenantService } from './tenant.service';
import { } from 'jasmine';
import { UserService } from '../user/user.service';

describe('TenantService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TenantService, UserService, ConfigService,
        LearnerService, ResourceService, ToasterService, Ng2IzitoastService]
    });
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
});
