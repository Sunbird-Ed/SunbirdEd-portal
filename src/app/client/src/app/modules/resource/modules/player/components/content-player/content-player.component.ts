import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, PlayerService, CopyContentService, PermissionService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { INoteData } from '@sunbird/notes';
import {
  ConfigService, IUserData, ResourceService, ToasterService, WindowScrollService, NavigationHelperService,
  PlayerConfig, ContentData, ContentUtilsServiceService, ITelemetryShare
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../../../service/popup-control.service';

/**
 *Component to play content
 */
@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html'
})
export class ContentPlayerComponent implements OnInit, AfterViewInit {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;

  closeIntractEdata: IInteractEventEdata;

  printPdfInteractEdata: IInteractEventEdata;

  objectInteract: IInteractEventObject;

  copyContentInteractEdata: IInteractEventEdata;

  sharelinkModal: boolean;

  public badgeData: Array<object>;
  /**
   * contains link that can be shared
   */
  shareLink: string;
  /**
   * content id
   */
  contentId: string;

  contentStatus: string;
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
  contentData: ContentData;
  /**
	 * telemetryShareData
	*/
  telemetryShareData: Array<ITelemetryShare>;
  /**
   * to show loader while copying content
   */
  showCopyLoader = false;
  /**
   * To show/hide the note popup editor
   */
  showNoteEditor = false;
  /**
   * This variable holds the details of the note created
   */
  createNoteData: INoteData;

  /**
   * Page Load Time, used this data in impression telemetry
   */
  public pageLoadDuration: Number;

  showExtContentMsg = false;

  closeUrl: any;
  playerOption: any;
  constructor(public activatedRoute: ActivatedRoute, public navigationHelperService: NavigationHelperService,
    public userService: UserService, public resourceService: ResourceService, public router: Router,
    public toasterService: ToasterService, public windowScrollService: WindowScrollService, public playerService: PlayerService,
    public copyContentService: CopyContentService, public permissionService: PermissionService,
    public contentUtilsServiceService: ContentUtilsServiceService, public popupControlService: PopupControlService,
    private configService: ConfigService, public navigationhelperService: NavigationHelperService) {
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
      this.contentStatus = params.contentStatus;
      this.userService.userData$.subscribe(
        (user: IUserData) => {
          if (user && !user.err) {
            this.getContent();
          }
        });
    });
  }
  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.contentId,
        type: this.contentData.contentType,
        ver: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.pageLoadDuration
      }
    };
    this.closeIntractEdata = {
      id: 'content-close',
      type: 'click',
      pageid: 'content-player'
    };
    this.objectInteract = {
      id: this.contentId,
      type: this.contentData.contentType,
      ver: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '1.0'
    };
    this.printPdfInteractEdata = {
      id: 'print-pdf-button',
      type: 'click',
      pageid: 'content-player'
    };
    this.copyContentInteractEdata = {
      id: 'copy-content-button',
      type: 'click',
      pageid: 'content-player'
    };
  }
  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    const option = { params: this.configService.appConfig.ContentPlayer.contentApiQueryParams };
    if (this.contentStatus && this.contentStatus === 'Unlisted') {
      option.params = { mode: 'edit' };
    }
    this.playerService.getContent(this.contentId, option).subscribe(
      (response) => {
        if (response.result.content.status === 'Live' || response.result.content.status === 'Unlisted') {
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
          this.setTelemetryData();
          this.showPlayer = true;
          this.windowScrollService.smoothScroll('content-player');
          // this.breadcrumbsService.setBreadcrumbs([{ label: this.contentData.name, url: '' }]);
          this.badgeData = _.get(response, 'result.content.badgeAssertions');
        } else {
          this.toasterService.warning(this.resourceService.messages.imsg.m0027);
          this.close();
        }
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
    try {
      window.frames['contentPlayer'].contentDocument.body.onunload({});
    } catch {

    } finally {
      setTimeout(() => {
        this.navigationHelperService.navigateToResource('/explore');
      }, 100);
    }
  }

  /**
   * This method calls the copy API service
   * @param {contentData} ContentData Content data which will be copied
   */
  copyContent(contentData: ContentData) {
    this.showCopyLoader = true;
    this.copyContentService.copyContent(contentData).subscribe(
      (response) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0042);
        this.showCopyLoader = false;
      },
      (err) => {
        this.showCopyLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0008);
      });
  }
  createEventEmitter(data) {
    this.createNoteData = data;
  }
  onShareLink() {
    this.shareLink = this.contentUtilsServiceService.getPublicShareUrl(this.contentId, this.contentData.mimeType);
    this.setTelemetryShareData(this.contentData);
  }
  ngAfterViewInit () {
    this.pageLoadDuration = this.navigationhelperService.getPageLoadTime();
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
