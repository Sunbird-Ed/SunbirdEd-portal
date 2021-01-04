import { TestBed, inject } from '@angular/core/testing';
import { DiscussionService } from './discussion.service';
import { configureTestSuite } from '@sunbird/test-util';
import { ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';





describe('DiscussionService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ ConfigService, CacheService],
  }));

  it('>>>', () => {
    const service = TestBed.get(DiscussionService);
    expect(service).toBeTruthy();
  });
});
