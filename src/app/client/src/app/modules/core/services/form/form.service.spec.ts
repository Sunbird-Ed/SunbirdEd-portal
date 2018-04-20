import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormService, ContentService, UserService, LearnerService } from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { Observable } from 'rxjs/Observable';
import { mockFormData } from './form.mock.spec.data';

  describe('FormService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [FormService, ContentService, ConfigService, ResourceService, UserService, LearnerService,
          CacheService]
      });
    });

    it('should fetch content creation form details', () => {
      const service = TestBed.get(FormService);
      const contentService = TestBed.get(ContentService);
      const cacheService = TestBed.get(CacheService);
      const content = 'textbook';
      const type = 'textbook';
      const action = 'textbook';
      const framework = 'textbook';
      spyOn(contentService, 'post').and.returnValue(Observable.of(mockFormData.success));
      spyOn(cacheService, 'set').and.returnValue(Observable.of(mockFormData.success.result.form.data.fields));
      service.getFormConfig(type, action, content, framework);
      expect(service).toBeTruthy();
    });
    it('should emit error on api failure', () => {
      const service = TestBed.get(FormService);
      const contentService = TestBed.get(ContentService);
      const cacheService = TestBed.get(CacheService);
      const content = 'textbook';
      const type = 'textbook';
      const action = 'textbook';
      const framework = 'textbook';
      spyOn(contentService, 'post').and.returnValue(Observable.of(mockFormData.error));
      service.getFormConfig(type, action, content, framework);
      expect(service).toBeTruthy();
    });
  });
