import { combineLatest, Subject, throwError } from 'rxjs';
import { map, mergeMap, first, takeUntil } from 'rxjs/operators';
import { ResourceService, ToasterService, ContentUtilsServiceService, ITelemetryShare } from '@sunbird/shared';
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
  sharelinkModal: boolean;
  shareLink: string;

  /**
   * telemetryShareData
  */
  telemetryShareData: Array<ITelemetryShare>;

  public unsubscribe$ = new Subject<void>();
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
    private coursesService: CoursesService, public toasterService: ToasterService, public courseBatchService: CourseBatchService,
    private resourceService: ResourceService, public router: Router, public breadcrumbsService: BreadcrumbsService,
    public contentUtilsServiceService: ContentUtilsServiceService) {
  }

  ngOnInit() {
    this.showLoader = false;
    const routeParams: any = this.activatedRoute.snapshot.firstChild.params;
    this.courseId = routeParams.courseId;
    if (this.courseId) {
      // get course herierachy here and send it to course-consumption-header and other child components
    } else {
      this.router.navigate(['/explore-course']);
    }
  }
  onShareLink() {
    this.shareLink = this.contentUtilsServiceService.getCoursePublicShareUrl(this.courseHierarchy.identifier);
    this.setTelemetryShareData(this.courseHierarchy);
  }
  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
