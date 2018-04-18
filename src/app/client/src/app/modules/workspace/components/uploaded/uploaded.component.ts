import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspaceclass';
import { SearchService, UserService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService,
  ResourceService, IContents, ILoaderMessage, INoResultMessage
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

/**
 * The uploaded component search for all the uploaded
*/
@Component({
  selector: 'app-uploaded',
  templateUrl: './uploaded.component.html',
  styleUrls: ['./uploaded.component.css']
})
export class UploadedComponent extends WorkSpace implements OnInit {
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
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
  uploaded: Array<IContents> = [];

  /**
   * To show / hide loader
  */
  showLoader = true;

  /**
   * loader message
  */
  loaderMessage: ILoaderMessage;

  /**
   * To show / hide error when no result found
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


  /**
  * To call resource service which helps to use language constant
 */
  public resourceService: ResourceService;

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
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.fetchUploaded(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
    });
  }
  /**
     * This method sets the make an api call to get all uploaded content with page No and offset
     */
  fetchUploaded(limit: number, pageNumber: number) {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    const searchParams = {
      filters: {
        status: ['Draft'],
        createdBy: this.userService.userid,
        contentType: this.config.appConfig.WORKSPACE.contentType,
        mimeType: ['application/pdf', 'video/x-youtube', 'application/vnd.ekstep.html-archive',
          'application/epub', 'application/vnd.ekstep.h5p-archive', 'video/mp4', 'video/webm'],
      },
      pageNumber: this.pageNumber,
      limit: this.pageLimit,
      params: { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn }
    };
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0023,
    };
    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && data.result.content.length > 0) {
          this.uploaded = data.result.content;
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
          _.forEach(this.uploaded, (item, key) => {
            const action = {
              right: {
                displayType: 'icon',
                classes: 'trash large icon',
                actionType: 'delete',
                clickable: true
              }
            };
            this.uploaded[key].action = action;

          });
          this.showLoader = false;
          console.log('>>>', this.uploaded);
        } else {
          this.showError = false;
          this.noResult = true;
          this.showLoader = false;
          this.noResultMessage = {
            'message': this.resourceService.messages.stmsg.m0008,
            'messageText': this.resourceService.messages.stmsg.m0024
          };
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0014);
      }
    );
  }

  deleteUploaded(param) {
    if (param.type === 'delete') {
      this.deleteConfirmModal(param.contentId);
    }
  }

  public deleteConfirmModal(contentIds) {
    const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
    config.isClosable = true;
    config.size = 'mini';
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
            this.uploaded = this.removeContent(this.uploaded, contentIds);
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
    this.route.navigate(['workspace/content/uploaded', this.pageNumber]);
  }
}
