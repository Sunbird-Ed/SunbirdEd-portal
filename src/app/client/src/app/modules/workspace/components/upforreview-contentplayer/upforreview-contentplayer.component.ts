import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ResourceService, ILoaderMessage, PlayerConfig, ContentData,
  WindowScrollService, ToasterService, NavigationHelperService
} from '@sunbird/shared';
import { PlayerService, PermissionService, UserService } from '@sunbird/core';
@Component({
  selector: 'app-upforreview-contentplayer',
  templateUrl: './upforreview-contentplayer.component.html',
  styleUrls: ['./upforreview-contentplayer.component.css']
})
export class UpforreviewContentplayerComponent implements OnInit {
  /**
   * To navigate to other pages
   */
  router: Router;
  /**
   * loader message
  */
 loaderMessage: ILoaderMessage;
  /**
   * To close url
  */
 closeUrl: any;
  /**
  * To show / hide loader
  */
  showLoader = true;
  /**
   * Flag to show error
   */
  showError = false;
  /**
   * content id
   */
  contentId: string;
  /**
   * user id
   */
  userId: string;
  /**
  * contain error message
  */
  errorMessage: string;
  /**
  * To call resource service which helps to use language constant
  */
 public resourceService: ResourceService;
  /**
  * To call user service
  */
 public userService: UserService;

  /**
  * To call PlayerService service
  */
  public playerService: PlayerService;
  /**
  * To call Permission service
  */
 public permissionService: PermissionService;
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
  * Constructor to create injected service(s) object
  Default method of Draft Component class
  * @param {ResourceService} resourceService Reference of resourceService
  * @param {ToasterService} toasterService Reference of ToasterService
  */
  constructor(resourceService: ResourceService, public activatedRoute: ActivatedRoute, userService: UserService,
    playerService: PlayerService, windowScrollService: WindowScrollService, permissionService: PermissionService,
    toasterService: ToasterService, public navigationHelperService: NavigationHelperService, router: Router) {
    this.resourceService = resourceService;
    this.playerService = playerService;
    this.userService = userService;
    this.windowScrollService = windowScrollService;
    this.permissionService = permissionService;
    this.toasterService = toasterService;
    this.router = router;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0025,
    };
  }

  ngOnInit() {
    this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.activatedRoute.params.subscribe((params) => {
          this.contentId = params.contentId;
          this.getContent();
        });
      }
      this.closeUrl = this.navigationHelperService.getPreviousUrl();
    });
  }
  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    this.showLoader = true;
    const option = {
          params: {mode: 'edit'}
    };
    this.playerService.getContent(this.contentId, option).subscribe(
      (response) => {
        if (response.result.content) {
          const contentDetails = {
            contentId: this.contentId,
            contentData: response.result.content
          };
          this.playerConfig = this.playerService.getConfig(contentDetails);
          this.contentData = response.result.content;
          this.showLoader = false;
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
   this.navigationHelperService.navigateToWorkSpace('/workspace/content/upForReview/1');
  }
}
