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
import { Observable } from 'rxjs/Observable';

describe('CourseProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [CourseProgressService]
    });
  });

  it('should be created', inject([CourseProgressService], (service: CourseProgressService) => {
    expect(service).toBeTruthy();
  }));

  it('should get CourseState FromAPI', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => Observable.of(Response.successData));
    service.getCourseStateFromAPI();
    const reqData = {  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'courseId': ['do_1124785353783377921154'],
    'contentIds': ['do_112474267785674752118', 'do_112473631695626240110', 'do_11246946881515520012', 'do_11246946840689868811']
      };
    service.getCourseStateFromAPI(reqData).subscribe(
      apiResponse => {
         expect(apiResponse.params.status).toBe('success');
      }
    );
  });
  it('should not get CourseState FromAPI', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => Observable.of(Response.errorData));
    service.getCourseStateFromAPI();
    const reqData = {  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'courseId': ['do_11247853537833779211'],
    'contentIds': ['do_112474267785674752118', 'do_112473631695626240110', 'do_11246946881515520012', 'do_11246946840689868811']
      };
    service.getCourseStateFromAPI(reqData).subscribe(
      apiResponse => {
         expect(apiResponse.params.status).not.toBe('success');
      }
    );
  });

  it('should update CourseState InServer ', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(Observable.of(Response.updateData));
    const reqData = {
      'userId': '0f451be5-2c83-4688-9089-fc329ce3bc18',
    'contents': [
            {
            'contentId': 'do_2122528233578250241233',
            'batchId': '115',
            'status': 2,
            'lastAccessTime': '2017-05-15 10:58:07:509+0530',
             'courseId': 'do_212282810437918720179',
             'result': 'pass',
             'score': '10',
             'grade': 'B'
            }
     ]
    };
    service.updateCourseStateInServer();
    service.updateCourseStateInServer(reqData).subscribe(
      apiResponse => {
         expect(apiResponse.params.status).toBe('success');
      }
    );
  });

  it('should not update CourseState InServer ', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(Observable.of(Response.UpdateDataError));
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
    service.updateCourseStateInServer();
    service.updateCourseStateInServer(reqData).subscribe(
      apiResponse => {
         expect(apiResponse.params.status).not.toBe('success');
      }
    );
  });

  xit('should update completed Count', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    service.prepareContentObject(Response.successData.result.contentList);
    const courseId_batchId = Response.successData.result.contentList[0].courseId + '_' + Response.successData.result.contentList[0].batchId;
    expect(service.localContentState[courseId_batchId]).toBeDefined();
  });
});
