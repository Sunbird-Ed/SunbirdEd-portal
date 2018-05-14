import { ContentService, PlayerService, UserService } from './../../services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService, ContentData,
  IUserProfile, ILoaderMessage
} from '@sunbird/shared';
import { IFlagReason, IFlagData, IRequestData, CollectionHierarchyAPI } from './../../interfaces';
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
  @ViewChild('modal') modal;
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
  /**
   * reference of contentService.
   */
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
   * stores identifier for content/collection/course
   */
  private identifier: string;
  /**
   * contentdata of content
   */
  public contentData: ContentData | CollectionHierarchyAPI.Content;
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
    if (this.playerService.contentData && this.playerService.contentData.identifier === this.identifier) {
      this.contentData = this.playerService.contentData;
    } else {
      this.playerService.getContent(this.identifier).subscribe(response => {
        this.contentData = response.result.content;
      });
    }
  }
  /**
   * This method use to Call flag api
   */
  populateFlagContent(requestData) {
    this.showLoader = true;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0077,
    };
    const option = {
      url: `${this.config.urlConFig.URLS.CONTENT.FLAG}/${this.identifier}`,
      data: { 'request': requestData }
    };
    this.contentService.post(option).subscribe(response => {
      this.showLoader = false;
      this.modal.deny();
      this.redirect();
    }, (err) => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0050);
    });
  }
  /**
   * This method use to create request Data for api call
   */
  saveMetaData() {
    const requestData: IRequestData = {
      flaggedBy: this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName,
      versionKey: this.contentData.versionKey
    };
    if (this.flagData.flagReasons) {
      requestData.flagReasons = [this.flagData.flagReasons];
    }
    if (this.flagData.comment) {
      requestData.flags = [this.flagData.comment];
    }
    this.populateFlagContent(requestData);
  }
  /**
   * This method helps to redirect to the parent component
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect(): void {
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
  }
  getCollectionHierarchy() {
    if (this.playerService.collectionData && this.playerService.collectionData.identifier === this.identifier) {
      this.contentData = this.playerService.collectionData;
    } else {
      this.playerService.getCollectionHierarchy(this.identifier).subscribe(response => {
        this.contentData = response.result.content;
      });
    }
  }
  /**
   * This method sets the annmouncementId and pagenumber from
   * activated route
	 */
  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(params => {
      if (params.contentId) {
        this.identifier = params.contentId;
        this.getContentData();
      } else {
        this.identifier = params.collectionId ?  params.collectionId :  params.courseId;
        this.getCollectionHierarchy();
      }
    });
  }
}

