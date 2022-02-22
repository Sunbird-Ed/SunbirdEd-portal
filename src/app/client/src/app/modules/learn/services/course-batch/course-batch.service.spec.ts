import { TestBed, inject, ComponentFixture } from '@angular/core/testing';

import { CourseBatchService } from './course-batch.service';

import { CoreModule } from '@sunbird/core';

import { SharedModule } from '@sunbird/shared';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';

describe('BatchService', () => {
  let component: CourseBatchService;
  let fixture: ComponentFixture<CourseBatchService>;
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [CourseBatchService]
    });
  });

  it('should create CourseBatchService', () => {
    const service: CourseBatchService = TestBed.inject(CourseBatchService);
    expect(service).toBeTruthy();
  });

});
