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
  @Output() questionScoreReviewEvents = new EventEmitter<any>();
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
    ACCESSEVENT: 'renderer:question:submitscore',
    ISLASTATTEMPT: 'renderer:selfassess:lastattempt',
    MAXATTEMPT: 'renderer:maxLimitExceeded',
    ACCESSREVIEWEVENT: 'renderer:question:reviewAssessment'
  };
  @Input() overlayImagePath: string;
  @Input() isSingleContent: boolean;
  @Input() telemetryObject: {};
  @Input() pageId: string;
  @Input() contentData;
  @Input() isContentDeleted: Subject<any>;
  @Output() closePlayerEvent = new EventEmitter<any>();
  @Output() ratingPopupClose = new EventEmitter<any>();
  @Output() selfAssessLastAttempt = new EventEmitter<any>();
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
  showQumlPlayer = false;
  contentId: string;
  collectionId:string;
// playerConfig:PlayerConfig;
  // public playerConfig:PlayerConfig = {"context":{"mode":"play","authToken":"","sid":"7283cf2e-d215-9944-b0c5-269489c6fa56","did":"3c0a3724311fe944dec5df559cc4e006","uid":"anonymous","channel":"505c7c48ac6dc1edc9b08f21db5a571d","pdata":{"id":"prod.diksha.portal","ver":"3.2.12","pid":"sunbird-portal.contentplayer"},"contextRollup":{"l1":"505c7c48ac6dc1edc9b08f21db5a571d"},"tags":[""],"cdata":[],"timeDiff":0,"objectRollup":{},"host":"","endpoint":"","userData":{"firstName":"Vivek","lastName":"Kasture"}},"config":{"traceId":"afhjgh","sideMenu":{"showShare":true,"showDownload":true,"showReplay":true,"showExit":true}},"metadata":{"compatibilityLevel":4,"copyright":"Tamilnadu","keywords":["b301epdf","b302epdf","epdf","1epdft1"],"subject":["Tamil"],"channel":"01235953109336064029450","language":["English"],"mimeType":"application/pdf","objectType":"Content","gradeLevel":["Class 1"],"appIcon":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31291455031832576019477/artifact/3_1535000262441.thumb.png","primaryCategory":"Teacher Resource","artifactUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291455031832576019477/b301b302_std_1_tamilenglish_lang_term-1_opt.pdf","contentType":"FocusSpot","identifier":"do_31291455031832576019477","audience":["Teacher"],"visibility":"Default","mediaType":"content","osId":"org.ekstep.quiz.app","languageCode":["en"],"license":"CC BY 4.0","name":"B301,B302_STD_1_TAMIL,ENGLISH_LANG_TERM 1_OPT","status":"Live","code":"43e68089-997e-49a4-902a-6262e5654515","description":"epdf","streamingUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291458881611366418883/b331332333_std_5_mathssciencesocial_tm_term-1_opt.pdf","medium":["Tamil"],"createdOn":"2019-12-16T07:59:53.154+0000","copyrightYear":2019,"additionalCategories":["Focus Spot"],"lastUpdatedOn":"2019-12-16T11:52:56.405+0000","creator":"SCERT 2 ECONTENTS","pkgVersion":1,"versionKey":"1576497176405","framework":"tn_k-12_5","createdBy":"f4f80b17-8609-44b9-b781-b79df5cf7e8d","board":"State (Tamil Nadu)","resourceType":"Read","licenseDetails":{"name":"CC BY 4.0","url":"https://creativecommons.org/licenses/by/4.0/legalcode","description":"For details see below:"}},"data":{}}

  /**
 * Dom element reference of contentRatingModal
 */
  @ViewChild('modal') modal;
  // playerConfig: { context: { mode: string; authToken: string; sid: string; did: string; uid: string; channel: string; contextRollup: { l1: string; }; partner: any[]; pdata: { id: string; ver: string; pid: string; }; tags: string[]; cdata: any[]; timeDiff: number; objectRollup: {}; host: string; endpoint: string; userData: { firstName: string; lastName: string; }; contentId: string; }; config: { traceId: string; sideMenu: { showShare: boolean; showDownload: boolean; showReplay: boolean; showExit: boolean; }; }; metadata: { copyright: string; subject: string[]; channel: string; language: string[]; mimeType: string; objectType: string; gradeLevel: string[]; appIcon: string; primaryCategory: string; artifactUrl: string; contentType: string; identifier: string; audience: string[]; visibility: string; mediaType: string; osId: string; languageCode: string[]; license: string; name: string; status: string; code: string; interceptionPoints: {}; streamingUrl: string; medium: string[]; createdOn: string; copyrightYear: number; lastUpdatedOn: string; creator: string; pkgVersion: number; versionKey: string; framework: string; createdBy: string; board: string; resourceType: string; orgDetails: { email: any; orgName: string; }; licenseDetails: { name: string; url: string; description: string; }; }; data: {}; };

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
    console.log('Player called');
    console.log('playerConfig', this.playerConfig);
