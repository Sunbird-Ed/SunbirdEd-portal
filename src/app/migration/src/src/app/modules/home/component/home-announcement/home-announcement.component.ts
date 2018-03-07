import { Component, OnInit, Input } from '@angular/core';
// Import services
import { AnnouncementService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, Announcement } from '@sunbird/shared';
/**
 * HomeAnnouncementComponent displays announcement inbox card on the home page.
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
   * To inject ResourceService.
   */
  private resourceService: ResourceService;
  /**
   * To inject AnnouncementService.
   */
  private announcement: AnnouncementService;
  /**
   *  Contains announcement list data like links,Title,attachments,description.
   */
  announcementlistData: Announcement;
  /**
  * Contains page limit of inbox list to be display on home page.
  */
  pageLimit: number;
  /**
   * Contains page number from which the inbox list have to be render has default
   * value 1 as on home page latest inbox list is shown.
   */
  pageNumber = 1;
  /**
   * Flags to showLoader have default value true because till it get all the data
   * or get a error it should be in waiting process.
   */
  showLoader = true;
  /**
   * Flags to showdiv have default value false because if there is error in getting data or
   * no data present then div should be hidden.
   */
  showdiv = false;
  /**
   * Loader message is the message shown in the loader giving details about loading reason.
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
  }
  /**
   * subscribeInboxData is used to subscribe announcement service to get api response.
   */
  public subscribeInboxData(limit: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageLimit = limit;

    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };
    this.announcement.getInboxData(option).subscribe(
      res => {
        if (res && res.result.count > 0) {
          this.announcementlistData = res.result.announcements;
          this.showLoader = false;
          this.showdiv = true;
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
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.subscribeInboxData(this.config.pageConfig.HOME.PAGE_LIMIT, this.pageNumber);
    });
  }
}
