import { Ng2IzitoastService } from 'ng2-izitoast';
import { response } from './tenant.service.spec.data';
import { DataService } from '../data/data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LearnerService } from '../learner/learner.service';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TenantService } from './tenant.service';
import {} from 'jasmine';
import { UserService } from '../user/user.service';

describe('TenantService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TenantService, UserService, ConfigService,
         LearnerService, DataService, ResourceService, ToasterService, Ng2IzitoastService]
    });
  });

  it('Should make get API call and set tenant data', () => {
    const service = TestBed.get(TenantService);
    const dataService = TestBed.get(DataService);
    spyOn(dataService, 'get').and.callFake(() => Observable.of(response.success));
    service.tenantData = {};
    service.getOrgDetails('Sunbird');
    expect(service.tenantData).toBeDefined();
  });

  it('Should return tenant data when getTenantData method is called', () => {
    const service = TestBed.get(TenantService);
    const dataService = TestBed.get(DataService);
    spyOn(dataService, 'get').and.callFake(() => Observable.of(response.success));
    service.tenantData = {};
    service.getOrgDetails('Sunbird');
    expect(service.getTenantData).toBeDefined();
  });
});
