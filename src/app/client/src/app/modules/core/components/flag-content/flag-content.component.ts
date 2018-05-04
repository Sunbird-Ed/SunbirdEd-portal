import { ContentService, PlayerService, UserService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';

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


  flagReasons = [{
    name: 'Inappropriate content',
    value: 'Inappropriate Content',
    description: 'Hateful, harmful or explicit lesson that is inappropriate for young learners'
  }, {
    name: 'Copyright violation',
    value: 'Copyright Violation',
    description: 'Uses copyrighted work without permission'
  }, {
    name: 'Privacy violation',
    value: 'Privacy Violation',
    description: 'Collects sensitive data or personal information about users, such as name' +
    '\n address, photo or other personally identifiable information'
  }, {
    name: 'Other',
    value: 'Other'
  }];


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
request: any;
data: any;
contentId: any;
contentName: any;
contentData: any;
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
  }


  getContentData() {
    if (this.playerService.contentData) {
      this.contentData = this.playerService.contentData;
      console.log('if', this.contentData);
    } else {
      this.playerService.getContent(this.contentId).subscribe(response => {
        this.contentData = response.result.content;
        console.log('else', this.contentData);
      });
    }
  }
  // populateFlagContent() {
  //   this.request = {
  //     flaggedBy: this.data.firstName + '' + this.data.lastName,
  //         versionKey: this.playerService.contentData.contentVersionKey
  //   };
  //   const option = {
  //     url: `${this.config.urlConFig.URLS.CONTENT.FLAG}/${this.contentId}`,
  //     data: this.request
  //     };
  //     return this.contentService.post(option);
  //   }
   // this.contentService.post(options);

  //  saveMetaData(data) {
  //   this.request = {
  //     flaggedBy: this.data.firstName + '' + this.data.lastName,
  //         versionKey: this.playerService.contentData.contentVersionKey
  //   };
  //   if (data.flagReasons) {
  //     this.request.flagReasons = [data.flagReasons];
  //   }
  //   if (data.comment) {
  //     this.request.flags = [data.comment];
  //   }
  //   populateFlagContent(requestData)
  // }

  /**
   * This method helps to redirect to the parent component
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect(): void {
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
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
        this.data = data.userProfile;
         this.getContentData();
      }
    });
    // this.activatedRoute.params.subscribe(params => {
    //   this.announcementId = params.announcementId;
    // });
    // this.activatedRoute.parent.params.subscribe((params) => {
    //   this.pageNumber = Number(params.pageNumber);
    // });
  }
}

