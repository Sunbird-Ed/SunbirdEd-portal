import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService, IPagination,
  ResourceService, ILoaderMessage, INoResultMessage, NavigationHelperService, LayoutService
} from '@sunbird/shared';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Ibatch } from './../../interfaces/';
import { WorkSpaceService, BatchService } from '../../services';
import * as _ from 'lodash-es';
import { SuiModalService } from '@project-sunbird/ng2-semantic-ui';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';

/**
 * The batch list component
*/

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html'
})
export class BatchListComponent extends WorkSpace implements OnInit, OnDestroy, AfterViewInit {

  /**
  * To navigate to other pages
  */
  route: Router;

  /**
   *url value
   */
  queryParams: any;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  public activatedRoute: ActivatedRoute;

  public closeIntractEdata: IInteractEventEdata;
  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();
  /**
   * Contains list of batchList  of logged-in user
  */
  batchList: Array<Ibatch> = [];
  /**
    status for preselection;
  */
  status: number;

  /**
    on click of close icon in the list page
  */
  closeUrl: string;

  /**
    category of the list 'assigned' or 'created';
  */
  category: string;

  /**
   * To show / hide loader
  */
  showLoader = true;

  /**
   * loader message
  */
  loaderMessage: ILoaderMessage;

  /**
   * To show / hide no result message when no result found
  */
  noResult = false;

  /**
   * To show / hide error
  */
  showError = false;

  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;

  /**
    * For showing pagination on draft list
  */
  private paginationService: PaginationService;

  /**
    * to get url app config
  */
  public config: ConfigService;
  /**
    * Contains page limit of batch  list
  */
  pageLimit: number;

  /**
    * Current page number of batch list
  */
  pageNumber = 1;

  /**
    * totalCount of the list
  */
  totalCount: Number;

  /**
  * Contains returned object of the pagination service
  * which is needed to show the pagination on inbox view
  */
  pager: IPagination;

  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;

  /**
 *search filters
 */
  filters: any;

  /**
  * To call resource service which helps to use language constant
 */
  public resourceService: ResourceService;
  /**
	* telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
	* inviewLogs
	*/
  inviewLogs = [];

  public sectionName: string;

  public unsubscribe = new Subject<void>();

  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {SearchService} SearchService Reference of SearchService
    * @param {UserService} UserService Reference of UserService
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(public modalService: SuiModalService, public searchService: SearchService,
    private batchService: BatchService,
    public workSpaceService: WorkSpaceService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, public navigationhelperService: NavigationHelperService, public layoutService: LayoutService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0108,
    };
    this.noResultMessage = {
      'message': 'messages.stmsg.m0020',
      'messageText': 'messages.stmsg.m0008'
    };
  }

  ngOnInit() {
    this.initLayout();
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      map(results => ({ params: results[0], queryParams: results[1] })),
      filter(res => this.pageNumber !== Number(res.params.pageNumber) || !_.isEqual(this.queryParams, res.queryParams)),
      takeUntil(this.unsubscribe)
    ).subscribe((res: any) => {
      this.queryParams = res.queryParams;
      this.manipulateQueryParam();
      const route = this.route.url.split('/view-all');
      this.closeUrl = '/workspace/content/batches/' + (this.queryParams.mentors ? 'assigned' : 'created');
      this.sectionName = res.params.section.replace(/\-/g, ' ');
      this.pageNumber = Number(res.params.pageNumber);
      this.fetchBatchList();
      this.setInteractEventData();
      this.batchService.updateEvent
        .subscribe((data) => {
          this.fetchBatchList();
      });
    }, (error) => {
      this.showLoader = false;
      this.noResult = true;
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
    });
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }

  /**
    * This method sets the make an api call to get all batch with page No and offset
  */
  manipulateQueryParam() {
    this.filters = {};
    const queryFilters = _.omit(this.queryParams, ['key', 'softConstraintsFilter', 'appliedFilters',
      'sort_by', 'sortType', 'defaultSortBy', 'exists', 'dynamic']);
    if (!_.isEmpty(queryFilters)) {
      _.forOwn(queryFilters, (queryValue, queryKey) => {
        this.filters[queryKey] = queryValue;
      });
    }
  }

  fetchBatchList() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.WORKSPACE.courseBatch.PAGE_LIMIT;
    const searchParams = {
      filters: this.filters,
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      sort_by: { createdDate: this.config.appConfig.WORKSPACE.createdDate }
    };
    this.getBatches(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.response.count && data.result.response.content.length > 0) {
          this.noResult = false;
          this.batchList = [];
          this.batchList = data.result.response.content;
          this.totalCount = data.result.response.count;
          this.pager = this.paginationService.getPager(data.result.response.count, this.pageNumber, this.pageLimit);
          this.updateBatch();
          this.getCourseName(_.uniq(_.map(this.batchList, 'courseId')));
        } else {
          this.showError = false;
          this.noResult = true;
          this.showLoader = false;
        }
      },
      (err: ServerResponse) => {
        this.batchList = [];
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      }
    );
  }

  onCardClick (event) {
    const batchData = event.data;
    if (batchData.enrollmentType === 'open') {
      this.batchService.setBatchData(batchData);
    }
    this.route.navigate(['update/batch', batchData.identifier], {queryParamsHandling: 'merge', relativeTo: this.activatedRoute});
  }

  /**
   * @since - #SH-58
   * @param  {Array} courseIds - unique courseIDs of the batches.
   * @description - This method helps to get the name of course to which the batch belongs.
   * @returns - course name mapped to the batch list.
   */
  getCourseName(courseIds) {
    const searchOption = {
      'filters': {
        'identifier': _.uniq(courseIds),
        'status': ['Live'],
        'contentType': ['Course']
      },
      'fields': ['name']
    };
    this.searchService.contentSearch(searchOption, false).subscribe(data => {
      if (_.get(data, 'result.content')) {
        _.map(this.batchList, (batchData) => {
          batchData.courseDetails = _.find(_.get(data, 'result.content'), courseData => courseData.identifier === batchData.courseId);
        });
      }
    });
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
    const route = this.route.url.split('?');
    const url = route[0].substring(0, route[0].lastIndexOf('/'));
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.route.navigate([url, page], {
      queryParams: this.queryParams,
      relativeTo: this.activatedRoute
    });
  }

  /**
  * processing batch for userlist to make an api call for userlist .
  */
  public updateBatch() {
    let userList = [];
    const participants = [];
    const userName = [];
    _.forEach(this.batchList, (item, key) => {
      participants[item.id] = !_.isUndefined(item.participant) ? _.size(item.participant) : 0;
      userList.push(item.createdBy);
      this.batchList[key].label = item.participantCount || 0;
    });
    userList = _.compact(_.uniq(userList));
    const req = {
      filters: { identifier: userList }
    };
    this.UserList(req).subscribe((res: ServerResponse) => {
      if (res.result.response.count && res.result.response.content.length > 0) {
        _.forEach(res.result.response.content, (val, key) => {
          userName[val.identifier] = (val.firstName || '') + ' ' + (val.lastName || '');
        });
        _.forEach(this.batchList, (item, key) => {
          this.batchList[key].userName = userName[item.createdBy];
        });
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
      this.showLoader = false;
    },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    );
  }

  setTelemetryImpressionData () {
     this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.activatedRoute.snapshot.params.pageNumber,
        visits: this.inviewLogs,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }

  setInteractEventData() {
    this.closeIntractEdata = {
      id: 'close',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
    };
  }

  /**
  * get inview  Data
  */
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.identifier,
          objtype: 'batch',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.setTelemetryImpressionData();
      this.inview({ inview: [] });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

