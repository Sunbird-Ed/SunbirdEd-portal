
import { combineLatest,  Observable } from 'rxjs';
import { WorkSpace } from './../../classes/workspace';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService, UserService, PermissionService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService,
  ResourceService, IContents, ILoaderMessage, INoResultMessage, IUserData
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
/**
 * The upforReview component search for all the upforreview content
*/

@Component({
  selector: 'app-up-for-review',
  templateUrl: './up-for-review.component.html',
  styleUrls: ['./up-for-review.component.css']
})
export class UpForReviewComponent extends WorkSpace implements OnInit {
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
   * Contains unique contentIds id
  */
  contentIds: string;
  /**
   * Contains list of published course(s) of logged-in user
  */
  upForReviewContentData: Array<IContents> = [];

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
    * Refrence of UserService
  */
  private userService: UserService;

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
  * Contains returned object of the pagination service
  * which is needed to show the pagination on inbox view
  */
  pager: IPagination;

  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;

  queryParams: any;
  sort: object;
  state: string;
  /**
   * userRoles
  */
  userRoles = [];
  /**
  * To call resource service which helps to use language constant
 */
  public resourceService: ResourceService;
  /**
    * reference of permissionService service.
  */
  public permissionService: PermissionService;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
	 * inviewLogs
	*/
  inviewLogs = [];
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {SearchService} SearchService Reference of SearchService
    * @param {UserService} UserService Reference of UserService
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
    * @param {ConfigService} config Reference of ConfigService
    * @param {permissionService} permissionService Refrence of permission service to check permission
  */
  constructor(public modalService: SuiModalService, public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, permissionService: PermissionService) {
    super(searchService, workSpaceService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0032,
    };
    this.state = 'upForReview';
    this.permissionService = permissionService;
  }

  ngOnInit() {
    combineLatest(
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
        this.fecthUpForReviewContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);
      });

    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.activatedRoute.snapshot.params.pageNumber,
        visits: this.inviewLogs
      }
    };
  }

  /**
  * This method sets the make an api call to get all UpForReviewContent with page No and offset
  */
  fecthUpForReviewContent(limit: number, pageNumber: number, bothParams) {
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
    const rolesMap = this.userService.RoleOrgMap;
    const searchParams = {
      filters: {
        status: ['Review'],
        createdFor: this.userService.RoleOrgMap && _.compact(_.union(rolesMap['CONTENT_REVIEWER'],
          rolesMap['BOOK_REVIEWER'],
          rolesMap['CONTENT_REVIEW'])),
        createdBy: { '!=': this.userService.userid },
        objectType: this.config.appConfig.WORKSPACE.objectType,
        board: bothParams.queryParams.board,
        subject: bothParams.queryParams.subject,
        medium: bothParams.queryParams.medium,
        gradeLevel: bothParams.queryParams.gradeLevel,
        contentType: bothParams.queryParams.contentType ? bothParams.queryParams.contentType : this.config.appConfig.WORKSPACE.contentType
      },
      limit: limit,
      offset: (pageNumber - 1) * (limit),
      query: _.toString(bothParams.queryParams.query),
      sort_by: this.sort
    };
    const contentType = this.getContentType && this.getContentType().contentType;
    searchParams.filters.contentType = contentType;
    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && data.result.content.length > 0) {
          this.upForReviewContentData = data.result.content;
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, pageNumber, limit);
          this.showLoader = false;
          this.noResult = false;
        } else {
          this.showError = false;
          this.noResult = true;
          this.showLoader = false;
          this.noResultMessage = {
            'message': this.resourceService.messages.stmsg.m0008,
            'messageText': this.resourceService.messages.stmsg.m0033
          };
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0021);
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
    this.route.navigate(['workspace/content/upForReview', this.pageNumber], { queryParams: this.queryParams });
  }
  contentClick(content) {
    this.workSpaceService.navigateToContent(content, this.state);
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
          objtype: inview.data.contentType,
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  getContentType() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        this.userRoles = user.userProfile.userRoles;
      });
    const request = {
      contentType: []
    };

    if (_.indexOf(this.userRoles, 'BOOK_REVIEWER') !== -1) {
      request.contentType = ['TextBook'];
    }
    if (_.indexOf(this.userRoles, 'CONTENT_REVIEWER') !== -1) {
     request.contentType = _.without(this.config.appConfig.WORKSPACE.contentType, 'TextBook');
    }
    if (_.indexOf(this.userRoles, 'CONTENT_REVIEWER') !== -1 &&
      _.indexOf(this.userRoles, 'BOOK_REVIEWER') !== -1) {
     request.contentType = this.config.appConfig.WORKSPACE.contentType;
    }
    return request;
  }
}
