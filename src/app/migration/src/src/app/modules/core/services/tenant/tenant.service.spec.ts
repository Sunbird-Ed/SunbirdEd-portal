import { response } from './tenant.service.spec.data';
import { DataService } from '../data/data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LearnerService } from '../learner/learner.service';
import { ConfigService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TenantService } from './tenant.service';
import {} from 'jasmine';
import { UserService } from '../user/user.service';

describe('TenantService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TenantService, UserService, ConfigService, LearnerService, DataService]
    });
  });

  it('Should make get API call and return Organization details', () => {
    const service = TestBed.get(TenantService);
    const dataService = TestBed.get(DataService);
    spyOn(dataService, 'get').and.callFake(() => Observable.of(response.success));
    service.orgDetails = {};
    service.getOrgDetails();
    expect(service.orgDetails).toBeDefined();
  });
});
