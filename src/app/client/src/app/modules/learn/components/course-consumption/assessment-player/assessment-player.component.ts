import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TocCardType } from '@project-sunbird/common-consumption';
import { UserService } from '@sunbird/core';
import { AssessmentScoreService, CourseBatchService, CourseConsumptionService } from '@sunbird/learn';
import { PublicPlayerService } from '@sunbird/public';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { combineLatest, Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import * as TreeModel from 'tree-model';

const ACCESSEVENT = 'renderer:question:submitscore';

@Component({
  selector: 'app-assessment-player',
  templateUrl: './assessment-player.component.html',
  styleUrls: ['./assessment-player.component.scss']
})
export class AssessmentPlayerComponent implements OnInit {
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
    private assessmentScoreService: AssessmentScoreService
  ) {
    this.playerOption = {
      showContentRating: true
    };
  }

  ngOnInit() {
    this.subscribeToQueryParam();
  }

  goBack() {
    this.location.back();
  }

  private subscribeToQueryParam() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([params, queryParams]) => {
        this.collectionId = params.collectionId;
        this.batchId = queryParams.batchId;
        this.courseId = queryParams.courseId;
        const selectedContent = queryParams.selectedContent;

        if (this.batchId) {
          this.getCollectionInfo(this.collectionId)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
              this.courseHierarchy = data.courseHierarchy;
              this.enrolledBatchInfo = data.enrolledBatchDetails;
              this.setActiveContent(selectedContent);
            }, error => {
              console.error('Error while fetching data', error);
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
            });
        }

        this.subscribeToContentProgressEvents().subscribe(data => { });
      });
  }


  private getCollectionInfo(courseId: string): Observable<any> {
    const inputParams = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
    return combineLatest([
      this.playerService.getCollectionHierarchy(courseId, {}),
      this.courseBatchService.getEnrolledBatchDetails(this.batchId),
    ]).pipe(map((results: any) => ({
      courseHierarchy: results[0].result.content,
      enrolledBatchDetails: results[1],
    })));
  }

  setActiveContent(selectedContent: string) {
    if (_.get(this.courseHierarchy, 'children')) {
      const flattenDeepContents = this.flattenDeep(this.courseHierarchy.children);

      if (selectedContent) {
        this.activeContent = flattenDeepContents.find(content => content.identifier === selectedContent);
      } else {
        this.activeContent = this.firstNonCollectionContent(flattenDeepContents);
      }


      if (this.activeContent) {
        this.isContentPresent = true;
        this.initPlayer(_.get(this.activeContent, 'identifier'));
        this.getContentState();
      }
    }
  }

  private firstNonCollectionContent(contents) {
    return contents.find((content) => content.mimeType !== 'application/vnd.ekstep.content-collection');
  }

  private flattenDeep(contents) {
    if (contents) {
      return contents.reduce((acc, val) => {
        if (val.children) {
          acc.push(val);
          return acc.concat(this.flattenDeep(val.children));
        } else {
          return acc.concat(val);
        }
      }, []);
    }
  }

  private initPlayer(id: string) {
    const options: any = { courseId: this.collectionId };

    if (this.batchId) {
      options.batchId = this.batchId;
    }
    this.courseConsumptionService.getConfigByContent(id, options)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe(config => {
        this.playerConfig = config;
        this.showLoader = false;
      }, (err) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.stmsg.m0009);
      });
  }

  onTocCardClick(event: any) {
    if (_.get(event, 'data')) {
      this.activeContent = event.data;
      this.initPlayer(_.get(this.activeContent, 'identifier'));
    }
  }

  private getContentState() {
    const req = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.parseChildContent(),
      batchId: this.batchId
    };
    this.courseConsumptionService.getContentState(req)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.contentStatus = res.content || [];
        this.calculateProgress();
      }, err => console.error(err, 'content read api failed'));
  }

  private parseChildContent() {
    const contentIds = [this.activeContent.identifier];
    const model = new TreeModel();
    const mimeTypeCount = {};
    const treeModel: any = model.parse(this.courseHierarchy);
    treeModel.walk((node) => {
      if (node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
        if (mimeTypeCount[node.model.mimeType]) {
          mimeTypeCount[node.model.mimeType] += 1;
        } else {
          mimeTypeCount[node.model.mimeType] = 1;
        }
        contentIds.push(node.model.identifier);
      }
    });

    return contentIds;
  }

  public contentProgressEvent(event) {
    if (!this.batchId || _.get(this.enrolledBatchInfo, 'status') !== 1) {
      return;
    }
    const telObject = _.get(event, 'detail.telemetryData');
    const eid = _.get(telObject, 'eid');
    if (eid === 'END' && !this.validEndEvent(event)) {
      return;
    }

    const request: any = {
      userId: this.userService.userid,
      contentId: _.cloneDeep(_.get(telObject, 'object.id')),
      courseId: this.courseId,
      batchId: this.batchId,
      status: eid === 'END' ? 2 : 1
    };
    if (!eid) {
      const contentType = this.activeContent.contentType;
      if (contentType === 'SelfAssess' && _.get(event, 'data') === ACCESSEVENT) {
        request['status'] = 2;
      }
    }

    this.courseConsumptionService.updateContentsState(request)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(updatedRes => this.contentStatus = _.cloneDeep(updatedRes.content),
        err => console.error('updating content status failed', err));
  }

  onAssessmentEvents(event) {
    if (!this.batchId || _.get(this.enrolledBatchInfo, 'status') !== 1) {
      return;
    }
    this.assessmentScoreService.receiveTelemetryEvents(event);
    this.calculateProgress();
  }

  onQuestionScoreSubmitEvents(event) {
    if (event) {
      this.assessmentScoreService.handleSubmitButtonClickEvent(true);
      this.contentProgressEvent(event);
    }
  }

  private validEndEvent(event) {
    const playerSummary: Array<any> = _.get(event, 'detail.telemetryData.edata.summary');
    const contentMimeType = this.activeContent.mimeType;
    const contentType = this.activeContent.contentType;
    if (contentType === 'SelfAssess') {
      return false;
    }
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

  calculateProgress() {
    if (this.courseHierarchy.children) {
      const consumedContents = [];
      let totalContents = 0;
      this.courseHierarchy.children.forEach(unit => {
        if (unit.mimeType === 'application/vnd.ekstep.content-collection') {
          const flattenDeepContents = this.flattenDeep(unit.children).filter(item => item.mimeType !== 'application/vnd.ekstep.content-collection');
          totalContents += flattenDeepContents.length;
          const contents = flattenDeepContents.filter(o => {
            return this.contentStatus.some(({ contentId, status }) => o.identifier === contentId && status === 2);
          });

          if (contents.length) {
            consumedContents.push(...contents);
          }
        } else {
          totalContents++;
          const content = this.contentStatus.find(item => item.contentId === unit.identifier && item.status === 2);
          if (content) {
            consumedContents.push(...content);
          }
        }
      });
      this.courseHierarchy.progress = 0;
      if (consumedContents.length) {
        this.courseHierarchy.progress = (consumedContents.length / totalContents) * 100;
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
