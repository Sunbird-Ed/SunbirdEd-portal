import { TestBed, inject } from '@angular/core/testing';
import { CourseBatchService } from './course-batch.service';
import { ContentService, PlayerService, UserService, LearnerService, CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  of as observableOf,
  throwError as observableThrowError, Observable
} from 'rxjs';
import { Response } from './course-batch.spec.data';
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const fakeActivatedRoute = {
  'params': observableOf({ 'courseId': 'do_1125083286221291521153', 'batchId': '01248661735846707228' }),
  'parent': { 'params': observableOf({ 'courseId': 'do_1125083286221291521153' }) },
  'snapshot': {
    params: [
      {
        courseId: 'do_1125083286221291521153',
        batchId: '01248661735846707228'
      }
    ],
    data: {
      telemetry: { env: 'course', pageid: 'batch-edit', type: 'view', object: { ver: '1.0', type: 'batch' } },
      roles: 'coursebacthesRole'
    }
  }
};
describe('CourseBatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [CourseBatchService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    });
  });

  it('should be created', inject([CourseBatchService], (service: CourseBatchService) => {
    const courseId = 'do_1125083286221291521153';
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getCollectionHierarchy').and.callFake(() => observableOf(Response.collectionData));
    service.getCourseHierarchy(courseId).subscribe(response => {
      expect(service).toBeTruthy();
      expect(service.courseHierarchy).toBeDefined();
    });
  }));
  it('should be create batch', inject([CourseBatchService], (service: CourseBatchService) => {
    const requestBody = {
      courseId: 'do_112470675618004992181',
      name: 'Test 2 batch',
      description: 'test',
      enrollmentType: 'invite-only',
      startDate: '2018-04-20T18:29:59.999Z',
      endDate: '2018-07-13T18:29:59.999Z',
      createdBy: '159e93d1-da0c-4231-be94-e75b0c226d7c',
      createdFor: [
        '0123673542904299520',
        '0123673689120112640',
        'ORG_001'
      ],
      mentors: [
        'b2479136-8608-41c0-b3b1-283f38c338ed',
        '97255811-5486-4f01-bad1-36138d0f5b8a'
      ]
    };
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'post').and.callFake(() => observableOf(Response.createBatch));
    service.createBatch(requestBody).subscribe(response => {
      expect(response.responseCode).toEqual('OK');
      expect(response.params.status).toEqual('success');
      expect(response.params.err).toEqual(null);
    });
  }));
  it('should be get batch details', inject([CourseBatchService], (service: CourseBatchService) => {
    const batchId = '01259879952143155267';
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'post').and.callFake(() => observableOf(Response.getBatchDetails));
    service.getBatchDetails(batchId).subscribe(response => {
      expect(response.responseCode).toEqual('OK');
      expect(response.params.status).toEqual('success');
      expect(response.params.err).toEqual(null);
    });
  }));
  it('should be update batch details', inject([CourseBatchService], (service: CourseBatchService) => {
    const requestBody = {
      'id': '01259879952143155267',
      'name': 'new tests',
      'description': '',
      'enrollmentType': 'invite-only',
      'startDate': '2018-09-26',
      'endDate': '2018-10-17',
      'createdFor': [
        '01232002070124134414',
        '012315809814749184151'
      ],
      'mentors': []
    };
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'post').and.callFake(() => observableOf(Response.update));
    service.updateBatch(requestBody).subscribe(response => {
      expect(response.responseCode).toEqual('OK');
      expect(response.params.status).toEqual('success');
      expect(response.params.err).toEqual(null);
    });
  }));

});
