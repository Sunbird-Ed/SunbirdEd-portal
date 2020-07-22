import { Component, OnInit } from '@angular/core';
import { IDashboard } from '../../interfaces';
import * as _ from 'lodash-es';
import { CourseProgressService } from '../../services';
@Component({
  selector: 'app-course-dashboard',
  templateUrl: './course-dashboard.component.html',
  styleUrls: ['./course-dashboard.component.scss']
})
export class CourseDashboardComponent implements OnInit {
  batchList = [];
  dashBoardData: IDashboard;

  constructor(private courseProgressService: CourseProgressService) { }

  ngOnInit() {
  this.getBatchList();
  }

  getBatchList() {
  }

  getEnrollmentAndCompletedCount() {
  }
}
