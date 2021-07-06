import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CacheService } from 'ng2-cache-service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '../../core.module';
import { FrameworkService } from '../framework/framework.service';
import { cmdList, validCmdList } from './segmentation-tag.service.spec.data';

import { SegmentationTagService } from './segmentation-tag.service';

describe('SegmentationTagService', () => {
  let frameworkService: FrameworkService;
  let service: SegmentationTagService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [CacheService]
    });
    frameworkService = TestBed.inject(FrameworkService);
    service = TestBed.inject(SegmentationTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
