import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CourseConsumptionService, CourseProgressService } from './../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CoursesService, PermissionService, CopyContentService,
  OrgDetailsService, UserService, GeneraliseLabelService,  } from '@sunbird/core';
import {
  ResourceService, ToasterService, ContentData, ContentUtilsServiceService, ITelemetryShare,
  ExternalUrlPreviewService
} from '@sunbird/shared';
import { IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import dayjs from 'dayjs';
import { GroupsService } from '../../../../groups/services/groups/groups.service';
import { NavigationHelperService } from '@sunbird/shared';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { CourseBatchService } from './../../../services';
import { DiscussionService } from '../../../../discussion/services/discussion/discussion.service';

import { DiscussionTelemetryService } from './../../../../shared/services/discussion-telemetry/discussion-telemetry.service';

@Component({
  selector: 'app-course-consumption-header',
  templateUrl: './course-consumption-header.component.html',
  styleUrls: ['./course-consumption-header.component.scss']
})
export class CourseConsumptionHeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  sharelinkModal: boolean;
  showProfileUpdatePopup = false;
  profileInfo: {
    firstName: string,
    lastName: string,
    id: string
  };
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
  isCustodianOrgUser = false;
  // courseMentor = false;
  // courseCreator = false;
  forumIds = [];
  isTrackable = false;
  viewDashboard = false;
  tocId;
  isGroupAdmin: boolean;
  showLoader = false;

  constructor(private activatedRoute: ActivatedRoute, public courseConsumptionService: CourseConsumptionService,
    public resourceService: ResourceService, private router: Router, public permissionService: PermissionService,
    public toasterService: ToasterService, public copyContentService: CopyContentService, private changeDetectorRef: ChangeDetectorRef,
    private courseProgressService: CourseProgressService, public contentUtilsServiceService: ContentUtilsServiceService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public coursesService: CoursesService, private userService: UserService,
    private telemetryService: TelemetryService, private groupService: GroupsService,
    private navigationHelperService: NavigationHelperService, public orgDetailsService: OrgDetailsService,
    public generaliseLabelService: GeneraliseLabelService,
    public courseBatchService: CourseBatchService,
    public discussionService: DiscussionService, public discussionTelemetryService: DiscussionTelemetryService) { }

  showJoinModal(event) {
    this.courseConsumptionService.showJoinCourseModal.emit(event);
  }

  ngOnInit() {
    this.getCustodianOrgUser();
    if (!this.courseConsumptionService.getCoursePagePreviousUrl) {
      this.courseConsumptionService.setCoursePagePreviousUrl();
    }
    this.isTrackable = this.courseConsumptionService.isTrackableCollection(this.courseHierarchy);
    this.viewDashboard = this.courseConsumptionService.canViewDashboard(this.courseHierarchy);

    this.profileInfo = this.userService.userProfile;

    observableCombineLatest(this.activatedRoute.firstChild.params, this.activatedRoute.firstChild.queryParams,
      (params, queryParams) => {
        return { ...params, ...queryParams };
      }).subscribe((params) => {
        this.courseId = params.courseId;
        this.batchId = params.batchId;
        this.courseStatus = params.courseStatus;
        this.contentId = params.contentId;
        this.tocId = params.textbook;
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
        this.fetchForumIds();
      });
    this.interval = setInterval(() => {
      if (document.getElementById('closebutton')) {
        this.showResumeCourse = true;
      } else {
        this.showResumeCourse = false;
      }
    }, 500);
    this.courseConsumptionService.userCreatedAnyBatch.subscribe((visibility: boolean) => {
      this.viewDashboard = this.viewDashboard && visibility;
    });
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
    const IsStoredLocally = localStorage.getItem('isCertificateNameUpdated_' + this.profileInfo.id) || 'false' ;
    const certificateDescription = this.courseBatchService.getcertificateDescription(this.enrolledBatchInfo);
    if (IsStoredLocally !== 'true'
    &&
    certificateDescription &&
    certificateDescription.isCertificate
    && this.isCustodianOrgUser && this.progress < 100) {
      this.showProfileUpdatePopup = true;
    } else {
      this.courseConsumptionService.launchPlayer.emit();
      this.coursesService.setExtContentMsg(showExtUrlMsg);
    }
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
  private getCustodianOrgUser() {
    this.orgDetailsService.getCustodianOrgDetails().subscribe(custodianOrg => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        this.isCustodianOrgUser = true;
      } else {
        this.isCustodianOrgUser = false;
      }
    });
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

  openDiscussionForum() {
    this.checkUserRegistration();
  }

  checkUserRegistration() {
    this.showLoader = true;
    const data = {
      username: _.get(this.userService.userProfile, 'userName'),
      identifier: _.get(this.userService.userProfile, 'userId'),
    };
    this.discussionTelemetryService.contextCdata = [
      {
        id: this.courseId,
        type: 'Course'
      },
      {
        id: this.batchId,
        type: 'Batch'
      }
    ];
    this.discussionService.registerUser(data).subscribe((response) => {
      const userName = _.get(response, 'result.userName');
      const result = this.forumIds;
      this.router.navigate(['/discussion-forum'], {
        queryParams: {
          categories: JSON.stringify({ result }),
          userName: userName
        }
      });
    }, error => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  fetchForumIds() {
    const requestBody = this.prepareRequestBody();
    if (requestBody) {
      this.discussionService.getForumIds(requestBody).subscribe(forumDetails => {
        this.forumIds = _.map(_.get(forumDetails, 'result'), 'cid');
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
    }
  }

  prepareRequestBody() {
    const request = {
      identifier: [],
      type: ''
    };
    const isCreator = this.userService.userid === _.get(this.courseHierarchy, 'createdBy');
    const isMentor = this.permissionService.checkRolesPermissions(['COURSE_MENTOR']);
    if (isCreator) {
      request.identifier = [this.courseId];
      request.type = 'course';
    } else if (this.enrolledCourse) {
      request.identifier = [this.batchId];
      request.type = 'batch';
    } else if (isMentor) {
      // TODO: make getBatches() api call;
      request.identifier = [this.courseId];
      request.type = 'course';
    } else {
      return;
    }

    return request;
  }
  async goBack() {
    const previousPageUrl: any = this.courseConsumptionService.getCoursePagePreviousUrl;
    this.courseConsumptionService.coursePagePreviousUrl = '';
    if (this.tocId) {
      const navigateUrl = this.userService.loggedIn ? '/resources/play/collection' : '/play/collection';
      this.router.navigate([navigateUrl, this.tocId], { queryParams: { textbook: this.tocId } });
    } else if (!previousPageUrl) {
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
