import {TestBed} from '@angular/core/testing';
import {ConfigService} from '@sunbird/shared';
import {LearnerService} from '@sunbird/core';
import {ManagedUserService} from './managed-user.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('ManagedUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [LearnerService, ManagedUserService, ConfigService]
  }));

  it('should be created', () => {
    const service: ManagedUserService = TestBed.get(ManagedUserService);
    expect(service).toBeTruthy();
  });
});
