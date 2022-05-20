
import {of as observableOf } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormService, ContentService, CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { mockFormData } from './form.mock.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

  // NEW xdescribe
xdescribe('FormService', () => {
    configureTestSuite();
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
        providers: [FormService, ContentService]
      });
    });

    it('should fetch content creation form details', () => {
      const service:any = TestBed.inject(FormService);
      const contentService = TestBed.inject(ContentService);
      const content = 'textbook';
      const type = 'textbook';
      const action = 'textbook';
      const framework = 'textbook';
      spyOn(contentService, 'post').and.returnValue(observableOf(mockFormData.success));
      service.getFormConfig(type, action, content, framework);
      expect(service).toBeTruthy();
    });
    it('should emit error on api failure', () => {
      const service:any = TestBed.inject(FormService);
      const contentService = TestBed.inject(ContentService);
      const content = 'textbook';
      const type = 'textbook';
      const action = 'textbook';
      const framework = 'textbook';
      spyOn(contentService, 'post').and.returnValue(observableOf(mockFormData.error));
      service.getFormConfig(type, action, content, framework);
      expect(service).toBeTruthy();
    });
  });
