import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService, IPagination,
  ResourceService, ILoaderMessage, INoResultMessage, IContents, NavigationHelperService
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui-v9';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-question-bank-list',
  templateUrl: './question-bank-list.component.html',
  styleUrls: ['./question-bank-list.component.scss']
})

export class QuestionBankListComponent extends WorkSpace implements OnInit, AfterViewInit {

  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
  
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
   * service for redirection to question bank list component
   */
  private activatedRoute: ActivatedRoute;

  /**
   * Contains unique contentIds id
   */
  contentIds: string[];

  /**
   * Contains list of published question banks
   */
  questionBanks: Array<IContents> = [];

  /**
   * To show / hide loader
   */
  showLoader = true;

  /**
   * loader message
   */
  loaderMessage: ILoaderMessage;

  /**
   * To show / hide no result message when no question banks found
   */
  noResult = false;

  /**
   * no result  message
   */
  noResultMessage: INoResultMessage;

  /**
   * For show and hide page section
   */
  pageLimit: number;

  /**
   * To show / hide pagination
   */
  pager: IPagination;

  /**
   * To get url, app configs
   */
  public config: ConfigService;

  /**
   * Contains page limit of inbox list
   */
  pageNumber = 1;

  /**
   * Contains returned object of the pagination service
   * which is needed to show the pagination on inbox view
   */
  paginationDetails: IPagination;

  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  /**
   * Contains pagination service reference
   */
  private paginationService: PaginationService;

  /**
   * This variable helps to show and hide page loader
   */
  showPageLoader = true;

  /**
   * Total count of question banks
   */
  totalCount: Number;

  /**
   * variable to show/hide delete modal
   */
  showDeleteModal = false;

  /**
   * Contains content id to delete content
   */
  deleteContentIds: Array<string> = [];

  /**
   * variable to show/hide deleting state
   */
  isDeleting = false;

  /**
   * Content identifier to delete
   */
  contentIdToDelete: string;

  /**
   * Content object type to delete
   */
  contentObjectTypeToDelete: string;

  /**
   * Contains telemetry impression event
   */
  telemetryImpression: IImpressionEventInput;

  /**
   * Contains navigation helper service reference
   */
  public navigationhelperService: NavigationHelperService;

  /**
   * Contains modal service reference
   */
  public modalService: SuiModalService;

  /**
   * Constructor to create injected service(s) object
   * Default method of Question Bank List Component class
   */
  constructor(
    searchService: SearchService,
    workSpaceService: WorkSpaceService,
    userService: UserService,
    private paginationServiceRef: PaginationService,
    private activatedRouteRef: ActivatedRoute,
    private routeRef: Router,
    private toasterServiceRef: ToasterService,
    private resourceServiceRef: ResourceService,
    private configRef: ConfigService,
    private navigationhelperServiceRef: NavigationHelperService,
    private modalServiceRef: SuiModalService
  ) {
    super(searchService, workSpaceService, userService);
    this.route = routeRef;
    this.activatedRoute = activatedRouteRef;
    this.toasterService = toasterServiceRef;
    this.resourceService = resourceServiceRef;
    this.config = configRef;
    this.paginationService = paginationServiceRef;
    this.navigationhelperService = navigationhelperServiceRef;
    this.modalService = modalServiceRef;
    this.state = 'questionbank';
  }

  ngOnInit() {
    this.paginationDetails = this.paginationService.getPager(0, 1, this.config.appConfig.WORKSPACE.PAGE_LIMIT);
    this.pageLimit = this.config.appConfig.WORKSPACE.PAGE_LIMIT;
    
    // Set up loader and no result messages
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages?.stmsg?.m0118 || 'Fetching question banks...',
    };
    this.noResultMessage = {
      'messageText': this.resourceService.messages?.stmsg?.m0131 || 'No question banks found',
      'message': this.resourceService.messages?.stmsg?.m0132 || 'Create a new question bank.'
    };
    
    observableCombineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params: any, queryParams: any) => {
        return { params, queryParams };
      }).subscribe(bothParams => {
        this.pageNumber = Number(bothParams.params.pageNumber);
        this.fetchQuestionBanks(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.pageNumber,
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  /**
   * This method sets the make an api call to get all question banks with page No and offset
   */
  fetchQuestionBanks(limit: number, pageNumber: number) {
    this.showPageLoader = true;
    this.pageNumber = pageNumber;
    const searchParams = {
      filters: {
        contentType: 'Course'
      },
      limit: limit,
      offset: (pageNumber - 1) * (limit),
      query: '',
      sort_by: { lastUpdatedOn: 'desc' }
    };

    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && data.result.content.length > 0) {
          this.questionBanks = data.result.content;
          this.totalCount = data.result.count;
          this.paginationDetails = this.paginationService.getPager(data.result.count, pageNumber, limit);
          this.showLoader = false;
          this.noResult = false;
        } else {
          this.showLoader = false;
          this.noResult = true;
          this.totalCount = 0;
          this.paginationDetails = this.paginationService.getPager(0, pageNumber, limit);
        }
        this.showPageLoader = false;
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = true;
        this.showPageLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      }
    );
  }

  /**
   * This method helps to navigate to different pages.
   * If page number is less than 1 or page number is greater than total number
   * of pages is less which is not possible, then it returns.
   */
  navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.route.navigate(['workspace/content/question-banks', this.pageNumber]);
  }

  /**
   * get status of questionset
   */
  getStatus(questionBank) {
    if (_.toLower(questionBank.status) === 'live') {
      return this.resourceService.messages.stmsg.m0130;
    }
  }

  /**
   * Contains methods to show success response and errors
   */
  contentClick(content) {
    this.workSpaceService.navigateToContent(content, this.state);
  }

  /**
   * Call delete API to delete content
   */
  deleteConfirmModal(contentId: string, objectType: string) {
    this.contentIdToDelete = contentId;
    this.contentObjectTypeToDelete = objectType;
    this.showDeleteModal = true;
  }

  /**
   * Confirm delete operation
   */
  confirmDelete() {
    this.isDeleting = true;
    const requestData = {
      'contentIds': [this.contentIdToDelete]
    };
    
    this.workSpaceService.deleteContent(requestData).subscribe(
      (data: ServerResponse) => {
        this.isDeleting = false;
        this.questionBanks = this.removeQuestionBanksFromList(this.questionBanks, [this.contentIdToDelete]);
        this.toasterService.success(this.resourceService.messages.smsg.m0006);
        this.closeDeleteModal();
        // Refresh the list if current page becomes empty
        if (this.questionBanks.length === 0 && this.pageNumber > 1) {
          this.navigateToPage(this.pageNumber - 1);
        }
      },
      (err: ServerResponse) => {
        this.isDeleting = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0022);
        this.closeDeleteModal();
      }
    );
  }

  /**
   * Close delete modal
   */
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.contentIdToDelete = '';
    this.contentObjectTypeToDelete = '';
    this.isDeleting = false;
  }

  /**
   * Delete questionbank content (legacy method - keeping for compatibility)
   */
  deleteContent() {
    const requestData = {
      'contentIds': this.deleteContentIds
    };
    this.workSpaceService.deleteContent(requestData).subscribe(
      (data: ServerResponse) => {
        this.showLoader = false;
        this.questionBanks = this.removeQuestionBanksFromList(this.questionBanks, this.deleteContentIds);
        this.toasterService.success(this.resourceService.messages.smsg.m0006);
        this.removeContentId();
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0022);
        this.removeContentId();
      }
    );
  }

  /**
   * Remove deleted questionbanks from list
   */
  removeQuestionBanksFromList(questionBanks: Array<IContents>, contentIds: Array<string>) {
    _.forEach(contentIds, (contentId) => {
      questionBanks = _.filter(questionBanks, content => content.identifier !== contentId);
    });
    return questionBanks;
  }

  /**
   * Remove content id
   */
  removeContentId() {
    this.deleteContentIds = [];
    this.showDeleteModal = false;
  }

  /**
   * This method calls the copy API service
   */
  copyContent(contentData: IContents) {
    this.showLoader = true;
    // Copy functionality to be implemented
    this.toasterService.success(this.resourceService.messages.smsg.m0042);
    this.showLoader = false;
  }

  setInteractEventData(id) {
    const cardClickInteractData = {
      context: {
        cdata: [],
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        id: id,
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    return cardClickInteractData;
  }
}
