// Import NG core testing module(s)
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Import services
import { CoursesService } from './course.service';
import { UserService } from './../user/user.service';
import { LearnerService } from './../learner/learner.service';
import { ConfigService } from '@sunbird/shared';
// Test data
import * as mockData from './course.service.spec.data';
const testData = mockData.mockRes;

describe('CoursesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [CoursesService, UserService, LearnerService, ConfigService]
    });
  });

  it('should be created', inject([CoursesService], (coursesService: CoursesService) => {
    expect(coursesService).toBeTruthy();
  }));

  it('should make api call', inject([CoursesService, UserService, LearnerService], (coursesService: CoursesService,
    userService: UserService, learnerService: LearnerService) => {
    spyOn(learnerService, 'get').and.callFake(() => Observable.of(testData.successData));
    const apiRes = coursesService.getEnrolledCourses();
    expect(coursesService).toBeTruthy();
    expect(learnerService.get).toHaveBeenCalled();
    expect(coursesService.courseData$).toBeDefined();
    console.log('++++', coursesService.courseData$);
  }));

  it('should set data', inject([CoursesService], (coursesService: CoursesService) => {
    coursesService.enrolledCourses = undefined;
    const data = testData.successData;
    coursesService.setEnrolledCourses(data);
    expect(coursesService).toBeTruthy();
    expect(coursesService.enrolledCourses).toBeDefined();
  }));

  it('doesnt contain data', inject([CoursesService], (coursesService: CoursesService) => {
    expect(coursesService).toBeTruthy();
    const data = testData.errorData;
    coursesService.setEnrolledCourses(data);
    expect(coursesService.enrolledCourses).toBeUndefined();
  }));

});
