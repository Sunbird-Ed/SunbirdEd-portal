
import {combineLatest as observableCombineLatest,  Observable } from 'rxjs';
import { ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
   IContents, ICard, UtilService } from '@sunbird/shared';
import { SearchService, PlayerService } from '@sunbird/core';
import { Component, OnInit,  NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { IHomeQueryParams } from './../../interfaces';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.css']
})
export class HomeSearchComponent implements OnInit {
  inviewLogs: any = [];
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  closeIntractEdata: IInteractEventEdata;
  cardIntractEdata: IInteractEventEdata;
  filterIntractEdata: IInteractEventEdata;
  /**
  * To call searchService which helps to use list of courses
  */
  private searchService: SearchService;
   /**
  * To call resource service which helps to use language constant
  */
  private resourceService: ResourceService;
  /**
   * To get url, app configs
   */
  public config: ConfigService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
   * Contains list of published course(s) of logged-in user
   */
  searchList: Array<ICard> = [];
  /**
   * To navigate to other pages
   */
  private route: Router;
  /**
  * To send activatedRoute.snapshot to router navigation
  * service for redirection to parent component
  */
  private activatedRoute: ActivatedRoute;
  /**
   * For showing pagination on inbox list
   */
  private paginationService: PaginationService;
  /**
    * To show / hide no result message when no result found
   */
  noResult = false;
  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;
  /**
    * totalCount of the list
  */
  totalCount: Number;
  /**
   * Current page number of inbox list
   */
  pageNumber = 1;
  /**
	 * Contains page limit of outbox list
	 */
  pageLimit: number;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  /**
     * loader message
    */
  loaderMessage: any;
  /**
   * Contains returned object of the pagination service
   * which is needed to show the pagination on inbox view
   */
  pager: IPagination;
  /**
   *url value
   */
  queryParams: IHomeQueryParams;
  /**
     * Constructor to create injected service(s) object
     * @param {SearchService} searchService Reference of SearchService
     * @param {Router} route Reference of Router
     * @param {PaginationService} paginationService Reference of PaginationService
     * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
     * @param {ConfigService} config Reference of ConfigService
     * @param {ResourceService} resourceService Reference of ResourceService
     * @param {ToasterService} toasterService Reference of ToasterService
   */
  constructor(searchService: SearchService, route: Router, private playerService: PlayerService,
    activatedRoute: ActivatedRoute, paginationService: PaginationService,
    resourceService: ResourceService, toasterService: ToasterService,
    config: ConfigService, public utilService: UtilService) {
    this.searchService = searchService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.paginationService = paginationService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.config = config;
  }
    /**
     * This method sets the make an api call to get all search data with page No and offset
     */
  populateCompositeSearch() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
    const searchParams = {
      filters: {
        contentType: ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'Course'],
        board: this.queryParams.Curriculum,
        language: this.queryParams.Medium,
        subject: this.queryParams.Subjects,
        concepts: this.queryParams.Concepts
      },
      limit: this.pageLimit,
      offset: (this.pageNumber - 1 ) * (this.pageLimit),
      query: this.queryParams.key
    };
    this.searchService.compositeSearch(searchParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result.count && apiResponse.result.content.length > 0) {
          this.showLoader = false;
          this.noResult = false;
          this.totalCount = apiResponse.result.count;
          this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
          const constantData = this.config.appConfig.HomeSearch.constantData;
        const metaData = this.config.appConfig.HomeSearch.metaData;
        const dynamicFields = {};
        this.searchList = this.utilService.getDataForCard(apiResponse.result.content, constantData, dynamicFields, metaData);
        } else {
          this.noResult = true;
          this.showLoader = false;
          this.noResultMessage = {
            'message': this.resourceService.messages.stmsg.m0007,
            'messageText': this.resourceService.messages.stmsg.m0006
          };
        }
      },
      err => {
        this.showLoader = false;
        this.noResult = true;
        this.noResultMessage = {
          'messageText': this.resourceService.messages.fmsg.m0077
        };
         this.toasterService.error(this.resourceService.messages.fmsg.m0051);
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
    this.route.navigate(['search/All', this.pageNumber], {
      queryParams: this.queryParams
    });
  }

  ngOnInit() {
    observableCombineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params: any, queryParams: any) => {
        return {
          params: params,
          queryParams: queryParams
        };
      })
      .subscribe(bothParams => {
        if (bothParams.params.pageNumber) {
          this.pageNumber = Number(bothParams.params.pageNumber);
        }
        this.queryParams = { ...bothParams.queryParams };
        this.populateCompositeSearch();
      });
      this.setInteractEventData();
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.route.url,
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype
        }
      };
  }
  setInteractEventData() {
    this.closeIntractEdata = {
      id: 'search-close',
      type: 'click',
      pageid: 'home-search'
    };
    this.cardIntractEdata = {
      id: 'content-card',
      type: 'click',
      pageid: 'home-search'
    };
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: 'home-search'
    };
  }
  playContent(event) {
    this.playerService.playContent(event.data.metaData);
  }
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.metaData.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.metaData.identifier,
          objtype: inview.data.metaData.contentType || 'content',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
}
