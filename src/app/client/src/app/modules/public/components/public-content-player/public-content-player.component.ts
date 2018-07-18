import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, UserService } from '@sunbird/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import {
  ConfigService, IUserData, ResourceService, ToasterService,
  WindowScrollService, NavigationHelperService, PlayerConfig, ContentData
} from '@sunbird/shared';
import { PublicPlayerService } from './../../services';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-public-content-player',
  templateUrl: './public-content-player.component.html',
  styleUrls: ['./public-content-player.component.css']
})
export class PublicContentPlayerComponent implements OnInit {
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
  /**
   * contain contentData
   */
  selectedLanguage: string;
  queryParams: any;

  showExtContentMsg = false;

  public showFooter: Boolean = false;
  contentData: ContentData;
  constructor(public activatedRoute: ActivatedRoute, public userService: UserService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public windowScrollService: WindowScrollService, public playerService: PublicPlayerService,
    public navigationHelperService: NavigationHelperService, public router: Router, private deviceDetectorService: DeviceDetectorService,
    private configService: ConfigService
  ) {
  }
  /**
   *
   * @memberof ContentPlayerComponent
   */
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.contentId;
      this.setTelemetryData();
      this.getContent();
      this.deviceDetector();
    });
  }
  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.contentId,
        type: 'content',
        ver: '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
  }
  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    this.playerService.getContent(this.contentId).subscribe(
      (response) => {
        const contentDetails = {
          contentId: this.contentId,
          contentData: response.result.content
        };
        this.playerConfig = this.playerService.getConfig(contentDetails);
        this.contentData = response.result.content;
             if (this.contentData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
            setTimeout(() => {
              this.showExtContentMsg = true;
            }, 5000);
          }
        this.showPlayer = true;
        this.windowScrollService.smoothScroll('content-player');
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
    this.navigationHelperService.navigateToResource('/explore/1');
  }

  deviceDetector() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    if ( deviceInfo.device === 'android' || deviceInfo.os === 'android') {
      this.showFooter = true;
    }
  }
}
