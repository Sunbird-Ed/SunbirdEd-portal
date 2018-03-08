import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, Announcement, ServerResponse } from '@sunbird/shared';
/**
 * This component displays announcement inbox card on the home page.
 */
@Component({
  selector: 'app-home-announcement',
  templateUrl: './home-announcement.component.html',
  styleUrls: ['./home-announcement.component.css']
})
export class HomeAnnouncementComponent implements OnInit {
  /**
   * To call resource service which helps to use language constant.
   */
  private resourceService: ResourceService;
  /**
   * To make inbox API calls.
   */
  private announcement: AnnouncementService;
  /**
   * To get url, app configs.
   */
  public config: ConfigService;
  /**
   * Contains result object returned from get Inbox API.
   */
  announcementlist: Announcement;
  /**
  * Contains page limit of home inbox list.
  */
  pageLimit: number;
  /**
   * Contains current page number of outbox list.
   */
  pageNumber: number;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  /**
   * Constructor
   * inject service(s)
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {AnnouncementService} announcement Reference of AnnouncementService.
   * @param {ConfigService} config Reference of config service.
   */
  constructor(resourceService: ResourceService, announcement: AnnouncementService,
   config: ConfigService) {
    this.resourceService = resourceService;
    this.announcement = announcement;
    this.config = config;
  }
  /**
   * populateHomeInboxData is used to subscribe announcement service.
   */
  public populateHomeInboxData(limit: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };
    this.announcement.getInboxData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        if (apiResponse && apiResponse.result.count > 0) {
          this.announcementlist = apiResponse.result.announcements;
        }
      },
      err => {
        this.showLoader = false;
      });
  }
  /**
   * This method calls the populateHomeInboxData to show inbox list.
	 */
  ngOnInit() {
      this.populateHomeInboxData(this.config.pageConfig.HOME.PAGE_LIMIT, this.pageNumber);
  }
}
