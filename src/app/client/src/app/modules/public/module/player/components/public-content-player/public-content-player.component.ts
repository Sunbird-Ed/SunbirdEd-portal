import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash-es';
import { Subject, of, throwError } from 'rxjs';
import {
  ConfigService, ResourceService, ToasterService, UtilService, ContentUtilsServiceService,
  WindowScrollService, NavigationHelperService, PlayerConfig, ContentData, ITelemetryShare
} from '@sunbird/shared';
import { PublicPlayerService } from '../../../../services';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { environment } from '@sunbird/environment';
import { PopupControlService } from '../../../../../../service/popup-control.service';
@Component({
  selector: 'app-public-content-player',
  templateUrl: './public-content-player.component.html',
  styleUrls: ['./public-content-player.component.scss']
})
export class PublicContentPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
   * content id
   */
  contentType: string;
  contentId: string;
  /**
   * contains player configuration
   */
  playerConfig: PlayerConfig;
  /**
   * Flag to show player
   */
  showPlayer = false;
  /**
   * Flag to show error
   */
  showError = false;
  /**
   * contain error message
   */
  errorMessage: string;
  queryParams: any;
  playerOption: any;
  showExtContentMsg = false;
  public showFooter: Boolean = false;
  contentData: ContentData;
  shareLink: string;
  public unsubscribe$ = new Subject<void>();
  public badgeData: Array<object>;
  public dialCode: string;
  telemetryCdata: Array<{}>;
  public telemetryInteractObject: IInteractEventObject;
  public closePlayerInteractEdata: IInteractEventEdata;
  public printPdfInteractEdata: IInteractEventEdata;
  public telemetryShareData: Array<ITelemetryShare>;
  public sharelinkModal: boolean;
  public objectRollup = {};
  isOffline: boolean = environment.isOffline;
  /** variables for player orientation change */
  playerThumbnail = true;
  overlayImagePath: string;
  loadLandscapePlayer =  false;
  loadPlayerInteractEdata: IInteractEventEdata;
  closeButtonInteractEdata: IInteractEventEdata;
  isSingleContent: any;
  isMobileOrTab: boolean;
  showCloseButton = false;
  contentRatingModal = false;
  showLoader = true;
  constructor(public activatedRoute: ActivatedRoute, public userService: UserService,
    public resourceService: ResourceService, public toasterService: ToasterService, public popupControlService: PopupControlService,
    public windowScrollService: WindowScrollService, public playerService: PublicPlayerService,
    public navigationHelperService: NavigationHelperService, public router: Router, private deviceDetectorService: DeviceDetectorService,
    private configService: ConfigService, public utilService: UtilService, private contentUtilsService: ContentUtilsServiceService) {
    this.playerOption = {
      showContentRating: true
    };
  }

  /** It will handle device back-button click to rotate landscape to portrait */
  @HostListener('window:orientationchange', ['$event'])
  public handleOrientationChange() {
    const screenType = _.get(screen, 'orientation.type');
      if ( screenType === 'portrait-primary' || screenType === 'portrait-secondary' ) {
        this.closeFullscreen();
      }
  }
  /**
   *
   * @memberof ContentPlayerComponent
   */
  ngOnInit() {
    /** if dial-code search result is having only one content then 'isSingleContent' will be true else false */
    this.isSingleContent = _.get(history.state, 'isSingleContent') ;
    /** if the browser is opened from mobile or tablet then 'isMobileOrTab' will be true else false*/
    this.isMobileOrTab = this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
    this.contentType = _.get(this.activatedRoute, 'snapshot.queryParams.contentType');
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.contentId;
      this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
      if (_.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')) {
        this.objectRollup = {
          l1 : _.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')
        };
      }
      this.setTelemetryData();
      this.getContent();
    });

  }
  setTelemetryData() {
    this.telemetryInteractObject = {
      id: this.contentId,
      type: this.contentType,
      ver: '1.0'
    };
    this.closePlayerInteractEdata = {
      id: 'close-player',
      type: 'click',
      pageid: 'public'
    };
    this.printPdfInteractEdata = {
      id: 'print-pdf-button',
      type: 'click',
      pageid: 'public'
    };
    this.loadPlayerInteractEdata = {
      id: 'play-button',
      type: 'click',
      pageid: 'public'
    };
    this.closeButtonInteractEdata = {
      id: 'player-close-button',
      type: 'click',
      pageid: 'public'
    };
  }


  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    const options: any = { dialCode: this.dialCode };
    const params = {params: this.configService.appConfig.PublicPlayer.contentApiQueryParams};
    this.playerService.getContent(this.contentId, params).pipe(
      mergeMap((response) => {
        if (_.get(response, 'result.content.status') === 'Unlisted') {
          return throwError({
            code: 'UNLISTED_CONTENT'
          });
        }
        return of(response);
      }),
      takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.showLoader = false;
      const contentDetails = {
        contentId: this.contentId,
        contentData: response.result.content
      };
      this.playerConfig = this.playerService.getConfig(contentDetails, options);
      this.playerConfig.context.objectRollup = this.objectRollup;
      this.contentData = response.result.content;
      if (this.contentData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
        setTimeout(() => {
          this.showExtContentMsg = true;
        }, 5000);
      }
      this.overlayImagePath = _.get(response, 'result.content.appIcon');
      this.showPlayer = true;
      // this.windowScrollService.smoothScroll('content-player');
      this.badgeData = _.get(response, 'result.content.badgeAssertions');
    }, (err) => {
      this.showError = true;
      this.errorMessage = this.resourceService.messages.stmsg.m0009;
    });
  }

  /**
   * retry launching player with same content details
   * @memberof ContentPlayerComponent
   */
  tryAgain() {
    this.showError = false;
    this.getContent();
  }
  /**
   * closes conent player and revert to previous url
   * @memberof ContentPlayerComponent
   */
  close() {
    try {
      window.frames['contentPlayer'].contentDocument.body.onunload({});
    } catch {

    } finally {
      setTimeout(() => {
        if (this.dialCode) {
          sessionStorage.setItem('singleContentRedirect', 'singleContentRedirect');
          const navigateOptions = {
            queryParams: {
              textbook: _.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')
            }
          };
          this.router.navigate(['/get/dial/', this.dialCode], navigateOptions);
        } else {
          this.navigationHelperService.navigateToPreviousUrl('/explore');
        }
      }, 100);
    }
  }

  /** When dial-code search result page has multiple contents and user clicked on a card from them
   * then 'isSingleContent' will be false and it should load player directly in landscape mode
   */
  deviceDetector() {
    if (this.isMobileOrTab) {
      if (this.isSingleContent === false) {
        this.loadLandscapePlayer = true;
      }
      this.showFooter = true;
      this.rotatePlayer();
    } else {
      this.playerThumbnail = false;
    }
  }

  /** When user comes from a single content dial-code search,
   * then auto play will not happen, until user clicks on the play icon
   * this method will handle that and turn the player into landscape
   */
  enablePlayer(mode: boolean) {
    this.playerThumbnail = mode;
    if (this.isMobileOrTab) {
      this.rotatePlayer();
     }
  }

  /** this method checks for the browser capability to be fullscreen via if-else ladder
   * if match found, it will turn the player along will be close button into fullscreen and then
   * rotate it to landscape mode
   */
  rotatePlayer() {
    setTimeout(() => {
      const playVideo: any = document.querySelector('#playerFullscreen');
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
      this.showCloseButton = true;
    });

}

