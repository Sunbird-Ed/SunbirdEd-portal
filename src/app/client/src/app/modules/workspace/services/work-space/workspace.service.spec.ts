import { TestBed, inject } from '@angular/core/testing';
// Import NG testing module(s)
import { HttpClientModule } from '@angular/common/http';
// Import services
import { WorkSpaceService } from './workspace.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService } from '@sunbird/core';

describe('WorkSpaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WorkSpaceService, ConfigService, ContentService]
    });
  });

  it('should be created', inject([WorkSpaceService], (service: WorkSpaceService) => {
    expect(service).toBeTruthy();
  }));
});
