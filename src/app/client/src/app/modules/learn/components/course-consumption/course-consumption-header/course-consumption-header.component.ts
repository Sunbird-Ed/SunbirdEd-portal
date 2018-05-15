import { Component, OnInit, Input } from '@angular/core';
import { CourseConsumptionService } from './../../../services';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CollectionHierarchyAPI, ContentService, CoursesService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-course-consumption-header',
  templateUrl: './course-consumption-header.component.html',
  styleUrls: ['./course-consumption-header.component.css']
})
export class CourseConsumptionHeaderComponent implements OnInit {
  @Input() courseHierarchy: any;
  @Input() enrolledCourse: boolean;
  permission = ['CONTENT_CREATOR'];
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
    public resourceService: ResourceService, private router: Router) {

    }

  ngOnInit() {
  }
  showDashboard() {
    this.router.navigate(['dashboard'], {relativeTo: this.activatedRoute.firstChild});
  }
  resumeCourse() {
    console.log('resume course');
  }
  flagCourse() {
    this.router.navigate(['flag'], {relativeTo: this.activatedRoute.firstChild});
  }
}
