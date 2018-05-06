import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { LearnerService } from '@sunbird/core';
import { TestBed, inject } from '@angular/core/testing';
import { CourseProgressService } from './course-progress.service';

describe('CourseProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseProgressService, LearnerService, ConfigService]
    });
  });

  it('should be created', inject([CourseProgressService], (service: CourseProgressService) => {
    expect(service).toBeTruthy();
  }));
});
