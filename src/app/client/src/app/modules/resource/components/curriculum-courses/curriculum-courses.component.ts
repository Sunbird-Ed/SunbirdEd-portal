import { Subject } from 'rxjs';
import { OrgDetailsService, UserService, SearchService, CoursesService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ToasterService, ConfigService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil, map, mergeMap, delay } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';

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
  constructor(private searchService: SearchService, private toasterService: ToasterService, private userService: UserService,
    public resourceService: ResourceService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    private router: Router, private orgDetailsService: OrgDetailsService, private navigationhelperService: NavigationHelperService,
    private contentSearchService: ContentSearchService, private coursesService: CoursesService, private utilService: UtilService) { }

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
      this.mergeCourseList(enrolledCourses);
      // this.getMergedCourseList(enrolledCourses, courseList);
    });
  }

  private mergeCourseList(enrolledCourses) {
    // const courseList = this.courseList
    this.enrolledCourses = this.courseList.map((course) => {
      const enrolledCourse = _.find(enrolledCourses,  {courseId: course.identifier});
      if (enrolledCourse) {
        return {
          ...enrolledCourse,
          // cardImg: this.commonUtilService.getContentImg(enrolledCourse),
          completionPercentage: enrolledCourse.completionPercentage || 0,
          isEnrolledCourse: true,
        };
      } else {
        return {
          ...course,
          // appIcon: this.commonUtilService.getContentImg(course),
          isEnrolledCourse: false
        };
      }
    });
  }

  private getMergedCourseList(enrolledCourses, courseList) {
    this.enrolledCourses = _.map(courseList, course => {
      const enrolledCourse = _.find(enrolledCourses, {courseId: course.identifier});
      if (enrolledCourse) {
        enrolledCourse.isEnrolledCourse = true;
        this.mergedCourseList['enrolledCourses'].push(enrolledCourse);
        return enrolledCourse;
      } else {
        course.isEnrolledCourse = false;
        this.mergedCourseList['courseList'].push(course);
        return course;
      }
    });
    this.mergedCourseList['enrolledCourses'] = _.uniqBy(this.mergedCourseList['enrolledCourses'], 'metaData.courseId');
    this.mergedCourseList['courseList'] = _.uniqBy(this.mergedCourseList['courseList'], 'identifier');
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
