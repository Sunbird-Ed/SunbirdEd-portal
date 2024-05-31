import { Component, OnInit, OnDestroy, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import {
  ConfigService, NavigationHelperService, ToasterService, ResourceService,
  UtilService, LayoutService
} from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { PublicPlayerService } from '@sunbird/public';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentPlayerPageComponent implements OnInit, OnDestroy, OnChanges {
  @Input() contentDetails;
  @Input() collectionData;
  @Input() playerConfig;
  @Input() tocPage = false;
  @Input() dialCode: string;
  @Input() isContentPresent = true;
  @Input() objectRollUp;
  @Input() contentProgressEvents$: Subject<any>;

  @Output() assessmentEvents = new EventEmitter<any>();
  @Output() questionScoreSubmitEvents = new EventEmitter<any>();
  @Output() questionScoreReviewEvents = new EventEmitter<any>();
  @Output() contentDownloaded = new EventEmitter();
  @Output() deletedContent = new EventEmitter();
  isCollapsed = false;

  unsubscribe$ = new Subject<void>();
  contentId: string;
  telemetryImpression: IImpressionEventInput;
  contentType: string;
  isConnected;
  isContentDeleted: Subject<any> = new Subject();
  playerOption: any;
  layoutConfiguration;
  isDesktopApp = false;
  transformCollectionData;
  frameworkCategoriesList;
  constructor(private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    public router: Router,
    private navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    private utilService: UtilService,
    private telemetryService: TelemetryService,
    public layoutService: LayoutService,
    private playerService: PublicPlayerService,
    public cslFrameworkService:CslFrameworkService
  ) { }

  ngOnInit() {
    this.frameworkCategoriesList = this.cslFrameworkService.getGlobalFilterCategoriesObject();
    this.transformCollectionData = this.cslFrameworkService.transformContentDataFwBased(this.frameworkCategoriesList,this.collectionData);
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.initLayout();
    this.utilService.emitHideHeaderTabsEvent(true);
    this.contentType = this.activatedRoute.snapshot.queryParams.contentType;
    this.getContentIdFromRoute();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
      .subscribe(x => { if (!this.tocPage) { this.setPageExitTelemtry(); } });
    this.playerOption = {
      showContentRating: true
    };
    this.activatedRoute.params.subscribe((params) => {
      if (_.get(this.activatedRoute, 'snapshot.queryParams.l1Parent') && !this.tocPage) {
        this.objectRollUp = {
          l1: _.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')
        };
      }
    });

    if (this.contentProgressEvents$) {
      this.contentProgressEvents$.subscribe(data => this.contentProgressEvents$.next(data));
    }
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }
  ngOnChanges() {
    if (this.contentDetails && this.tocPage) {
      this.contentId = this.contentDetails.identifier;
      this.getContent();
    }
  }

  getContentIdFromRoute() {
    this.activatedRoute.params.pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(params => {
        if (params.contentId) {
          this.contentId = params.contentId;
          this.getContent();
        }
      });
  }

  getContent() {
    const options: any = { dialCode: this.dialCode };
    if (this.isDesktopApp) {
      const params = { params: this.configService.appConfig.PublicPlayer.contentApiQueryParams };
      this.playerService.getContent(this.contentId, params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          this.contentDetails = _.get(response, 'result.content') || _.get(response, 'result.questionset') || _.get(response, 'result.questionSet');
          const status = !_.has(this.contentDetails, 'desktopAppMetadata.isAvailable') ? false :
          !_.get(this.contentDetails, 'desktopAppMetadata.isAvailable');
          this.isContentDeleted.next({value: status});
          this.getContentConfigDetails(this.contentId, options);
          this.setTelemetryData();
        }, error => {
          this.contentDetails = {};
          this.isContentDeleted.next({value: true});
          this.setTelemetryData();
        });
    }
  }

  getContentConfigDetails(contentId, options) {
    const contentDetails = {
      contentId: contentId,
      contentData: this.contentDetails
    };
    this.playerConfig.context.objectRollup = this.objectRollUp;
  }

  checkContentDeleted(event) {
    if (this.isDesktopApp && event) {
      this.isContentDeleted.next({ value: true });
      this.deletedContent.emit(this.contentDetails);
    }
  }

  checkContentDownloading(event) {
    this.isContentDeleted.next({ value: false });
    this.contentDownloaded.emit(event);
  }

  goBack() {
    this.logTelemetry('close-content-player');
    this.navigationHelperService.goBack();
  }

  logTelemetry(id) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'content',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'play-content',
      }
    };
    this.telemetryService.interact(interactData);
  }

  setTelemetryData() {
    let telemetryCdata;
    if (this.dialCode) {
      telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
    }
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: telemetryCdata || []
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      }
    };
    if (!this.tocPage) {
      this.telemetryImpression.edata['subtype'] = this.activatedRoute.snapshot.data.telemetry.subtype;
      this.telemetryImpression.edata['duration'] = this.navigationHelperService.getPageLoadTime();
    }
    if (this.contentDetails) {
      this.telemetryImpression.object = {
        id: this.contentDetails['identifier'],
        type: this.contentType,
        ver: `${this.contentDetails['pkgVersion']}` || '1.0',
        rollup: this.objectRollUp
      };
    }
  }

  setPageExitTelemtry() {
    if (this.contentDetails) {
      this.telemetryImpression.object = {
        id: this.contentDetails['identifier'],
        type: this.contentDetails['contentType'],
        ver: `${this.contentDetails['pkgVersion']}` || '1.0',
      };
    }
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  onAssessmentEvents(event) {
    this.assessmentEvents.emit(event);
  }

  onQuestionScoreSubmitEvents(event) {
    this.questionScoreSubmitEvents.emit(event);
  }
  onQuestionScoreReviewEvents(event) {
    this.questionScoreReviewEvents.emit(event);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.utilService.emitHideHeaderTabsEvent(false);
  }
}
