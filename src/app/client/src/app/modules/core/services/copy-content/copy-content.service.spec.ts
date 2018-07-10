
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { CopyContentService } from './copy-content.service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule, UserService, ContentService } from '@sunbird/core';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as testData from './copy-content.service.spec.data';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('CopyContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
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
});
