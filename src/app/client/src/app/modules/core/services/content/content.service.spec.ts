import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { ContentService } from './content.service';

describe('ContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ContentService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([ContentService], (service: ContentService) => {
    expect(service).toBeTruthy();
  }));
});
