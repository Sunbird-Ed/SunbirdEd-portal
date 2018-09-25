import { TestBed, inject } from '@angular/core/testing';
import { CourseBatchService } from './course-batch.service';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('CourseBatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [CourseBatchService]
    });
  });

  xit('should be created', inject([CourseBatchService], (service: CourseBatchService) => {
    expect(service).toBeTruthy();
  }));
});
