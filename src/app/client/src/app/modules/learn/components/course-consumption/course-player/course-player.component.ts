import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TocCardType } from '@project-sunbird/common-consumption'
import { CoursesService, PermissionService, UserService, GeneraliseLabelService } from '@sunbird/core';
import {
  ConfigService, ExternalUrlPreviewService, ICollectionTreeOptions, NavigationHelperService,
  ResourceService, ToasterService, WindowScrollService, ITelemetryShare, LayoutService
} from '@sunbird/shared';
import { IEndEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject, IStartEventInput, TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { combineLatest, merge, Subject, forkJoin, of} from 'rxjs';
import { map, mergeMap, takeUntil, catchError } from 'rxjs/operators';
import TreeModel from 'tree-model';
import { PopupControlService } from '../../../../../service/popup-control.service';
import { CourseBatchService, CourseConsumptionService, CourseProgressService } from './../../../services';
import { ContentUtilsServiceService, ConnectionService } from '@sunbird/shared';
import dayjs from 'dayjs';
import { NotificationServiceImpl } from '../../../../notification/services/notification/notification-service-impl';
import { CsCourseService } from '@project-sunbird/client-services/services/course/interface';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { CertificateDownloadAsPdfService } from 'sb-svg2pdf-v13';

@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['course-player.component.scss'],
  providers: [CertificateDownloadAsPdfService]
})
export class CoursePlayerComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
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
  public isCertificateReadyForDownload = false;
  public introductoryMaterialArray = [];
  public detailedIntroductoryMaterialArray: any[] = [];
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
  assessmentMaxAttempts: number;
  showJoinModal = false;
  tocId;
  groupId;
  showLastAttemptsModal = false;
  navigateToContentObject: any;
  _routerStateContentStatus: any;
  isConnected = false;
  dropdownContent = true;
  showForceSync = true;
  expiryDate = null;
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
    public generaliseLabelService: GeneraliseLabelService,
    private connectionService: ConnectionService,
    @Inject('CS_COURSE_SERVICE') private CsCourseService: CsCourseService,
    @Inject('SB_NOTIFICATION_SERVICE') private notificationService: NotificationServiceImpl,
    private certDownloadAsPdf: CertificateDownloadAsPdfService,
    private http: HttpClient,
  ) {
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
    // this.assessmentMaxAttempts = this.configService.appConfig.CourseConsumption.selfAssessMaxLimit;
  }
  ngOnInit() {
    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
    } else {
      this.courseMentor = false;
    }
    this.connectionService.monitor()
    .pipe(takeUntil(this.unsubscribe)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
    this.getUserProfileDetail();
    // Set consetnt pop up configuration here
    this.consentConfig = {
      tncLink: _.get(this.resourceService, 'frmelmnts.lbl.tncLabelLink'),
      tncText: _.get(this.resourceService, 'frmelmnts.lbl.agreeToShareDetails')
    };
    this.initLayout();
    this.courseProgressService.courseProgressData.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(courseProgressData => {
        this.courseProgressData = courseProgressData;
        this.progress = courseProgressData.progress ? Math.floor(courseProgressData.progress) : 0;
        if (this.activatedRoute.snapshot.queryParams.showCourseCompleteMessage === 'true') {
          this.showCourseCompleteMessage = this.progress >= 100 ? true : false;
          if (this.showCourseCompleteMessage) {
            this.notificationService.fetchNotificationList();
          }
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
          if (!_.get(event, 'isCertInBatch')) {
            this.showConfirmationPopup = true;
            this.popupMode = _.get(event, 'mode');
          }
        }
      }, 1000);
    });
    const isForceSynced = localStorage.getItem(this.courseId + '_isforce-sync');
        if (isForceSynced) {
          this.showForceSync = false;
        }
    this.loadIntroductorymaterial();
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
    const fieldsArray: Array<string> = ['progress', 'score'];
    const req: any = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.contentIds,
      batchId: this.batchId,
      fields: fieldsArray
    };
    this.CsCourseService
      .getContentState(req, { apiPath: '/content/course/v1' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        const _parsedResponse = this.courseProgressService.getContentProgressState(req, res);
        this.progressToDisplay = Math.floor((_parsedResponse.completedCount / this.courseHierarchy.leafNodesCount) * 100);
        if(this.progressToDisplay >= 100) {
          this.isCertificateReadyForDownload = true;
        }
        this.contentStatus = _parsedResponse.content || [];
        this._routerStateContentStatus = _parsedResponse;
        this.markContentVisibility(this.courseHierarchy.children, this.contentStatus, this.progressToDisplay)
        this.calculateProgress();
      }, error => {
        console.log('Content state read CSL API failed ', error);
      });
  }

  public findContentById(id: string) {
    return this.treeModel.first(node => node.model.identifier === id);
  }

  public navigateToContent(event: any, collectionUnit?: any, id?): void {
    this.navigateToContentObject = {
      event: event,
      collectionUnit: collectionUnit,
      id: id
    };
    if (_.get(event, 'event.isDisabled')) {
      return this.toasterService.error(_.get(this.resourceService, 'frmelmnts.lbl.selfAssessMaxAttempt'));
    } else if (_.get(event, 'event.isLastAttempt')) {
      this.showLastAttemptsModal = true;
    } else {
      this._navigateToContent();
    }
  }

  private _navigateToContent() {
    this.showLastAttemptsModal = false;
    /* istanbul ignore else */
    if (!this.addToGroup) {
      this.logTelemetry(this.navigateToContentObject.id, this.navigateToContentObject.event.data);
    } else {
      this.logTelemetry('play-content-group', this.navigateToContentObject.event.data);
    }
    /* istanbul ignore else */
    setTimeout(() => {
        if (!this.showLastAttemptsModal && !_.isEmpty(this.navigateToContentObject.event.event)) {
        this.navigateToPlayerPage(this.navigateToContentObject.collectionUnit, this.navigateToContentObject.event);
      }
    }, 100);
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
        queryParams: { batchId: this.batchId, courseId: this.courseId, courseName: this.courseHierarchy.name },
        state: { contentStatus: this._routerStateContentStatus }
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
      this.batchMessage = _.get(this.generaliseLabelService, 'frmelmnts.lbl.joinTrainingToAcessContent');
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
        batchMessage = (this.resourceService.messages.emsg.m009).replace('{startDate}', batch[0].startDate);
      } else if (batchenrollEndDate !== null && batchenrollEndDate < currentDate) {
        batchMessage = (this.resourceService.messages.emsg.m008).replace('{endDate}', batch[0].enrollmentEndDate);
      }
    }
    return batchMessage;
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
            flattenDeepContents = this.courseConsumptionService.flattenDeep(unit.children).filter(item => item.mimeType !== 'application/vnd.ekstep.content-collection' && item.mimeType !== 'application/vnd.sunbird.question');
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
    const userId = _.get(this.userService, 'userid');
    const isConsentGiven = _.upperCase(_.get(this.courseHierarchy, 'userConsent')) === 'YES';
    const isMinor = _.get(this.userService, 'userProfile')?.isMinor;
    const isManagedUser = _.get(this.userService, 'userProfile').managedBy;
    const canViewDashboard = this.courseConsumptionService.canViewDashboard(this.courseHierarchy);
    return (userId && isConsentGiven && (!isMinor || isManagedUser) && !canViewDashboard && this.enrolledCourse);
  }
  dropdownMenu() {
    this.dropdownContent = !this.dropdownContent;
  }
  public forceSync() {
    localStorage.setItem(this.courseId + '_isforce-sync', 'true');
    this.showForceSync = false;
    this.closeSharePopup('force-sync');
    this.dropdownContent = !this.dropdownContent;
    const req = {
      'courseId': this.courseId,
      'batchId': this.batchId,
      'userId': _.get(this.userService, 'userid')
    };
    this.CsCourseService.updateContentState(req, { apiPath: '/content/course/v1' })
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((res) => {
      this.toasterService.success(this.resourceService.frmelmnts.lbl.forceSyncsuccess);
    }, error => {
      console.log('Content state update CSL API failed ', error);
    });
  }

  public downloadCertificate(): void {
    const userId = _.get(this.userService, 'userid');
    if (!userId) {
      this.toasterService.error('User ID not found.');
      console.error('User ID is missing, cannot make API call.');
      return;
    }
   
    const requestBody = {
      filters: {
        recipient: {
          id: {
            eq: userId
          }
        }
      }
    };
   
    const apiUrl = 'learner/rc/certificate/v1/search';
   
    this.http.post<any[]>(apiUrl, requestBody, { withCredentials: true }) // Specify the expected response type as an array
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          const certificateResponse = response;
   
          if (certificateResponse && certificateResponse.length > 0) {
            const currentCourseId = this.courseId; // Get current courseId from the component
            const matchingCertificate = certificateResponse.find(cert => _.get(cert, 'training.id') === currentCourseId);

            const courseName = _.get(matchingCertificate, 'name');
            this.CsCourseService.getSignedCourseCertificate(_.get(matchingCertificate, 'osid'))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((resp) => {
              if (_.get(resp, 'printUri')) {
                this.toasterService.success('Certificate download initiated.');
                this.certDownloadAsPdf.download(resp.printUri, null, courseName);
              }
              // } else if (_.get(course, 'certificates.length')) {
              //   this.downloadPdfCertificate(course.certificates[0]);
              // } else {
              //   this.toasterService.error(this.resourceService.messages.emsg.m0076);
              // }
            }, error => {
              console.error('Error downloading certificate:', error);
              this.toasterService.error(this.resourceService.messages.emsg.m0076);
            });
          } else {
            console.log('No certificates found in the API response.');
            this.toasterService.info('No certificates found for your account.');
          }
        },
        (error) => {
          console.error('Certificate API Error:', error);
          this.toasterService.error('Failed to fetch certificate data from the API.');
        }
      );
  }


  loadIntroductorymaterial() {
    if (!this.courseId) {
      console.error('Course ID is not available.');
      this.toasterService.error('Course ID is missing, cannot load introductory material.');
      return;
    }

    const apiUrl = `api/content/v1/read/${this.courseId}`;

    this.http.get<any>(apiUrl)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.introductoryMaterialArray = []; // Reset
          this.detailedIntroductoryMaterialArray = []; // Reset

          if (response && response.result && response.result.content && response.result.content.introductoryMaterial) {
            try {
              const introductoryMaterialString = response.result.content.introductoryMaterial;
              const parsedMaterial = JSON.parse(introductoryMaterialString);

              if (Array.isArray(parsedMaterial) && parsedMaterial.length > 0) {
                this.introductoryMaterialArray = parsedMaterial.sort((a, b) => a.index - b.index);

                const detailObservables = this.introductoryMaterialArray
                  .map(material => {
                    const doId = material.identifier; 
                    if (!doId) {
                      console.warn('Introductory material item is missing an identifier:', material);
                      return of(null); // Return an observable of null if id is missing
                    }

                    const detailApiUrl = `/api/content/v1/read/${doId}`;
                    return this.http.get<any>(detailApiUrl).pipe(
                      map(detailResponse => {
                        return detailResponse.result && detailResponse.result.content ? detailResponse.result.content : null;
                      }),
                      catchError(err => {
                        console.error(`Failed to fetch details for DO_ID ${doId}:`, err);
                        return of(null); // Return null for this item on error, so forkJoin doesn't fail completely
                      })
                    );
                  })
                  .filter(obs => obs !== null); // Filter out observables that were initially null (e.g. missing doId)

                if (detailObservables.length > 0) {
                  forkJoin(detailObservables)
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe(
                      (detailedResults) => {
                        this.detailedIntroductoryMaterialArray = detailedResults.filter(res => res !== null);
                        // this.detailedIntroductoryMaterialArray.forEach(item => {
                        //   item.appIcon = "assets/common-consumption/images/sprite.svg#doc";
                        // });
                        // console.log("detailedIntroductoryMaterialArray populated:", this.detailedIntroductoryMaterialArray);
                        // console.log("courseHierarchy :", this.courseHierarchy);
                      },
                      (forkJoinError) => {
                        // This error block is for errors in forkJoin itself, though individual errors are handled above.
                        console.error('Error in forkJoin for detailed introductory materials:', forkJoinError);
                      }
                    );
                } else if (this.introductoryMaterialArray.length > 0) {
                  console.warn('No valid identifiers found in introductory materials to fetch details.');
                }

              } else {
                // Parsed material is not an array or is empty
                console.log('No introductory material items found after parsing, or the format is not an array.');
              }
            } catch (error) {
              console.error('Error parsing introductory material JSON:', error);
            }
          } else {
            // No introductoryMaterial field in the initial response or it's empty
            console.log('No "introductoryMaterial" field in the API response, or it is empty.');
          }
        },
        (error) => {
          this.toasterService.error('Failed to fetch the initial list of introductory material.');
          console.error('API error fetching initial introductory material list:', error);
          this.introductoryMaterialArray = []; // Ensure reset on error
          this.detailedIntroductoryMaterialArray = []; // Ensure reset on error
        }
      );
  }

  public handleIntroItemClick(event: any, introItem: any): void {
    if (introItem && introItem.mimeType === 'application/pdf') {
      const pdfUrl = introItem.previewUrl || introItem.artifactUrl;
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
        this.logTelemetry('view-pdf-intro-item', introItem);
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0004); // Or a more specific "PDF URL not found" message
      }
    } else {
      this.navigateToContent(event, introItem, 'child-item');
    }
  }

  markContentVisibility(
    sections = [],
    contentStatus = [],
    progress = 0
  ) {
    if (!Array.isArray(sections) || !Array.isArray(contentStatus)) {
      return;
    }

    const statusMap = new Map(contentStatus.map(cs => [cs.contentId, cs.status]));
    let showNext = true;

    _.forEach(sections, section => {
      if (!section?.children?.length) return;

      _.forEach(section.children, (child, i) => {
        const status = statusMap.get(child.identifier);
        let showContent = false;

        if (progress === 0) {
          showContent = section.index === 1 && i === 0;
        } else if (status === 2 || status === 1) {
          showContent = true;
          if (status === 1) showNext = false;
        } else if (status === 0 && showNext) {
          const currentIndex = _.findIndex(contentStatus, cs => cs.contentId === child.identifier);
          const allPrevComplete = _.every(_.slice(contentStatus, 0, currentIndex), cs => cs.status === 2);
          if (allPrevComplete) {
            showContent = true;
            showNext = false;
          }
        }
        child.showContent = showContent;
      });
    });
  }

  async getUserProfileDetail() {
    var profileDetails: any = localStorage.getItem('userProfile');
  
    const payload = {
      "request": {
        "filters": {
          "code": [JSON.parse(JSON.parse(profileDetails).framework.profileConfig).trainingGroup]
        }
      }
    };
  
    this.expiryDate = 'NA'; 
    let matchFound = false;
  
    this.userService.expiryDate(payload).subscribe(async res => {
      console.log("Api called ", res, res.result.content[0].expiry_date);
      var doIdLink = window.location.href.split('/');
      var currentDoId;
  
      doIdLink.filter(item => {
        if (item.includes('do')) {
          currentDoId = item;
        }
      });
  
      res.result.content.filter(item => {
        console.log("currentDoId", item, currentDoId);
        if (item.children && item.children.includes(currentDoId)) {
          this.expiryDate = item.expiry_date;
          matchFound = true;
        }
      });
  
      if (!matchFound) {
        this.expiryDate = 'NA';
      }
  
      console.log("Final expiryDate", this.expiryDate);
    }, err => {
      console.log("Error : ", err);
      this.expiryDate = 'NA';
    });
  }

}
