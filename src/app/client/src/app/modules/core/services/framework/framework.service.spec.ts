import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FrameworkService, ContentService, UserService, LearnerService } from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { Observable } from 'rxjs/Observable';
import { mockFrameworkData } from './framework.mock.spec.data';

describe('FrameworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FrameworkService, ContentService, ConfigService, ResourceService, UserService, LearnerService,
        CacheService]
    });
  });

  it('should fetch framework details', () => {
    const service = TestBed.get(FrameworkService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'get').and.returnValue(Observable.of(mockFrameworkData.success));
    service.isApiCall = true;
    service.initialize();
    service.frameworkData$.subscribe(frameworkData => {
      expect(frameworkData).toBeDefined();
    });
  });
  it('should not call framework api', () => {
    const service = TestBed.get(FrameworkService);
    const contentService = TestBed.get(ContentService);
    spyOn(service, 'getFramework');
    service.isApiCall = false;
    service.initialize();
    expect(service.getFramework).not.toHaveBeenCalled();
  });
  it('should emit error on getFramework api failure', () => {
    const service = TestBed.get(FrameworkService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'get').and.returnValue(Observable.throw(mockFrameworkData.error));
    service.isApiCall = true;
    service.initialize();
    service.frameworkData$.subscribe(frameworkData => {
      expect(frameworkData.err).toBeDefined();
    });
  });
  it('should emit error on getFrameworkCategories api failure', () => {
    const service = TestBed.get(FrameworkService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'get').and.returnValue(Observable.throw(mockFrameworkData.error));
    service.isApiCall = true;
    service.getFrameworkCategories('NCF');
    service.frameworkData$.subscribe(frameworkData => {
      expect(frameworkData.err).toBeDefined();
    });
  });
});
