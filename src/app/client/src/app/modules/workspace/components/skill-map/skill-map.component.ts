import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService, ISort, FrameworkService, ContentService } from '@sunbird/core';
import { PermissionService } from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService, IPagination,
  ResourceService, ILoaderMessage, INoResultMessage, IContents, NavigationHelperService
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { debounceTime, map } from 'rxjs/operators';

/**
 * Interface for skill map content extending IContents with status property
 */
interface ISkillMapContent extends IContents {
  identifier?: string;
  status?: string;
  lastUpdatedOn?: string;
  code?: string;
  objectType?: string;
  type?: string;
  metaData?: {
    identifier?: string;
    name?: string;
    code?: string;
    status?: string;
    lastUpdatedOn?: string;
    description?: string;
    type?: string;
    objectType?: string;
    mimeType?: string;
  };
}

@Component({
  selector: 'app-skill-map',
  templateUrl: './skill-map.component.html',
  styleUrls: ['./skill-map.component.scss']
})

export class SkillMapComponent extends WorkSpace implements OnInit, AfterViewInit {

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
   * Contains unique contentIds id
  */
  contentIds: string;
  /**
   * Contains list of skill map content(s) of logged-in user
  */
  skillMapContent: Array<ISkillMapContent> = [];

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
  showError = false;  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;

  /**
    * For showing pagination on skill map list
  */
  private paginationService: PaginationService;

  /**
  * To get url, app configs
  */
  public config: ConfigService;
  /**
  * Contains page limit of skill map list
  */
  pageLimit: number;
  /**
  * Current page number of skill map list
  */
  pageNumber = 1;

  /**
  * totalCount of the list
  */
  totalCount: Number;
  /**
    status for preselection;
  */
  status: string;
  /**
  route query param;
  */
  queryParams: any;
  /**
  redirectUrl;
  */
  public redirectUrl: string;
  /**
  filterType;
  */
  public filterType: string;
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
  sort: { [key: string]: string };
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
  * which is needed to show the pagination on skill map view
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
  * To store deleting content id
  */
  private currentContentId: string;

  /**
  * To store deleting content type
  */
  private contentMimeType: string;

  /**
   * To show/hide delete confirmation modal
   */
  public showDeleteModal: boolean = false;

  /**
   * To show loading state during deletion
   */
  public isDeleting: boolean = false;

  /**
   * To check user role for skill maps
   */
  public isSkillMapCreator: boolean = false;
  public isSkillMapReviewer: boolean = false;

