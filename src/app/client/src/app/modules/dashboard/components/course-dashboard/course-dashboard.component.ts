import { NavigationHelperService, ResourceService, ToasterService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDashboardItems } from '../../interfaces';
import * as _ from 'lodash-es';
import { CourseProgressService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import {  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-course-dashboard',
  templateUrl: './course-dashboard.component.html',
  styleUrls: ['./course-dashboard.component.scss']
})
export class CourseDashboardComponent implements OnInit, OnDestroy {

  public dashBoardItems: Array<IDashboardItems> = [];
  courseId: string;
  telemetryImpression: IImpressionEventInput;
  public unsubscribe$ = new Subject<void>();

  constructor(
    private courseProgressService: CourseProgressService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private navigationhelperService: NavigationHelperService,
    public resourceService: ResourceService,
    private toasterService: ToasterService,
    ) { }

  ngOnInit() {
    this.activatedRoute.parent.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
        this.courseId = _.get(params, 'courseId');
        this.getBatchList();
        this.setImpressionEvent();
      });
  }

  // To set telemetry impression
  setImpressionEvent() {
    this.telemetryImpression = {
      context: {
        env: _.get(this.activatedRoute.snapshot, 'data.telemetry.env')
      },
      edata: {
        type: _.get(this.activatedRoute.snapshot, 'data.telemetry.type'),
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
        uri: this.router.url,
        duration: this.navigationhelperService.getPageLoadTime()
      },
      object: {
          id: this.courseId,
          type: _.get(this.activatedRoute.snapshot, 'data.telemetry.object.type'),
          ver: _.get(this.activatedRoute.snapshot, 'data.telemetry.object.ver'),
      }
    };
  }

  // To get the loggedIn user created batch list for the course
  getBatchList() {
    const searchParams = {
      courseId: this.courseId,
      status: ['0', '1', '2'],
      createdBy: this.userService.userid
    };
    this.courseProgressService.getBatches(searchParams).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.getDashboardData(_.get(data, 'result.response'));
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  // To get the user enrolled/completed  count for the Course
  getDashboardData(batchList) {
    const batches = _.get(batchList, 'content');
    if (batches) {
      this.dashBoardItems.push({
        title: _.get(this.resourceService, 'frmelmnts.lbl.totalBatches'),
        count: _.get(batchList, 'count'),
        type: 'small',
      });
      _.forEach(batches, batch => {
        this.updateDashBoardItems(_.get(this.resourceService, 'frmelmnts.lbl.totalCompletions'), _.get(batch, 'completedCount'), 'large');
        this.updateDashBoardItems(_.get(this.resourceService, 'frmelmnts.lbl.totalEnrollments'), _.get(batch, 'participantCount'), 'small');
        });
    }
  }

  // To update the dashboardItems count
  updateDashBoardItems(title: string, count: number, type: string) {
    const enrollmentCount = _.find(this.dashBoardItems, { title: title });
    if (enrollmentCount) {
      enrollmentCount.count += count;
    } else {
      this.dashBoardItems.push({
        title: title,
        count: count,
        type: type,
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
