import { Observable, of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, inject } from '@angular/core/testing';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CourseConsumptionService } from './course-consumption.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseProgressService } from '../courseProgress/course-progress.service';

const fakeActivatedRoute = {
  'params': observableOf({ contentId: 'd0_33567325' }),
  'root': {
    children: [{snapshot: {
      queryParams: {}
    }}]
  }
};

describe('CourseConsumptionService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot(), RouterTestingModule],
      providers: [CourseConsumptionService, CourseProgressService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));
});
