// import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { SearchService, CoursesService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-curriculum-courses',
  templateUrl: './curriculum-courses.component.html',
  styleUrls: ['./curriculum-courses.component.scss']
})
export class CurriculumCoursesComponent implements OnInit, OnDestroy {

  public channelId: string;
  public isCustodianOrg = true;
  private unsubscribe$ = new Subject<void>();
  defaultBg = false;
  public defaultFilters = {
    board: [],
    gradeLevel: [],
    medium: []
  };

  public selectedCourse: {};
  public courseList: any = [];
  public title: string;
  public enrolledCourses: any = [];
  public mergedCourseList: {} = {enrolledCourses: [], courseList: []};
  constructor(private searchService: SearchService, private toasterService: ToasterService,
    public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    private router: Router, private navigationhelperService: NavigationHelperService,
    private coursesService: CoursesService,
   ) { }

  ngOnInit() {
    this.title = _.get(this.activatedRoute, 'snapshot.queryParams.title');
    if (!_.isEmpty(_.get(this.searchService, 'subjectThemeAndCourse.contents'))) {
      this.courseList = _.get(this.searchService, 'subjectThemeAndCourse.contents');
      this.selectedCourse = _.omit(_.get(this.searchService, 'subjectThemeAndCourse'), 'contents');
      this.fetchEnrolledCourses();
    } else {
      this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
      this.navigationhelperService.goBack();
    }
  }

  private fetchEnrolledCourses() {
    return this.coursesService.enrolledCourseData$.pipe(map(({enrolledCourses, err}) => {
      return enrolledCourses;
    })).subscribe(enrolledCourses => {
      this.enrolledCourses = this.courseList.map((course) => {
        const enrolledCourse = _.find(enrolledCourses,  {courseId: course.identifier});
        if (enrolledCourse) {
          return {
            ...enrolledCourse,
            completionPercentage: enrolledCourse.completionPercentage || 0,
            isEnrolledCourse: true,
          };
        } else {
          return {
            ...course,
            isEnrolledCourse: false
          };
        }
      });
    });
  }




  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goBack() {
    this.navigationhelperService.goBack();
  }

  navigateToCourseDetails(course) {
    const courseId = _.get(course, 'metaData.courseId') || course.identifier;
    this.router.navigate(['learn/course', courseId]);
  }
}
