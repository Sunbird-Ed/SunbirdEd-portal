import { Component, OnInit, Input } from '@angular/core';
import { CourseConsumptionService, CourseProgressService } from './../../../services';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CollectionHierarchyAPI, ContentService, CoursesService, PermissionService, CopyContentService } from '@sunbird/core';
import { ResourceService, ToasterService, ContentData } from '@sunbird/shared';
@Component({
  selector: 'app-course-consumption-header',
  templateUrl: './course-consumption-header.component.html',
  styleUrls: ['./course-consumption-header.component.css']
})
export class CourseConsumptionHeaderComponent implements OnInit {
  /**
   * to show loader while copying content
   */
  showCopyLoader = false;
  @Input() courseHierarchy: any;
  @Input() enrolledCourse: boolean;
  permission = ['COURSE_MENTOR'];
  courseId: string;
  lastPlayedContentId: string;
  showResumeCourse = true;
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
    public resourceService: ResourceService, private router: Router, public permissionService: PermissionService,
    public toasterService: ToasterService, public copyContentService: CopyContentService,
    private courseProgressService: CourseProgressService) {

    }

  ngOnInit() {
    this.activatedRoute.firstChild.params.subscribe((param) => {
      this.courseId = param.courseId;
    });
    this.courseProgressService.courseProgressData.subscribe((courseProgressData) => {
      this.courseHierarchy.progress = courseProgressData.progress;
      this.lastPlayedContentId = courseProgressData.lastPlayedContentId;
      this.showResumeCourse = false;
    });
  }
  showDashboard() {
    this.router.navigate(['learn/course', this.courseId, 'dashboard']);
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
  /**
   * This method calls the copy API service
   * @param {contentData} ContentData Content data which will be copied
   */
  copyContent(contentData: ContentData) {
    this.showCopyLoader = true;
    this.copyContentService.copyContent(contentData).subscribe(
      (response) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0042);
        this.showCopyLoader = false;
      },
      (err) => {
        this.showCopyLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }
}
