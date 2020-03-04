import { PublicPlayerService } from '@sunbird/public';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ToasterService, ResourceService , OfflineCardService} from '@sunbird/shared';
const OFFLINE_ARTIFACT_MIME_TYPES = ['application/epub', 'video/webm', 'video/mp4', 'application/pdf'];
import { Subject } from 'rxjs';
import { ConnectionService, ContentManagerService } from '@sunbird/offline';
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
  @ViewChild('contentIframe') contentIframe: ElementRef;
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
    ACCESSEVENT: 'renderer:question:submitscore'
  };
  /**
 * Dom element reference of contentRatingModal
 */
  @ViewChild('modal') modal;
  @Input() contentData;
  isLoading: Boolean = false; // To restrict player loading multiple times
  constructor(public configService: ConfigService, public router: Router, public toasterService: ToasterService,
    public resourceService: ResourceService, public navigationHelperService: NavigationHelperService,
    private connectionService: ConnectionService,
    private contentManagerService: ContentManagerService,
    private offlineCardService: OfflineCardService,
    public playerService: PublicPlayerService) {
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

  ngAfterViewInit() {
    if (!_.isEmpty(this.playerConfig)) {
      this.loadPlayer();
    }
  }

  ngOnChanges() {
    if (this.isContentDeleted) {
      this.isContentDeleted.subscribe(data => {
        this.contentDeleted = data.value && !this.router.url.includes('browse');
      });
    }
    this.contentRatingModal = false;
    if (!_.isEmpty(this.playerConfig)) {
      this.objectRollUp = _.get(this.playerConfig, 'context.objectRollup') || {};
        this.loadPlayer();
        this.handleYoutubeContent(this.contentData);
    }

  }
  handleYoutubeContent(data) {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      if (!isConnected && this.offlineCardService.isYoutubeContent(data)) {
        this.youTubeContentStatus = true;
      } else {
        this.youTubeContentStatus = false;
        this.loadPlayer();
      }
        });
  }
  ngOnInit() {
    this.contentManagerService.deletedContent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.deleteContent(data);
    });
  }

  loadCdnPlayer() {
    if (this.isLoading) {// To restrict player loading multiple times
      return;
    }
    this.isLoading = true;
    const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.cdnUrl + '&build_number=' + this.buildNumber;

    const playerElement = this.contentIframe.nativeElement;
    playerElement.src = iFrameSrc;
    playerElement.onload = (event) => {
      this.isLoading = false;
      try {
        this.adjustPlayerHeight();
        playerElement.contentWindow.initializePreview(this.playerConfig);
        playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => {
          const eid = telemetryEvent.detail.telemetryData.eid;
          if (eid && (eid === 'START')) {
            this.isLoading = false; // To restrict player loading multiple times
          }
          this.generateContentReadEvent(telemetryEvent);
        });
        window.frames['contentPlayer'].addEventListener('message', accessEvent =>
          this.generateScoreSubmitEvent(accessEvent), false);
      } catch (err) {
        this.isLoading = false; // To restrict player loading multiple times
        this.loadDefaultPlayer();
      }
    };
  }
  loadDefaultPlayer(url = this.configService.appConfig.PLAYER_CONFIG.baseURL) {
    if (this.isLoading) { // To restrict player loading multiple times
      return;
    }
    this.isLoading = true;
    const iFrameSrc = url + '&build_number=' + this.buildNumber;
    const playerElement = this.contentIframe.nativeElement;
    playerElement.src = iFrameSrc;
    playerElement.onload = (event) => {
      try {
        this.adjustPlayerHeight();
        playerElement.contentWindow.initializePreview(this.playerConfig);
        playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => {
          const eid = telemetryEvent.detail.telemetryData.eid;
          if (eid && (eid === 'START')) {
            this.isLoading = false; // To restrict player loading multiple times
          }
          this.generateContentReadEvent(telemetryEvent);
        });
        window.frames['contentPlayer'].addEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
      } catch (err) {
        this.isLoading = false; // To restrict player loading multiple times
        const prevUrls = this.navigationHelperService.history;
        if (this.isCdnWorking.toLowerCase() === 'yes' && prevUrls[prevUrls.length - 2]) {
          history.back();
        }
      }
    };
  }
  /**
   * Initializes player with given config and emits player telemetry events
   * Emits event when content starts playing and end event when content was played/read completely
   */
  loadPlayer() {
    const downloadStatus = _.has(this.playerConfig, 'metadata.desktopAppMetadata') ?
    !_.has(this.playerConfig, 'metadata.desktopAppMetadata.isAvailable') ||
    _.get(this.contentData, 'desktopAppMetadata.isAvailable') : false;

    if (_.includes(this.router.url, 'browse') && !downloadStatus) {
      this.loadDefaultPlayer(`${this.configService.appConfig.PLAYER_CONFIG.localBaseUrl}webview=true`);
      return;
    } else if (!_.includes(this.router.url, 'browse') || downloadStatus) {
      this.playerConfig.data = '';
      if (_.get(this.playerConfig, 'metadata.artifactUrl')
        && _.includes(OFFLINE_ARTIFACT_MIME_TYPES, this.playerConfig.metadata.mimeType)) {
        const artifactFileName = this.playerConfig.metadata.artifactUrl.split('/');
        this.playerConfig.metadata.artifactUrl = artifactFileName[artifactFileName.length - 1];
      }
      this.loadDefaultPlayer(this.configService.appConfig.PLAYER_CONFIG.localBaseUrl);
      return;
    }

    if (this.previewCdnUrl !== '' && (this.isCdnWorking).toLowerCase() === 'yes') {
      this.loadCdnPlayer();
      return;
    }
    this.loadDefaultPlayer();
  }
  /**
   * Adjust player height after load
   */
  adjustPlayerHeight() {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#contentPlayer').css('height', height + 'px');
    }
  }

  generateScoreSubmitEvent(event: any) {
    if (_.toLower(event.data) === (_.toLower(this.CONSTANT.ACCESSEVENT))) {
      this.questionScoreSubmitEvents.emit(event);
    }
  }

  generateContentReadEvent(event: any) {
    const eid = event.detail.telemetryData.eid;
    if (eid && (eid === 'START' || eid === 'END')) {
      this.contentProgressEvents$.next(event);
    } else if (eid && (eid === 'IMPRESSION')) {
      this.emitSceneChangeEvent();
    }
    if (eid && (eid === 'ASSESS') || eid === 'START' || eid === 'END') {
      this.assessmentEvents.emit(event);
    }
  }
  emitSceneChangeEvent(timer = 0) {
    setTimeout(() => {
      const stageId = this.contentIframe.nativeElement.contentWindow.EkstepRendererAPI.getCurrentStageId();
      const eventData = { stageId };
      this.sceneChangeEvent.emit(eventData);
    }, timer); // waiting for player to load, then fetching stageId (if we dont wait stageId will be undefined)
  }
  deleteContent(event) {
    if (!this.router.url.includes('browse')) {
      this.contentDeleted = true;
      this.deletedContent.emit(event);
    }
  }

  checkContentDownloading(event) {
    if (!this.router.url.includes('browse')) {
      this.contentDeleted = false;
      const contentDetails = {
        contentId: event.identifier,
        contentData: event
      };
      this.contentData = event;
      this.playerConfig = this.playerService.getConfig(contentDetails);
      if (!_.isEmpty(this.playerConfig)) {
        this.loadPlayer();
      }
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

