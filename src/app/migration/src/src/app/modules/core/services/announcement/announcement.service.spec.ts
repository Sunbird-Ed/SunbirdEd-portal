import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';

import { AnnouncementService } from './announcement.service';

describe('AnnouncementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AnnouncementService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([AnnouncementService], (service: AnnouncementService) => {
    expect(service).toBeTruthy();
  }));
});
