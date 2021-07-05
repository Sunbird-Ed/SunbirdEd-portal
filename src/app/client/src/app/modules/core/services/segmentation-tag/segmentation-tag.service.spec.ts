import { TestBed } from '@angular/core/testing';

import { SegmentationTagService } from './segmentation-tag.service';

describe('SegmentationTagService', () => {
  let service: SegmentationTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SegmentationTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
