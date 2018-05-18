import { Component, OnInit, Input } from '@angular/core';
import { CourseConsumptionService, CourseProgressService } from './../../../services';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CollectionHierarchyAPI, ContentService, CoursesService, PermissionService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-course-consumption-header',
  templateUrl: './course-consumption-header.component.html',
  styleUrls: ['./course-consumption-header.component.css']
})
export class CourseConsumptionHeaderComponent implements OnInit {
  @Input() courseHierarchy: any;
  @Input() enrolledCourse: boolean;
  permission = ['COURSE_MENTOR'];
  lastPlayedContentId: string;
  showResumeCourse = true;
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
    public resourceService: ResourceService, private router: Router, public permissionService: PermissionService,
    private courseProgressService: CourseProgressService) {

    }

  ngOnInit() {
    this.courseProgressService.courseProgressData.subscribe((courseProgressData) => {
      this.courseHierarchy.progress = courseProgressData.progress;
      this.lastPlayedContentId = courseProgressData.lastPlayedContentId;
      this.showResumeCourse = false;
    });
  }
  showDashboard() {
    this.router.navigate(['dashboard'], {relativeTo: this.activatedRoute.firstChild});
  }
  resumeCourse() {
    this.navigateToContent(this.lastPlayedContentId);
    console.log('resume course');
  }
  flagCourse() {
    this.router.navigate(['flag'], {relativeTo: this.activatedRoute.firstChild});
  }

    private navigateToContent( id: string ): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'contentId': id },
      relativeTo: this.activatedRoute
    };
    this.router.navigate([], navigationExtras);
  }
}
