
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EditorService } from './editor.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService } from '@sunbird/core';
import { mockRes } from './editor.service.spec.data';

describe('EditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [EditorService, ConfigService, ContentService]
    });
  });

  it('should call Content service post function', inject([EditorService, ContentService, ConfigService], (service: EditorService,
    configService, contentService) => {
    const option = {
      url: '/content/content/v1/create',
      data: {
          'request': mockRes.createCollectionData
      }
    };
     const response = service.create(mockRes.createCollectionData);
    expect(response).toBeTruthy();
    expect(response).toBeDefined();

  }));

  it('should call Content service get function', inject([EditorService, ContentService, ConfigService], (service: EditorService,
    configService, contentService) => {
    const option = {
      url: '/content/content/v1/read/do_2124788044789760001782?fields=createdBy,status,mimeType&mode=edit'
    };
     const response = service.getById(mockRes.req, mockRes.qs);
    expect(response).toBeTruthy();
    expect(response).toBeDefined();

  }));
});
