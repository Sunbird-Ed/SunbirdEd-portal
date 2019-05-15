import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash-es';
import { Subject  } from 'rxjs';
import {
  ConfigService, ResourceService, ToasterService,
  WindowScrollService, NavigationHelperService, PlayerConfig, ContentData
} from '@sunbird/shared';
import { PublicPlayerService } from '../../../../services';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';

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
  public unsubscribe$ = new Subject<void>();
  public badgeData: Array<object>;
  public dialCode: string;
  telemetryCdata: Array<{}>;
  public telemetryInteractObject: IInteractEventObject;
  public closePlayerInteractEdata: IInteractEventEdata;

  constructor(public activatedRoute: ActivatedRoute, public userService: UserService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public windowScrollService: WindowScrollService, public playerService: PublicPlayerService,
    public navigationHelperService: NavigationHelperService, public router: Router, private deviceDetectorService: DeviceDetectorService,
    private configService: ConfigService
  ) {
    this.playerOption = {
      showContentRating: true
    };
  }
  /**
   *
   * @memberof ContentPlayerComponent
   */
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.contentId;
      this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
      this.setTelemetryData();
      this.getContent();
      this.deviceDetector();
    });
  }
  setTelemetryData() {
    this.telemetryInteractObject = {
      id: this.contentId,
      type: 'Content',
      ver: '1.0'
    };
    this.closePlayerInteractEdata = {
      id: 'close-player',
      type: 'click',
      pageid: 'public'
    };
  }
  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.dialCode = queryParams.dialCode;
    });
    const options: any = { dialCode: this.dialCode };
    const params = {params: this.configService.appConfig.PublicPlayer.contentApiQueryParams};
    this.playerService.getContent(this.contentId, params).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          const contentDetails = {
            contentId: this.contentId,
            contentData: response.result.content
          };
          this.playerConfig = this.playerService.getConfig(contentDetails, options);
          this.contentData = response.result.content;
          if (this.contentData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
            setTimeout(() => {
              this.showExtContentMsg = true;
            }, 5000);
          }
          this.showPlayer = true;
          this.windowScrollService.smoothScroll('content-player');
          this.badgeData = _.get(response, 'result.content.badgeAssertions');
        },
        (err) => {
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
    this.navigationHelperService.navigateToResource('/explore');
  }
  deviceDetector() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    if (deviceInfo.device === 'android' || deviceInfo.os === 'android') {
      this.showFooter = true;
    }
  }

  ngAfterViewInit () {
    setTimeout(() => {
        this.dialCode = _.get(this.activatedRoute, 'snapshot.queryParams.dialCode');
        if (this.dialCode) {
          this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
        }
        this.telemetryImpression = {
          context: {
            env: this.activatedRoute.snapshot.data.telemetry.env,
            cdata: this.telemetryCdata
          },
          object: {
            id: this.activatedRoute.snapshot.params.contentId,
            type: 'Content',
            ver: '1.0'
          },
          edata: {
            type: this.activatedRoute.snapshot.data.telemetry.type,
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
            uri: this.router.url,
            subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
            duration: this.navigationHelperService.getPageLoadTime()
          }
        };
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
