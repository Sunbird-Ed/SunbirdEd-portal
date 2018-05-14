import { TestBed, inject } from '@angular/core/testing';

import { CourseConsumptionService } from './course-consumption.service';

describe('CourseConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseConsumptionService]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));
});
