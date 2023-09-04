import { TestBed } from '@angular/core/testing';

import { CoursePageContentService } from './course-page-content.service'

describe('CoursePageContentService', () => {
  let service: CoursePageContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursePageContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
