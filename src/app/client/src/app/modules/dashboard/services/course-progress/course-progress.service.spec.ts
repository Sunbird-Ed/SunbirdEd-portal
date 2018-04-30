import { TestBed, inject } from '@angular/core/testing';

import { CourseProgressService } from './course-progress.service';

describe('CourseProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseProgressService]
    });
  });

  it('should be created', inject([CourseProgressService], (service: CourseProgressService) => {
    expect(service).toBeTruthy();
  }));
});
