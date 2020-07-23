import { NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { IDashBoardLarge } from './../../interfaces/dashboardData';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDashboard } from '../../interfaces';
import * as _ from 'lodash-es';
import { CourseProgressService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import {  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum dashBoardTitles {
  batches = 'TOTAL BATCHES',
  enrollments = 'TOTAL ENROLLMENTS',
  completions = 'TOTAL COMPLETIONS',
}
@Component({
  selector: 'app-course-dashboard',
  templateUrl: './course-dashboard.component.html',
  styleUrls: ['./course-dashboard.component.scss']
})
export class CourseDashboardComponent implements OnInit, OnDestroy {

  public dashBoardSmallCards: IDashboard = {
    totalBatches: {
      title: dashBoardTitles.batches,
      count: 0
    },
    totalEnrollment: {
      title: dashBoardTitles.enrollments,
      count: 0
    }
  };

  public dashBoardLargeCards: IDashBoardLarge = {
    totalCompleted: {
      title: dashBoardTitles.completions,
      count: 0
    }
  };

  public unsubscribe$ = new Subject<void>();
  courseId: string;
  queryParams;
  telemetryImpression: IImpressionEventInput;

  constructor(
    private courseProgressService: CourseProgressService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private navigationhelperService: NavigationHelperService
    ) { }

  ngOnInit() {
    this.courseId = _.get(this.activatedRoute.snapshot.params, 'courseId');
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.getBatchList();
    this.setImpressionEvent();
  }

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
      }
    };
  }

  getBatchList() {
    const searchParams = {
      courseId: this.courseId,
      status: ['0', '1', '2'],
      createdBy: this.userService.userid
    };
    this.courseProgressService.getBatches(searchParams).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.getEnrollmentAndCompletedCount(_.get(data, 'result.response'));
    }, err => {
    });

  }

  getEnrollmentAndCompletedCount(batchList) {
    const batches = _.get(batchList, 'content');
    if (batches) {
      this.dashBoardSmallCards.totalBatches.count = _.get(batchList, 'count');
      _.forEach(batches, batch => {
        this.dashBoardLargeCards.totalCompleted.count += _.get(batch, 'completedCount');
        this.dashBoardSmallCards.totalEnrollment.count += _.get(batch, 'participantCount');
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
