import { ConfigService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter,
OnChanges, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ToasterService, ResourceService, ContentUtilsServiceService } from '@sunbird/shared';
const OFFLINE_ARTIFACT_MIME_TYPES = ['application/epub'];
import { Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { UserService, FormService } from '../../../core/services';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { CsContentProgressCalculator } from '@project-sunbird/client-services/services/content/utilities/content-progress-calculator';
import { ContentService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() playerConfig: PlayerConfig;
  @Output() assessmentEvents = new EventEmitter<any>();
  @Output() questionScoreSubmitEvents = new EventEmitter<any>();
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @Output() playerOnDestroyEvent = new EventEmitter<any>();
  @Output() sceneChangeEvent = new EventEmitter<any>();
  @Input() contentProgressEvents$: Subject<any>;
  playerLoaded = false;
  buildNumber: string;
  @Input() playerOption: any;
  contentRatingModal = false;
  showRatingModalAfterClose = false;
  previewCdnUrl: string;
  isCdnWorking: string;
  CONSTANT = {
    ACCESSEVENT: 'renderer:question:submitscore'
  };
  @Input() overlayImagePath: string;
  @Input() isSingleContent: boolean;
  @Input() telemetryObject: {};
  @Input() pageId: string;
  @Input() contentData;
  @Input() isContentDeleted: Subject<any>;
  @Output() closePlayerEvent = new EventEmitter<any>();
  @Output() ratingPopupClose = new EventEmitter<any>();
  contentDeleted = false;
  isMobileOrTab: boolean;
  showPlayIcon = true;
  closeButtonInteractEdata: IInteractEventEdata;
  loadPlayerInteractEdata: IInteractEventEdata;
  playerOverlayImage: string;
  isFullScreenView = false;
  public unsubscribe = new Subject<void>();
  public showNewPlayer = false;
  mobileViewDisplay = 'block';
  playerType: string;
  isDesktopApp = false;

  /**
 * Dom element reference of contentRatingModal
 */
  @ViewChild('modal') modal;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.closeContentFullScreen();
  }

  constructor(public configService: ConfigService, public router: Router, private toasterService: ToasterService,
    public resourceService: ResourceService, public navigationHelperService: NavigationHelperService,
    private deviceDetectorService: DeviceDetectorService, private userService: UserService, public formService: FormService
    , public contentUtilsServiceService: ContentUtilsServiceService, private contentService: ContentService,
    private cdr: ChangeDetectorRef, public playerService: PublicPlayerService, private utilService: UtilService) {
    this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'))
      ? (<HTMLInputElement>document.getElementById('buildNumber')).value : '1.0';
    this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
    this.isCdnWorking = (<HTMLInputElement>document.getElementById('cdnWorking'))
      ? (<HTMLInputElement>document.getElementById('cdnWorking')).value : 'no';
  }

  @HostListener('window:orientationchange', ['$event'])
  public handleOrientationChange() {
    const screenType = _.get(screen, 'orientation.type');
      if ( screenType === 'portrait-primary' || screenType === 'portrait-secondary' ) {
        this.closeFullscreen();
      }
  }

  ngOnInit() {
    // If `sessionStorage` has UTM data; append the UTM data to context.cdata
    if (this.playerConfig && sessionStorage.getItem('UTM')) {
      let utmData;
      try {
        utmData = JSON.parse(sessionStorage.getItem('UTM'));
      } catch (error) {
        throw new Error('JSON Parse Error => UTM data');
      }
      if (utmData && _.get(this.playerConfig, 'context.cdata')) {
        this.playerConfig.context.cdata = _.union(this.playerConfig.context.cdata, utmData);
      }
      if (utmData && !_.get(this.playerConfig, 'context.cdata')) {
        this.playerConfig.context['cdata'] = [];
        this.playerConfig.context.cdata = _.union(this.playerConfig.context.cdata, utmData);
      }
    }
    this.isDesktopApp = this.utilService.isDesktopApp;
    // Check for loggedIn user; and append user data to context object
    // User data (`firstName` and `lastName`) is used to show at the end of quiz
    if (this.playerConfig) {
        this.addUserDataToContext();
    }
    this.isMobileOrTab = this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
    if (this.isSingleContent === false) {
      this.showPlayIcon = false;
    }
    this.setTelemetryData();
    this.navigationHelperService.contentFullScreenEvent.
    pipe(takeUntil(this.unsubscribe)).subscribe(isFullScreen => {
      this.isFullScreenView = isFullScreen;
      const root: HTMLElement = document.getElementsByTagName( 'html' )[0];
      if (isFullScreen) {
        root.classList.add('PlayerMediaQueryClass');
      } else {
        root.classList.remove('PlayerMediaQueryClass');
      }
      if (this.isDesktopApp) {
        const hideCM = isFullScreen ? true : false;
        this.navigationHelperService.handleContentManagerOnFullscreen(hideCM);
      }
      this.loadPlayer();
    });

    this.contentUtilsServiceService.contentShareEvent.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      if (this.isMobileOrTab && data === 'close') {
        this.mobileViewDisplay = 'block';
      }
    });
  }

  /**
   * loadPlayer method will be called
   */
  ngAfterViewInit() {
    if (this.playerConfig) {
      this.loadPlayer();
    }
  }

  ngOnChanges(changes) {
    this.contentRatingModal = false;
    this.showNewPlayer = false;
    this.cdr.detectChanges();
    if (this.playerConfig) {
      this.playerOverlayImage = this.overlayImagePath ? this.overlayImagePath : _.get(this.playerConfig, 'metadata.appIcon');
      this.loadPlayer();
    }
  }
  loadCdnPlayer() {
    const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.cdnUrl + '&build_number=' + this.buildNumber;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          this.adjustPlayerHeight();
          playerElement.contentWindow.initializePreview(this.playerConfig);
          if (this.playerLoaded) {
            playerElement.removeEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
            window.frames['contentPlayer'].removeEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
          }
          this.playerLoaded = true;
          playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
          window.frames['contentPlayer'].addEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
        } catch (err) {
          this.loadDefaultPlayer();
        }
      };
    }, 0);
  }
  loadDefaultPlayer(url = this.configService.appConfig.PLAYER_CONFIG.baseURL) {
    const iFrameSrc = url + '&build_number=' + this.buildNumber;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          this.adjustPlayerHeight();
          playerElement.contentWindow.initializePreview(this.playerConfig);
          if (this.playerLoaded) {
            playerElement.removeEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
            window.frames['contentPlayer'].removeEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
          }
          this.playerLoaded = true;
          playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
          window.frames['contentPlayer'].addEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
        } catch (err) {
          const prevUrls = this.navigationHelperService.history;
          if (this.isCdnWorking.toLowerCase() === 'yes' && prevUrls[prevUrls.length - 2]) {
            history.back();
          }
        }
      };
    }, 0);
  }

  loadPlayer() {
    this.playerType = null;
    const formReadInputParams = {
      formType: 'content',
      formAction: 'play',
      contentType: 'player'
    };
    this.formService.getFormConfig(formReadInputParams).subscribe(
      (data: any) => {
        let isNewPlayer = false;
        _.forEach(data, (value) => {
          if (_.includes(_.get(value, 'mimeType'), this.playerConfig.metadata.mimeType) && _.get(value, 'version') === 2) {
            this.playerType = _.get(value, 'type');
            isNewPlayer = true;
          }
        });

        if (isNewPlayer) {
          this.playerLoaded = false;
          this.loadNewPlayer();
        } else {
          this.loadOldPlayer();
        }
      },
      (error) => {
        this.loadOldPlayer();
      }
    );
  }

  loadOldPlayer() {
    this.showNewPlayer = false;
    if (this.isDesktopApp) {
      this.updateMetadataForDesktop();
      this.loadDefaultPlayer(this.configService.appConfig.PLAYER_CONFIG.localBaseUrl);
      return;
    }
    if (this.isMobileOrTab) {
      this.rotatePlayer();
    }
    if (this.previewCdnUrl !== '' && (this.isCdnWorking).toLowerCase() === 'yes') {
      this.loadCdnPlayer();
      return;
    }

    this.loadDefaultPlayer();
  }

  loadNewPlayer() {
    const downloadStatus = Boolean(_.get(this.playerConfig, 'metadata.desktopAppMetadata.isAvailable'));
    const artifactUrl = _.get(this.playerConfig, 'metadata.artifactUrl');
    if (downloadStatus && artifactUrl && !_.startsWith(artifactUrl, 'http://')) {
      this.playerConfig.metadata.artifactUrl = `${location.origin}/${artifactUrl}`;
    }
    this.addUserDataToContext();
    if (this.isMobileOrTab) {
      this.isFullScreenView = true;
      this.rotatePlayer();
    }
    this.showNewPlayer = true;
  }

  // Update ArtifactUrl for old Player
  updateMetadataForDesktop() {
    const downloadStatus = Boolean(_.get(this.playerConfig, 'metadata.desktopAppMetadata.isAvailable'));
    if (downloadStatus) {
      this.playerConfig.data = '';
      if (_.get(this.playerConfig, 'metadata.artifactUrl')
        && _.includes(OFFLINE_ARTIFACT_MIME_TYPES, this.playerConfig.metadata.mimeType)) {
        const artifactFileName = this.playerConfig.metadata.artifactUrl.split('/');
        this.playerConfig.metadata.artifactUrl = artifactFileName[artifactFileName.length - 1];
      }
    }
  }

  /**
   * Adjust player height after load
   */
  adjustPlayerHeight() {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      let height = playerWidth * (9 / 16);
      if (_.get(screen, 'orientation.type') === 'landscape-primary' && this.isMobileOrTab) {
        height = window.innerHeight;
      }
      $('#contentPlayer').css('height', height + 'px');
    }
  }

  generateScoreSubmitEvent(event: any) {
    if (event.data.toLowerCase() === (this.CONSTANT.ACCESSEVENT).toLowerCase()) {
      this.questionScoreSubmitEvents.emit(event);
    }
  }
  eventHandler(event) {
    if (_.get(event, 'edata.type') === 'SHARE') {
      this.contentUtilsServiceService.contentShareEvent.emit('open');
      this.mobileViewDisplay = 'none';
    }
  }

  generateContentReadEvent(event: any, newPlayerEvent?) {
    if (!event) {
      return;
    }
    if (newPlayerEvent) {
      event = { detail: {telemetryData: event}};
    }
    const eid = event.detail.telemetryData.eid;
    if (eid && (eid === 'START' || eid === 'END')) {
      this.showRatingPopup(event);
      if (this.contentProgressEvents$) {
        this.contentProgressEvents$.next(event);
      }
    } else if (eid && (eid === 'IMPRESSION')) {
      this.emitSceneChangeEvent();
    }
    if (eid && (eid === 'ASSESS') || eid === 'START' || eid === 'END') {
      this.assessmentEvents.emit(event);
    }
  }
  emitSceneChangeEvent(timer = 0) {
    setTimeout(() => {
      if (_.get(this, 'contentIframe.nativeElement')) {
        const stageId = this.contentIframe.nativeElement.contentWindow.EkstepRendererAPI.getCurrentStageId();
        const eventData = { stageId };
        this.sceneChangeEvent.emit(eventData);
      }
    }, timer); // waiting for player to load, then fetching stageId (if we dont wait stageId will be undefined)
  }

  showRatingPopup(event) {
    let contentProgress;
    const playerSummary: Array<any> = _.get(event, 'detail.telemetryData.edata.summary');
    if (playerSummary) {
      const contentMimeType = this.playerConfig.metadata.mimeType;
      contentProgress = CsContentProgressCalculator.calculate(playerSummary, contentMimeType);
    }
    if (event.detail.telemetryData.eid === 'END' && contentProgress === 100) {
      this.contentRatingModal = !this.isFullScreenView;
      this.showRatingModalAfterClose = true;
      if (this.modal) {
        this.modal.showContentRatingModal = true;
      }
    }
  }

  /**
   * this method will handle play button click and turn the player into landscape
   */
  enablePlayer(mode: boolean) {
    this.showPlayIcon = mode;
    this.loadPlayer();
  }

  /** this method checks for the browser capability to be fullscreen via if-else ladder
   * if match found, it will turn the player along will be close button into fullscreen and then
   * rotate it to landscape mode
   */
  rotatePlayer() {
    setTimeout(() => {
      const playVideo: any = document.querySelector('#playerFullscreen');
      try {
        if (playVideo.requestFullscreen) {
          playVideo.requestFullscreen();
        } else if (playVideo.mozRequestFullScreen) { /* Firefox */
          playVideo.mozRequestFullScreen();
        } else if (playVideo.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          playVideo.webkitRequestFullscreen();
        } else if (playVideo.msRequestFullscreen) { /* IE/Edge */
          playVideo.msRequestFullscreen();
        }
        screen.orientation.lock('landscape');
      } catch (error) {}
    });
  }

  /** when user clicks on close button
   * this method will let the player to exit from fullscreen mode and
   * 1. video thumbnail will be shown for single content
   * 2. content-details page will be shown ( for multi-result dial-code search flow)
   */
  closeFullscreen() {
    /** to exit the fullscreen mode */
    if (document['exitFullscreen']) {
      document['exitFullscreen']();
    } else if (document['mozCancelFullScreen']) { /* Firefox */
      document['mozCancelFullScreen']();
    } else if (document['webkitExitFullscreen']) { /* Chrome, Safari and Opera */
      document['webkitExitFullscreen']();
    } else if (document['msExitFullscreen']) { /* IE/Edge */
      document['msExitFullscreen']();
    }

    if (this.showRatingModalAfterClose) {
      this.contentRatingModal = true;
      if (this.modal) {
        this.modal.showContentRatingModal = true;
      }
    }
     /** to change the view of the content-details page */
    this.showPlayIcon = true;
    this.closePlayerEvent.emit();
  }

  setTelemetryData() {
    this.closeButtonInteractEdata = {
      id: 'player-close-button',
      type: 'click',
      pageid: this.pageId
    };

    this.loadPlayerInteractEdata = {
      id: 'play-button',
      type: 'click',
      pageid: this.pageId
    };
  }

  closeContentFullScreen() {
    this.navigationHelperService.emitFullScreenEvent(false);
    this.loadPlayer();
  }

  closeModal() {
    this.ratingPopupClose.emit({});
  }

  public addUserDataToContext() {
    this.playerConfig.context['userData'] = { firstName: 'anonymous', lastName: 'anonymous' };
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          const userProfile = user.userProfile;
          this.playerConfig.context['userData'] = {
            firstName: userProfile.firstName ? userProfile.firstName : 'anonymous',
            lastName: userProfile.lastName ? userProfile.lastName : 'anonymous'
          };
        }
      });
    }
  }

  ngOnDestroy() {
    const playerElement = _.get(this.contentIframe, 'nativeElement');
    if (playerElement) {
      if (_.get(playerElement, 'contentWindow.telemetry_web.tList.length')) {
        const request = {
          url: this.configService.urlConFig.URLS.TELEMETRY.SYNC,
          data: {
            'id': 'api.sunbird.telemetry',
            'ver': '3.0',
            'events': playerElement.contentWindow.telemetry_web.tList.map(item => JSON.parse(item))
          }
        };
        this.contentService.post(request).subscribe();
      }
      playerElement.remove();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
