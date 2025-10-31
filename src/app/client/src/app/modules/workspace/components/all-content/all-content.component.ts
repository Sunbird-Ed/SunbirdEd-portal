
import { combineLatest as observableCombineLatest, forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { SuiModalService, TemplateModalConfig, ModalTemplate } from '@project-sunbird/ng2-semantic-ui';
import { debounceTime, map } from 'rxjs/operators';
import { ContentIDParam } from '../../interfaces/delteparam';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-all-content',
  templateUrl: './all-content.component.html',
  styleUrls: ['./all-content.component.scss']
})

export class AllContentComponent extends WorkSpace implements OnInit, AfterViewInit {

  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
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
  allContent: Array<IContents> = [];

  // pageLoadTime = new PageLoadTime()
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
   * lock popup data for locked contents
  */
  lockPopupData: object;

  /**
   * To show content locked modal
  */
  showLockedContentModal = false;

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
  * To store all the collection details to be shown in collection modal
  */
  public collectionData: Array<any>;

  /**
  * Flag to show/hide loader on first modal
  */
  private showCollectionLoader: boolean;

  /**
  * To define collection modal table header
  */
  private headers: any;

  /**
  * To store deleting content id
  */
  private currentContentId: ContentIDParam;

  /**
  * To store deleteing content type
  */
  private contentMimeType: string;

  /**
   * To store modal object of first yes/No modal
   */
  private deleteModal: any;

  /**
   * To show/hide collection modal
   */
  public collectionListModal = false;
  public isQuestionSetFilterEnabled: boolean;

  public categoryCodes: string[] = [];

