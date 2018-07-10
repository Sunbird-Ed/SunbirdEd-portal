import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService,
  ResourceService, ILoaderMessage, INoResultMessage
} from '@sunbird/shared';
import { Ibatch, IStatusOption } from './../../interfaces/';
import { WorkSpaceService, BatchService } from '../../services';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';

/**
 * The batch list component
*/

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.css']
})
export class BatchListComponent extends WorkSpace implements OnInit {

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
   * Status option
  */
  statusOptions: Array<IStatusOption> = [];
  /**
   * Contains list of batchList  of logged-in user
  */
  batchList: Array<Ibatch> = [];
  /**
    status for preselection;
  */
  status: number;

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
    config: ConfigService) {
    super(searchService, workSpaceService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.statusOptions = this.config.dropDownConfig.statusOptions;
    this.status = this.statusOptions[0].value;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0108,
    };
    this.noResultMessage = {
      'message': this.resourceService.messages.stmsg.m0020,
      'messageText': this.resourceService.messages.stmsg.m0008
    };
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.fetchBatchList();
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
    this.batchService.updateEvent
      .subscribe((data) => {
        console.log('update event in list');
        this.fetchBatchList();
    });
  }
  changeBatchStatus() {
    this.pageNumber = 1;
    this.route.navigate(['workspace/content/batches', 1]);
    this.fetchBatchList();
  }
  /**
    * This method sets the make an api call to get all batch with page No and offset
  */
  fetchBatchList() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.WORKSPACE.PAGE_LIMIT;
    const searchParams = {
      filters: {
        status: this.status.toString(),
        createdFor: this.userService.RoleOrgMap['COURSE_MENTOR'],
        createdBy: this.userService.userid
      },
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      sort_by: { createdDate: this.config.appConfig.WORKSPACE.createdDate }
    };
    this.getBatches(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.response.count && data.result.response.content.length > 0) {
          this.noResult = false;
          this.batchList = data.result.response.content;
          this.totalCount = data.result.response.count;
          this.pager = this.paginationService.getPager(data.result.response.count, this.pageNumber, this.pageLimit);
          this.updateBatch();
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
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
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
    this.route.navigate(['workspace/content/batches', this.pageNumber]);
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
      this.batchList[key].label = participants[item.id];
    });
    userList = _.compact(_.uniq(userList));
    const req = {
      filters: { identifier: userList }
    };
    this.UserList(req).subscribe((res: ServerResponse) => {
      if (res.result.response.count && res.result.response.content.length > 0) {
        this.showLoader = false;
        _.forEach(res.result.response.content, (val, key) => {
          userName[val.identifier] = val.firstName + ' ' + val.lastName;
        });
        _.forEach(this.batchList, (item, key) => {
          this.batchList[key].userName = userName[item.createdBy];
        });
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    );
    this.showLoader = false;
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
}

