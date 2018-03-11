import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ConfigService, PaginationService, ToasterService, DateFormatPipe, ServerResponse } from '@sunbird/shared';
import { IAnnouncementListData, IPagination } from '@sunbird/announcement';

/**
 * The announcement outbox component displays all
 * the announcement which is created by the logged in user
 * having announcement creator access
 */
@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.css']
})
export class OutboxComponent implements OnInit {

  /**
	 * Contains result object returned from get outbox API
	 */
  outboxData: IAnnouncementListData;

  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  showLoader = true;

  /**
	 * Contains page limit of outbox list
	 */
  pageLimit: number;

  /**
	 * Contains current page number of outbox list
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
   * populate outbox data with given limit and pagenumber.
	 *
	 * @param {number} limit max no. of announcement to be shown.
	 * @param {number} pageNumber page number to be displayed
	 *
	 * @example populateOutboxData(10, 1)
	 */
  populateOutboxData(limit: number, pageNumber: number): void {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;

    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };

    this.announcementService.getOutboxData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.outboxData = apiResponse.result;
        this.showLoader = false;
        this.pager = this.paginationService.getPager(this.outboxData.count, this.pageNumber, this.pageLimit);
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
      }
    );
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
    this.route.navigate(['announcement/outbox', this.pageNumber]);
  }

  /**
   * This method calls the populateOutboxData to show outbox list.
   * It also changes the status of a deleted announcement to cancelled.
	 *
	 */
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.populateOutboxData(this.config.pageConfig.OUTBOX.PAGE_LIMIT, this.pageNumber);
    });

    this.announcementService.announcementDeleteEvent.subscribe(data => {
      _.each(this.outboxData.announcements, (key, index) => {
        if (data && data === key.id) {
          this.outboxData.announcements[index].status = 'cancelled';
        }
      });
    });
  }
}
