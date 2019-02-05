import { TestBed, inject } from '@angular/core/testing';
import { CopyContentService } from './copy-content.service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule, UserService, ContentService, PublicDataService } from '@sunbird/core';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as testData from './copy-content.service.spec.data';
import { FrameworkService } from './../framework/framework.service';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { CacheService } from 'ng2-cache-service';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('CopyContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [CopyContentService, FrameworkService, UserService, ContentService, { provide: Router, useClass: RouterStub }]
    });
  });

  it('should make copy api call and get success response', inject([CopyContentService, ContentService],
    (service: CopyContentService, contentService: ContentService) => {
      const userService = TestBed.get(UserService);
      userService._userProfile = testData.mockRes.userData;
      spyOn(contentService, 'post').and.callFake(() => observableOf(testData.mockRes.successResponse));
      service.copyContent(testData.mockRes.contentData).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        }
      );
    }));

  it ('copy content should take framework value as channels default framework',
    inject([CopyContentService, ContentService, PublicDataService, FrameworkService, CacheService],
    (dataservice: PublicDataService) => {
      const frameworkservice = TestBed.get(FrameworkService);
      const cacheService = TestBed.get(CacheService);
      const userService = TestBed.get(UserService);
      const copyContentService = TestBed.get(CopyContentService);
      const contentService = TestBed.get(ContentService);
      const router = TestBed.get(Router);
      frameworkservice._frameWorkData$ = testData.mockRes.frameworkData;
      frameworkservice._frameworkData$.next({
        err: null, framework: 'NCF',
        frameworkdata: testData.mockRes.frameworkData
      });
      userService._userProfile = testData.mockRes.userData;
      spyOn(contentService, 'post').and.callFake(() => observableOf(testData.mockRes.successResponse));
      copyContentService.copyContent(testData.mockRes.contentData).subscribe(
        apiResponse => {
        }
      );
      expect(router.navigate).toHaveBeenCalledWith(
          ['/workspace/content/edit/content/do_1125006439303577601155/draft/NCF/Draft']);
    }));

  it('copy course should take framework value same as the course framework which is used to copy',
    inject([CopyContentService, ContentService, PublicDataService, FrameworkService, CacheService],
    (dataservice: PublicDataService) => {
      const frameworkservice = TestBed.get(FrameworkService);
      const cacheService = TestBed.get(CacheService);
      const userService = TestBed.get(UserService);
      const copyContentService = TestBed.get(CopyContentService);
      const contentService = TestBed.get(ContentService);
      const router = TestBed.get(Router);
      frameworkservice._frameWorkData$ = testData.mockRes.frameworkData;
      frameworkservice._frameworkData$.next({
        err: null, framework: 'NCF',
        frameworkdata: testData.mockRes.frameworkData
      });
      userService._userProfile = testData.mockRes.userData;
      spyOn(contentService, 'post').and.callFake(() => observableOf(testData.mockRes.successResponse));
      copyContentService.copyContent(testData.mockRes.courseData)
      .subscribe(
        apiResponse => {
        }
      );
      expect(router.navigate).toHaveBeenCalledWith(['/workspace/content/edit/content/do_1125006439303577601155/draft/NCFCOPY/Draft']);
    }));
});
