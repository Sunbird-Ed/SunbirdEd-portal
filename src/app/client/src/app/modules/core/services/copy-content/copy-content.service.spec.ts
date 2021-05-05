
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { CopyContentService } from './copy-content.service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule, UserService, ContentService } from '@sunbird/core';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as testData from './copy-content.service.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('CopyContentService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [CopyContentService, UserService, ContentService, { provide: Router, useClass: RouterStub }]
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

  it('should copy textbook as a course', inject([], () => {
    const service = TestBed.get(CopyContentService);
    const userService = TestBed.get(UserService);
    const contentService = TestBed.get(ContentService);
    const contentData = testData.mockRes.copyCourseContentData;
    userService._userProfile = testData.mockRes.userData;
    const userData = userService._userProfile;
    const params = {
      request: {
        course: {
          name: 'Copy of ' + contentData.name,
          description: contentData.description,
          organisation: userService.orgNames,
          createdFor: userData.organisationIds,
          createdBy: userData.userId,
          framework: contentData.framework,
          code: contentData.identifier,
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course'
        },
        hierarchy: contentData.children
      }
    };
    const option = {
      data: params,
      url: 'course/v1/create'
    };
    spyOn(service, 'openCollectionEditor').and.stub();
    spyOn(contentService, 'post').and.callFake(() => observableOf(testData.mockRes.copyContentSuccess));
    service.copyAsCourse(contentData).subscribe( (response) => {
      expect(service['openCollectionEditor']).toHaveBeenCalledWith('NCFCOPY', 'do_11302157861002444811');
    });
  }));

  it('should open collection editor when a textbook is copied as a course', inject([], () => {
    const service = TestBed.get(CopyContentService);
    const router = TestBed.get(Router);
    const url = `/workspace/content/edit/collection/do_11302157861002444811/Course/draft/NCFCOPY/Draft`;
    service.openCollectionEditor('NCFCOPY', 'do_11302157861002444811');
    expect(router.navigate).toHaveBeenCalledWith([url]);
  }));

  it('should call the formatData', inject([], () => {
    const service = TestBed.get(CopyContentService);
    const router = TestBed.get(Router);
    spyOn(service, 'formatData');
    service.formatData();
    expect(service.formatData).toHaveBeenCalled();
  }));

  it('should call the redirectToEditor', inject([], () => {
    const service = TestBed.get(CopyContentService);
    const router = TestBed.get(Router);
    spyOn(service, 'redirectToEditor');
    service.redirectToEditor();
    expect(service.redirectToEditor).toHaveBeenCalled();
  }));
});
