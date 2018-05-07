import { ContentService, PlayerService, UserService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService, ContentData,
 IUserProfile } from '@sunbird/shared';
import {IRequestData} from './../../interfaces';
/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-flag-content',
  templateUrl: './flag-content.component.html',
  styleUrls: ['./flag-content.component.css']
})
export class FlagContentComponent implements OnInit {


  flagReasons: Array<object>;


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
private playerService: PlayerService;
private userService: UserService;
requestData: IRequestData;
userData: IUserProfile;
contentId: string;
contentName: string;
contentData: ContentData;
data = {};
showLoader = false;
showContentFlagModal = true;
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


  getContentData() {
    if (this.playerService.contentData) {
      this.contentData = this.playerService.contentData;
    } else {
      this.playerService.getContent(this.contentId).subscribe(response => {
        this.contentData = response.result.content;
      });
    }
  }
  populateFlagContent(requestData) {
    this.showLoader = true;
    const option = {
      url: `${this.config.urlConFig.URLS.CONTENT.FLAG}/${this.contentId}`,
      data: {'request' : requestData}
      };
       this.contentService.post(option).subscribe(response => {
         if (response && response.responseCode === 'OK') {
          this.showLoader = false;
          this.showContentFlagModal = false;
         } else {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0050);
         }
       });
    }

   saveMetaData() {
    this.requestData = {
      flaggedBy: this.userData.firstName + ' ' + this.userData.lastName,
          versionKey: this.playerService.contentData.versionKey
    };
    if (this.data['flagReasons']) {
      this.requestData.flagReasons = [this.data['flagReasons']];
    }
    if (this.data['comment']) {
      this.requestData.flags = [this.data['comment']];
    }
    this.populateFlagContent(this.requestData);
  }


  /**
   * This method helps to redirect to the parent component
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect(): void {
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
    console.log(this.activatedRoute.snapshot);
  }

  /**
   * This method sets the annmouncementId and pagenumber from
   * activated route
	 */
  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(params => {
      this.contentId = params.contentId;
      this.contentName = params.contentName;
    });
    this.userService.userData$.subscribe(data => {
      if (data) {
        this.userData = data.userProfile;
         this.getContentData();
      }
    });
  }
}

