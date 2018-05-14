import { CourseConsumptionService } from './../../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CollectionHierarchyAPI, ContentService, CoursesService } from '@sunbird/core';
@Component({
  selector: 'app-course-consumption-page',
  templateUrl: './course-consumption-page.component.html',
  styleUrls: ['./course-consumption-page.component.css']
})
export class CourseConsumptionPageComponent implements OnInit {
  subscription: any;
  courseId: string;
  batchId: string;
  showLoader = true;
  courseHierarchy: any;
  enrolledCourse: boolean;
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
  private coursesService: CoursesService) { }

  ngOnInit() {
    this.subscription = Observable.combineLatest(this.activatedRoute.params, this.activatedRoute.children[0].params,
      (params, firstChildParams) => {
        return {...params, ...firstChildParams};
      }).subscribe((params) => {
        this.batchId = params.batchId;
        this.courseId = params.courseId;
        this.getCourseHierarchy(params.courseId);
      });
  }
  private getCourseHierarchy(courseId: string) {
    this.courseConsumptionService.getCourseHierarchy(courseId).subscribe((response) => {
      if (response.result.content.status === 'Live' || response.result.content.status === 'Unlisted' ||
          response.result.content.status === 'Flagged') {
        this.courseHierarchy = response.result.content;
        this.getBatch();
      } else {
        // warning messages.imsg.m0026
      }
    }, (err) => {
      // show error messages.fmsg.m0003
    });
  }
  getBatch() {
    this.coursesService.enrolledCourseData$.subscribe(data => {
        if (data && !data.err) {
          const enrCourse = _.find(data.enrolledCourses, (course, index) => {
            if ((this.batchId && this.batchId === course.batchId) || course.courseId === this.courseId) {
              return course;
            }
          });
          if (enrCourse && enrCourse.batchId) {
            this.enrolledCourse = true;
            this.courseHierarchy.progress = enrCourse.progress || 0;
          } else {
            this.enrolledCourse = false;
          }
          this.showLoader = false;
        } else if (data && data.err) {
          this.enrolledCourse = false;
          this.showLoader = false;
        }
    });
  }

}
