import { TestBed, inject } from '@angular/core/testing';
import { CopyContentService } from './copy-content.service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule, UserService, ContentService } from '@sunbird/core';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import * as testData from './copy-content.service.spec.data';
import { ILogEventInput } from '@sunbird/telemetry';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('CopyContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [CopyContentService, UserService, ContentService, { provide: Router, useClass: RouterStub }]
    });
  });

  it('should make copy api call and get success response', inject([CopyContentService, ContentService],
    (service: CopyContentService, contentService: ContentService) => {
      const userService = TestBed.get(UserService);
      userService._userProfile = testData.mockRes.userData;
      spyOn(contentService, 'post').and.callFake(() => Observable.of(testData.mockRes.successResponse));
      const logEvent: ILogEventInput = {
        context: { env: 'search' },
        edata: { type: 'api_call', level: 'INFO', message: '' }
      };
      service.copyContent(testData.mockRes.contentData, logEvent).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        }
      );
    }));
});
