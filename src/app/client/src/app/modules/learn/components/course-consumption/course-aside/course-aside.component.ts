import { Component, Input, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash-es';
import { CourseConsumptionService, CourseProgressService } from '../../../services';
import { CoursesService, UserService } from '@sunbird/core';
import { CsCourseService } from '@project-sunbird/client-services/services/course/interface';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-course-aside',
  templateUrl: './course-aside.component.html',
  styleUrls: ['./course-aside.component.scss']
})
export class CourseAsideComponent implements OnInit {
  @Input() courseHierarchy:any;
  @Input() configContent:any;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  navigate() {
    this.router.navigate(['/learn/course/play',this.courseHierarchy.identifier]);
  }
}
