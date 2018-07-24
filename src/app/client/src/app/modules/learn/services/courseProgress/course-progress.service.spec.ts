
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse,
  CourseStates, CourseProgressData, CourseProgress, ContentList, IUserData, IUserProfile,
  SharedModule
} from '@sunbird/shared';
import { ContentService, CoreModule } from '@sunbird/core';
import { CourseProgressService } from './course-progress.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {Response} from './course-progress.service.spec.data';

describe('CourseProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [CourseProgressService]
    });
  });

  it('should be created', inject([CourseProgressService], (service: CourseProgressService) => {
    expect(service).toBeTruthy();
  }));

  it('should update content state in server ', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(observableOf(Response.updateData));
    const req1 = {  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'courseId': 'do_1124785353783377921154',
    'contentId': 'do_112474267785674752118',
    'batchId': '01247853957897420815',
    'status' : 2
      };
    const reqData = {
      'userId': '0f451be5-2c83-4688-9089-fc329ce3bc18',
    'contents': [req1]
    };
    service.updateContentStateToServer(req1);
    service.updateContentStateToServer(reqData).subscribe(
      apiResponse => {
         expect(apiResponse.params.status).toBe('success');
      }
    );
  });

  it('should not update content state in server ', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(observableOf(Response.UpdateDataError));
    const reqData = {
      'userId': '0f451be5-2c83-4688-9089-fc329ce3bc',
    'contents': [
            {
            'status': 2,
            'lastAccessTime': '2017-05-15 10:58:07:509+0530',
             'courseId': 'do_212282810437918720179',
             'result': 'pass',
             'score': '10',
             'grade': 'B'
            }
     ]
    };
    const req1 = {  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'courseId': 'do_1124785353783377921154',
    'contentId': 'do_112474267785674752118',
    'batchId': '01247853957897420815',
    'status' : 2
      };
    service.updateContentStateToServer(req1);
    service.updateContentStateToServer(reqData).subscribe(
      apiResponse => {
         expect(apiResponse.params.status).not.toBe('success');
      }
    );
  });
});