/** when user clicks on close button
   * this method will let the player to exit from fullscreen mode and
   * 1. video thumbnail will be shown for single content
   * 2. content-details page will be shown ( for multi-result dial-code search flow)
   */
  closeFullscreen() {
    this.showCloseButton = false;
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
     /** to change the view of the content-details page */
    if (this.isSingleContent) {
      this.playerThumbnail = true;
    } else {
      this.loadLandscapePlayer = false;
      this.playerThumbnail = true;
    }
  }

  ngAfterViewInit () {
    setTimeout(() => {
        if (this.dialCode) {
          this.telemetryCdata = [{ 'type': 'DialCode', 'id': this.dialCode }];
        }
        this.telemetryImpression = {
          context: {
            env: this.activatedRoute.snapshot.data.telemetry.env,
            cdata: this.telemetryCdata
          },
          object: {
            id: this.activatedRoute.snapshot.params.contentId,
            type: this.contentType,
            ver: '1.0',
            rollup: this.objectRollup
          },
          edata: {
            type: this.activatedRoute.snapshot.data.telemetry.type,
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
            uri: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
            subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
            duration: this.navigationHelperService.getPageLoadTime()
          }
        };
        this.deviceDetector();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onShareLink() {
    this.shareLink = this.contentUtilsService.getPublicShareUrl(this.contentId,
      _.get(this.contentData, 'mimeType'));
    this.setTelemetryShareData(this.contentData);
  }

  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }

  printPdf(pdfUrl: string) {
    window.open(pdfUrl, '_blank');
  }

}
