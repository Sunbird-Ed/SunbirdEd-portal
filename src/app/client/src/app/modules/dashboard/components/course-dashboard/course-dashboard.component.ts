import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDashboard } from '../../interfaces';
import * as _ from 'lodash-es';
import { CourseProgressService } from '../../services';
@Component({
  selector: 'app-course-dashboard',
  templateUrl: './course-dashboard.component.html',
  styleUrls: ['./course-dashboard.component.scss']
})
export class CourseDashboardComponent implements OnInit, OnDestroy {
  batchList = [];
  dashBoardData: IDashboard;
  public unsubscribe$ = new Subject<void>();

  constructor(private courseProgressService: CourseProgressService) { }

  ngOnInit() {
  this.getBatchList();
  }

  getBatchList() {
  }

  getEnrollmentAndCompletedCount() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
