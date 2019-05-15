import { Observable, of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, inject } from '@angular/core/testing';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CourseConsumptionService } from './course-consumption.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import { PlayerService } from '@sunbird/core';

const fakeActivatedRoute = {
  'params': observableOf({ contentId: 'd0_33567325' }),
  'root': {
    children: [{snapshot: {
      queryParams: {}
    }}]
  }
};

const courseHierarchyGetMockResponse = {
  'id': 'ekstep.learning.content.hierarchy',
  'ver': '2.0',
  'ts': '2018-05-07T07:20:27ZZ',
  'params': {
      'resmsgid': '0ea98baa-5a9e-49fd-a568-7967bc1e0ab8',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
  },
  'result': {
    'content': {
      'identifier': 'do_212347136096788480178'
    }
  }
};

describe('CourseConsumptionService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      providers: [CourseConsumptionService, CourseProgressService, PlayerService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    });
  });
  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));

  it('should not call api to get course herierachy if data exists', () => {
    const service = TestBed.get(CourseConsumptionService);
    const playerService = TestBed.get(PlayerService);
    service.courseHierarchy = courseHierarchyGetMockResponse.result.content;
    spyOn(service, 'getCourseHierarchy').and.callThrough();
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue(observableOf(courseHierarchyGetMockResponse));
    service.getCourseHierarchy('do_212347136096788480178');
    expect(playerService.getCollectionHierarchy).not.toHaveBeenCalled();
  });

  it('should call api to get course herierachy if data not exists', () => {
    const service = TestBed.get(CourseConsumptionService);
    const playerService = TestBed.get(PlayerService);
    spyOn(service, 'getCourseHierarchy').and.callThrough();
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue(observableOf(courseHierarchyGetMockResponse));
    service.getCourseHierarchy('do_212347136096788480178');
    expect(playerService.getCollectionHierarchy).toHaveBeenCalled();
  });

});
