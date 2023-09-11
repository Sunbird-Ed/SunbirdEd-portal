import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService, FrameworkService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ToasterService,
  ResourceService, ConfigService, IContents, ILoaderMessage, INoResultMessage,
  NavigationHelperService, IPagination
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';

/**
 * The Review submission  component
*/

@Component({
  selector: 'app-review-submissions',
  templateUrl: './review-submissions.component.html'
})
export class ReviewSubmissionsComponent extends WorkSpace implements OnInit, AfterViewInit {
  /**
  * state for content editior
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
   * Contains unique contentIds id
  */
  contentIds: string;
  /**
   * Contains list of published course(s) of logged-in user
  */
  reviewContent: Array<IContents> = [];

  /**
   * To show / hide loader
  */
  showLoader = true;

  /**
   * loader message
  */
  loaderMessage: ILoaderMessage;
  /**
     * To show / hide error
   */
  showError = false;

  /**
    * To show / hide no result message when no result found
   */
  noResult = false;

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
  * Contains page limit of review submission list
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
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
   /**
   * To check if questionSet enabled
   */
  public isQuestionSetEnabled: boolean;
  /**
   * Constructor to create injected service(s) object
   Default method of Review submission  Component class
   * @param {SearchService} SearchService Reference of SearchService
   * @param {Router} route Reference of Router
   * @param {UserService} UserService Reference of UserService
   * @param {PaginationService} paginationService Reference of PaginationService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ConfigService} config Reference of ConfigService
   * @param {ToasterService} toaster Reference of toasterService
 */
  constructor(public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    public frameworkService: FrameworkService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    config: ConfigService, resourceService: ResourceService,
    toasterService: ToasterService,
    public navigationhelperService: NavigationHelperService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.config = config;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.state = 'review';
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0018,
    };
  }

  ngOnInit() {
    this.workSpaceService.questionSetEnabled$.subscribe(
      (response: any) => {
          this.isQuestionSetEnabled = response?.questionSetEnablement;
        }
    );
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.fetchReviewContents(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
    });
  }
  /**
   * This method sets the make an api call to get all reviewContent with page No and offset
  */
  fetchReviewContents(limit: number, pageNumber: number) {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    const primaryCategories = _.compact(_.concat(this.frameworkService['_channelData'].contentPrimaryCategories,
       this.frameworkService['_channelData'].collectionPrimaryCategories));
    const searchParams = {
      filters: {
        status: ['Review', 'FlagReview'],
        createdBy: this.userService.userid,
        primaryCategory: (!_.isEmpty(primaryCategories) ? primaryCategories : this.config.appConfig.WORKSPACE.primaryCategory),
        objectType: this.isQuestionSetEnabled ? this.config.appConfig.WORKSPACE.allowedObjectType : this.config.appConfig.WORKSPACE.objectType,
      },
      limit: this.pageLimit,
      offset: (this.pageNumber - 1) * (this.pageLimit),
      sort_by: { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn }
    };
    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        const allContent= this.workSpaceService.getAllContent(data, this.isQuestionSetEnabled);
        if (allContent.length > 0) {
          this.reviewContent = allContent;
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
          const constantData = this.config.appConfig.WORKSPACE.ReviewSubmission.constantData;
          const metaData = this.config.appConfig.WORKSPACE.ReviewSubmission.metaData;
          const dynamicFields = this.config.appConfig.WORKSPACE.ReviewSubmission.dynamicFields;
          this.reviewContent = this.workSpaceService.getDataForCard(allContent, constantData, dynamicFields, metaData);
          this.showLoader = false;
        } else {
          this.showError = false;
          this.showLoader = false;
          this.noResult = true;
          this.noResultMessage = {
            'message': 'messages.stmsg.m0008',
            'messageText': 'messages.stmsg.m0033'
          };
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0012);
      }
    );
  }
  /**
    * This method launch the content editior
  */
  contentClick(param) {
    this.workSpaceService.navigateToContent(param.data.metaData, this.state);
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
    this.route.navigate(['workspace/content/review', this.pageNumber]);
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
}
