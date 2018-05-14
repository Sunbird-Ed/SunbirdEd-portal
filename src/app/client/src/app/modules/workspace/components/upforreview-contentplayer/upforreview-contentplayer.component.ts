import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ResourceService, ILoaderMessage, PlayerConfig, ContentData,
  WindowScrollService, ToasterService, NavigationHelperService
} from '@sunbird/shared';
import { PlayerService } from '@sunbird/core';
@Component({
  selector: 'app-upforreview-contentplayer',
  templateUrl: './upforreview-contentplayer.component.html',
  styleUrls: ['./upforreview-contentplayer.component.css']
})
export class UpforreviewContentplayerComponent implements OnInit {
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
  * Constructor to create injected service(s) object
  Default method of Draft Component class
  * @param {ResourceService} resourceService Reference of resourceService
  * @param {ToasterService} toasterService Reference of ToasterService
  */
  constructor(resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    playerService: PlayerService, windowScrollService: WindowScrollService,
    toasterService: ToasterService, public navigationHelperService: NavigationHelperService) {
    this.resourceService = resourceService;
    this.playerService = playerService;
    this.windowScrollService = windowScrollService;
    this.toasterService = toasterService;
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
    this.navigationHelperService.navigateToPreviousUrl('/workspace/content/upForReview/1');
  }
}
