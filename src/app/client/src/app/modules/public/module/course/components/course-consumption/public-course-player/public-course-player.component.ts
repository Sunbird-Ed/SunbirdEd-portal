import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import {
  ILoaderMessage, ConfigService, ICollectionTreeOptions, ResourceService,
  NavigationHelperService
} from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import TreeModel from 'tree-model';
import { UserService, GeneraliseLabelService } from '@sunbird/core';
import { TocCardType } from '@project-sunbird/common-consumption';
import { ITelemetryShare, ContentUtilsServiceService } from '@sunbird/shared';

@Component({
  selector: 'app-public-course-player',
  templateUrl: './public-course-player.component.html',
  styleUrls: ['./public-course-player.component.scss']
})
export class PublicCoursePlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  private courseId: string;
  collectionTreeNodes: any;
  loader = true;
  showError = false;
  courseHierarchy: any;
  readMore = false;
  curriculum = [];
  telemetryCourseImpression: IImpressionEventInput;
  treeModel: any;
  showContentCreditsModal: boolean;
  cardType: TocCardType = TocCardType.COURSE;
  loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };
  collectionTreeOptions: ICollectionTreeOptions;
  unsubscribe = new Subject<void>();
  showJoinTrainingModal = false;
  shareLinkModal = false;
  telemetryShareData: Array<ITelemetryShare>;
  shareLink: string;
  @ViewChild('joinTrainingModal') joinTrainingModal;
  isExpandedAll: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService,
    public router: Router,
    public resourceService: ResourceService,
    public navigationhelperService: NavigationHelperService,
    private userService: UserService,
    public telemetryService: TelemetryService,
    private contentUtilsServiceService: ContentUtilsServiceService,
    public generaliseLabelService: GeneraliseLabelService
  ) {
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
  }

  ngOnInit() {
    const routeParams: any = { ...this.activatedRoute.snapshot.params };
    this.courseId = routeParams.courseId;
    const inputParams = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
    this.courseConsumptionService.getCourseHierarchy(routeParams.courseId, inputParams).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(courseHierarchy => {
        this.loader = false;
        this.courseHierarchy = courseHierarchy;
        this.isExpandedAll = this.courseHierarchy.children && this.courseHierarchy.children.length === 1 ? true : undefined;
        this.parseChildContent();
        this.collectionTreeNodes = { data: this.courseHierarchy };
        this.getGeneraliseResourceBundle();
      });
  }

  getGeneraliseResourceBundle() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe)).subscribe(item => {
      this.generaliseLabelService.initialize(this.courseHierarchy, item.value);
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
      }
    });

    let videoContentCount = 0;
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryCourseImpression();
    });
  }

  isExpanded(index: number) {
    if (_.isUndefined(this.isExpandedAll)) {
      return Boolean(index === 0);
    }
    return this.isExpandedAll;
  }

  ngOnDestroy() {
    if (this.joinTrainingModal && this.joinTrainingModal.deny) {
      this.joinTrainingModal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
        duration: this.navigationhelperService.getPageLoadTime()
      },
      object: {
        id: this.activatedRoute.snapshot.params.courseId,
        type: 'Course',
        ver: '1.0',
        rollup: {
          l1: this.activatedRoute.snapshot.params.courseId
        }
      }
    };
  }

  public navigateToContent(event: any, id) {
    this.logTelemetry(id, event.data);
    if (!_.get(this.userService, 'userid') && !_.isEmpty(event.event)) {
      this.showJoinTrainingModal = true;
    }
  }



  logTelemetry(id, content?: {}) {
    const objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseHierarchy, _.get(content, 'identifier'));
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'explore-course-toc',
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
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'explore',
        cdata: [{ id: this.courseId, type: 'Course' }]
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'explore-course-toc',
      },
      object: {
        id: _.get(this.courseHierarchy, 'identifier'),
        type: _.get(this.courseHierarchy, 'contentType') || 'Course',
        ver: `${_.get(this.courseHierarchy, 'pkgVersion')}` || `1.0`,
        rollup: { l1: this.courseId }
      }
    };
    this.telemetryService.interact(interactData);
  }
}