// this.playerConfig = {"context":{"mode":"play","authToken":"","sid":"7283cf2e-d215-9944-b0c5-269489c6fa56","did":"3c0a3724311fe944dec5df559cc4e006","uid":"anonymous","channel":"505c7c48ac6dc1edc9b08f21db5a571d","pdata":{"id":"prod.diksha.portal","ver":"3.2.12","pid":"sunbird-portal.contentplayer"},"contextRollup":{"l1":"505c7c48ac6dc1edc9b08f21db5a571d"},"tags":[""],"cdata":[],"timeDiff":0,"objectRollup":{},"host":"","endpoint":"","userData":{"firstName":"Vivek","lastName":"Kasture"}},"config":{"traceId":"afhjgh","sideMenu":{"showShare":true,"showDownload":true,"showReplay":true,"showExit":true}},"metadata":{"compatibilityLevel":4,"copyright":"Tamilnadu","keywords":["b301epdf","b302epdf","epdf","1epdft1"],"subject":["Tamil"],"channel":"01235953109336064029450","language":["English"],"mimeType":"application/pdf","objectType":"Content","gradeLevel":["Class 1"],"appIcon":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31291455031832576019477/artifact/3_1535000262441.thumb.png","primaryCategory":"Teacher Resource","artifactUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291455031832576019477/b301b302_std_1_tamilenglish_lang_term-1_opt.pdf","contentType":"FocusSpot","identifier":"do_31291455031832576019477","audience":["Teacher"],"visibility":"Default","mediaType":"content","osId":"org.ekstep.quiz.app","languageCode":["en"],"license":"CC BY 4.0","name":"B301,B302_STD_1_TAMIL,ENGLISH_LANG_TERM 1_OPT","status":"Live","code":"43e68089-997e-49a4-902a-6262e5654515","description":"epdf","streamingUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291458881611366418883/b331332333_std_5_mathssciencesocial_tm_term-1_opt.pdf","medium":["Tamil"],"createdOn":"2019-12-16T07:59:53.154+0000","copyrightYear":2019,"additionalCategories":["Focus Spot"],"lastUpdatedOn":"2019-12-16T11:52:56.405+0000","creator":"SCERT 2 ECONTENTS","pkgVersion":1,"versionKey":"1576497176405","framework":"tn_k-12_5","createdBy":"f4f80b17-8609-44b9-b781-b79df5cf7e8d","board":"State (Tamil Nadu)","resourceType":"Read","licenseDetails":{"name":"CC BY 4.0","url":"https://creativecommons.org/licenses/by/4.0/legalcode","description":"For details see below:"}},"data":{}}

    //   context: {
    //     mode: "play",
    //     authToken: "",
    //     sid: "af794c16-5c2b-4c03-a093-13c4fb6497ea",
    //     did: "285e997b5b90426d31a3d9400030b3cf",
    //     uid: "anonymous",
    //     channel: "01269878797503692810",
    //     contextRollup: {
    //       l1: "01269878797503692810"
    //     },
    //     partner: [],
    //     pdata: {
    //       id: "local.sunbird.portal",
    //       ver: "5.2.0",
    //       pid: "sunbird-portal"
    //     },
    //     tags: [
    //       "01269878797503692810"
    //     ],
    //     cdata: [],
    //     timeDiff: -0.126,
    //     objectRollup: {},
    //     host: "",
    //     endpoint: "",
    //     userData: {
    //       firstName: "Guest",
    //       lastName: ""
    //     },
    //     contentId: "do_21374282058165452811276"
    //   },
    //   config: {
    //     traceId: "prince",
    //     sideMenu: {
    //       showShare: true,
    //       showDownload: true,
    //       showReplay: true,
    //       showExit: true
    //     }
    //   },
    //   metadata: {
    //     copyright: "Tamil nadu, MPPS GYARAGONDANAHALLI",
    //     subject: [
    //       "Science"
    //     ],
    //     channel: "01269878797503692810",
    //     language: [
    //       "English"
    //     ],
    //     mimeType: "application/pdf",
    //     objectType: "Content",
    //     gradeLevel: [
    //       "Class 8"
    //     ],
    //     appIcon: "https://obj.stage.sunbirded.org/sunbird-content-staging/content/do_21374282058165452811276/artifact/do_213269091461218304117_1619762141444_1.thumb.jpg",
    //     primaryCategory: "Teacher Resource",
    //     artifactUrl: "https://obj.stage.sunbirded.org/sunbird-content-staging/content/assets/do_21374282058165452811276/sample-1.pdf",
    //     contentType: "Resource",
    //     identifier: "do_21374282058165452811276",
    //     audience: [
    //       "Student"
    //     ],
    //     visibility: "Default",
    //     mediaType: "content",
    //     osId: "org.ekstep.quiz.app",
    //     languageCode: [
    //       "en"
    //     ],
    //     license: "CC BY 4.0",
    //     name: "SunbirdBootCamp123",
    //     status: "Live",
    //     code: "4108396e-0143-476d-8768-ee861e5ccdab",
    //     interceptionPoints: {},
    //     streamingUrl: "https://obj.stage.sunbirded.org/sunbird-content-staging/content/assets/do_21374282058165452811276/sample-1.pdf",
    //     medium: [
    //       "English"
    //     ],
    //     createdOn: "2023-02-28T13:20:03.039+0000",
    //     copyrightYear: 2023,
    //     lastUpdatedOn: "2023-02-28T13:27:32.179+0000",
    //     creator: "Guest name changed",
    //     pkgVersion: 1,
    //     versionKey: "1677590628352",
    //     framework: "tn_k-12_5",
    //     createdBy: "fca2925f-1eee-4654-9177-fece3fd6afc9",
    //     board: "State (Tamil Nadu)",
    //     resourceType: "Learn",
    //     orgDetails: {
    //       email: null,
    //       orgName: "Tamil nadu"
    //     },
    //     licenseDetails: {
    //       name: "CC BY 4.0",
    //       url: "https://creativecommons.org/licenses/by/4.0/legalcode",
    //       description: "For details see below:"
    //     }
    //   },
    //   data: {}
    // }
    console.log('playerConfig', this.playerConfig);

    this.checkForQumlPlayer()
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
        document.body.classList.add('o-y-hidden');
      } else {
        root.classList.remove('PlayerMediaQueryClass');
        document.body.classList.remove('o-y-hidden');
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
    this.checkForQumlPlayer();
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
          if (_.includes(_.get(value, 'mimeType'), _.get(this.playerConfig, 'metadata.mimeType')) && _.get(value, 'version') === 2) {
            this.playerConfig.context.threshold = _.get(value, 'threshold');
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

  checkForQumlPlayer() {
    console.log('showQumlPlayer1', this.showQumlPlayer);
    if (_.get(this.playerConfig, 'metadata.mimeType') === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset) {
      this.playerConfig.config.sideMenu.showDownload = false;
      if (!_.get(this.playerConfig, 'metadata.instructions')) {
        this.playerService.getQuestionSetRead(_.get(this.playerConfig, 'metadata.identifier')).subscribe((data: any) => {
          this.playerConfig.metadata.instructions = _.get(data, 'result.questionset.instructions');
          this.showQumlPlayer = true;
          console.log('showQumlPlayer2', this.showQumlPlayer,this.playerConfig);

        }, (error) => {
          console.log('showQumlPlayer3', this.showQumlPlayer, this.playerConfig);

          this.showQumlPlayer = true;
        });
      } else {
        console.log('showQumlPlayer4', this.showQumlPlayer, this.playerConfig);

        this.showQumlPlayer = true;
      }
    }
  }

  loadOldPlayer() {
    this.showNewPlayer = false;
    if (this.isDesktopApp) {
      this.updateMetadataForDesktop();
      const downloadStatus = Boolean(_.get(this.playerConfig, 'metadata.desktopAppMetadata.isAvailable'));
      let playerUrl = this.configService.appConfig.PLAYER_CONFIG.localBaseUrl;
      if (!downloadStatus) {
        playerUrl = `${playerUrl}webview=true`;
      }
      this.loadDefaultPlayer(playerUrl);
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
    this.contentId = _.get(this.playerConfig, 'metadata.identifier');
    this.collectionId = _.get(this.playerConfig, 'context.objectRollup.l1');
    if (downloadStatus && artifactUrl && !_.startsWith(artifactUrl, 'http://')) {
      this.playerConfig.metadata.artifactUrl = `${location.origin}/${artifactUrl}`;
    }
    this.addUserDataToContext();
    if (this.isMobileOrTab) {
      this.isFullScreenView = true;
      if (_.get(this.playerConfig, 'metadata.mimeType') !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset) {
        this.rotatePlayer();
      }
    }
    this.showNewPlayer = true;
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          const userProfile = user.userProfile;
          const userId = userProfile.id;
          const varName = (userId + '_' + (this.collectionId ? this.collectionId : '') + '_' + (this.contentId ? this.contentId : '') + '_config');
          const playerConfig: any = JSON.parse(localStorage.getItem(varName)) || {};
          this.playerConfig['config'] = { ...this.playerConfig['config'], ...playerConfig };
        }
      });
    } else {
      const varName = ('guest' + '_' + (this.collectionId ? this.collectionId : '') + '_' + (this.contentId ? this.contentId : '') + '_config');;
      const playerConfig: any = JSON.parse(localStorage.getItem(varName)) || {};
      this.playerConfig['config'] = { ...this.playerConfig['config'], ...playerConfig };
    }
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
    if (event.data.toLowerCase() === (this.CONSTANT.ISLASTATTEMPT).toLowerCase()) {
      this.selfAssessLastAttempt.emit(event);
    }
    if (event.data.toLowerCase() === (this.CONSTANT.MAXATTEMPT).toLowerCase()) {
      this.selfAssessLastAttempt.emit(event);
    }
    if (event.data.toLowerCase() === (this.CONSTANT.ACCESSREVIEWEVENT).toLowerCase()) {
      this.questionScoreReviewEvents.emit(event);
    }
  }

  generatelimitedAttemptEvent(event) {
    if (_.get(event, 'edata.isLastAttempt')) {
      this.selfAssessLastAttempt.emit(event);
    } else if (_.get(event, 'edata.maxLimitExceeded')) {
      this.selfAssessLastAttempt.emit(event);
    }
  }

  eventHandler(event) {
    if (event.eid === 'END') {
      const metaDataconfig = event.metaData;
      if (this.userService.loggedIn) {
        this.userService.userData$.subscribe((user: any) => {
          if (user && !user.err) {
            const userProfile = user.userProfile;
            const userId = userProfile.id;
            const varName = (userId + '_' + (this.collectionId ? this.collectionId : '') + '_' + (this.contentId ? this.contentId : '') + '_config');
            localStorage.setItem(varName, JSON.stringify(metaDataconfig));
          }
        });
      } else {
        const userId = 'guest';
        const varName = (userId + '_' + (this.collectionId ? this.collectionId : '') + '_' + (this.contentId ? this.contentId : '') + '_config');
        localStorage.setItem(varName, JSON.stringify(metaDataconfig));
      }
    }
    if (event.eid === 'exdata') {
      this.generatelimitedAttemptEvent(event);
      return;
    }
    if (_.get(event, 'edata.type') === 'SHARE') {
      this.contentUtilsServiceService.contentShareEvent.emit('open');
      this.mobileViewDisplay = 'none';
    }
    if (_.get(event, 'edata.type') === 'PRINT') {
      const windowFrame = window.document.querySelector('pdf-viewer iframe');
      if (windowFrame) {
        windowFrame['contentWindow'].print();
      }
      this.mobileViewDisplay = 'none';
    }
  }

  generateContentReadEvent(event: any, newPlayerEvent?) {
    let eventCopy = newPlayerEvent ? _.cloneDeep(event) : event;
    if (!eventCopy) {
      return;
    }
    if (newPlayerEvent) {
      eventCopy = { detail: {telemetryData: eventCopy}};
    }
    const eid = _.get(eventCopy, 'detail.telemetryData.eid');
    const contentId = _.get(eventCopy, 'detail.telemetryData.object.id');
    // this.contentId = contentId;
    if (eid && (eid === 'START' || eid === 'END') && contentId === _.get(this.playerConfig, 'metadata.identifier')) {
      this.showRatingPopup(eventCopy);
      if (this.contentProgressEvents$) {
        this.contentProgressEvents$.next(eventCopy);
      }
    } else if (eid && (eid === 'IMPRESSION')) {
      this.emitSceneChangeEvent();
    }
    if (eid && (eid === 'ASSESS') || eid === 'START' || eid === 'END') {
      this.assessmentEvents.emit(eventCopy);
    }

    if (_.get(this.playerConfig, 'metadata.mimeType') === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset && eid === 'END') {
      this.questionScoreSubmitEvents.emit(event);
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
    this.focusOnReplay();
    this.ratingPopupClose.emit({});
  }
  
  focusOnReplay() {
    if (this.playerType === 'quml-player') {
      const replayButton: HTMLElement = document.querySelector('.replay-section');
      if (replayButton) {
        replayButton.focus();
      }
    }
  }
  
  public addUserDataToContext() {
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          const userProfile = user.userProfile;
          this.playerConfig.context['userData'] = {
            firstName: userProfile.firstName ? userProfile.firstName : 'Guest',
            lastName: userProfile.lastName ? userProfile.lastName : ''
          };
        }
      });
    } else {
      this.playerConfig.context.userData = {
        firstName: this.userService.guestUserProfile.formatedName || 'Guest',
        lastName: ''
      };
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
