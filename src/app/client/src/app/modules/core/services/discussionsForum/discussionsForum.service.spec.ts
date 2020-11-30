import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { DiscussionsForumService } from './discussionsForum.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('DiscussionsForumService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DiscussionsForumService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([DiscussionsForumService], (service: DiscussionsForumService) => {
    expect(service).toBeTruthy();
  }));
});