  /**
   * Helper method to check if a value is an array (for use in templates)
   */
  public isArray(value: any): boolean {
    return Array.isArray(value);
  }
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
    public navigationhelperService: NavigationHelperService,
    public workSpaceService: WorkSpaceService,
    public frameworkService: FrameworkService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, public modalService: SuiModalService,
    public cslFrameworkService: CslFrameworkService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.state = 'allcontent';
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0110,
    };
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this.cslFrameworkService = cslFrameworkService;
  }

  ngOnInit() {
    this.workSpaceService.questionSetEnabled$.subscribe(
      (response: any) => {
        this.isQuestionSetFilterEnabled = response.questionSetEnablement;
      }
    );
    this.filterType = this.config.appConfig.allmycontent.filterType;
    this.redirectUrl = this.config.appConfig.allmycontent.inPageredirectUrl;
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
        this.fecthAllContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);
      });
  }
  /**
  * This method sets the make an api call to get all UpForReviewContent with page No and offset
  */
  fecthAllContent(limit: number, pageNumber: number, bothParams) {
    this.showLoader = true;
    const frameworkCategories = this.cslFrameworkService.getFrameworkCategoriesObject() as Array<any>;

    const dynamicFilters = frameworkCategories.reduce((filters, category) => {
      const code = category.code;
      if (bothParams['queryParams'][code]) {
        filters[code] = bothParams['queryParams'][code];
      }
      return filters;
    }, {} as Record<string, any>);
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
        createdBy: this.userService.userid,
        // tslint:disable-next-line:max-line-length
        primaryCategory: _.get(bothParams, 'queryParams.primaryCategory') || (!_.isEmpty(primaryCategories) ? primaryCategories : this.config.appConfig.WORKSPACE.primaryCategory),
        ...dynamicFilters
      },
      limit: limit,
      offset: (pageNumber - 1) * (limit),
      query: _.toString(bothParams.queryParams.query),
      sort_by: this.sort
    };
    if (this.isQuestionSetFilterEnabled !== true) {
      searchParams.filters['objectType'] = this.config.appConfig.WORKSPACE.objectType;
    }
    this.searchContentWithLockStatus(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && (!_.isEmpty(data.result.content) ||
        (!_.isEmpty(data.result.QuestionSet)))) {
          if (this.isQuestionSetFilterEnabled === true && data.result.QuestionSet) {
            data.result.content = _.concat(data.result.content, data.result.QuestionSet);
          }
          this.allContent = data.result.content;
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, pageNumber, limit);
          this.showLoader = false;
          this.noResult = false;
        } else {
          this.showError = false;
          this.noResult = true;
          this.showLoader = false;
          this.noResultMessage = {
            'messageText': 'messages.stmsg.m0006'
          };
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0081);
      }
    );
  }

  public deleteConfirmModal(contentIds, mimeType) {
    this.currentContentId = contentIds;
    this.contentMimeType = mimeType;
    this.showCollectionLoader = false;
    const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
    config.isClosable = false;
    config.size = 'small';
    config.transitionDuration = 0;
    config.mustScroll = true;
    this.modalService
      .open(config);
    setTimeout(() => {
      let element = document.getElementsByTagName('sui-modal');
      if(element && element.length > 0)
        element[0].className = 'sb-modal';
    }, 10);
  }

  /**
  * This method checks whether deleting content is linked to any collections, if linked to collection displays collection list pop modal.
  */
  public checkLinkedCollections(modal) {
    if (!_.isUndefined(modal)) {
      this.deleteModal = modal;
    }
    this.showCollectionLoader = false;
    if (this.contentMimeType === this.config.editorConfig.COLLECTION_EDITOR.mimeCollection || this.contentMimeType === this.config.editorConfig.QUESTIONSET_EDITOR.mimeCollection) {
      this.deleteContent(this.currentContentId);
      return;
    }

    this.getLinkedCollections(this.currentContentId)
      .subscribe((response) => {
        const count = _.get(response, 'result.count');
        if (!count) {
          this.deleteContent(this.currentContentId);
          return;
        }
        this.showCollectionLoader = true;
        const collections = _.get(response, 'result.content', []);

        const channels = _.map(collections, (collection) => {
          return _.get(collection, 'channel');
        });
        const channelMapping = {};
        forkJoin(_.map(channels, (channel: string) => {
            return this.getChannelDetails(channel);
          })).subscribe((forkResponse) => {
            this.collectionData = [];
            _.forEach(forkResponse, channelResponse => {
              const channelId = _.get(channelResponse, 'result.channel.code');
              const channelName = _.get(channelResponse, 'result.channel.name');
              channelMapping[channelId] = channelName;
            });

            const frameworkCategories = this.cslFrameworkService.getGlobalFilterCategoriesObject();

            _.forEach(collections, collection => {
              const dynamicFields = {};

              if (frameworkCategories && Array.isArray(frameworkCategories)) {
                const categoryCodes = frameworkCategories.map(category => ({code: category.code, collectionCode: category.alternativeCode}));

                categoryCodes.forEach(category => {
                  if (collection[category.code] || collection[category.collectionCode]) {
                    dynamicFields[category.code] = collection[category.code] || collection[category.collectionCode];
                  }
                });
              }

              const requiredFields = {
                contentType: collection.contentType,
                name: collection.name,
                channel: channelMapping[collection.channel]
              };

              const obj = { ...requiredFields, ...dynamicFields };
              this.collectionData.push(obj);
          });

            const requiredHeaders = {
              type: 'Type',
              name: 'Name',
              channel: 'Tenant Name'
            };

            this.categoryCodes = [];
            const dynamicHeaders = {};

            if (frameworkCategories && Array.isArray(frameworkCategories)) {
              frameworkCategories.forEach((category: any) => {
                if (category.code) {
                  this.categoryCodes.push(category.code);
                  dynamicHeaders[category.code] = category.label ||
                    category.code.charAt(0).toUpperCase() + category.code.slice(1);
                }
              });
            }
          
          this.headers = { ...requiredHeaders, ...dynamicHeaders };
            if (!_.isUndefined(modal)) {
              this.deleteModal.deny();
            }
          this.collectionListModal = true;
          },
          (error) => {
            this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0014'));
            console.log(error);
          });
        },
        (error) => {
          this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0015'));
          console.log(error);
        });
  }

  /**
  * This method deletes content or question set based on mime type
  */
  deleteContent(contentId) {
    this.showLoader = true;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0034,
    };

    // Choose the appropriate delete method based on mime type
    const deleteObservable = this.contentMimeType === 'application/vnd.sunbird.questionset' 
      ? this.deleteQuestionSet(contentId)
      : this.delete(contentId);

    deleteObservable.subscribe(
      (data: ServerResponse) => {
        this.showLoader = false;
        this.allContent = this.removeAllMyContent(this.allContent, contentId);
        if (this.allContent.length === 0) {
          this.ngOnInit();
        }
        this.toasterService.success(this.resourceService.messages.smsg.m0006);
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0022);
      }
    );
    if (!_.isUndefined(this.deleteModal)) {
      this.deleteModal.deny();
    }
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
    this.route.navigate(['workspace/content/allcontent', this.pageNumber], { queryParams: this.queryParams });
  }

  contentClick(content) {
    if (content.originData) {
      const originData = JSON.parse(content.originData);
      if (originData.copyType === 'shallow') {
        const errMsg = (this.resourceService.messages.emsg.m1414).replace('{instance}', originData.organisation[0]);
        this.toasterService.error(errMsg);
        return;
      }
    }
    if (_.size(content.lockInfo) && this.userService.userid !== content.lockInfo.createdBy) {
      this.lockPopupData = content;
      this.showLockedContentModal = true;
    } else {
      const status = content.status.toLowerCase();
      if (status === 'processing') {
        return;
      }
      if (status === 'draft') { // only draft state contents need to be locked
        this.workSpaceService.navigateToContent(content, this.state);
      } else {
        this.workSpaceService.navigateToContent(content, this.state);
      }
    }
  }

  public onCloseLockInfoPopup () {
    this.showLockedContentModal = false;
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
  removeAllMyContent(contentList, requestData) {
    return contentList.filter((content) => {
      return requestData.indexOf(content.identifier) === -1;
    });
  }
}

