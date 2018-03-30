
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
// Import NG testing module(s)
import { HttpClientModule } from '@angular/common/http';
// Import services
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

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

  it('should be created', inject([EditorService], (service: EditorService) => {
    expect(service).toBeTruthy();
  }));

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
});
