import { TestBed, inject } from '@angular/core/testing';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CourseConsumptionService } from './course-consumption.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CourseConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [CourseConsumptionService]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));
});
