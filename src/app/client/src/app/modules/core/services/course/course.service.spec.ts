import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { CoursesService } from './course.service';
import { UserService } from './../user/user.service';
import { LearnerService } from './../learner/learner.service';
import { ConfigService } from '@sunbird/shared';
import * as mockData from './course.service.spec.data';
const testData = mockData.mockRes;
describe('CoursesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
    expect(coursesService.enrolledCourseData$).toBeDefined();
  }));
});
