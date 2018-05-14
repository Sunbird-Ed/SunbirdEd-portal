import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ResourceService, ILoaderMessage, PlayerConfig, ContentData,
  WindowScrollService, ToasterService, NavigationHelperService,
  ConfigService, RouterNavigationService
} from '@sunbird/shared';
import { PlayerService, ContentService, PermissionService, UserService } from '@sunbird/core';
@Component({
  selector: 'app-flag-conentplayer',
  templateUrl: './flag-conentplayer.component.html',
  styleUrls: ['./flag-conentplayer.component.css']
})
export class FlagConentplayerComponent implements OnInit {
  /**
   * loader message
  */
  loaderMessage: ILoaderMessage;

  /**
  * To show / hide loader
  */
  showLoader = true;
  /**
   * Flag to show error
   */
  showError = false;
  /**
   * isShowFlagActionButton to show button
   */
  flagActionButton = false;
  /**
   * content id
   */
  contentId: string;

  /**
  * contain error message
  */
  errorMessage: string;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;

  /**
  * To call PlayerService service
  */
  public playerService: PlayerService;

  /**
  * To call PlayerService service
  */
  public windowScrollService: WindowScrollService;
  /**
   * contains player configuration
   */
  playerConfig: PlayerConfig;

  /**
   * contain contentData
  */
  contentData: ContentData;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
   * reference of ConfigService.
  */
  public configService: ConfigService;
  /**
   * reference of ContentService.
   */
  public contentService: ContentService;
  /**
    * Refrence of UserService
  */
  private userService: UserService;

  /**
   * To navigate back to parent component
   */
  public routerNavigationService: RouterNavigationService;

  /**
   * reference of permissionService service.
  */
  public permissionService: PermissionService;
  /**
  * Constructor to create injected service(s) object
  Default method of Draft Component class
  * @param {ResourceService} resourceService Reference of resourceService
  * @param {ToasterService} toasterService Reference of ToasterService
  * @param {ContentService} contentService Reference of contentService
  * @param {configService} configService Reference of configService
  * @param {PermissionService} permissionService Reference of PermissionService
  * @param {UserService} UserService Reference of UserService
  */
  constructor(resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    playerService: PlayerService, windowScrollService: WindowScrollService,
    toasterService: ToasterService, public navigationHelperService: NavigationHelperService,
    configService: ConfigService, contentService: ContentService,
    routerNavigationService: RouterNavigationService,
    permissionService: PermissionService,
    userService: UserService) {
    this.resourceService = resourceService;
    this.playerService = playerService;
    this.windowScrollService = windowScrollService;
    this.toasterService = toasterService;
    this.configService = configService;
    this.contentService = contentService;
    this.routerNavigationService = routerNavigationService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0025,
    };
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.contentId;
      this.getContent();
    });
  }
  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    this.showLoader = true;
    this.playerService.getContent(this.contentId).subscribe(
      (response) => {
          const contentDetails = {
            contentId: this.contentId,
            contentData: response.result.content
          };
          this.playerConfig = this.playerService.getConfig(contentDetails);
          this.contentData = response.result.content;
          this.showLoader = false;
      },
      (err) => {
        this.showError = true;
        this.errorMessage = this.resourceService.messages.stmsg.m0009;
        this.toasterService.error(this.resourceService.messages.fmsg.m0015);
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
    this.navigationHelperService.navigateToPreviousUrl('/workspace/content/flagged/1');
  }
  /**
  * acceptContentFlag api call
  */
  acceptContentFlag() {
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.ACCEPT_FLAG}/${this.contentId}`,
      data: { 'request': { versionKey: this.contentData.versionKey} }
    };
    this.contentService.post(option).subscribe(response => {
        this.toasterService.success(this.resourceService.messages.smsg.m0007);
        this.close();
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0024);
    });
  }

  /**
  * discardContentFlag api call
  */
  discardContentFlag() {
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.DISCARD_FLAG}/${this.contentId}`,
      data: { 'request': { } }
    };
    this.contentService.post(option).subscribe(response => {
        this.toasterService.success(this.resourceService.messages.smsg.m0008);
        this.close();
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0025);
    });
  }
}