  /**
    * Constructor to create injected service(s) object
    Default method of SkillMap Component class
    * @param {SearchService} SearchService Reference of SearchService
    * @param {UserService} UserService Reference of UserService
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(public searchService: SearchService,
    public navigationhelperService: NavigationHelperService,
    public workSpaceService: WorkSpaceService,
    public frameworkService: FrameworkService,
    public permissionService: PermissionService,
    private contentService: ContentService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.state = 'skillmap';
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0110,
    };
    this.noResultMessage = {
      'messageText': 'messages.stmsg.m0008'
    };
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this.isSkillMapCreator = this.permissionService.checkRolesPermissions(['SKILLDOMAIN_CREATOR']);
    this.isSkillMapReviewer = this.permissionService.checkRolesPermissions(['SKILLDOMAIN_REVIEWER']);
  }

  ngOnInit() {
    const currentUrl = this.route.url;
    const isReviewerRoute = currentUrl.includes('skillmap-reviewer');
    if (isReviewerRoute) {
      this.isSkillMapReviewer = true;
      this.isSkillMapCreator = false;
    }
    this.filterType = this.config.appConfig.skillmap?.filterType || this.config.appConfig.allmycontent.filterType;
    this.redirectUrl = this.config.appConfig.skillmap?.inPageredirectUrl || this.config.appConfig.allmycontent.inPageredirectUrl;
    observableCombineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams).pipe(
        debounceTime(10),
        map(([params, queryParams]) => ({ params, queryParams })
        ))
      .subscribe(bothParams => {
        if (bothParams.params.pageNumber) {
          this.pageNumber = Number(bothParams.params.pageNumber);
        }
        this.queryParams = bothParams.queryParams;
        this.query = this.queryParams['query'];
        this.fetchSkillMapContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);
      });
  }

  /**
  * This method sets the make an api call to get all Skill Map Frameworks with page No and offset
  */
  fetchSkillMapContent(limit: number, pageNumber: number, bothParams) {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    this.skillMapContent = [];
    this.totalCount = 0;
    this.noResult = false;

    if (bothParams.queryParams.sort_by) {
      const sort_by = bothParams.queryParams.sort_by;
      const sortType = bothParams.queryParams.sortType;
      this.sort = {
        [sort_by]: _.toString(sortType)
      };
    } else {
      this.sort = { lastPublishedOn: 'desc' };
    }

    let statusFilter: string[] = [];
    if (this.isSkillMapCreator) {
      statusFilter = ['Draft', 'Review', 'Live']; // Creators see all statuses
    } else if (this.isSkillMapReviewer) {
      statusFilter = ['Review']; // Reviewers only see Review status
    } else {
      statusFilter = ['Draft', 'Review', 'Live']; // Default fallback
    }

    const searchParams = {
      filters: {
        status: statusFilter,
        objectType: 'Framework',
        type: 'SkillMap',
      },
      limit: limit,
      offset: (pageNumber - 1) * limit,
      query: _.toString(bothParams.queryParams.query),
      sort_by: this.sort
    };

    this.loaderMessage = {
      'loaderMessage': this.isSkillMapReviewer
        ? (this.resourceService.messages.stmsg.fetchingSkillmapsForReview || 'Fetching skill maps for review...')
        : this.resourceService.messages.stmsg.m0021,
    };

    this.searchService.compositeSearch(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && data.result.Framework && data.result.Framework.length > 0) {
          this.skillMapContent = this.processFrameworkData(data.result.Framework);
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, pageNumber, limit);
          this.showLoader = false;
          this.noResult = false;
        } else {
          this.showError = false;
          this.noResult = true;
          this.showLoader = false;
          this.noResultMessage = {
            'message': this.isSkillMapReviewer
              ? (this.resourceService.messages.stmsg.m0035 || 'No skill maps found for review')
              : 'No skill maps found',
            'messageText': this.isSkillMapReviewer
              ? (this.resourceService.messages.stmsg.m0007 || 'Please submit skill maps for review')
              : 'messages.stmsg.m0006' // Uses "No results found"
          };
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0051); // Something went wrong, try again later
      }
    );
  }

  /**
   * Process framework data to match expected content format
   */
  private processFrameworkData(frameworks: any[]): ISkillMapContent[] {
    // Sort frameworks by lastUpdatedOn in descending order
    const sortedFrameworks = [...frameworks].sort((a, b) => {
      const dateA = new Date(a.lastUpdatedOn || 0).getTime();
      const dateB = new Date(b.lastUpdatedOn || 0).getTime();
      return dateB - dateA;
    });
    
    return sortedFrameworks.map(framework => ({
      identifier: framework.identifier,
      name: framework.name,
      code: framework.code,
      status: framework.status,
      lastUpdatedOn: framework.lastUpdatedOn,
      lastStatusChangedOn: framework.lastStatusChangedOn,
      description: framework.description,
      type: framework.type,
      objectType: framework.objectType,
      creator: framework.creator || framework.createdBy || '',
      createdBy: framework.createdBy || '',
      contentType: 'Skill Map',
      primaryCategory: 'Skill Map',
      mimeType: 'application/vnd.skill-map+json',
      metaData: {
        identifier: framework.identifier,
        name: framework.name,
        code: framework.code,
        status: framework.status,
        lastUpdatedOn: framework.lastUpdatedOn,
        description: framework.description,
        type: framework.type,
        objectType: framework.objectType,
        mimeType: 'application/vnd.framework' // Add a default mimeType for frameworks
      }
    } as ISkillMapContent));
  }

  public deleteConfirmModal(contentIds, mimeType) {
    this.currentContentId = contentIds;
    this.contentMimeType = mimeType;
    this.showDeleteModal = true;
  }

  /**
   * Close delete confirmation modal
   */
  public closeDeleteModal() {
    this.showDeleteModal = false;
    this.isDeleting = false;
  }

  /**
   * Confirm deletion action
   */
  public confirmDelete() {
    this.deleteContent(this.currentContentId);
    this.closeDeleteModal();
  }

  /**
  * This method checks whether deleting content is linked to any collections
  * For skill maps (frameworks), we support deletion only for Draft status
  */
  public checkLinkedCollections(modal) {
    if (!_.isUndefined(modal)) {
      modal.deny();
    }
    this.deleteContent(this.currentContentId);
  }

  private deleteContent(contentId: string) {
    this.isDeleting = true;
    this.frameworkService.retireFramework(contentId).subscribe(
      (data: ServerResponse) => {
        this.isDeleting = false;
        // Handle successful deletion
        if (data.responseCode === 'OK') {
          this.toasterService.success(
            this.resourceService.messages.smsg.m0006 || 'Content deleted successfully'
          );
        } else {
          // API returned success but with non-OK response code
          this.toasterService.error(
            data.params?.errmsg ||
            this.resourceService.messages.fmsg.failedToDeleteContent ||
            'Failed to delete content'
          );
        }
        // Refresh the skill map list by removing the deleted content
        this.skillMapContent = this.skillMapContent.filter(content => content.identifier !== contentId);
        this.totalCount = Number(this.totalCount) - 1;
        
        // Update pagination if necessary
        if (this.skillMapContent.length === 0 && this.pageNumber > 1) {
          this.navigateToPage(this.pageNumber - 1);
        } else {
          // Recalculate pagination
          this.pager = this.paginationService.getPager(Number(this.totalCount), this.pageNumber, this.pageLimit);
        }
      },
      (err: ServerResponse) => {
        this.isDeleting = false;
        // Handle different error scenarios
        let errorMessage = this.resourceService.messages.fmsg.m0051 || 'Something went wrong, try again later';
        this.toasterService.error(errorMessage);
        console.error('Skill map deletion error:', err);
      }
    );
  }

  /**
  * This method calls the workspace content search or handles skill map actions
  */
  contentClick(content: ISkillMapContent): void {
    if (this.isSkillMapReviewer) {
      this.workSpaceService.openSkillMapEditor(content, 'review');
      return;
    }

    if (this.isSkillMapCreator) {
      if (content.status === 'Draft') {
        this.workSpaceService.openSkillMapEditor(content, 'edit');
        return;
      }
    }
    const status = content.status || (content.metaData && content.metaData.status);

    if (status === 'Live' || status === 'Review') {
      this.workSpaceService.openSkillMapEditor(content, 'view');
    } else {
      this.toasterService.warning(this.resourceService.messages.imsg.canNotReviewSkillmap || 'This skill Domain cannot be viewed in current status');
    }
  }

  /**
   * Navigate to skill map editor - only for frameworks with appropriate status
   * @param {ISkillMapContent} content - skill map content
   */
  editSkillMap(content: ISkillMapContent): void {
    const status = content.status || (content.metaData && content.metaData.status);
    if (status === 'Draft') {
      this.workSpaceService.openSkillMapEditor(content, 'edit');
    } else if (status === 'Live' || status === 'Review') {
      this.workSpaceService.openSkillMapEditor(content, 'view');
    } else {
      this.toasterService.warning(this.resourceService.messages.imsg.canNotEditSkillmap || 'This skill Domain cannot be edited in current status');
    }
  }

  /**
   * View skill map in read-only mode - for Live and Review status frameworks
   * @param {ISkillMapContent} content - skill map content
   */
  onView(content: ISkillMapContent): void {
    const status = content.status || (content.metaData && content.metaData.status);

    // Only allow viewing for Live and Review status
    if (status === 'Live' || status === 'Review') {
      this.workSpaceService.openSkillMapEditor(content, 'view');
    }
    else if (status === 'Draft') {
      this.workSpaceService.openSkillMapEditor(content, 'edit');
    }
    else {
      this.toasterService.warning(
        this.resourceService.messages.imsg.canNotViewSkillmap ||
        'This skill domain cannot be viewed in current status'
      );
    }
  }

  /**
   * This method calls the pagination logic to display the pagination and to make the api calls
   * @param {number} page
  */
  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;

    // Determine the route based on current URL
    const currentUrl = this.route.url;
    const routePath = currentUrl.includes('skillmap-reviewer') ? 'skillmap-reviewer' : 'skillmap';

    this.route.navigate(['workspace/content/' + routePath, this.pageNumber], {
      queryParams: this.queryParams
    });
  }

  ngAfterViewInit() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.activatedRoute.snapshot.params.pageNumber,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
  }

  setInteractData(id) {
    return {
      id,
      type: 'click',
      pageid: 'workspace-content-skillmap'
    };
  }
}
