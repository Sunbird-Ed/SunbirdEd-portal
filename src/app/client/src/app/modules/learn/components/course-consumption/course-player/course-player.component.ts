import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TocCardType } from '@project-sunbird/common-consumption';
import { CoursesService, PermissionService, UserService, GeneraliseLabelService } from '@sunbird/core';
import {
  ConfigService, ExternalUrlPreviewService, ICollectionTreeOptions, NavigationHelperService,
  ResourceService, ToasterService, WindowScrollService, ITelemetryShare, LayoutService
} from '@sunbird/shared';
import { IEndEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject, IStartEventInput, TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { combineLatest, merge, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import * as TreeModel from 'tree-model';
import { PopupControlService } from '../../../../../service/popup-control.service';
import { CourseBatchService, CourseConsumptionService, CourseProgressService } from './../../../services';
import { ContentUtilsServiceService } from '@sunbird/shared';
import { MimeTypeMasterData } from '@project-sunbird/common-consumption/lib/pipes-module/mime-type';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['course-player.component.scss']
})
export class CoursePlayerComponent implements OnInit, OnDestroy {

  public courseInteractObject: IInteractEventObject;
  public contentInteractObject: IInteractEventObject;
  public closeContentIntractEdata: IInteractEventEdata;
  private courseId: string;
  public batchId: string;
  public enrolledCourse = false;
  public contentId: string;
  public courseStatus: string;
  public flaggedCourse = false;
  public contentTitle: string;
  public playerConfig: any;
  public loader = true;
  public courseConsent = 'course-consent';
  public courseHierarchy: any;
  public istrustedClickXurl = false;
  public telemetryCourseImpression: IImpressionEventInput;
  public telemetryContentImpression: IImpressionEventInput;
  public telemetryCourseEndEvent: IEndEventInput;
  public telemetryCourseStart: IStartEventInput;
  public contentIds = [];
  public courseProgressData: any;
  public contentStatus = [];
  public contentDetails: { title: string, id: string, parentId: string }[] = [];
  public enrolledBatchInfo: any;
  public treeModel: any;
  public consentConfig: any;
  public showExtContentMsg = false;
  public previewContentRoles = ['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION'];
  public collectionTreeOptions: ICollectionTreeOptions;
  public unsubscribe = new Subject<void>();
  public showJoinTrainingModal = false;
  telemetryCdata: Array<{}> = [];
  pageId: string;
  cardType: TocCardType = TocCardType.COURSE;
  hasPreviewPermission = false;
  contentInteract: IInteractEventEdata;
  startInteract: IInteractEventEdata;
  continueInteract: IInteractEventEdata;
  shareLinkModal = false;
  telemetryShareData: Array<ITelemetryShare>;
  shareLink: string;
  progress = 0;
  isExpandedAll: boolean;
  isFirst = false;
  addToGroup = false;
  isModuleExpanded = false;
  isEnrolledCourseUpdated = false;
  layoutConfiguration;
  certificateDescription = {};
  showCourseCompleteMessage = false;
  showConfirmationPopup = false;
  popupMode: string;
  createdBatchId: string;
  courseMentor = false;
  progressToDisplay = 0;
  public todayDate = dayjs(new Date()).format('YYYY-MM-DD');
  public batchMessage: any;
  showDataSettingSection = false;

