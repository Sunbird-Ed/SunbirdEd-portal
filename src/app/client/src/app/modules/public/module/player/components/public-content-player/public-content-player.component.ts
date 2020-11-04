import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash-es';
import { Subject, of, throwError, Subscription } from 'rxjs';
import {
  ConfigService, ResourceService, ToasterService, UtilService, ContentUtilsServiceService,
  WindowScrollService, NavigationHelperService, PlayerConfig, ContentData, ITelemetryShare, LayoutService
} from '@sunbird/shared';
import { PublicPlayerService } from '../../../../services';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { PopupControlService } from '../../../../../../service/popup-control.service';
import { PlatformLocation } from '@angular/common';
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
  /** variables for player orientation change */
  loadLandscapePlayer =  false;
  isSingleContent: any;
  isMobileOrTab: boolean;
  showCloseButton = false;
  contentRatingModal = false;
  showLoader = true;
  paramsSub: Subscription;
  isFullScreenView = false;
  constructor(public activatedRoute: ActivatedRoute, public userService: UserService,
    public resourceService: ResourceService, public toasterService: ToasterService, public popupControlService: PopupControlService,
    public windowScrollService: WindowScrollService, public playerService: PublicPlayerService,
    public navigationHelperService: NavigationHelperService, public router: Router, private deviceDetectorService: DeviceDetectorService,
    private configService: ConfigService, public utilService: UtilService, private contentUtilsService: ContentUtilsServiceService,
    private location: PlatformLocation, public layoutService: LayoutService) {
    this.playerOption = {
      showContentRating: true
    };
  }
  /**
   *
   * @memberof ContentPlayerComponent
   */
  ngOnInit() {
    this.layoutService.scrollTop();
    this.isMobileOrTab = this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
    this.contentType = _.get(this.activatedRoute, 'snapshot.queryParams.contentType');
    this.paramsSub = this.activatedRoute.params.subscribe((params) => {
      this.showLoader = true; // show loader every time the param changes, used in route reuse strategy
      /** if dial-code search result is having only one content then 'isSingleContent' will be true else false */
      this.isSingleContent = _.get(history.state, 'isSingleContent') ;
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
    // Used to handle browser back button
    this.location.onPopState(() => {
      if (this.isSingleContent) {
        const prevUrl = this.navigationHelperService.history[this.navigationHelperService.history.length - 3];
        window.location.href = prevUrl.url;
      }
    });

    this.navigationHelperService.contentFullScreenEvent.subscribe((isFullScreen) => {
      this.isFullScreenView = isFullScreen;
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
        if (this.dialCode && !this.isSingleContent) {
          sessionStorage.setItem('singleContentRedirect', 'singleContentRedirect');
          const navigateOptions = {
            queryParams: {
              textbook: _.get(this.activatedRoute, 'snapshot.queryParams.l1Parent')
            }
          };
          this.router.navigate(['/get/dial/', this.dialCode], navigateOptions);
        } else {
          const prevUrl = this.navigationHelperService.history[this.navigationHelperService.history.length - 3];
          this.router.navigate([prevUrl.url]);
        }
      }, 100);
    }
  }

  /**
   * then 'isSingleContent' will be false and it should load player directly in landscape mode
   */
  deviceDetector() {
    if (this.isMobileOrTab && this.isSingleContent === false) {
      this.loadLandscapePlayer = true;
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
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
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

  closePlayer() {
    this.loadLandscapePlayer = false;
  }

}
