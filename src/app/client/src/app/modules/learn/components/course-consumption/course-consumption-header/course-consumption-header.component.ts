import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CourseConsumptionService, CourseProgressService } from './../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CoursesService, PermissionService, CopyContentService,
  OrgDetailsService, UserService, GeneraliseLabelService,  } from '@sunbird/core';
import {
  ResourceService, ToasterService, ContentData, ContentUtilsServiceService, ITelemetryShare,
  ExternalUrlPreviewService, UtilService, ConnectionService, OfflineCardService, ServerResponse
} from '@sunbird/shared';
import { IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import dayjs from 'dayjs';
import { GroupsService } from '../../../../groups/services/groups/groups.service';
import { NavigationHelperService } from '@sunbird/shared';
import { CourseBatchService } from './../../../services';
import { DiscussionService } from '../../../../discussion/services/discussion/discussion.service';
import { FormService } from '../../../../core/services/form/form.service';
import { IForumContext } from '../../../interfaces';
import { ContentManagerService } from '../../../../public/module/offline/services';
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
   * input data for fetchforum Ids
   */
  fetchForumIdReq: IForumContext;
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
  @Input() layoutConfiguration;
  isGroupAdmin = false;
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
  batchRemaningTime: any;
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
  showLoader = false;
  batchEndCounter: number;
  showBatchCounter: boolean;
  isDesktopApp = false;
  isConnected = true;
  contentDownloadStatus = {};
  showUpdate = false;
  showExportLoader = false;
  showModal = false;
  showDownloadLoader = false;
  disableDelete = false;
  isAvailableLocally = false;
  showDeleteModal = false;
  batchList = [];
  enrollmentEndDate: string;
  todayDate = dayjs(new Date()).format('YYYY-MM-DD');
  showError = false;

  constructor(private activatedRoute: ActivatedRoute, public courseConsumptionService: CourseConsumptionService,
    public resourceService: ResourceService, public router: Router, public permissionService: PermissionService,
    public toasterService: ToasterService, public copyContentService: CopyContentService, private changeDetectorRef: ChangeDetectorRef,
    private courseProgressService: CourseProgressService, public contentUtilsServiceService: ContentUtilsServiceService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public coursesService: CoursesService, private userService: UserService,
    private telemetryService: TelemetryService, private groupService: GroupsService,
    private navigationHelperService: NavigationHelperService, public orgDetailsService: OrgDetailsService,
    public generaliseLabelService: GeneraliseLabelService, public connectionService: ConnectionService,
    public courseBatchService: CourseBatchService, private utilService: UtilService, public contentManagerService: ContentManagerService,
    private formService: FormService, private offlineCardService: OfflineCardService,
    public discussionService: DiscussionService, public discussionTelemetryService: DiscussionTelemetryService) { }

  showJoinModal(event) {
    this.courseConsumptionService.showJoinCourseModal.emit(event);
  }

  ngOnInit() {
    this.isGroupAdmin = _.get(this.groupService, 'groupData.isAdmin');
    this.isDesktopApp = this.utilService.isDesktopApp;
    if (this.isDesktopApp) {
      this.connectionService.monitor().pipe(takeUntil(this.unsubscribe)).subscribe(isConnected => {
        this.isConnected = isConnected;
      });
      this.contentManagerService.contentDownloadStatus$.pipe(takeUntil(this.unsubscribe)).subscribe( contentDownloadStatus => {
        this.contentDownloadStatus = contentDownloadStatus;
        this.checkDownloadStatus();
      });
    }
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
        this.getAllBatchDetails();
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
    this.generateDataForDF();
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

  getTimeRemaining(endTime) {
    this.getFormData();
    const countDownDate = new Date(endTime).getTime() + 1000 * 60 * 60 * 24;
    const now = new Date().getTime();
    const total = countDownDate - now;
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    if (days >= 0) {
      this.showBatchCounter = this.batchEndCounter >= days;
      if (this.showBatchCounter) {
        return days + ' ' + 'day(s)' + ' ' + hours + 'h' + ' ' + minutes + 'm';
      }
    } else {
      this.showBatchCounter = false;
    }
    return;
  }

  getFormData() {
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe((data: any) => {
      _.forEach(data, (value, key) => {
        if ('frmelmnts.tab.courses' === value.title) {
          this.batchEndCounter = value.batchEndCounter || null;
        }
      });
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
    // const IsStoredLocally = localStorage.getItem('isCertificateNameUpdated_' + this.profileInfo.id) || 'false' ;
    // const certificateDescription = this.courseBatchService.getcertificateDescription(this.enrolledBatchInfo);
    // if (IsStoredLocally !== 'true'
    // &&
    // certificateDescription &&
    // certificateDescription.isCertificate
    // && this.isCustodianOrgUser && this.progress < 100) {
    //   this.showProfileUpdatePopup = true;
    // } else {
      this.courseConsumptionService.launchPlayer.emit();
      this.coursesService.setExtContentMsg(showExtUrlMsg);
    // }
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
    const leftTimeDate = dayjs(this.batchEndDate).format('MMM DD, YYYY');
    this.batchRemaningTime = this.getTimeRemaining(leftTimeDate);
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
        type: content ? _.get(content, 'primaryCategory') : 'Course',
        ver: content ? `${_.get(content, 'pkgVersion')}` : `1.0`,
        rollup: this.courseConsumptionService.getRollUp(objectRollUp) || {}
      }
    };
    this.telemetryService.interact(interactData);
  }
  generateDataForDF() {
    const isCreator = this.userService.userid === _.get(this.courseHierarchy, 'createdBy');
    const isMentor = this.permissionService.checkRolesPermissions(['COURSE_MENTOR']);
    if (isCreator) {
      this.fetchForumIdReq = {
        type: 'course',
        identifier: [this.courseId]
      };
    } else if (this.enrolledCourse) {
      this.fetchForumIdReq = {
        type: 'batch',
        identifier: [this.batchId]
      };
    } else if (isMentor) {
      // TODO: make getBatches() api call;
      this.fetchForumIdReq = {
        type: 'course',
        identifier: [this.courseId]
      };
    }
  }
  async goBack() {
    const previousPageUrl: any = this.courseConsumptionService.getCoursePagePreviousUrl;
    this.courseConsumptionService.coursePagePreviousUrl = '';
    if (this.isDesktopApp && !this.isConnected) {
      this.router.navigate(['/mydownloads'], { queryParams: { selectedTab: 'mydownloads' } });
      return;
    }
    if (this.tocId) {
      const navigateUrl = this.userService.loggedIn ? '/resources/play/collection' : '/play/collection';
      this.router.navigate([navigateUrl, this.tocId], { queryParams: { textbook: this.tocId } });
    } else if (!previousPageUrl) {
      this.router.navigate(['/resources'], { queryParams: { selectedTab: 'course' } });
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
  checkStatus(status) {
    this.checkDownloadStatus();
    return this.utilService.getPlayerDownloadStatus(status, this.courseHierarchy);
  }
  checkDownloadStatus() {
    if (this.courseHierarchy) {
      const downloadStatus = ['CANCELED', 'CANCEL', 'FAILED', 'DOWNLOAD'];
      const status = this.contentDownloadStatus[this.courseHierarchy.identifier];
      this.courseHierarchy['downloadStatus'] = _.isEqual(downloadStatus, status) ? 'DOWNLOAD' :
      (_.includes(['INPROGRESS', 'RESUME', 'INQUEUE'], status) ? 'DOWNLOADING' : _.isEqual(status, 'COMPLETED') ? 'DOWNLOADED' : status);
    }
  }
  updateCollection(collection) {
    collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.logTelemetry('update-collection');
    const request = {
      contentId: collection.identifier
    };
    this.contentManagerService.updateContent(request).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
      this.showUpdate = false;
    }, (err) => {
      this.showUpdate = true;
      const errorMessage = !this.isConnected ? _.replace(this.resourceService.messages.smsg.m0056, '{contentName}', collection.name) :
        this.resourceService.messages.fmsg.m0096;
      this.toasterService.error(errorMessage);
    });
  }

  exportCollection(collection) {
    this.logTelemetry('export-collection');
    this.showExportLoader = true;
    this.contentManagerService.exportContent(collection.identifier)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.showExportLoader = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0059);
      }, error => {
        this.showExportLoader = false;
        if (_.get(error, 'error.responseCode') !== 'NO_DEST_FOLDER') {
          this.toasterService.error(this.resourceService.messages.fmsg.m0091);
        }
      });
  }

  isYoutubeContentPresent(collection) {
    this.logTelemetry('is-youtube-in-collection');
    this.showModal = this.offlineCardService.isYoutubeContent(collection);
    if (!this.showModal) {
      this.downloadCollection(collection);
    }
  }

  downloadCollection(collection) {
    this.showDownloadLoader = true;
    this.disableDelete = false;
    collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.logTelemetry('download-collection');
    this.contentManagerService.downloadContentId = collection.identifier;
    this.contentManagerService.downloadContentData = collection;
    this.contentManagerService.failedContentName = collection.name;
    this.contentManagerService.startDownload({}).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.contentManagerService.downloadContentId = '';
      this.contentManagerService.downloadContentData = {};
      this.showDownloadLoader = false;
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    }, error => {
      this.disableDelete = true;
      this.showDownloadLoader = false;
      this.contentManagerService.downloadContentId = '';
      this.contentManagerService.downloadContentData = {};
      this.contentManagerService.failedContentName = '';
      collection['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
        this.toasterService.error(this.resourceService.messages.fmsg.m0090);
          }
    });
  }

  deleteCollection(collectionData) {
    this.disableDelete = true;
    this.logTelemetry('delete-collection');
    const request = {request: {contents: [collectionData.identifier]}};
    this.contentManagerService.deleteContent(request).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.toasterService.success(this.resourceService.messages.stmsg.desktop.deleteCourseSuccessMessage);
      collectionData['downloadStatus'] = 'DOWNLOAD';
      collectionData['desktopAppMetadata.isAvailable'] = false;
      this.goBack();
    }, err => {
      this.disableDelete = false;
      this.toasterService.error(this.resourceService.messages.etmsg.desktop.deleteCourseErrorMessage);
    });
  }
   /**
     * @description - navigate to the DF Page when the event is emited from the access-discussion component
     * @param  {} routerData
     */
  assignForumData(routerData) {
    this.router.navigate(['/discussion-forum'], {
      queryParams: {
        categories: JSON.stringify({ result: routerData.forumIds }),
        userId: routerData.userId
      }
    });
  }

  isEnrollmentAllowed(enrollmentEndDate) {
    return dayjs(enrollmentEndDate).isBefore(this.todayDate);
  }

  isValidEnrollmentEndDate(enrollmentEndDate) {
    return !!enrollmentEndDate;
  }

  getAllBatchDetails() {
    this.batchList = [];
    const searchParams: any = {
      filters: {
        status: '1',
        courseId: this.courseId
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    searchParams.filters.enrollmentType = 'open';
    this.courseBatchService.getAllBatchDetails(searchParams).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data: ServerResponse) => {
        if (data.result.response.content && data.result.response.content.length > 0) {
          this.batchList = data.result.response.content;
          this.enrollmentEndDate = _.get(this.batchList[0], 'enrollmentEndDate');
        }
      },
      (err: ServerResponse) => {
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
  }
}
