import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig, LayoutService, NavigationHelperService, ResourceService, UtilService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';
import { ContentManagerService } from '../../../public/module/offline/services';

const OFFLINE_ARTIFACT_MIME_TYPES = ['application/epub', 'video/webm', 'video/mp4', 'application/pdf'];
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html',
  styleUrls: ['./content-player.component.scss']
})
export class ContentPlayerComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  @Input() playerConfig: PlayerConfig;
  @Output() assessmentEvents = new EventEmitter<any>();
  @Output() questionScoreSubmitEvents = new EventEmitter<any>();
  @Output() questionScoreReviewEvents = new EventEmitter<any>();
  @ViewChild('contentIframe', {static: false}) contentIframe: ElementRef;
  @Output() playerOnDestroyEvent = new EventEmitter<any>();
  @Output() sceneChangeEvent = new EventEmitter<any>();
  @Input() contentProgressEvents$: Subject<any>;
  @Output() deletedContent = new EventEmitter();
  buildNumber: string;
  @Input() playerOption: any;
  contentRatingModal = false;
  previewCdnUrl: string;
  isCdnWorking: string;
  @Input() isContentDeleted: Subject<any>;
  contentDeleted = false;
  @Input() isContentPresent = true;
  @Input() objectRollUp: {} = {};
  isConnected: any;
  youTubeContentStatus: any;
  public unsubscribe$ = new Subject<void>();
  CONSTANT = {
    ACCESSEVENT: 'renderer:question:submitscore',
    ACCESSREVIEWEVENT: 'renderer:question:reviewAssessment'
  };
  /**
 * Dom element reference of contentRatingModal
 */
  @ViewChild('modal', {static: false}) modal;
  @Input() contentData;
  @Input() layoutConfiguration;
  isFullScreenView;
  isLoading: Boolean = false; // To restrict player loading multiple times
  isDesktopApp: Boolean = false;
  constructor(public router: Router, public layoutService: LayoutService, public navigationHelperService: NavigationHelperService,
    public playerService: PublicPlayerService, public resourceService: ResourceService,private contentManagerService: ContentManagerService,
    public utilService: UtilService) {
    this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'))
      ? (<HTMLInputElement>document.getElementById('buildNumber')).value : '1.0';
    this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
    this.isCdnWorking = (<HTMLInputElement>document.getElementById('cdnWorking'))
      ? (<HTMLInputElement>document.getElementById('cdnWorking')).value : 'no';
  }
  /**
   * loadPlayer method will be called
   */

  ngAfterViewInit() {}

  ngOnChanges() {
    if (this.isDesktopApp && this.isContentDeleted) {
      this.isContentDeleted.subscribe(data => {
        this.contentDeleted = data.value && !this.router.url.includes('browse');
      });
    }
    this.contentRatingModal = false;
    if (!_.isEmpty(this.playerConfig)) {
      this.objectRollUp = _.get(this.playerConfig, 'context.objectRollup') || {};
    }

  }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.checkFullScreenView();
    if (this.contentProgressEvents$) {
      this.contentProgressEvents$.subscribe(data => {
        this.contentProgressEvents$.next(data);
      });
    }
    this.initLayout();
    if(this.isDesktopApp) { 
      this.contentManagerService.deletedContent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
        this.deleteContent(data);
      });
    }
  }

  deleteContent(event) {
    if (!this.router.url.includes('mydownloads')) {
      this.contentDeleted = true;
      this.deletedContent.emit(event);
    }
  }

  checkContentDownloading(event) {
    if (this.isDesktopApp && !_.get(this.contentData, 'desktopAppMetadata.isAvailable')) {
      this.contentDeleted = false;
      const contentDetails = {
        contentId: event.identifier,
        contentData: event
      };
      this.contentData = event;
      this.playerConfig = this.playerService.getConfig(contentDetails);
    }
  }

  checkFullScreenView() {
    this.navigationHelperService.contentFullScreenEvent.pipe(takeUntil(this.unsubscribe$)).subscribe(isFullScreen => {
      this.isFullScreenView = isFullScreen;
    });
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

  generateScoreSubmitEvent(event: any) {
    if (_.toLower(event.data) === (_.toLower(this.CONSTANT.ACCESSEVENT))) {
      this.questionScoreSubmitEvents.emit(event);
    }
    if (event.data.toLowerCase() === (this.CONSTANT.ACCESSREVIEWEVENT).toLowerCase()) {
      this.questionScoreReviewEvents.emit(event);
    }
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
  }
}

