
import {combineLatest as observableCombineLatest,  Observable } from 'rxjs';
import { ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage } from '@sunbird/shared';
import { SearchService, UserService } from '@sunbird/core';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-org-search',
  templateUrl: './org-search.component.html',
  styleUrls: ['./org-search.component.css']
})
export class OrgSearchComponent implements OnInit {

  /**
   * Reference of toaster service
   */
  private searchService: SearchService;

  /**
   * Reference of resource service
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
   * Contains list of org search result
   */
  searchList: Array<any> = [];
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
   * For showing pagination on user search list
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
   * Current page number of org search
   */
  pageNumber = 1;
  /**
	 * Contains page limit of user search list
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
  queryParams: any;
  inviewLogs: any = [];
  closeIntractEdata: IInteractEventEdata;
  orgDownLoadIntractEdata: IInteractEventEdata;
  filterIntractEdata: IInteractEventEdata;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
   * To get user profile of logged-in user
   */
  public userService: UserService;
  /**
   * Constructor to create injected service(s) object
   * Default method of Draft Component class
   * @param {SearchService} searchService Reference of SearchService
   * @param {Router} route Reference of Router
   * @param {PaginationService} paginationService Reference of PaginationService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ConfigService} config Reference of ConfigService
   * @param {UserService} userService Reference of UserService
   */
  constructor(searchService: SearchService, route: Router,
    activatedRoute: ActivatedRoute, paginationService: PaginationService, resourceService: ResourceService,
    toasterService: ToasterService, public ngZone: NgZone, config: ConfigService,
    userService: UserService) {
    this.searchService = searchService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.paginationService = paginationService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.config = config;
    this.userService = userService;
  }

  /**
  * This method calls the org API and populates the required data
  */
  populateOrgSearch() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
    const searchParams = {
      filters: {
        rootOrgId: this.userService.rootOrgId,
        orgTypeId: this.queryParams.OrgType
      },
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      query: this.queryParams.key
    };
    this.searchService.orgSearch(searchParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result.response.count && apiResponse.result.response.content.length > 0) {
          this.showLoader = false;
          this.noResult = false;
          this.searchList = apiResponse.result.response.content;
          this.totalCount = apiResponse.result.response.count;
          this.pager = this.paginationService.getPager(apiResponse.result.response.count, this.pageNumber, this.pageLimit);
        } else {
          this.noResult = true;
          this.showLoader = false;
          this.noResultMessage = {
            'message': this.resourceService.messages.stmsg.m0008,
            'messageText': this.resourceService.messages.stmsg.m0007
          };
        }
      },
      err => {
        this.showLoader = false;
        this.noResult = true;
        this.noResultMessage = {
          'messageText': this.resourceService.messages.fmsg.m0077
        };
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }

  /**
  * This method helps to download the orgnasition name
  */
  downloadOrganisation() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true
    };
    const downloadArray = [{
      'orgName': 'Organisation Name'
    }];
    _.each(this.searchList, (key, index) => {
      downloadArray.push({
        'orgName': key.orgName
      });
    });
    return new Angular2Csv(downloadArray, 'Organisations', options);
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
    this.route.navigate(['search/Organisations', this.pageNumber], {
      queryParams: this.queryParams
    });
  }

  getQueryParams () {
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
      this.populateOrgSearch();
    });
  }

  ngOnInit() {
    this.getQueryParams();
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
      pageid: 'organization-search'
    };
    this.orgDownLoadIntractEdata = {
      id: 'organization-download',
      type: 'click',
      pageid: 'organization-search'
    };
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: 'organization-search'
    };
  }
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.identifier,
          objtype: 'organization',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
}
