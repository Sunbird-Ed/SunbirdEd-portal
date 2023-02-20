import {combineLatest as observableCombineLatest } from 'rxjs';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService, ISort, FrameworkService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService, IPagination,
  ResourceService, ILoaderMessage, INoResultMessage, IContents, NavigationHelperService
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { SuiModalService } from 'ng2-semantic-ui-v9';
@Component({
  selector: 'app-collaborating-on',
  templateUrl: './collaborating-on.component.html'
})
export class CollaboratingOnComponent extends WorkSpace implements OnInit, AfterViewInit {
  /**
  * state for content editor
  */
  state: string;
  /**
   * To navigate to other pages
   */
  route: Router;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;
  /**
   * Contains list of published course(s) of logged-in user
  */
  collaboratingContent: Array<IContents> = [];
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
     * To show content locked modal
    */
  showLockedContentModal = false;
  /**
     * lock popup data for locked contents
    */
    lockPopupData: object;

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
  * To get url, app configs
  */
  public config: ConfigService;
  /**
  * Contains page limit of inbox list
  */
  pageLimit: number;
  /**
  * Current page number of inbox list
  */
  pageNumber = 1;
  /**
  * totalCount of the list
  */
  totalCount: Number;
  /**
    status for content;
  */
  status: string;
  /**
  route query param;
  */
  queryParams: any;
  /**
  sortingOptions ;
  */
  public sortingOptions: Array<ISort>;
  /**
  sortingOptions ;
  */
  sortByOption: string;
  /**
  sort for filter;
  */
  sort: object;
  /**
	 * inviewLogs
	*/
  inviewLogs = [];
  /**
* value typed
*/
  query: string;
  /**
  * Contains returned object of the pagination service
  * which is needed to show the pagination on all content view
  */
  pager: IPagination;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * column name which we want to sort
  */
  column = '' ;
  /**
  * sortDirection
  */
  sortDirection = '';
  /**
  *reverse
  */
   reverse = false;
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
  constructor(public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    public frameworkService: FrameworkService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, public modalService: SuiModalService,
    public navigationhelperService: NavigationHelperService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.state = 'collaborating-on';
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0124,
    };
    this.noResultMessage = {
      'messageText': 'messages.stmsg.m0123'
    };
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.collaboratingOnSortingOptions;
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
        this.queryParams = bothParams.queryParams;
        this.query = this.queryParams['query'];
        this.fecthAllContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);
      });
  }
  /**
  * This method sets the make an api call to get all collaborating with page No and offset
  */
  fecthAllContent(limit: number, pageNumber: number, bothParams) {
    this.showLoader = true;
    if (bothParams.queryParams.sort_by) {
      const sort_by = bothParams.queryParams.sort_by;
      const sortType = bothParams.queryParams.sortType;
      this.sort = {
        [sort_by]: _.toString(sortType)
      };
    } else {
      this.sort = { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn };
    }
    const preStatus = ['Draft', 'FlagDraft', 'Review', 'Processing', 'Live', 'Unlisted', 'FlagReview'];
    const primaryCategories = _.compact(_.concat(this.frameworkService['_channelData'].contentPrimaryCategories,
    this.frameworkService['_channelData'].collectionPrimaryCategories));
    const searchParams = {
      filters: {
        status: bothParams.queryParams.status ? bothParams.queryParams.status : preStatus,
        collaborators: [this.userService.userid],
        primaryCategory: _.get(bothParams, 'queryParams.primaryCategory') || (!_.isEmpty(primaryCategories) ? primaryCategories :
        this.config.appConfig.WORKSPACE.primaryCategory),
        objectType: this.config.appConfig.WORKSPACE.objectType,
        board: bothParams.queryParams.board,
        subject: bothParams.queryParams.subject,
        medium: bothParams.queryParams.medium,
        gradeLevel: bothParams.queryParams.gradeLevel
      },
      limit: limit,
      offset: (pageNumber - 1) * (limit),
      query: _.toString(bothParams.queryParams.query),
      sort_by: this.sort
    };
    this.searchContentWithLockStatus(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && !_.isEmpty(data.result.content)) {
          this.collaboratingContent = data.result.content;
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, pageNumber, limit);
          this.showLoader = false;
          this.noResult = false;
        } else {
          this.showError = false;
          this.noResult = true;
          this.showLoader = false;
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0084);
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
    this.route.navigate(['workspace/content/collaborating-on', this.pageNumber], { queryParams: this.queryParams });
  }

  contentClick(content) {
    if (_.size(content.lockInfo) && this.userService.userid !== content.lockInfo.createdBy) {
        this.lockPopupData = content;
        this.showLockedContentModal = true;
    } else {
      if (content.status.toLowerCase() === 'draft') {  // only draft state contents need to be locked
        this.workSpaceService.navigateToContent(content, this.state);
      }
    }
  }

  public onCloseLockInfoPopup () {
    this.showLockedContentModal = false;
  }

  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.identifier,
          objtype: inview.data.contentType,
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  sortColumns(column) {
    this.column = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.reverse = !this.reverse;
  }

  ngAfterViewInit () {
    setTimeout(() => {
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
      this.inview({ inview: [] });
    });
  }
  /**
   * Used to dispaly content
   *@param {number} index Give position for current entry
   *@param {number} item  Give postion
   */
  trackByFn(index, item) {
    return item.identifier;
  }
}

