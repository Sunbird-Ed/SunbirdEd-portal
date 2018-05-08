import { ContentService, PlayerService, UserService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService, ContentData,
  IUserProfile, ILoaderMessage
} from '@sunbird/shared';
import { IFlagReason, IFlagData, IRequestData } from './../../interfaces';
/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-flag-content',
  templateUrl: './flag-content.component.html',
  styles: [`
   >>> .ui.modal>.close{
    display: none
   }
 `],
})
export class FlagContentComponent implements OnInit {
  /**
   * It is type of IFlagReason containing name, value and description
   */
  flagReasons: Array<IFlagReason>;
  /**
   * To send activatedRoute.snapshot to routerNavigationService
   */
  public activatedRoute: ActivatedRoute;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
   * To navigate back to parent component
   */
  public routerNavigationService: RouterNavigationService;

  private contentService: ContentService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * To get contentData of specific content
   */
  private playerService: PlayerService;
  /**
   * To get userData of user
   */
  private userService: UserService;
  /**
   * userData of user of type IUserProfile
   */
  public userData: IUserProfile;
  /**
   * content id of content
   */
  private contentId: string;
  /**
   * contentdata of content
   */
  public contentData: ContentData;
  /**
   * Input data for request (flagreason and comment)
   */
  public flagData: IFlagData = {};
  /**
     * This variable hepls to show and hide page loader.
     * It is kept false by default as at first when we comes
     * to a page the loader should not be displayed before showing
     * any data
     */
  showLoader = false;
  /**
  * Contains loader message to display
  */
  loaderMessage: ILoaderMessage;
  /**
	 * Consructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {AnnouncementService} announcementService Reference of AnnouncementService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
	 */
  constructor(activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService,
    contentService: ContentService,
    config: ConfigService,
    playerService: PlayerService,
    userService: UserService) {
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
    this.contentService = contentService;
    this.config = config;
    this.playerService = playerService;
    this.userService = userService;
    this.flagReasons = this.config.appConfig.FLAGREASONS;
  }
  /**
   * This method use to get content Data
   */
  getContentData() {
    if (this.playerService.contentData) {
      this.contentData = this.playerService.contentData;
    } else {
      this.playerService.getContent(this.contentId).subscribe(response => {
        this.contentData = response.result.content;
      });
    }
  }
  /**
   * This method use to Call flag api
   */
  populateFlagContent(requestData, modal) {
    this.showLoader = true;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0077,
    };
    const option = {
      url: `${this.config.urlConFig.URLS.CONTENT.FLAG}/${this.contentId}`,
      data: { 'request': requestData }
    };
    this.contentService.post(option).subscribe(response => {
      this.showLoader = false;
      modal.deny();
      this.redirect();
    }, (err) => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0050);
    });
  }
  /**
   * This method use to create request Data for api call
   */
  saveMetaData(modal) {
    const requestData: IRequestData = {
      flaggedBy: this.userData.firstName + ' ' + this.userData.lastName,
      versionKey: this.contentData.versionKey
    };
    if (this.flagData.flagReasons) {
      requestData.flagReasons = [this.flagData.flagReasons];
    }
    if (this.flagData.comment) {
      requestData.flags = [this.flagData.comment];
    }
    this.populateFlagContent(requestData, modal);
  }
  /**
   * This method helps to redirect to the parent component
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect(): void {
    this.showLoader = false;
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
  }
  /**
   * This method sets the annmouncementId and pagenumber from
   * activated route
	 */
  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(params => {
      this.contentId = params.contentId;
    });
    this.userService.userData$.subscribe(data => {
      if (data) {
        this.userData = data.userProfile;
        this.getContentData();
      }
    });
  }
}

