
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FrameworkService, UserService, CoreModule, PublicDataService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { mockFrameworkData } from './framework.mock.spec.data';
import { Ng2IziToastModule } from 'ng2-izitoast';

describe('FrameworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [FrameworkService, PublicDataService, UserService, CacheService]
    });
  });

  it('should call user service', () => {
    const service = TestBed.get(FrameworkService);
    const userService = TestBed.get(UserService);
    service.isApiCall = true;
    service.hashTagId = '0123456789';
    service.defaultFramework = 'NCF';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(service, 'getFramework').and.callThrough();
    service.getFramework();
    expect(service.getFramework).toHaveBeenCalled();
  });

  it('should fetch framework details', () => {
    const service = TestBed.get(FrameworkService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableOf(mockFrameworkData.frameworkSuccess));
    service.isApiCall = true;
    service.getFrameworkCategories();
    service.frameworkData$.subscribe(frameworkData => {
      expect(service._frameworkData).toBe(mockFrameworkData.frameworkSuccess.result.framework.categories);
    });
  });

  it('should emit error on getFramework api failure', () => {
    const service = TestBed.get(FrameworkService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableThrowError(mockFrameworkData.error));
    service.isApiCall = true;
    service.getFrameworkCategories();
    service.frameworkData$.subscribe(frameworkData => {
      expect(frameworkData.err).toBe(mockFrameworkData.error);
    });
  });
  it('should emit error on getFrameworkCategories api failure', () => {
    const service = TestBed.get(FrameworkService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableThrowError(mockFrameworkData.error));
    service.isApiCall = true;
    service.defaultFramework = 'NCF';
    service.getFrameworkCategories();
    service.frameworkData$.subscribe(frameworkData => {
      expect(frameworkData.err).toBe(mockFrameworkData.error);
    });
  });
});
