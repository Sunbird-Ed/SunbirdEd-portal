
import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CourseConsumptionService, CourseProgressService } from './../../../services';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { CoursesService, PermissionService, CopyContentService } from '@sunbird/core';
import {
  ResourceService, ToasterService, ContentData, ContentUtilsServiceService, ITelemetryShare,
  ExternalUrlPreviewService
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-course-consumption-header',
  templateUrl: './course-consumption-header.component.html',
  styleUrls: ['./course-consumption-header.component.css']
})
export class CourseConsumptionHeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  sharelinkModal: boolean;
  /**
   * contains link that can be shared
   */
  flaggedCourse = false;
  /**
	 * telemetryShareData
	*/
  telemetryShareData: Array<ITelemetryShare>;
  shareLink: string;
  /**
   * to show loader while copying content
   */
  showCopyLoader = false;
  onPageLoadResume = true;
  courseInteractObject: IInteractEventObject;
  resumeIntractEdata: IInteractEventEdata;
  @Input() courseHierarchy: any;
  @Input() enrolledBatchInfo: any;
  enrolledCourse: boolean;
  batchId: any;
  dashboardPermission = ['COURSE_MENTOR'];
  courseId: string;
  lastPlayedContentId: string;
  showResumeCourse = true;
  contentId: string;
  progress = 0;
  courseStatus: string;
  public unsubscribe = new Subject<void>();
  constructor(private activatedRoute: ActivatedRoute, private courseConsumptionService: CourseConsumptionService,
    public resourceService: ResourceService, private router: Router, public permissionService: PermissionService,
    public toasterService: ToasterService, public copyContentService: CopyContentService, private changeDetectorRef: ChangeDetectorRef,
    private courseProgressService: CourseProgressService, public contentUtilsServiceService: ContentUtilsServiceService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public coursesService: CoursesService) {

  }

  ngOnInit() {
    observableCombineLatest(this.activatedRoute.firstChild.params, this.activatedRoute.firstChild.queryParams,
      (params, queryParams) => {
        return { ...params, ...queryParams };
      }).subscribe((params) => {
        this.courseId = params.courseId;
        this.batchId = params.batchId;
        this.courseStatus = params.courseStatus;
        this.contentId = params.contentId;
        this.resumeIntractEdata = {
          id: 'course-resume',
          type: 'click',
          pageid: 'course-consumption'
        };
        this.courseInteractObject = {
          id: this.courseHierarchy.identifier,
          type: 'Course',
          ver: this.courseHierarchy.pkgVersion ? this.courseHierarchy.pkgVersion.toString() : '1.0',
        };
        if (this.courseHierarchy.status === 'Flagged') {
          this.flaggedCourse = true;
        }
        if (this.batchId) {
          this.enrolledCourse = true;
        }
      });
  }
  ngAfterViewInit() {
    this.courseProgressService.courseProgressData.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((courseProgressData) => {
        this.enrolledCourse = true;
        this.progress = courseProgressData.progress ? Math.round(courseProgressData.progress) : 0;
        this.lastPlayedContentId = courseProgressData.lastPlayedContentId;
        if (!this.flaggedCourse && this.onPageLoadResume &&
          !this.contentId && this.enrolledBatchInfo.status > 0 && this.lastPlayedContentId) {
          this.onPageLoadResume = false;
          this.showResumeCourse = false;
          this.resumeCourse();
        } else if (!this.flaggedCourse && this.contentId && this.enrolledBatchInfo.status > 0 && this.lastPlayedContentId) {
          this.onPageLoadResume = false;
          this.showResumeCourse = false;
        } else {
          this.onPageLoadResume = false;
        }
      });
  }

  showDashboard() {
    this.router.navigate(['learn/course', this.courseId, 'dashboard']);
  }

  resumeCourse(showExtUrlMsg?: boolean) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'contentId': this.lastPlayedContentId },
      relativeTo: this.activatedRoute
    };
    this.router.navigate([this.courseId, 'batch', this.batchId], navigationExtras);
    this.coursesService.setExtContentMsg(showExtUrlMsg);
  }

  flagCourse() {
    this.router.navigate(['flag'], { relativeTo: this.activatedRoute.firstChild });
  }
  /**
   * This method calls the copy API service
   * @param {contentData} ContentData Content data which will be copied
   */
  copyContent(contentData: ContentData) {
    this.showCopyLoader = true;
    this.copyContentService.copyContent(contentData).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0042);
          this.showCopyLoader = false;
        },
        (err) => {
          this.showCopyLoader = false;
          this.toasterService.error(this.resourceService.messages.emsg.m0008);
        });
  }
  onShareLink() {
    this.shareLink = this.contentUtilsServiceService.getPublicShareUrl(this.courseId, this.courseHierarchy.mimeType);
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
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
