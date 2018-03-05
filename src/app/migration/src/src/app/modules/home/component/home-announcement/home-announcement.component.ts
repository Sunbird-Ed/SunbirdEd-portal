import { Component, OnInit, Input } from '@angular/core';
// Import services
import { AnnouncementService } from '@sunbird/core';
import { ActivatedRoute, Router} from '@angular/router';
import {  ConfigService, ResourceService } from '@sunbird/shared';



/**
 * HomeAnnouncementComponent displays announcement inbox card
 */
@Component({
  selector: 'app-home-announcement',
  templateUrl: './home-announcement.component.html',
  styleUrls: ['./home-announcement.component.css']
})
/**
 *  HomeAnnouncementComponent
 * interact with announcement inbox data.
 */
export class HomeAnnouncementComponent implements OnInit {
  /**
   * Property of ResourceService used to render resourcebundels.
   */
  resourceService: ResourceService;
  /**
   * Property of AnnouncementService used to render announcement inbox detail.
   */
  announcement: AnnouncementService;
  /**
   *  Contains announcement inbox details
   */
  listData: Array<any> = [];
  /**
  * Contains page limit of inbox list
  */
  pageLimit: number;

  /**
   * Contains page number of inbox list
   */
  pageNumber = 1;
  /**
   * Flags to show loader
   */
  showLoader = true;
  /**
   * Flags to show div
   */
  showdiv = false;
  /**
   * Loader message
   */
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'We are Fetching Details ...'
  };
   /**
   * To navigate to other pages
   */
  route: Router;

  /**
   * To get params from url
   */
  private activatedRoute: ActivatedRoute;

  /**
   * reference of config service.
   */
  public config: ConfigService;

   /**
    * Constructor
    * inject service(s)
    * @param {ResourceService} resourceService  ResourceService used to render resourcebundels.
    * @param {AnnouncementService} announcement AnnouncementService used to render announcement inbox detail.
    * @param {Router} route To navigate to other pages
    * @param {ActivatedRoute} activatedRoute To get params from url
    * @param {ConfigService} config ConfigService reference
    */
  constructor(resourceService: ResourceService, announcement: AnnouncementService,
    route: Router, activatedRoute: ActivatedRoute, config: ConfigService) {
    this.resourceService = resourceService;
    this.announcement = announcement;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.config = config;
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.getInbox(this.config.pageConfig.HOME.PAGE_LIMIT, this.pageNumber);
    });
  }

  /**
   * getInbox is subscribe to announcement service to get api response.
   */
  public getInbox(limit: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageLimit = limit;

    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };
    this.announcement.getInboxData(option).subscribe(
      res => {
        if (res && res.result.count > 0) {
          this.listData = res.result.announcements;
          this.showLoader = false;
          this.showdiv = true;
          console.log('service', res);
        }
      },
      err => {
        console.log('show error');
        this.showLoader = false;
      });
  }

  /**
   * Initialize getInbox
   */
  ngOnInit() {
   // this.getInbox();
  }

}
