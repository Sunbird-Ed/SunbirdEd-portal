import { combineLatest, Subscription, Subject } from 'rxjs';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  ContentService, UserService, BreadcrumbsService, PermissionService, CoursesService
} from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import {
  WindowScrollService, ILoaderMessage, ConfigService, ICollectionTreeOptions, NavigationHelperService,
  ToasterService, ResourceService, ExternalUrlPreviewService
} from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { INoteData } from '@sunbird/notes';
import {
  IImpressionEventInput, IEndEventInput, IStartEventInput, IInteractEventObject, IInteractEventEdata
} from '@sunbird/telemetry';

@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit, OnDestroy {

  public courseInteractObject: IInteractEventObject;

  public contentInteractObject: IInteractEventObject;

  public closeContentIntractEdata: IInteractEventEdata;

  private activatedRoute: ActivatedRoute;

  private courseId: string;

  public batchId: string;

  public enrolledCourse = false;

  public contentId: string;

  public courseStatus: string;

  private contentService: ContentService;

  public flaggedCourse = false;

  public collectionTreeNodes: any;

  public contentTitle: string;

  public playerConfig: any;

  private windowScrollService: WindowScrollService;

  private router: Router;

  public loader: Boolean = true;

  showError = false;

  private activatedRouteSubscription: Subscription;

  enableContentPlayer = false;

  courseHierarchy: any;

  readMore = false;

  createNoteData: INoteData;

  curriculum = [];

  getConfigByContentSubscription: Subscription;

  queryParamSubscription: Subscription;

  updateContentsStateSubscription: Subscription;

  istrustedClickXurl = false;
  /**
   * To show/hide the note popup editor
   */
  showNoteEditor = false;

  /**
	 * telemetryImpression object for course TOC page
	*/
  telemetryCourseImpression: IImpressionEventInput;

  /**
	 * telemetryImpression object for content played from within a course
	*/
  telemetryContentImpression: IImpressionEventInput;
  /**
   * telemetry course end event
   */
  telemetryCourseEndEvent: IEndEventInput;


  telemetryCourseStart: IStartEventInput;

  contentIds = [];

  contentStatus: any;

  contentDetails = [];

  enrolledBatchInfo: any;

  treeModel: any;

  nextPlaylistItem: any;

  prevPlaylistItem: any;

  noContentToPlay = 'No content to play';

  showExtContentMsg = false;

  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  public collectionTreeOptions: ICollectionTreeOptions;

  public unsubscribe = new Subject<void>();

  constructor(contentService: ContentService, activatedRoute: ActivatedRoute, private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService, windowScrollService: WindowScrollService,
    router: Router, public navigationHelperService: NavigationHelperService, private userService: UserService,
    private toasterService: ToasterService, private resourceService: ResourceService, public breadcrumbsService: BreadcrumbsService,
    private cdr: ChangeDetectorRef, public courseBatchService: CourseBatchService, public permissionService: PermissionService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public coursesService: CoursesService) {
    this.contentService = contentService;
    this.activatedRoute = activatedRoute;
    this.windowScrollService = windowScrollService;
    this.router = router;
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
  }
  ngOnInit() {
    this.activatedRouteSubscription = this.activatedRoute.params.pipe(first(),
      mergeMap((params) => {
        this.courseId = params.courseId;
        this.batchId = params.batchId;
        this.courseStatus = params.courseStatus;
        this.setTelemetryCourseImpression();
        if (this.batchId) {
          return combineLatest(
            this.courseConsumptionService.getCourseHierarchy(params.courseId),
            this.courseBatchService.getEnrolledBatchDetails(this.batchId),
          ).pipe(map(results => ({ courseHierarchy: results[0], enrolledBatchDetails: results[1] })));
        } else {
          return this.courseConsumptionService.getCourseHierarchy(params.courseId)
            .pipe(map((courseHierarchy) => ({ courseHierarchy })));
        }
      })).subscribe((response: any) => {
        this.courseHierarchy = response.courseHierarchy;
        this.courseInteractObject = {
          id: this.courseHierarchy.identifier,
          type: 'Course',
          ver: this.courseHierarchy.pkgVersion ? this.courseHierarchy.pkgVersion.toString() : '1.0'
        };
        if (this.courseHierarchy.status === 'Flagged') {
          this.flaggedCourse = true;
        }
        if (this.batchId) {
          this.enrolledBatchInfo = response.enrolledBatchDetails;
          this.enrolledCourse = true;
          this.setTelemetryStartEndData();
          this.parseChildContent();
          if (this.enrolledBatchInfo.status > 0 && this.contentIds.length > 0) {
            this.getContentState();
            this.subscribeToQueryParam();
          }
        } else if (this.courseStatus === 'Unlisted' || this.permissionService.checkRolesPermissions(['COURSE_MENTOR', 'CONTENT_REVIEWER'])
          || this.courseHierarchy.createdBy === this.userService.userid) {
          this.parseChildContent();
          this.subscribeToQueryParam();
        } else {
          this.parseChildContent();
        }
        this.collectionTreeNodes = { data: this.courseHierarchy };
        this.loader = false;
      }, (error) => {
        this.loader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
      });
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
    _.forEach(mimeTypeCount, (value, key) => {
      this.curriculum.push({ mimeType: key, count: value });
    });
  }
  private getContentState() {
    const req = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.contentIds,
      batchId: this.batchId
    };
    this.courseConsumptionService.getContentState(req).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.contentStatus = res.content;
      }, (err) => {
        console.log(err, 'content read api failed');
      });
  }
  private subscribeToQueryParam() {
    this.queryParamSubscription = this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.contentId) {
        const content = this.findContentById(queryParams.contentId);
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
  private findContentById(id: string) {
    return this.treeModel.first((node) => {
      return node.model.identifier === id;
    });
  }
  private OnPlayContent(content: { title: string, id: string }, showExtContentMsg?: boolean) {
    if (content && content.id && ((this.enrolledCourse && !this.flaggedCourse &&
      this.enrolledBatchInfo.status > 0) || this.courseStatus === 'Unlisted'
      || this.permissionService.checkRolesPermissions(['COURSE_MENTOR', 'CONTENT_REVIEWER'])
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
      options.batchHashTagId = this.enrolledBatchInfo.hashTagId;
    }
    this.getConfigByContentSubscription = this.courseConsumptionService.getConfigByContent(data.id, options)
      .subscribe((config) => {
        this.setContentInteractData(config);
        this.loader = false;
        this.playerConfig = config;
        if ((config.metadata.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl && !(this.istrustedClickXurl))
          || (config.metadata.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl && showExtContentMsg)) {
          setTimeout(() => {
            this.showExtContentMsg = true;
          }, 5000);
        } else {
          this.showExtContentMsg = false;
        }
        this.enableContentPlayer = true;
        this.contentTitle = data.title;
        this.breadcrumbsService.setBreadcrumbs([{ label: this.contentTitle, url: '' }]);
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
    if ((this.batchId && !this.flaggedCourse && this.enrolledBatchInfo.status > 0)
      || this.courseStatus === 'Unlisted' || this.permissionService.checkRolesPermissions(['COURSE_MENTOR', 'CONTENT_REVIEWER'])
      || this.courseHierarchy.createdBy === this.userService.userid) {
      this.router.navigate([], navigationExtras);
    }
  }
  public contentProgressEvent(event) {
    if (this.batchId && this.enrolledBatchInfo && this.enrolledBatchInfo.status === 1) {
      const eid = event.detail.telemetryData.eid;
      const request: any = {
        userId: this.userService.userid,
        contentId: this.contentId,
        courseId: this.courseId,
        batchId: this.batchId,
        status: eid === 'END' ? 2 : 1
      };
      this.updateContentsStateSubscription = this.courseConsumptionService.updateContentsState(request)
        .subscribe((updatedRes) => {
          this.contentStatus = updatedRes.content;
        }, (err) => {
          console.log('updating content status failed', err);
        });
    }
  }
  public closeContentPlayer() {
    this.cdr.detectChanges();
    if (this.enableContentPlayer === true) {
      const navigationExtras: NavigationExtras = {
        relativeTo: this.activatedRoute
      };
      this.enableContentPlayer = false;
      this.router.navigate([], navigationExtras);
    }
  }
  public createEventEmitter(data) {
    this.createNoteData = data;
  }
  ngOnDestroy() {
    if (this.activatedRouteSubscription) {
      this.activatedRouteSubscription.unsubscribe();
    }
    if (this.getConfigByContentSubscription) {
      this.getConfigByContentSubscription.unsubscribe();
    }
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
    if (this.updateContentsStateSubscription) {
      this.updateContentsStateSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  private setTelemetryStartEndData() {
    this.telemetryCourseStart = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'play'
      }
    };
    this.telemetryCourseEndEvent = {
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
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
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      },
      object: {
        id: this.courseId,
        type: 'course',
        ver: '1.0'
      }
    };
  }
  private setTelemetryContentImpression() {
    this.telemetryContentImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
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
        rollup: {
          l1: this.courseId,
          l2: this.contentId
        }
      }
    };
  }
  private setContentInteractData(config) {
    this.contentInteractObject = {
      id: config.metadata.identifier,
      type: config.metadata.contentType || config.metadata.resourceType || 'content',
      ver: config.metadata.pkgVersion ? config.metadata.pkgVersion.toString() : '1.0',
      rollup: { l1: this.courseId }
    };
    this.closeContentIntractEdata = {
      id: 'content-close',
      type: 'click',
      pageid: 'course-consumption'
    };
  }
}