  @ViewChild('joinTrainingModal') joinTrainingModal;
  showJoinModal = false;
  tocId;
  groupId;
  constructor(
    public activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService,
    public windowScrollService: WindowScrollService,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    private userService: UserService,
    private toasterService: ToasterService,
    private resourceService: ResourceService,
    public popupControlService: PopupControlService,
    public courseBatchService: CourseBatchService,
    public permissionService: PermissionService,
    public externalUrlPreviewService: ExternalUrlPreviewService,
    public coursesService: CoursesService,
    private courseProgressService: CourseProgressService,
    private deviceDetectorService: DeviceDetectorService,
    public telemetryService: TelemetryService,
    private contentUtilsServiceService: ContentUtilsServiceService,
    public layoutService: LayoutService,
    public generaliseLabelService: GeneraliseLabelService
  ) {
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
  }
  ngOnInit() {
    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
    } else {
      this.courseMentor = false;
    }
    // Set consetnt pop up configuration here
    this.consentConfig = {
      tncLink: this.resourceService.frmelmnts.lbl.tncLabelLink,
      tncText: this.resourceService.frmelmnts.lbl.agreeToShareDetails
    };
    this.initLayout();
    this.courseProgressService.courseProgressData.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(courseProgressData => {
        this.courseProgressData = courseProgressData;
        this.progress = courseProgressData.progress ? Math.floor(courseProgressData.progress) : 0;
        if (this.activatedRoute.snapshot.queryParams.showCourseCompleteMessage === 'true') {
          this.showCourseCompleteMessage = this.progress >= 100 ? true : false;
          const queryParams = this.tocId ? { textbook: this.tocId } : {};
          this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams, replaceUrl: true });
        }
      });
    this.courseConsumptionService.updateContentConsumedStatus
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.courseHierarchy = _.cloneDeep(data.courseHierarchy);
        this.batchId = data.batchId;
        this.courseId = data.courseId;
        this.contentIds = this.courseConsumptionService.parseChildren(this.courseHierarchy);
        this.getContentState();
      });

    this.courseConsumptionService.launchPlayer
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        /* istanbul ignore else */
        if (_.get(this.courseHierarchy, 'children.length')) {
          const unconsumedUnit = this.courseHierarchy.children.find(item => !item.isUnitConsumed);
          const unit = unconsumedUnit ? unconsumedUnit : this.courseHierarchy;
          this.navigateToPlayerPage(unit);
        }
      });

    this.activatedRoute.queryParams
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(response => {
      this.addToGroup = Boolean(response.groupId);
      this.groupId = _.get(response, 'groupId');
      this.tocId = response.textbook || undefined;
    });

    this.courseConsumptionService.updateContentState
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.getContentState();
      });
    this.pageId = this.activatedRoute.snapshot.data.telemetry.pageid;
    merge(this.activatedRoute.params.pipe(
      mergeMap(({ courseId, batchId, courseStatus }) => {
        this.courseId = courseId;
        this.batchId = batchId;
        this.courseStatus = courseStatus;
        if (this.batchId) {
          this.telemetryCdata = [{ id: this.batchId, type: 'CourseBatch' }];
        }
        this.setTelemetryCourseImpression();
        const inputParams = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
        /* istanbul ignore else */
        if (this.batchId) {
          return combineLatest([
            this.courseConsumptionService.getCourseHierarchy(courseId, inputParams),
            this.courseBatchService.getEnrolledBatchDetails(this.batchId)
          ]).pipe(map(results => ({ courseHierarchy: results[0], enrolledBatchDetails: results[1] })));
        }

        return this.courseConsumptionService.getCourseHierarchy(courseId, inputParams)
          .pipe(map(courseHierarchy => ({ courseHierarchy })));
      })))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ courseHierarchy, enrolledBatchDetails }: any) => {
        this.courseHierarchy = courseHierarchy;
        this.layoutService.updateSelectedContentType.emit(this.courseHierarchy.contentType);
        this.isExpandedAll = this.courseHierarchy.children.length === 1 ? true : false;
        this.courseInteractObject = {
          id: this.courseHierarchy.identifier,
          type: 'Course',
          ver: this.courseHierarchy.pkgVersion ? this.courseHierarchy.pkgVersion.toString() : '1.0'
        };

        /* istanbul ignore else */
        if (this.courseHierarchy.status === 'Flagged') {
          this.flaggedCourse = true;
        }
        this.parseChildContent();

        if (this.batchId) {
          this.enrolledBatchInfo = enrolledBatchDetails;
          this.certificateDescription = this.courseBatchService.getcertificateDescription(this.enrolledBatchInfo);
          this.enrolledCourse = true;
          setTimeout(() => {
            this.setTelemetryStartEndData();
          }, 100);

          /* istanbul ignore else */
          if (_.hasIn(this.enrolledBatchInfo, 'status') && this.contentIds.length) {
            this.getContentState();
          }
          this.isCourseModifiedAfterEnrolment();
        } else if (this.courseStatus === 'Unlisted' || this.permissionService.checkRolesPermissions(this.previewContentRoles)
          || this.courseHierarchy.createdBy === this.userService.userid) {
          this.hasPreviewPermission = true;
        }
        this.showDataSettingSection = this.getDataSetting();
        this.loader = false;
      }, (error) => {
        this.loader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
      });

    this.courseBatchService.updateEvent.subscribe((event) => {
      setTimeout(() => {
        if (_.get(event, 'event') === 'issueCert' && _.get(event, 'value') === 'yes') {
          this.createdBatchId = _.get(event, 'batchId');
          this.showConfirmationPopup = true;
          this.popupMode = _.get(event, 'mode');
        }
      }, 1000);
    });
  }

  /**
   * @since - release-3.2.10
   * @param  {object} event
   * @description - it will navigate to add-certificate page or will trigger
   *                telemetry event based on the event mode.
   */
  onPopupClose(event) {
    if (_.get(event, 'mode') === 'add-certificates') {
      this.navigateToConfigureCertificate('add', _.get(event, 'batchId'));
      this.logTelemetry('choose-to-add-certificate');
    } else {
      this.logTelemetry('deny-add-certificate');
    }
    this.showConfirmationPopup = false;
  }

  /**
   * @since - release-3.2.10
   * @param  {string} mode
   * @param  {string} batchId
   * @description - It will navigate to certificate-configuration page.
   */
  navigateToConfigureCertificate(mode: string, batchId: string) {
    this.router.navigate([`/certs/configure/certificate`], {
      queryParams: {
        type: mode,
        courseId: this.courseId,
        batchId: batchId
      }
    });
  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
    pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
    if (layoutConfig != null) {
      this.layoutConfiguration = layoutConfig.layout;
    }
   });
  }

  private parseChildContent() {
    this.contentIds = [];
    const model = new TreeModel();
    const mimeTypeCount = {};
    this.treeModel = model.parse(this.courseHierarchy);
    this.treeModel.walk((node) => {
      if (node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
        if (mimeTypeCount[node.model.mimeType]) {
          mimeTypeCount[node.model.mimeType] += 1;
        } else {
          mimeTypeCount[node.model.mimeType] = 1;
        }
        this.contentIds.push(node.model.identifier);
      }
    });
  }

  private getContentState() {
    const req = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.contentIds,
      batchId: this.batchId
    };
    this.courseProgressService.getContentState(req)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.progressToDisplay = Math.floor((res.completedCount / this.courseHierarchy.leafNodesCount) * 100);
        this.contentStatus = res.content || [];
        this.calculateProgress();
      },
        err => console.log(err, 'content read api failed'));
  }

  public findContentById(id: string) {
    return this.treeModel.first(node => node.model.identifier === id);
  }

  public navigateToContent(event: any, collectionUnit?: any, id?): void {
    /* istanbul ignore else */
    if (!this.addToGroup) {
      this.logTelemetry(id, event.data);
    } else {
      this.logTelemetry('play-content-group', event.data);
    }

          /* istanbul ignore else */
      if (!_.isEmpty(event.event)) {
        this.navigateToPlayerPage(collectionUnit, event);
      }
  }

  private setTelemetryStartEndData() {
    this.telemetryCdata = [{ 'type': 'Course', 'id': this.courseId }];
    if (this.batchId) {
      this.telemetryCdata.push({ id: this.batchId, type: 'CourseBatch' });
    }
    if (this.groupId && !_.find(this.telemetryCdata, {id: this.groupId})) {
      this.telemetryCdata.push({
        id: this.groupId,
        type: 'Group'
      });
    }
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.telemetryCourseStart = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata
      },
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver,
        rollup: {
          l1: this.courseId
        }
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'play',
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
    this.telemetryCourseEndEvent = {
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver,
        rollup: {
          l1: this.courseId
        }
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'play'
      }
    };
  }

  private setTelemetryCourseImpression() {
    if (this.groupId && !_.find(this.telemetryCdata, {id: this.groupId})) {
      this.telemetryCdata.push({
        id: this.groupId,
        type: 'Group'
      });
    }
    this.telemetryCourseImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      },
      object: {
        id: this.courseId,
        type: 'Course',
        ver: '1.0',
        rollup: {
          l1: this.courseId
        }
      }
    };
  }

  isExpanded(index: number) {
    if (_.isUndefined(this.isExpandedAll) && !(this.isModuleExpanded) && index === 0) {
      return true;
    }
    return this.isExpandedAll;
  }

  collapsedChange(event: boolean, index: number) {
    if (event === false) {
      _.map(_.get(this.courseHierarchy, 'children'), (unit, key) => {
        unit.collapsed = key === index ? false : true;
      });
    }
  }

  navigateToPlayerPage(collectionUnit: any, event?) {
    if ((this.enrolledCourse && this.batchId) || this.hasPreviewPermission) {
      const navigationExtras: NavigationExtras = {
        queryParams: { batchId: this.batchId, courseId: this.courseId, courseName: this.courseHierarchy.name }
      };
      if (this.tocId) {
        navigationExtras.queryParams['textbook'] = this.tocId;
      }

      if (this.groupId) {
        navigationExtras.queryParams['groupId'] = this.groupId;
      }

      if (event && !_.isEmpty(event.event)) {
        navigationExtras.queryParams.selectedContent = event.data.identifier;
      } else if (collectionUnit.mimeType === 'application/vnd.ekstep.content-collection' && _.get(collectionUnit, 'children.length')
        && _.get(this.contentStatus, 'length')) {
        const parsedChildren = this.courseConsumptionService.parseChildren(collectionUnit);
        const collectionChildren = [];
        this.contentStatus.forEach(item => {
          if (parsedChildren.find(content => content === item.contentId)) {
            collectionChildren.push(item);
          }
        });

        /* istanbul ignore else */
        if (collectionChildren.length) {
          const selectedContent: any = collectionChildren.find(item => item.status !== 2);

          /* istanbul ignore else */
          if (selectedContent) {
            navigationExtras.queryParams.selectedContent = selectedContent.contentId;
          }
        }
      }
      this.router.navigate(['/learn/course/play', collectionUnit.identifier], navigationExtras);
    } else {
      this.batchMessage = this.generaliseLabelService.frmelmnts.lbl.joinTrainingToAcessContent;
      this.showJoinTrainingModal = true;
      if (this.courseHierarchy.batches && this.courseHierarchy.batches.length === 1) {
        this.batchMessage = this.validateBatchDate(this.courseHierarchy.batches);
      } else if (this.courseHierarchy.batches && this.courseHierarchy.batches.length === 2) {
        const allBatchList = _.filter(_.get(this.courseHierarchy, 'batches'), (batch) => {
          return !this.isEnrollmentAllowed(_.get(batch, 'enrollmentEndDate'));
        });
         this.batchMessage = this.validateBatchDate(allBatchList);
      }
    }
  }

  validateBatchDate(batch) {
    let batchMessage = this.generaliseLabelService.frmelmnts.lbl.joinTrainingToAcessContent;
    if (batch && batch.length === 1) {
      const currentDate = new Date();
      const batchStartDate = new Date(batch[0].startDate);
      const batchenrollEndDate = batch[0].enrollmentEndDate ? new Date(batch[0].enrollmentEndDate) : null;
      if (batchStartDate > currentDate) {
        batchMessage = (this.resourceService.messages.emsg.m009).replace('{startDate}', batch[0].startDate)
      } else if (batchenrollEndDate !== null && batchenrollEndDate < currentDate) {
        batchMessage = (this.resourceService.messages.emsg.m008).replace('{endDate}', batch[0].enrollmentEndDate)
      }
    }
    return batchMessage
  }

  isEnrollmentAllowed(enrollmentEndDate) {
    return dayjs(enrollmentEndDate).isBefore(this.todayDate);
  }

  calculateProgress() {
    /* istanbul ignore else */
    if (_.get(this.courseHierarchy, 'children')) {
      this.courseHierarchy.children.forEach(unit => {
        if (unit.mimeType === 'application/vnd.ekstep.content-collection') {
          let consumedContents = [];
          let flattenDeepContents = [];

          /* istanbul ignore else */
          if (_.get(unit, 'children.length')) {
            flattenDeepContents = this.courseConsumptionService.flattenDeep(unit.children).filter(item => item.mimeType !== 'application/vnd.ekstep.content-collection');
            /* istanbul ignore else */
            if (this.contentStatus.length) {
              consumedContents = flattenDeepContents.filter(o => {
                return this.contentStatus.some(({ contentId, status }) => o.identifier === contentId && status === 2);
              });
            }
          }

          unit.consumedContent = consumedContents.length;
          unit.contentCount = flattenDeepContents.length;
          unit.isUnitConsumed = consumedContents.length === flattenDeepContents.length;
          unit.isUnitConsumptionStart = false;

          if (consumedContents.length) {
            unit.progress = Math.round((consumedContents.length / flattenDeepContents.length) * 100);
            unit.isUnitConsumptionStart = true;
          } else {
            unit.progress = 0;
            unit.isUnitConsumptionStart = false;
          }

        } else {
          const consumedContent = this.contentStatus.filter(({ contentId, status }) => unit.identifier === contentId && status === 2);
          unit.consumedContent = consumedContent.length;
          unit.contentCount = 1;
          unit.isUnitConsumed = consumedContent.length === 1;
          unit.progress = consumedContent.length ? 100 : 0;
          unit.isUnitConsumptionStart = Boolean(consumedContent.length);
        }
      });
    }
  }

  logTelemetry(id, content?: {}) {
    if (this.batchId) {
      this.telemetryCdata = [{ id: this.batchId, type: 'CourseBatch' }];
    }
    const objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseHierarchy, _.get(content, 'identifier'));
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: this.telemetryCdata || []
      },
      edata: {
        id: id,
        type: 'CLICK',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'course-details',
      },
      object: {
        id: content ? _.get(content, 'identifier') : this.activatedRoute.snapshot.params.courseId,
        type: content ? _.get(content, 'contentType') : 'Course',
        ver: content ? `${_.get(content, 'pkgVersion')}` : `1.0`,
        rollup: this.courseConsumptionService.getRollUp(objectRollUp) || {}
      }
    };
    if (this.groupId && !_.find(this.telemetryCdata, {id: this.groupId})) {
      interactData.context.cdata.push({
        id: this.groupId,
        type: 'Group'
      });
    }
    this.telemetryService.interact(interactData);
  }


  getAllBatchDetails(event) {
    this.courseConsumptionService.getAllOpenBatches(event);
  }

  shareUnitLink(unit: any) {
    this.shareLink = `${this.contentUtilsServiceService.getCoursePublicShareUrl(this.courseId)}?moduleId=${unit.identifier}`;
    this.shareLinkModal = true;
    this.setTelemetryShareData(this.courseHierarchy);
  }

  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }

  closeSharePopup(id) {
    this.shareLinkModal = false;
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
        rollup: { l1: this.courseId }
      }
    };

    if (this.groupId && !_.find(this.telemetryCdata, {id: this.groupId})) {
      interactData.context.cdata.push({
        id: this.groupId,
        type: 'Group'
      });
    }
    this.telemetryService.interact(interactData);
  }

  ngOnDestroy() {
    if (this.joinTrainingModal && this.joinTrainingModal.deny) {
      this.joinTrainingModal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  isCourseModifiedAfterEnrolment() {
    this.coursesService.getEnrolledCourses().pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        const enrolledCourse = _.find(_.get(data, 'result.courses'), (course) => course.courseId === this.courseId);
        const enrolledCourseDateTime = new Date(enrolledCourse.enrolledDate).getTime();
        const courseLastUpdatedOn = new Date(this.courseHierarchy.lastUpdatedOn).getTime();
        this.isEnrolledCourseUpdated = (enrolledCourse && (enrolledCourseDateTime < courseLastUpdatedOn)) || false;
      });
  }

  onCourseCompleteClose() {
    this.showCourseCompleteMessage = false;
  }

  getDataSetting() {
    if (_.get(this.userService, 'userid') && (_.upperCase(_.get(this.courseHierarchy, 'userConsent')) === 'YES')
      && !this.courseConsumptionService.canViewDashboard(this.courseHierarchy) && this.enrolledCourse) {
        return true;
    }
    return false;
  }
}
