
import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ConfigService, PaginationService, ToasterService, DateFormatPipe, ServerResponse } from '@sunbird/shared';
import { IAnnouncementListData, IPagination } from '@sunbird/announcement';
import { IInteractEventInput, IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

import { Subject } from 'rxjs';

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
export class OutboxComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  /**
	 * inviewLogs
	*/
  inviewLogs = [];
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
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
	 * This variable hepls to show and hide warning div
   * when get outbox API fails
	 */
  showWarningDiv = false;

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
   * telemetryInteract event
   */
  telemetryInteract: IInteractEventInput;
  resendId;
  public createAnnouncementInteractEdata: IInteractEventEdata;
  public deleteAnnouncementInteractEdata: IInteractEventEdata;
  public resendAnnouncementInteractEdata: IInteractEventEdata;
  public navigateInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;

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
    config: ConfigService, private cdr: ChangeDetectorRef) {
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

    this.announcementService.getOutboxData(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (apiResponse: ServerResponse) => {
        this.outboxData = apiResponse.result;
        this.showLoader = false;
        this.pager = this.paginationService.getPager(this.outboxData.count, this.pageNumber, this.pageLimit);
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
        this.showWarningDiv = true;
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
   * get inview  Data
  */
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.id;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.id,
          objtype: 'announcement',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  /**
   * This method calls the populateOutboxData to show outbox list.
   * It also changes the status of a deleted announcement to cancelled.
	 *
	 */
  ngOnInit() {

    this.activatedRoute.params.pipe(
    takeUntil(this.unsubscribe))
    .subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.populateOutboxData(this.config.appConfig.ANNOUNCEMENT.OUTBOX.PAGE_LIMIT, this.pageNumber);
    });

    this.announcementService.announcementDeleteEvent.pipe(
    takeUntil(this.unsubscribe))
    .subscribe(data => {
      _.each(this.outboxData.announcements, (key, index) => {
        if (data && data === key.id) {
          this.outboxData.announcements[index].status = 'cancelled';
        }
      });
    });

    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: '/announcement/outbox/' + this.pageNumber,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
    this.setInteractEventData();
  }
  setInteractEventData() {
    this.createAnnouncementInteractEdata = {
      id: 'create-announcement',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.deleteAnnouncementInteractEdata = {
      id: 'delete-announcement',
      type: 'click',
      pageid: 'announcement-list'
    };
    this.resendAnnouncementInteractEdata = {
      id: 'resend-announcement',
      type: 'click',
      pageid: 'announcement-resend'
    };
    this.navigateInteractEdata = {
      id: 'paginate-outbox',
      type: 'click',
      pageid: 'announcement-list'
    };
    this.telemetryInteractObject = {
      id: '',
      type: 'announcement',
      ver: '1.0'
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
