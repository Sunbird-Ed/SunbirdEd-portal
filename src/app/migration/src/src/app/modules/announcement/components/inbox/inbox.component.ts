import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ConfigService, PaginationService, ToasterService, DateFormatPipe, ServerResponse} from '@sunbird/shared';

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
	 * Contains object of inbox list data
	 */
  inboxData: any;

  /**
	 * Contains whole object of result
	 */
  result: any;

  /**
	 * To show / hide loader
	 */
  showLoader = true;

  /**
	 * Contains page limit of inbox list
	 */
  pageLimit: number;

  /**
	 * Contains page number of inbox list
	 */
  pageNumber = 1;

  /**
	 * Contains total count of inbox list
	 */
  totalCount: number;

  /**
	 * Contains object of the pager service
	 */
  pager: any;

  /**
   * To make inbox API calls
   */
  private announcementService: AnnouncementService;

  /**
   * To navigate to other pages
   */
  route: Router;

  /**
   * To get params from url
   */
  private activatedRoute: ActivatedRoute;

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  /**
   * To call pagination service
   */
  private paginationService: PaginationService;

  /**
   * To call toaster service
   */
  private iziToast: ToasterService;

  /**
   * reference of config service.
   */
  public config: ConfigService;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of AnnouncementService class
	 *
   * @param {AnnouncementService} announcementService To make inbox API calls
   * @param {Router} route To navigate to other pages
   * @param {ActivatedRoute} activatedRoute To get params from url
   * @param {ResourceService} resourceService To call resource service which helps to use language constant
   * @param {PaginationService} paginationService To call pagination service
   * @param {ToasterService} iziToast To call toaster service
   * @param {ConfigService} config ConfigService reference
	 */
  constructor(announcementService: AnnouncementService,
    route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    paginationService: PaginationService,
    iziToast: ToasterService,
    config: ConfigService) {
    this.announcementService = announcementService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.paginationService = paginationService;
    this.iziToast = iziToast;
    this.config = config;
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.renderInbox(this.config.pageConfig.OUTBOX.PAGE_LIMIT, this.pageNumber);
    });
  }

  /**
	 * Function to render inbox list. In this method 2 parameters is passed.
   * First one is limit which helps to decide how many announcement should be displayed
   * Second one is page number which helps to show which page is getting displayed.
	 *
	 * @param {number} limit Variable to show how many announcement should be displayed
	 * @param {number} pageNumber  Variable to decide which page should be displayed
	 *
	 * @example renderInbox(10, 1)
	 */
  renderInbox(limit: number, pageNumber: number) {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;

    const option = {
      pageNumber: this.pageNumber,
      limit: this.pageLimit
    };

    this.announcementService.getInboxData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.inboxData = apiResponse.result.announcements;
        console.log(this.inboxData);
        this.result = apiResponse.result;
        this.showLoader = false;
        this.totalCount = apiResponse.result.count;
        this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
      },
      err => {
        this.iziToast.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
      }
    );
  }

  /**
   * This method helps to navigate to different pages.
   * If page number is less than 1 or total number
   * of pages is less which is not possible, then it returns.
	 *
	 * @param {number} page Variable to know which page has been clicked
	 *
	 * @example setPage(1)
	 */
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return false;
    }
    this.pageNumber = page;
    this.route.navigate(['announcement/inbox', this.pageNumber]);
  }

  /**
   * This method updates the status of the API object.
   * It updates the deleted announcement status to cancelled locally without
   * calling the API
	 *
	 */
  // updateStatus(annid) {
  //   _.each(this.outboxData,  (key, index) => {
  //     if (annid && annid === key.id) {
  //        this.outboxData[index].status = 'cancelled';
  //     }
  //   });
  // }

  /**
   * This method subscribes announcement event in announcement service
   * and calls the render outbox method to refresh the list
	 *
	 */
  ngOnInit() {
    // this.announcementService.announcementDeleteEvent.subscribe(data => this.updateStatus(data));
  }
}

