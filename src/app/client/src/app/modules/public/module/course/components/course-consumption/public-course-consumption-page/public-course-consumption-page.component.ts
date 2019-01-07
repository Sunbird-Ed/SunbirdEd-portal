import { combineLatest, Subject, throwError } from 'rxjs';
import { map, mergeMap, first, takeUntil } from 'rxjs/operators';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService } from '@sunbird/learn';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { CoursesService, BreadcrumbsService } from '@sunbird/core';
import * as moment from 'moment';
@Component({
  templateUrl: './public-course-consumption-page.component.html',
  styleUrls: ['./public-course-consumption-page.component.css']
})
export class PublicCourseConsumptionPageComponent implements OnInit, OnDestroy {
  public courseId: string;
  public showLoader = true;
  public showError = false;
  public courseHierarchy: any;
  public unsubscribe$ = new Subject<void>();
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
    private coursesService: CoursesService, public toasterService: ToasterService, public courseBatchService: CourseBatchService,
    private resourceService: ResourceService, public router: Router, public breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.showLoader = false;
    const routeParams: any = { ...this.activatedRoute.snapshot.params, ...this.activatedRoute.snapshot.firstChild.params };
    this.courseId = routeParams.courseId;
    // get course herierachy here and send it to course-consumption-header and other child components
  }

  private checkCourseStatus(courseHierarchy) {
    if (!['Live', 'Unlisted', 'Flagged'].includes(courseHierarchy.status)) {
      this.toasterService.warning(this.resourceService.messages.imsg.m0026);
      this.router.navigate(['/explore-course']);
    }
  }

  private updateBreadCrumbs() {
    this.breadcrumbsService.setBreadcrumbs([{
      label: this.courseHierarchy.name,
      url: '/explore-course'
    }]);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
