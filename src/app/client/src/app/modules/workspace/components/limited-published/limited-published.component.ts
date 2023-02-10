
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService, FrameworkService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService,
  ResourceService, IContents, ILoaderMessage, INoResultMessage, IPagination,
  ContentUtilsServiceService, ITelemetryShare, NavigationHelperService
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import * as _ from 'lodash-es';
import {
  SuiModalService, TemplateModalConfig, ModalTemplate
} from 'ng2-semantic-ui-v9';
import { IImpressionEventInput } from '@sunbird/telemetry';

/**
 * The limited publish component to search limited published content
*/
@Component({
  selector: 'app-limited-published',
  templateUrl: './limited-published.component.html',
  styleUrls: ['./limited-published.component.scss']
})
export class LimitedPublishedComponent extends WorkSpace implements OnInit, AfterViewInit {

  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
  /**
   * To navigate to other pages
   */
  route: Router;
  /**
  * state for content editior
 */
  state: string;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to unpublished  component
  */
  private activatedRoute: ActivatedRoute;

  /**
   * Contains unique contentIds id
  */
  contentIds: string;
  /**
   * Contains list of published course(s) of logged-in user
  */
  limitedPublishList: Array<IContents> = [];

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
  * To show / hide modal
 */
  sharelinkModal = false;
  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;

  /**
    * For showing pagination on unpublished list
  */
  private paginationService: PaginationService;

  /**
  * To get url, app configs
  */
  public config: ConfigService;
  /**
  * contentShareLink
  */
  shareLink: string;
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

  /**
  * Reference of ContentUtilsServiceService
  */
  private contentUtilsServiceService: ContentUtilsServiceService;

  /**
  * To call resource service which helps to use language constant
 */
  public resourceService: ResourceService;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
	 * telemetryShareData
	*/
  telemetryShareData: Array<ITelemetryShare>;
  /**
	 * inviewLogs
	*/
  inviewLogs = [];

  /**
    * Constructor to create injected service(s) object
    Default method of unpublished Component class
    * @param {SearchService} SearchService Reference of SearchService
    * @param {UserService} UserService Reference of UserService
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(public modalService: SuiModalService, public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    public frameworkService: FrameworkService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, contentUtilsServiceService: ContentUtilsServiceService,
    public navigationhelperService: NavigationHelperService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.contentUtilsServiceService = contentUtilsServiceService;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0082,
    };
    this.noResultMessage = {
      'message': 'messages.stmsg.m0008',
      'messageText': 'messages.stmsg.m0083'
    };
    this.state = 'limited-publish';
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.fetchLimitedPublished(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
    });
  }
  /**
   * This method sets the make an api call to get all Unlisted with page No and offset
   */
  fetchLimitedPublished(limit: number, pageNumber: number) {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    const primaryCategory = _.compact(_.concat(this.frameworkService['_channelData'].contentPrimaryCategories,
      this.frameworkService['_channelData'].collectionPrimaryCategories));
    const searchParams = {
      filters: {
        status: ['Unlisted'],
        createdBy: this.userService.userid,
        primaryCategory: (!_.isEmpty(primaryCategory) ? primaryCategory : this.config.appConfig.WORKSPACE.primaryCategory),
        objectType: 'Content'
      },
      limit: this.pageLimit,
      offset: (this.pageNumber - 1) * (this.pageLimit),
      sort_by: { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn }
    };
    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && data.result.content.length > 0) {
          this.limitedPublishList = data.result.content;
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
          const constantData = this.config.appConfig.WORKSPACE.LimitedPublishing.constantData;
          const metaData = this.config.appConfig.WORKSPACE.LimitedPublishing.metaData;
          const dynamicFields = this.config.appConfig.WORKSPACE.LimitedPublishing.dynamicFields;
          this.limitedPublishList = this.workSpaceService.getDataForCard(data.result.content, constantData, dynamicFields, metaData);
          this.showLoader = false;
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
        this.toasterService.error(this.resourceService.messages.fmsg.m0064);
      }
    );
  }
  contentClick(param) {
    if (param.action.eventName === 'delete') {
      this.deleteConfirmModal(param.data.metaData.identifier);
    } else if (param.action.eventName === 'share') {
      this.shareLink = this.contentUtilsServiceService.getUnlistedShareUrl(param.data.metaData);
      this.setTelemetryShareData(param.data.metaData);
      this.sharelinkModal = true;
    } else {
      this.workSpaceService.navigateToContent(param.data.metaData, this.state);
    }
  }
  public deleteConfirmModal(contentIds) {
    const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
    config.isClosable = false;
    config.size = 'small';
    config.transitionDuration = 0;
    config.mustScroll = true;
    setTimeout(() => {
      let element = document.getElementsByTagName('sui-modal');
      if(element && element.length > 0)
        element[0].className = 'sb-modal';
    }, 10);
    this.modalService
      .open(config)
      .onApprove(result => {
        this.showLoader = true;
        this.loaderMessage = {
          'loaderMessage': this.resourceService.messages.stmsg.m0034,
        };
        this.delete(contentIds).subscribe(
          (data: ServerResponse) => {
            this.showLoader = false;
            this.limitedPublishList = this.removeContent(this.limitedPublishList, contentIds);
            if (this.limitedPublishList.length === 0) {
              this.fetchLimitedPublished(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
            }
            this.toasterService.success(this.resourceService.messages.smsg.m0006);
          },
          (err: ServerResponse) => {
            this.showLoader = false;
            this.toasterService.error(this.resourceService.messages.fmsg.m0022);
          }
        );
      })
      .onDeny(result => {
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
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.route.navigate(['workspace/content/limited-publish', this.pageNumber]);
  }
  /**
  * get inview  Data
  */
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.metaData.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.metaData.identifier,
          objtype: inview.data.metaData.contentType,
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
  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }
}
