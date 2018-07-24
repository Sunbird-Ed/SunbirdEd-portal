
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoursesService } from './course.service';
import { UserService } from './../user/user.service';
import { LearnerService } from './../learner/learner.service';
import { SharedModule } from '@sunbird/shared';
import * as mockData from './course.service.spec.data';
import { CoreModule } from '@sunbird/core';
const testData = mockData.mockRes;
describe('CoursesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: []
    });
  });
  it('should be created', inject([CoursesService], (coursesService: CoursesService) => {
    expect(coursesService).toBeTruthy();
  }));
  it('should make api call', inject([CoursesService, UserService, LearnerService], (coursesService: CoursesService,
    userService: UserService, learnerService: LearnerService) => {
    spyOn(learnerService, 'get').and.callFake(() => observableOf(testData.apiResonseData));
    coursesService.getEnrolledCourses().subscribe(apiResponse => {
     expect(coursesService['enrolledCourses']).toEqual(testData.apiResonseData.result.courses);
    });
    expect(coursesService).toBeTruthy();
    expect(learnerService.get).toHaveBeenCalled();
    expect(coursesService.enrolledCourseData$).toBeDefined();
  }));
  it('should call updateCourseProgress', inject([CoursesService, UserService, LearnerService], (coursesService: CoursesService,
    userService: UserService, learnerService: LearnerService) => {
      const courseId = 'do_1125083286221291521153';
      const batchId = '01250836468775321655';
      const progress = 2;
      coursesService['enrolledCourses'] = testData.apiResonseData.result.courses;
      coursesService.updateCourseProgress(courseId, batchId, progress);
      expect(coursesService.enrolledCourseData$).toBeDefined();
      expect(coursesService['enrolledCourses'][0].progress).toEqual(2);
  }));
});
