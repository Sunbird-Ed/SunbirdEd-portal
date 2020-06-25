import { Location } from '@angular/common';
import { TelemetryService, IAuditEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TocCardType } from '@project-sunbird/common-consumption';
import { UserService } from '@sunbird/core';
import { AssessmentScoreService, CourseBatchService, CourseConsumptionService } from '@sunbird/learn';
import { PublicPlayerService } from '@sunbird/public';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { combineLatest, Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { CsCourseProgressCalculator } from '@project-sunbird/client-services/services/course/utilities/course-progress-calculator';
import * as TreeModel from 'tree-model';
const ACCESSEVENT = 'renderer:question:submitscore';

@Component({
  selector: 'app-assessment-player',
  templateUrl: './assessment-player.component.html',
  styleUrls: ['./assessment-player.component.scss']
})
export class AssessmentPlayerComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  contentProgressEvents$ = new Subject();
  batchId: string;
  collectionId: string;
  courseId: string;
  courseHierarchy;
  enrolledBatchInfo;
  showLoader = true;
  noContentMessage = 'No Content available';
  activeContent: any;
  isContentPresent = false;
  courseFallbackImg = './../../../../../assets/images/book.png';
  cardType: TocCardType = TocCardType.COURSE;
  contentStatus = [];
  playerConfig;
  playerOption;
  courseName: string;
  courseProgress: number;
  private objectRollUp = [];
  public treeModel: any;
  isParentCourse = false;
  telemetryContentImpression: IImpressionEventInput;
  telemetryPlayerPageImpression: IImpressionEventInput;
  telemetryCdata: Array<{}>;
  isUnitCompleted = false;
  isFullScreenView = false;


  constructor(
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private courseConsumptionService: CourseConsumptionService,
    private configService: ConfigService,
    private courseBatchService: CourseBatchService,
    private toasterService: ToasterService,
    private location: Location,
    private playerService: PublicPlayerService,
    private userService: UserService,
    private assessmentScoreService: AssessmentScoreService,
    private navigationHelperService: NavigationHelperService,
    private telemetryService: TelemetryService,
    private router: Router
  ) {
    this.playerOption = {
      showContentRating: true
    };
  }

  ngOnInit() {
    this.subscribeToQueryParam();
    this.navigationHelperService.contentFullScreenEvent.
    pipe(takeUntil(this.unsubscribe)).subscribe(isFullScreen => {
      this.isFullScreenView = isFullScreen;
    });
  }

  goBack() {
    if (this.navigationHelperService['_history'].length === 1) {
      this.router.navigate(['/learn/course', this.courseId, 'batch', this.batchId]);
    } else {
      this.location.back();
    }
  }

  private subscribeToQueryParam() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([params, queryParams]) => {
        this.collectionId = params.collectionId;
        this.batchId = queryParams.batchId;
        this.courseId = queryParams.courseId;
        this.courseName = queryParams.courseName;
        const selectedContent = queryParams.selectedContent;
        const isSingleContent = this.collectionId === selectedContent;
        this.isParentCourse = this.collectionId === this.courseId;
        if (this.batchId) {
          this.telemetryCdata = [{ id: this.batchId, type: 'CourseBatch' }];
          this.getCollectionInfo(this.courseId)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
              const model = new TreeModel();
              this.treeModel = model.parse(data.courseHierarchy);
              if (!this.isParentCourse && data.courseHierarchy.children) {
                this.courseHierarchy = data.courseHierarchy.children.find(item => item.identifier === this.collectionId);
              } else {
                this.courseHierarchy = data.courseHierarchy;
              }
              this.enrolledBatchInfo = data.enrolledBatchDetails;
              this.setActiveContent(selectedContent, isSingleContent);
            }, error => {
              console.error('Error while fetching data', error);
              this.toasterService.error(this.resourceService.messages.fmsg.m0051);
              this.goBack();
            });
        } else {
          this.playerService.getCollectionHierarchy(this.collectionId, {})
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
              this.courseHierarchy = data.result.content;
              if (this.courseHierarchy.mimeType !== 'application/vnd.ekstep.content-collection') {
                this.activeContent = this.courseHierarchy;
                this.initPlayer(_.get(this.activeContent, 'identifier'));
              } else {
                this.setActiveContent(selectedContent);
              }
            }, error => {
              console.error('Error while fetching data', error);
              this.toasterService.error(this.resourceService.messages.fmsg.m0051);
              this.goBack();
            });
        }
        this.setTelemetryCourseImpression();
        this.subscribeToContentProgressEvents().subscribe(data => { });
      });
  }


  private getCollectionInfo(courseId: string): Observable<any> {
    const inputParams = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
    return combineLatest([
      this.courseConsumptionService.getCourseHierarchy(courseId, inputParams),
      this.courseBatchService.getEnrolledBatchDetails(this.batchId),
    ]).pipe(map((results: any) => {
      return {
        courseHierarchy: results[0],
        enrolledBatchDetails: results[1],
      };
    }));
  }

  setActiveContent(selectedContent: string, isSingleContent?: boolean) {
    if (_.get(this.courseHierarchy, 'children')) {
      const flattenDeepContents = this.courseConsumptionService.flattenDeep(this.courseHierarchy.children);

      if (selectedContent) {
        this.activeContent = flattenDeepContents.find(content => content.identifier === selectedContent);
      } else {
        this.activeContent = this.firstNonCollectionContent(flattenDeepContents);
      }

      /* istanbul ignore else */
      if (this.activeContent) {
        this.isContentPresent = true;
        this.initPlayer(_.get(this.activeContent, 'identifier'));
      }
    } else if (isSingleContent) {
      this.activeContent = this.courseHierarchy;
      this.initPlayer(_.get(this.activeContent, 'identifier'));
    }
    this.getContentState();
  }

  private firstNonCollectionContent(contents) {
    return contents.find((content) => content.mimeType !== 'application/vnd.ekstep.content-collection');
  }

  private initPlayer(id: string) {
    this.assessmentScoreService.init({
      batchDetails: this.enrolledBatchInfo,
      courseDetails: this.courseHierarchy,
      contentDetails: { identifier: id }
    });
    const options: any = { courseId: this.collectionId };

    /* istanbul ignore else */
    if (this.batchId) {
      options.batchId = this.batchId;
    }

    this.courseConsumptionService.getConfigByContent(id, options)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe(config => {
        this.objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseConsumptionService.courseHierarchy, id);
        const objectRollUp = this.objectRollUp ? this.courseConsumptionService.getRollUp(this.objectRollUp) : {};
        if (config && config.context) {
          config.context.objectRollup = objectRollUp;
        }
        this.playerConfig = config;
        this.showLoader = false;
        this.setTelemetryContentImpression();
      }, (err) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.stmsg.m0009);
      });
  }

  onTocCardClick(event: any, id) {
    /* istanbul ignore else */
    if (_.get(event, 'data')) {
      this.activeContent = event.data;
      this.initPlayer(_.get(this.activeContent, 'identifier'));
      this.logTelemetry(id, event.data);
    }
  }

  private getContentState() {
    const req = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.courseConsumptionService.parseChildren(this.courseHierarchy),
      batchId: this.batchId
    };
    this.courseConsumptionService.getContentState(req)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.contentStatus = res.content || [];
        this.calculateProgress();
      }, err => console.error(err, 'content read api failed'));
  }

  public contentProgressEvent(event) {
    /* istanbul ignore else */
    if (!this.batchId || _.get(this.enrolledBatchInfo, 'status') !== 1) {
      return;
    }
    const telObject = _.get(event, 'detail.telemetryData');
    const eid = _.get(telObject, 'eid');
    /* istanbul ignore else */
    if (eid === 'END' && !this.validEndEvent(event)) {
      return;
    }

    const request: any = {
      userId: this.userService.userid,
      contentId: _.cloneDeep(_.get(telObject, 'object.id')),
      courseId: this.courseId,
      batchId: this.batchId,
      status: (eid === 'END' && this.courseProgress === 100) ? 2 : 1,
      progress: this.courseProgress
    };
    /* istanbul ignore else */
    if (!eid) {
      const contentType = this.activeContent.contentType;
      /* istanbul ignore else */
      if (contentType === 'SelfAssess' && _.get(event, 'data') === ACCESSEVENT) {
        request['status'] = 2;
      }
    }

    /* istanbul ignore else */
    if (request.status === 2 && !this.isUnitCompleted) {
      this.logAuditEvent();
    }

    this.courseConsumptionService.updateContentsState(request)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(updatedRes => {
        this.contentStatus = _.cloneDeep(updatedRes.content);
        /* istanbul ignore else */
        if (!this.isUnitCompleted) {
          this.calculateProgress(true);
        }
      }, err => console.error('updating content status failed', err));
    this.courseConsumptionService.updateContentState.emit();
  }

  onAssessmentEvents(event) {
    /* istanbul ignore else */
    if (!this.batchId || _.get(this.enrolledBatchInfo, 'status') !== 1) {
      return;
    }
    this.assessmentScoreService.receiveTelemetryEvents(event);
    this.calculateProgress();
  }

  onQuestionScoreSubmitEvents(event) {
    /* istanbul ignore else */
    if (event) {
      this.assessmentScoreService.handleSubmitButtonClickEvent(true);
      this.contentProgressEvent(event);
    }
  }

  /**
   * @since #SH-120
   * @param  {object} event - telemetry end event data
   * @description - It will return the progress calculated from client-service(Common Consumption)
   */
  private validEndEvent(event) {
    const playerSummary: Array<any> = _.get(event, 'detail.telemetryData.edata.summary');
    const contentMimeType = this.activeContent.mimeType;
    this.courseProgress = CsCourseProgressCalculator.calculate(playerSummary, contentMimeType);
    return this.courseProgress;
  }

  calculateProgress(isLogAuditEvent?: boolean) {
    /* istanbul ignore else */
    if (_.get(this.courseHierarchy, 'children')) {
      const consumedContents = [];
      let totalContents = 0;
      this.courseHierarchy.children.forEach(unit => {
        if (unit.mimeType === 'application/vnd.ekstep.content-collection') {
          const flattenDeepContents = this.courseConsumptionService.flattenDeep(unit.children).filter(item => item.mimeType !== 'application/vnd.ekstep.content-collection');
          totalContents += flattenDeepContents.length;

          let contents = [];
          /* istanbul ignore else */
          if (this.contentStatus.length) {
            contents = flattenDeepContents.filter(o => {
              return this.contentStatus.some(({ contentId, status }) => o.identifier === contentId && status === 2);
            });
          }

          /* istanbul ignore else */
          if (contents.length) {
            consumedContents.push(...contents);
          }
        } else {
          totalContents++;
          const content = this.contentStatus.find(item => item.contentId === unit.identifier && item.status === 2);
          /* istanbul ignore else */
          if (content) {
            consumedContents.push(content);
          }
        }
      });
      this.courseHierarchy.progress = 0;
      /* istanbul ignore else */
      if (consumedContents.length) {
        this.courseHierarchy.progress = (consumedContents.length / totalContents) * 100;
      }
      this.isUnitCompleted = totalContents === consumedContents.length;
      /* istanbul ignore else */
      if (isLogAuditEvent && this.isUnitCompleted) {
        this.logAuditEvent(true);
      }
    }
  }

  private subscribeToContentProgressEvents() {
    return this.contentProgressEvents$.pipe(
      map(event => {
        this.contentProgressEvent(event);
        return {
          contentProgressEvent: event
        };
      }),
      takeUntil(this.unsubscribe)
    );
  }


  logTelemetry(id, content?: {}) {
    if (this.batchId) {
      this.telemetryCdata = [{ id: this.batchId, type: 'CourseBatch' }];
    }
    const objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseHierarchy, _.get(content, 'identifier'));
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: this.telemetryCdata
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'play-collection',
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

  private setTelemetryContentImpression() {
    const objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseHierarchy, _.get(this.activeContent, 'identifier'));
    const telemetryContentImpression = {
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
        id: this.activeContent.identifier,
        type: this.activeContent.contentType || 'content',
        ver: this.activeContent.pkgVersion ? this.activeContent.pkgVersion.toString() : '1.0',
        rollup: this.courseConsumptionService.getRollUp(objectRollUp) || {}
      }
    };
    this.telemetryService.impression(telemetryContentImpression);
  }

  private setTelemetryCourseImpression() {
    this.telemetryPlayerPageImpression = {
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
        id:  this.courseId || _.get(this.courseHierarchy, 'identifier'),
        type: _.get(this.courseHierarchy, 'contentType') || 'Course',
        ver:  `${_.get(this.courseHierarchy, 'pkgVersion')}` || '1.0',
        rollup: { l1: this.courseId }
      }
    };
  }

  logAuditEvent(isUnit?: boolean) {
    const auditEventInput: IAuditEventInput = {
      'context': {
        'env': this.activatedRoute.snapshot.data.telemetry.env,
        'cdata': [
          { id: this.courseId, type: 'CourseId' },
          { id: this.userService.userid, type: 'UserId' },
          { id: this.batchId, type: 'BatchId' },
        ]
      },
      'object': {
        'id': this.batchId,
        'type': this.activatedRoute.snapshot.data.telemetry.object.type,
        'ver': this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      'edata': {
        props: ['courseId', 'userId', 'batchId'],
        state: '',
        prevstate: ''
      }
    };

    if (isUnit) {
      auditEventInput.context.cdata.push({ id: this.courseHierarchy.identifier, type: 'UnitId' });
      auditEventInput.edata.props.push('unitId');
    } else {
      auditEventInput.context.cdata.push({ id: this.activeContent.identifier, type: 'ContentId' });
      auditEventInput.edata.props.push('contentId');
    }

    this.telemetryService.audit(auditEventInput);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
