import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspaceclass';
import { SearchService, UserService } from '@sunbird/core';
import {
  ServerResponse, PaginationService,
  ResourceService, ConfigService, IContents, LoaderMessage, NoResultMessage
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';

/**
 * The Review submission  component
*/

@Component({
  selector: 'app-review-submissions',
  templateUrl: './review-submissions.component.html',
  styleUrls: ['./review-submissions.component.css']
})
export class ReviewSubmissionsComponent extends WorkSpace implements OnInit {
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
  loaderMessage: LoaderMessage;
  /**
     * To show / hide error when no result found
   */
  showError = false;

  /**
   * no result  message
  */
  noResultMessage: NoResultMessage;

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
  * Contains page limit of review submission list
  */
  pageLimit: number;

  /**
    * Current page number of inbox list
  */
  pageNumber = 1;

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
   * Constructor to create injected service(s) object
   Default method of Review submission  Component class
   * @param {SearchService} SearchService Reference of SearchService
   * @param {Router} route Reference of Router
   * @param {UserService} UserService Reference of UserService
   * @param {PaginationService} paginationService Reference of PaginationService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ConfigService} config Reference of ConfigService
 */
  constructor(public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    config: ConfigService, resourceService: ResourceService) {
    super(searchService, workSpaceService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.config = config;
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.fetchReviewContents(this.config.pageConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
    });
  }
  /**
   * This method sets the make an api call to get all reviewContent with page No and offset
  */
  fetchReviewContents(limit: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    const searchParams = {
      filters: {
        status: ['Review'],
        createdBy: this.userService.userid,
        contentType: this.config.pageConfig.WORKSPACE.contentType,
        objectType: this.config.pageConfig.WORKSPACE.objectType,
      },
      pageNumber: this.pageNumber,
      limit: this.pageLimit,
      params: { lastUpdatedOn: this.config.pageConfig.WORKSPACE.lastUpdatedOn }
    };
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0018,
    };
    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && data.result.content.length > 0) {
          this.reviewContent = data.result.content;
          this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
          this.showLoader = false;
        } else {
          this.showError = true;
          this.showLoader = false;
          this.noResultMessage = {
            'message': this.resourceService.messages.stmsg.m0008,
            'messageText': this.resourceService.messages.stmsg.m0033
          };
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
      }
    );
  }

  actionClick(event) {
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
}
