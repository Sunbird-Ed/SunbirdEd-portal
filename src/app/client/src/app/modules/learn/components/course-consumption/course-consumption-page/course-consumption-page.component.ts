import { Subscription } from 'rxjs/Subscription';
import { ResourceService } from '@sunbird/shared';
import { ToasterService } from './../../../../shared/services/toaster/toaster.service';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CollectionHierarchyAPI, ContentService, CoursesService, BreadcrumbsService } from '@sunbird/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-course-consumption-page',
  templateUrl: './course-consumption-page.component.html',
  styleUrls: ['./course-consumption-page.component.css']
})
export class CourseConsumptionPageComponent implements OnInit, OnDestroy {
  subscription: any;
  courseId: string;
  batchId: string;
  showLoader = true;
  showError = false;
  courseHierarchy: any;
  eventSubscription: any;
  courseDataSubscription: Subscription;
  public unsubscribe = new Subject<void>();

  enrolledBatchInfo: any;
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
    private coursesService: CoursesService, public toasterService: ToasterService, public courseBatchService: CourseBatchService,
    private resourceService: ResourceService, public router: Router, public breadcrumbsService: BreadcrumbsService) {
    }

  ngOnInit() {
    this.subscription = Observable.combineLatest(this.activatedRoute.params, this.activatedRoute.firstChild.params,
      (params, firstChildParams) => {
        return { ...params, ...firstChildParams };
      }).flatMap( (params) => {
        this.batchId = params.batchId;
        this.courseId = params.courseId;
        if (this.batchId) {
          return Observable.combineLatest(this.courseConsumptionService.getCourseHierarchy(params.courseId),
          this.getEnrolledCourseBatchDetails(), (courseHierarchy, enrolledBatchDetails) => {
           return { courseHierarchy, enrolledBatchDetails };
         });
        } else {
          return this.courseConsumptionService.getCourseHierarchy(params.courseId).map((courseHierarchy) => {
            return { courseHierarchy };
          });
        }
      }).subscribe((data) => {
        this.processCourseHierarchy(data.courseHierarchy);
        this.showLoader = false;
      }, (err) => {
        this.showLoader = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0003);
        this.router.navigate([`/learn`]);
      });

    this.eventSubscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      if (this.courseHierarchy) {
        if (this.batchId) {
          this.breadcrumbsService.setBreadcrumbs([{
            label: this.courseHierarchy.name,
            url: '/learn/course/' + this.courseId + '/batch/' + this.batchId
          }]);
        } else {
          this.breadcrumbsService.setBreadcrumbs([{
            label: this.courseHierarchy.name,
            url: '/learn/course/' + this.courseId
          }]);
        }
      }
    });
  }
  private processCourseHierarchy(courseHierarchy) {
      if (courseHierarchy.status === 'Live' || courseHierarchy.status === 'Unlisted' || courseHierarchy.status === 'Flagged') {
        this.courseHierarchy = courseHierarchy;
        this.breadcrumbsService.setBreadcrumbs([{ label: this.courseHierarchy.name, url: '/learn/course/' + this.courseId }]);
      } else {
        this.toasterService.warning(this.resourceService.messages.imsg.m0026);
        this.router.navigate(['/learn']);
      }
  }
  private getEnrolledCourseBatchDetails() {
    return this.courseBatchService.getEnrolledBatchDetails(this.batchId).map((data) => {
      this.enrolledBatchInfo = data;
      this.processBatch();
      return data;
    });
  }
  private processBatch() {
    this.courseDataSubscription = this.coursesService.enrolledCourseData$.subscribe(enrolledCourses => {
      if (enrolledCourses && !enrolledCourses.err) {
          const enrollCourse: any = _.find(enrolledCourses.enrolledCourses, {'batchId': this.batchId});
          if (enrollCourse === undefined) {
            this.toasterService.error(this.resourceService.messages.fmsg.m0001);
            this.router.navigate([`/learn`]);
          }
      } else if (enrolledCourses && enrolledCourses.err) {
          this.toasterService.error(this.resourceService.messages.fmsg.m0001);
          this.router.navigate([`/learn`]);
      }
    });
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    if (this.courseDataSubscription) {
      this.courseDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
