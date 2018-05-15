import { ResourceService } from '@sunbird/shared';
import { ToasterService } from './../../../../shared/services/toaster/toaster.service';
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
  private coursesService: CoursesService, private toasterService: ToasterService,
  private resourceService: ResourceService, private router: Router) { }

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
      if (response.status === 'Live' || response.status === 'Unlisted' || response.status === 'Flagged') {
        this.courseHierarchy = response;
        this.getBatch();
      } else {
        this.toasterService.warning(this.resourceService.messages.imsg.m0026);
        this.router.navigate(['/learn']);
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0003);
    });
  }
  getBatch() {
    this.coursesService.enrolledCourseData$.subscribe(enrolledCourses => {
        if (enrolledCourses && !enrolledCourses.err) {
          if (this.batchId) {
            this.showLoader = false;
            const enrolledCourse = _.find(enrolledCourses.enrolledCourses, (value, index) => {
              if (this.batchId === value.batchId) {
                return value;
              }
            });
            if (enrolledCourse && enrolledCourse.batchId) {
              this.enrolledCourse = true;
              this.courseHierarchy.progress = enrolledCourse.progress || 0;
            } else {
              this.enrolledCourse = false;
              this.router.navigate([`/learn/course/${this.courseId}`]);
            }
          } else {
            this.showLoader = false;
            this.enrolledCourse = false;
            this.router.navigate([`/learn/course/${this.courseId}`]);
          }
        } else if (enrolledCourses && enrolledCourses.err) {
          this.enrolledCourse = false;
          this.showLoader = false;
          this.router.navigate([`/learn/course/${this.courseId}`]);
        }
    });
  }
}
