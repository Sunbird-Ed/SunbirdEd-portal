import { NavigationHelperService, ResourceService, ToasterService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IDashboard, IDashBoardItems } from '../../interfaces';
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

  public dashBoard: IDashboard;
  public dashBoardItems: IDashBoardItems;

  public unsubscribe$ = new Subject<void>();
  courseId: string;
  queryParams: {};
  telemetryImpression: IImpressionEventInput;
  state: {};

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
    this.state = history.state;
    this.initializeFields();
    this.courseId = _.get(this.activatedRoute.snapshot.params, 'courseId') || _.get(this.state, 'id');
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.getBatchList();
    this.setImpressionEvent();
  }

  // To initialize the dashboard data
  initializeFields() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$))
    .subscribe(item => {
    this.dashBoard = {
      totalBatches: {
        title: this.resourceService.frmelmnts.lbl.totalBatches,
        count: 0
      },
      totalEnrollment: {
        title: this.resourceService.frmelmnts.lbl.totalEnrollments,
        count: 0
      }
    };

     this.dashBoardItems = {
      totalCompleted: {
        title: this.resourceService.frmelmnts.lbl.totalCompletions,
        count: 0
      }
    };
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
          type: _.get(this.state, 'type'),
          ver: `${_.get(this.state, 'ver')}` || '1.0',
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
      this.getEnrollmentAndCompletedCount(_.get(data, 'result.response'));
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });

  }

  // To get the user enrolled/completed  count for the Course
  getEnrollmentAndCompletedCount(batchList) {
    const batches = _.get(batchList, 'content');
    if (batches) {
      this.dashBoard.totalBatches.count = _.get(batchList, 'count');
      _.forEach(batches, batch => {
        this.dashBoardItems.totalCompleted.count += _.get(batch, 'completedCount');
        this.dashBoard.totalEnrollment.count += _.get(batch, 'participantCount');
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
