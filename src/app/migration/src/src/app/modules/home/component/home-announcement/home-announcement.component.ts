import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
import { IAnnouncementListData } from '@sunbird/announcement';

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
  public resourceService: ResourceService;
  /**
   * To make inbox API calls.
   */
  private announcementService: AnnouncementService;
  /**
   * To get url, app configs.
   */
  public config: ConfigService;
  /**
   * Contains result object returned from get Inbox API.
   */
  announcementlist: IAnnouncementListData;
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
  constructor(resourceService: ResourceService, announcementService: AnnouncementService,
    config: ConfigService) {
    this.resourceService = resourceService;
    this.announcementService = announcementService;
    this.config = config;
  }
  /**
   * This method calls the announcement inbox API.
   */
  public populateHomeInboxData(limit: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };
    this.announcementService.getInboxData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        if (apiResponse && apiResponse.result.count > 0) {
          this.announcementlist = apiResponse.result;
          // Calling received API
          _.each(this.announcementlist.announcements, (key) => {
            if (key.received === false) {
              this.announcementService.receivedAnnouncement({ announcementId: key.id }).subscribe(
                (response: ServerResponse) => { }
              );
            }
          });
        }
      },
      err => {
        this.showLoader = false;
      });
  }

  /**
   * This method checks whether a announcement's status is true or false.
   * If false it calls the read API with the particular announcement id
   * and changes its read status to true
	 *
	 * @param {string} announcementId Clicked announcement id
	 * @param {boolean} read Read status of the clicked announcement id
	 */
  readAnnouncement(announcementId: string, read: boolean): void {
    if (read === false) {
      this.announcementService.readAnnouncement({ announcementId: announcementId }).subscribe(
        (response: ServerResponse) => {
          _.each(this.announcementlist.announcements, (key, index) => {
            if (announcementId === key.id) {
              this.announcementlist.announcements[index].read = true;
            }
          });
        }
      );
    }
  }

  /**
   * This method calls the populateHomeInboxData to show inbox list.
	 */
  ngOnInit() {
    this.populateHomeInboxData(this.config.pageConfig.HOME.PAGE_LIMIT, this.pageNumber);
  }
}
