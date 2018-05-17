import { TestBed, inject } from '@angular/core/testing';

import { CourseBatchService } from './course-batch.service';

describe('BatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseBatchService]
    });
  });

  it('should be created', inject([CourseBatchService], (service: CourseBatchService) => {
    expect(service).toBeTruthy();
  }));
});
