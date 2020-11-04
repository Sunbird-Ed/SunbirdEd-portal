
import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CourseConsumptionService, CourseProgressService } from './../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CoursesService, PermissionService, CopyContentService, UserService, GeneraliseLabelService } from '@sunbird/core';
import {
  ResourceService, ToasterService, ContentData, ContentUtilsServiceService, ITelemetryShare,
  ExternalUrlPreviewService
} from '@sunbird/shared';
import { IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import * as dayjs from 'dayjs';
import { GroupsService } from '../../../../groups/services/groups/groups.service';
import { NavigationHelperService } from '@sunbird/shared';
@Component({
  selector: 'app-course-consumption-header',
  templateUrl: './course-consumption-header.component.html',
  styleUrls: ['./course-consumption-header.component.scss']
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
  onPageLoadResume = false;
  courseInteractObject: IInteractEventObject;
  @Input() courseHierarchy: any;
  @Input() enrolledBatchInfo: any;
  @Input() groupId: string;
  @Input() showAddGroup = false;
  enrolledCourse = false;
  batchId: any;
  dashboardPermission = ['COURSE_MENTOR', 'CONTENT_CREATOR'];
  courseId: string;
  lastPlayedContentId: string;
  showResumeCourse = true;
  contentId: string;
  progress = 0;
  courseStatus: string;
  public unsubscribe = new Subject<void>();
  batchEndDate: any;
  public interval: any;
  telemetryCdata: Array<{}>;
  enableProgress = false;
  // courseMentor = false;
  // courseCreator = false;
  forumId;
  isTrackable = false;
  viewDashboard = false;
  constructor(private activatedRoute: ActivatedRoute, public courseConsumptionService: CourseConsumptionService,
    public resourceService: ResourceService, private router: Router, public permissionService: PermissionService,
    public toasterService: ToasterService, public copyContentService: CopyContentService, private changeDetectorRef: ChangeDetectorRef,
    private courseProgressService: CourseProgressService, public contentUtilsServiceService: ContentUtilsServiceService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public coursesService: CoursesService, private userService: UserService,
    private telemetryService: TelemetryService, private groupService: GroupsService,
    private navigationHelperService: NavigationHelperService, public generaliseLabelService: GeneraliseLabelService) { }

  showJoinModal(event) {
    this.courseConsumptionService.showJoinCourseModal.emit(event);
  }

  ngOnInit() {
    this.forumId = _.get(this.courseHierarchy, 'forumId') || _.get(this.courseHierarchy, 'metaData.forumId');
    if (!this.courseConsumptionService.getCoursePagePreviousUrl) {
      this.courseConsumptionService.setCoursePagePreviousUrl();
    }
    this.isTrackable = this.courseConsumptionService.isTrackableCollection(this.courseHierarchy);
    this.viewDashboard = this.courseConsumptionService.canViewDashboard(this.courseHierarchy);

    observableCombineLatest(this.activatedRoute.firstChild.params, this.activatedRoute.firstChild.queryParams,
      (params, queryParams) => {
        return { ...params, ...queryParams };
      }).subscribe((params) => {
        this.courseId = params.courseId;
        this.batchId = params.batchId;
        this.courseStatus = params.courseStatus;
        this.contentId = params.contentId;
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
          this.telemetryCdata = [{ id: this.batchId, type: 'CourseBatch' }];
        }
      });
    this.interval = setInterval(() => {
      if (document.getElementById('closebutton')) {
        this.showResumeCourse = true;
      } else {
        this.showResumeCourse = false;
      }
    }, 500);
  }
  ngAfterViewInit() {
    this.courseProgressService.courseProgressData.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((courseProgressData) => {
        if (this.batchId) {
          this.enrolledCourse = true;
          this.progress = courseProgressData.progress ? Math.floor(courseProgressData.progress) : 0;
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
        }
      });

      this.courseConsumptionService.updateContentConsumedStatus.emit(
        {
          courseId: this.courseId,
          batchId: this.batchId,
          courseHierarchy: this.courseHierarchy
         });
  }

  showDashboard() {
    this.router.navigate(['learn/course', this.courseId, 'dashboard', 'batches']);
  }

  // To close the dashboard
  closeDashboard() {
    this.router.navigate(['learn/course', this.courseId]);
  }

  resumeCourse(showExtUrlMsg?: boolean) {
    this.courseConsumptionService.launchPlayer.emit();
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
    this.shareLink = this.contentUtilsServiceService.getCoursePublicShareUrl(this.courseId);
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
    clearInterval(this.interval);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  getBatchStatus() {
   /* istanbul ignore else */
   if (_.get(this.enrolledBatchInfo, 'endDate')) {
    this.batchEndDate = dayjs(this.enrolledBatchInfo.endDate).format('YYYY-MM-DD');
   }
   return (_.get(this.enrolledBatchInfo, 'status') === 2 && this.progress <= 100);
  }

  closeSharePopup(id) {
    this.sharelinkModal = false;
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: this.telemetryCdata
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'course-details',
      },
      object: {
        id: _.get(this.courseHierarchy, 'identifier'),
        type: _.get(this.courseHierarchy, 'contentType') || 'Course',
        ver: `${_.get(this.courseHierarchy, 'pkgVersion')}` || `1.0`,
        rollup: {l1: this.courseId}
      }
    };
    this.telemetryService.interact(interactData);
  }

  logTelemetry(id, content?: {}) {
    if (this.batchId) {
      this.telemetryCdata = [{ id: this.batchId, type: 'courseBatch' }];
    }
    const objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseHierarchy, _.get(content, 'identifier'));
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'Course',
        cdata: this.telemetryCdata || []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'course-consumption',
      },
      object: {
        id: content ? _.get(content, 'identifier') : this.activatedRoute.snapshot.params.courseId,
        type: content ? _.get(content, 'contentType') : 'Course',
        ver: content ? `${_.get(content, 'pkgVersion')}` : `1.0`,
        rollup: this.courseConsumptionService.getRollUp(objectRollUp) || {}
      }
    };
    this.telemetryService.interact(interactData);
  }

  addActivityToGroup() {
    const isActivityAdded = _.find(_.get(this.groupService, 'groupData.activities'), {id: this.courseId});
    if (_.get(this.groupService, 'groupData.isAdmin') && _.isEmpty(isActivityAdded)) {
      const request = {
        activities: [{ id: this.courseId, type: 'Course' }]
      };
      this.groupService.addActivities(this.groupId, request).subscribe(response => {
        this.goBack();
        this.toasterService.success(this.resourceService.messages.imsg.activityAddedSuccess);
      }, error => {
        this.goBack();
        this.toasterService.error(this.resourceService.messages.stmsg.activityAddFail);
      });
    } else {
      this.goBack();
      isActivityAdded ? this.toasterService.error(this.resourceService.messages.emsg.activityAddedToGroup) :
      this.toasterService.error(this.resourceService.messages.emsg.noAdminRole);
    }
  }


  openDiscussionForum() {
    this.router.navigate(['/discussions'], {queryParams: {forumId: this.forumId} });
  }


  goBack() {
    const previousPageUrl: any = this.courseConsumptionService.getCoursePagePreviousUrl;
    this.courseConsumptionService.coursePagePreviousUrl = '';
    if (!previousPageUrl) {
      this.router.navigate(['/learn']);
      return;
    }
    if (previousPageUrl.url.indexOf('/my-groups/') >= 0) {
      this.navigationHelperService.goBack();
    } else {
      if (previousPageUrl.queryParams) {
        this.router.navigate([previousPageUrl.url], {queryParams: previousPageUrl.queryParams});
      } else {
        this.router.navigate([previousPageUrl.url]);
      }
    }
  }
}
