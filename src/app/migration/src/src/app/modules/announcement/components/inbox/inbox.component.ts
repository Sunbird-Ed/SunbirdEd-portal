import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ConfigService, PaginationService, ToasterService, ServerResponse } from '@sunbird/shared';
import { IAnnouncementListData, IPagination } from '@sunbird/announcement';

/**
 * The announcement inbox component displays all
 * the announcement which is received by the logged in user
 */
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  /**
	 * Contains result object returned from get inbox API
	 */
  inboxData: IAnnouncementListData;

  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  showLoader = true;

  /**
	 * Contains page limit of inbox list
	 */
  pageLimit: number;

  /**
	 * Current page number of inbox list
	 */
  pageNumber = 1;

  /**
	 * Contains returned object of the pagination service
   * which is needed to show the pagination on inbox view
	 */
  pager: IPagination;

  /**
   * To make inbox API calls
   */
  private announcementService: AnnouncementService;

  /**
   * To navigate to other pages
   */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to parent component
   */
  private activatedRoute: ActivatedRoute;

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  /**
   * For showing pagination on inbox list
   */
  private paginationService: PaginationService;

  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;

  /**
   * To get url, app configs
   */
  public config: ConfigService;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of AnnouncementService class
	 *
   * @param {AnnouncementService} announcementService Reference of AnnouncementService
   * @param {Router} route Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {PaginationService} paginationService Reference of PaginationService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {ConfigService} config Reference of ConfigService
	 */
  constructor(announcementService: AnnouncementService,
    route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    paginationService: PaginationService,
    toasterService: ToasterService,
    config: ConfigService) {
    this.announcementService = announcementService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.paginationService = paginationService;
    this.toasterService = toasterService;
    this.config = config;
  }

  /**
   * Populate announcement inbox data with given limit and pagenumber.
   * It also calls the received API to change the status of the
   * announcements to false whose status is true.
	 *
	 * @param {number} limit max no. of announcement to be shown.
	 * @param {number} pageNumber page number to be displayed
	 *
	 * @example populateInboxData(10, 1)
	 */
  populateInboxData(limit: number, pageNumber: number) {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;

    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };

    this.announcementService.getInboxData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.inboxData = apiResponse.result;
        this.showLoader = false;
        this.pager = this.paginationService.getPager(this.inboxData.count, this.pageNumber, this.pageLimit);

        // Calling received API
        _.each(this.inboxData.announcements, (key) => {
          if (key.received === false) {
            this.announcementService.receivedAnnouncement({ announcementId: key.id }).subscribe(
              (response: ServerResponse) => { }
            );
          }
        });
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
      }
    );
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
          _.each(this.inboxData.announcements, (key, index) => {
            if (announcementId === key.id) {
              this.inboxData.announcements[index].read = true;
            }
          });
        }
      );
    }
  }

  /**
   * This method helps to navigate to different pages.
   * If page number is less than 1 or page number is greater than total number
   * of pages is less which is not possible, then it returns.
	 *
	 * @param {number} page Variable to know which page has been clicked
	 *
	 * @example navigateToPage(1)
	 */
  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.route.navigate(['announcement/inbox', this.pageNumber]);
  }

  /**
   * This method calls the populateInboxData to show inbox list.
	 */
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.populateInboxData(this.config.pageConfig.INBOX.PAGE_LIMIT, this.pageNumber);
    });
  }
}

