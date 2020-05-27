import {inject, TestBed} from '@angular/core/testing';
import {ConfigService} from '@sunbird/shared';
import {LearnerService} from '@sunbird/core';
import {ManagedUserService} from './managed-user.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of as observableOf, throwError as observableThrowError} from 'rxjs';


describe('ManagedUserService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [LearnerService, ManagedUserService, ConfigService]
  }));

  it('should be created', () => {
    const service: ManagedUserService = TestBed.get(ManagedUserService);
    expect(service).toBeTruthy();
  });

  it('should fetch managed user list', inject([ManagedUserService], (service: ManagedUserService) => {
    const mockData = {success: 'success'};
    const request = {request: {filters: {managedBy: 'mockUserID'}}};
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData));
    service.fetchManagedUserList(request).subscribe((data: any) => {
      expect(data).toBe(mockData);
    });
  }));

  it('should not fetch managed user list', inject([ManagedUserService], (service: ManagedUserService) => {
    const mockError = {'error': 'error'};
    const request = {request: {filters: {managedBy: 'mockUserID'}}};
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableThrowError(mockError));
    service.fetchManagedUserList(request).subscribe((data: any) => {
    }, err => {
      expect(err).toBe(mockError);
    });
  }));


});
