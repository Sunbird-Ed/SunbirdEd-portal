import { combineLatest, Subject } from 'rxjs';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UserService, PermissionService, CoursesService } from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash-es';
import {
  WindowScrollService, ILoaderMessage, ConfigService, ICollectionTreeOptions, NavigationHelperService,
  ToasterService, ResourceService, ExternalUrlPreviewService, ContentUtilsServiceService
} from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService, CourseProgressService } from './../../../services';
import { INoteData } from '@sunbird/notes';
import { IImpressionEventInput, IEndEventInput, IStartEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as TreeModel from 'tree-model';

@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html'
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

  public collectionTreeNodes: any;

  public contentTitle: string;

  public playerConfig: any;

  public loader = true;

  public showError = false;

  public enableContentPlayer = false;

  public courseHierarchy: any;

  public readMore = false;

  public createNoteData: INoteData;

  public curriculum = [];

  public istrustedClickXurl = false;

  public showNoteEditor = false;

  public telemetryCourseImpression: IImpressionEventInput;

  public telemetryContentImpression: IImpressionEventInput;

  public telemetryCourseEndEvent: IEndEventInput;

  public telemetryCourseStart: IStartEventInput;

  public contentIds = [];

  public courseProgressData: any;

  public contentStatus: any;

  public contentDetails = [];

  public enrolledBatchInfo: any;

  public treeModel: any;

  public nextPlaylistItem: any;

  public prevPlaylistItem: any;

  public contributions: any;

  public noContentToPlay = 'No content to play';

  public showExtContentMsg = false;

  private objectRollUp: any;

  showContentCreditsModal: boolean;

  telemetryCdata: Array<{}>;

  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  public previewContentRoles = ['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION'];

  public collectionTreeOptions: ICollectionTreeOptions;

  public unsubscribe = new Subject<void>();
  playerOption: any;
  constructor(public activatedRoute: ActivatedRoute, private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService, public windowScrollService: WindowScrollService,
    public router: Router, public navigationHelperService: NavigationHelperService, private userService: UserService,
    private toasterService: ToasterService, private resourceService: ResourceService,
    private cdr: ChangeDetectorRef, public courseBatchService: CourseBatchService, public permissionService: PermissionService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public coursesService: CoursesService,
    private courseProgressService: CourseProgressService, private deviceDetectorService: DeviceDetectorService,
    private contentUtilsService: ContentUtilsServiceService) {
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
    this.playerOption = {
      showContentRating: true
    };
  }
  ngOnInit() {
    this.activatedRoute.params.pipe(first(),
      mergeMap(({courseId, batchId, courseStatus}) => {
        this.courseId = courseId;
        this.batchId = batchId;
        this.courseStatus = courseStatus;
        this.telemetryCdata = [{id: this.courseId , type: 'Course'}];
        if (this.batchId) {
          this.telemetryCdata.push({id: this.batchId , type: 'CourseBatch'});
        }
        this.setTelemetryCourseImpression();
        const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
        if (this.batchId) {
          return combineLatest(
            this.courseConsumptionService.getCourseHierarchy(courseId, inputParams),
            this.courseBatchService.getEnrolledBatchDetails(this.batchId),
          ).pipe(map(results => ({ courseHierarchy: results[0], enrolledBatchDetails: results[1] })));
        }
        return this.courseConsumptionService.getCourseHierarchy(courseId, inputParams)
          .pipe(map(courseHierarchy => ({ courseHierarchy })));
      })).subscribe(({courseHierarchy, enrolledBatchDetails}: any) => {
        this.courseHierarchy = courseHierarchy;
        this.contributions = _.join(_.map(this.courseHierarchy.contentCredits, 'name'));
        this.courseInteractObject = {
          id: this.courseHierarchy.identifier,
          type: 'Course',
          ver: this.courseHierarchy.pkgVersion ? this.courseHierarchy.pkgVersion.toString() : '1.0'
        };
        if (this.courseHierarchy.status === 'Flagged') {
          this.flaggedCourse = true;
        }
        this.parseChildContent();
        if (this.batchId) {
          this.enrolledBatchInfo = enrolledBatchDetails;
          this.enrolledCourse = true;
          setTimeout(() => {
            this.setTelemetryStartEndData();
          }, 100);
          if (_.hasIn(this.enrolledBatchInfo, 'status') && this.contentIds.length) {
            this.getContentState();
            this.subscribeToQueryParam();
          }
        } else if (this.courseStatus === 'Unlisted' || this.permissionService.checkRolesPermissions(this.previewContentRoles)
          || this.courseHierarchy.createdBy === this.userService.userid) {
          this.subscribeToQueryParam();
        }
        this.collectionTreeNodes = { data: this.courseHierarchy };
        this.loader = false;
      }, (error) => {
        this.loader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
    });
     this.courseProgressService.courseProgressData.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(courseProgressData => this.courseProgressData = courseProgressData);
  }
  private parseChildContent() {
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
        this.contentDetails.push({ id: node.model.identifier, title: node.model.name });
        this.contentIds.push(node.model.identifier);
      }
    });
    let videoContentCount = 0 ;
    _.forEach(mimeTypeCount, (value, key) => {
      if (key.includes('video')) {
        videoContentCount = videoContentCount + value;
      } else {
        this.curriculum.push({ mimeType: key, count: value });
      }
    });
    if (videoContentCount > 0) {
      this.curriculum.push({ mimeType: 'video', count: videoContentCount });
    }
  }
  private getContentState() {
    const req = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.contentIds,
      batchId: this.batchId
    };
    this.courseConsumptionService.getContentState(req).pipe(first())
      .subscribe(res => this.contentStatus = res.content,
        err => console.log(err, 'content read api failed'));
  }
  private subscribeToQueryParam() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe))
    .subscribe(({contentId}) => {
      if (contentId) {
        const content = this.findContentById(contentId);
        this.objectRollUp = this.contentUtilsService.getContentRollup(content);
        const isExtContentMsg = this.coursesService.showExtContentMsg ? this.coursesService.showExtContentMsg : false;
        if (content) {
          this.OnPlayContent({ title: _.get(content, 'model.name'), id: _.get(content, 'model.identifier') },
            isExtContentMsg);
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
          this.closeContentPlayer();
        }
      } else {
        this.closeContentPlayer();
      }
    });
  }
  public findContentById(id: string) {
    return this.treeModel.first(node => node.model.identifier === id);
  }
  private OnPlayContent(content: { title: string, id: string }, showExtContentMsg?: boolean) {
    if (content && content.id && ((this.enrolledCourse && !this.flaggedCourse &&
      this.enrolledBatchInfo.status > 0) || this.courseStatus === 'Unlisted'
      || this.permissionService.checkRolesPermissions(this.previewContentRoles)
      || this.courseHierarchy.createdBy === this.userService.userid)) {
      this.contentId = content.id;
      this.setTelemetryContentImpression();
      this.setContentNavigators();
      this.playContent(content, showExtContentMsg);
    } else {
      this.closeContentPlayer();
    }
  }
  private setContentNavigators() {
    const index = _.findIndex(this.contentDetails, ['id', this.contentId]);
    this.prevPlaylistItem = this.contentDetails[index - 1];
    this.nextPlaylistItem = this.contentDetails[index + 1];
  }
  private playContent(data: any, showExtContentMsg?: boolean): void {
    this.enableContentPlayer = false;
    this.loader = true;
    const options: any = { courseId: this.courseId };
    if (this.batchId) {
      options.batchId = this.batchId;
    }
    this.courseConsumptionService.getConfigByContent(data.id, options).pipe(first())
      .subscribe(config => {
        if (config.context) {
          config.context.objectRollup = this.objectRollUp;
        }
        this.setContentInteractData(config);
        this.loader = false;
        this.playerConfig = config;
        if ((config.metadata.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl && !(this.istrustedClickXurl))
          || (config.metadata.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl && showExtContentMsg)) {
          setTimeout(() => this.showExtContentMsg = true, 5000);
        } else {
          this.showExtContentMsg = false;
        }
        this.enableContentPlayer = true;
        this.contentTitle = data.title;
        this.windowScrollService.smoothScroll('app-player-collection-renderer', 500);
      }, (err) => {
        this.loader = false;
        this.toasterService.error(this.resourceService.messages.stmsg.m0009);
      });
  }
  public navigateToContent(content: { title: string, id: string }): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'contentId': content.id },
      relativeTo: this.activatedRoute
    };
    const playContentDetail = this.findContentById(content.id);
    if (playContentDetail.model.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
      this.showExtContentMsg = false;
      this.istrustedClickXurl = true;
      this.externalUrlPreviewService.generateRedirectUrl(playContentDetail.model, this.userService.userid, this.courseId, this.batchId);
    }
    if ((this.batchId && !this.flaggedCourse && this.enrolledBatchInfo.status)
      || this.courseStatus === 'Unlisted' || this.permissionService.checkRolesPermissions(this.previewContentRoles)
      || this.courseHierarchy.createdBy === this.userService.userid) {
      this.router.navigate([], navigationExtras);
    }
  }
  public contentProgressEvent(event) {
    if (!this.batchId || _.get(this.enrolledBatchInfo, 'status') !== 1) {
      return;
    }
    const eid = event.detail.telemetryData.eid;
    if (eid === 'END' && !this.validEndEvent(event)) {
      return;
    }
    const request: any = {
      userId: this.userService.userid,
      contentId: this.contentId,
      courseId: this.courseId,
      batchId: this.batchId,
      status: eid === 'END' ? 2 : 1
    };
    this.courseConsumptionService.updateContentsState(request).pipe(first())
    .subscribe(updatedRes => this.contentStatus = updatedRes.content,
      err => console.log('updating content status failed', err));
  }
  private validEndEvent(event) {
    const playerSummary: Array<any> = _.get(event, 'detail.telemetryData.edata.summary');
    const contentMimeType = _.get(this.findContentById(this.contentId), 'model.mimeType');
    const validSummary = (summaryList: Array<any>) => (percentage: number) => _.find(summaryList, (requiredProgress =>
      summary => summary && summary.progress >= requiredProgress)(percentage));
    if (validSummary(playerSummary)(20) && ['video/x-youtube', 'video/mp4', 'video/webm'].includes(contentMimeType)) {
        return true;
    } else if (validSummary(playerSummary)(0) &&
        ['application/vnd.ekstep.h5p-archive', 'application/vnd.ekstep.html-archive'].includes(contentMimeType)) {
      return true;
    } else if (validSummary(playerSummary)(100)) {
      return true;
    }
    return false;
  }
  public closeContentPlayer() {
    try {
      window.frames['contentPlayer'].contentDocument.body.onunload({});
    } catch {

    } finally {
      setTimeout(() => {
        this.cdr.detectChanges();
        if (this.enableContentPlayer === true) {
          const navigationExtras: NavigationExtras = {
            relativeTo: this.activatedRoute
          };
          this.enableContentPlayer = false;
          this.router.navigate([], navigationExtras);
        }
      }, 100);
    }
  }
  public createEventEmitter(data) {
    this.createNoteData = data;
  }
  showContentCreditsPopup () {
    this.showContentCreditsModal = true;
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  private setTelemetryStartEndData() {
    this.telemetryCdata = [{ 'type': 'Course', 'id': this.courseId }];
    if (this.batchId) {
      this.telemetryCdata.push({id: this.batchId , type: 'CourseBatch'});
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
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'play',
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version ,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
    this.telemetryCourseEndEvent = {
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
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
        ver: '1.0'
      }
    };
  }
  private setTelemetryContentImpression() {
    this.telemetryContentImpression = {
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
        id: this.contentId,
        type: 'content',
        ver: '1.0',
        rollup: this.objectRollUp
      }
    };
  }
  private setContentInteractData(config) {
    this.contentInteractObject = {
      id: config.metadata.identifier,
      type: config.metadata.contentType || config.metadata.resourceType || 'Content',
      ver: config.metadata.pkgVersion ? config.metadata.pkgVersion.toString() : '1.0',
      rollup: this.objectRollUp
    };
    this.closeContentIntractEdata = {
      id: 'content-close',
      type: 'click',
      pageid: 'course-consumption'
    };
  }
}
