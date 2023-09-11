import { debounceTime, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService, CoursesService, FrameworkService } from '@sunbird/core';
import {
  ServerResponse, ConfigService, PaginationService, IPagination,
  IContents, ToasterService, ResourceService, ILoaderMessage, INoResultMessage,
  NavigationHelperService
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { combineLatest, forkJoin } from 'rxjs';
import { ContentIDParam } from '../../interfaces/delteparam';

/**
 * Interface for passing the configuartion for modal
*/

import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui-v9';

/**
 * The published  component search for all the published component
*/

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss']
})
export class PublishedComponent extends WorkSpace implements OnInit, AfterViewInit {
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
   * Contains list of published conten(s) of logged-in user
  */
  publishedContent: Array<IContents> = [];
  /**
     * To show / hide loader
  */
  showLoader = true;

  /**
   * loader message
  */
  loaderMessage: ILoaderMessage;

  showCourseQRCodeBtn = false;

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
     * Contains page limit of inbox list
  */
  pageLimit = 9;

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
  * To get url, app configs
  */
  public config: ConfigService;

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
  queryParams: object;
  query: string;
  sort: object;

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
  /**
   * To check if questionSet enabled
   */
   public isQuestionSetEnabled: boolean;
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
    public frameworkService: FrameworkService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, public navigationhelperService: NavigationHelperService,
    public coursesService: CoursesService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.state = 'published';
  }

  ngOnInit() {
    this.workSpaceService.questionSetEnabled$.subscribe(
      (response: any) => {
          this.isQuestionSetEnabled = response?.questionSetEnablement;
        }
    );
    combineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams).pipe(
        debounceTime(100),
        map(([params, queryParams]) => ({ params, queryParams })
      ))
      .subscribe(bothParams => {
        if (bothParams.params.pageNumber) {
          this.pageNumber = Number(bothParams.params.pageNumber);
        }
        this.queryParams = bothParams.queryParams;
        this.query = this.queryParams['query'];
        this.fetchPublishedContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);
      });
      this.isPublishedCourse();
  }
  isPublishedCourse() {
    const searchParams = {
      filters: {
        status: ['Live'],
        createdBy: this.userService.userid,
        contentType: ['Course'],
        objectType: this.config.appConfig.WORKSPACE.objectType,
      },
      sort_by: { lastUpdatedOn: 'desc' }
    };
      this.searchService.compositeSearch(searchParams).subscribe((data: ServerResponse) => {
        if (data?.result?.content && data?.result?.content?.length > 0) {
         this.showCourseQRCodeBtn = true;
       }
      });
  }
  getCourseQRCsv() {
    this.coursesService.getQRCodeFile().subscribe((data: any) => {
      const FileURL = _.get(data, 'result.fileUrl');
      if (FileURL) {
        window.open (FileURL, '_blank');
      }
    },
    (err: ServerResponse) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0095);
    });
  }
  /**
    * This method sets the make an api call to get all Published content with page No and offset
    */
  fetchPublishedContent(limit: number, pageNumber: number, bothParams?: object) {
    this.showLoader = true;
    this.pageNumber = pageNumber;
    this.pageLimit = limit;
    this.publishedContent = [];
    this.totalCount = 0;
    this.noResult = false;
    if (bothParams['queryParams'].sort_by) {
      const sort_by = bothParams['queryParams'].sort_by;
      const sortType = bothParams['queryParams'].sortType;
      this.sort = {
        [sort_by]: _.toString(sortType)
      };
    } else {
      this.sort = { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn };
    }
    // tslint:disable-next-line:max-line-length
    const primaryCategories = _.compact(_.concat(this.frameworkService['_channelData'].contentPrimaryCategories, this.frameworkService['_channelData'].collectionPrimaryCategories));
    const searchParams = {
      filters: {
        status: ['Live'],
        createdBy: this.userService.userid,
        objectType: this.isQuestionSetEnabled ? this.config.appConfig.WORKSPACE.allowedObjectType : this.config.appConfig.WORKSPACE.objectType,
        // tslint:disable-next-line:max-line-length
        primaryCategory: _.get(bothParams, 'queryParams.primaryCategory') || (!_.isEmpty(primaryCategories) ? primaryCategories : this.config.appConfig.WORKSPACE.primaryCategory),
        // mimeType: this.config.appConfig.WORKSPACE.mimeType,
        board: bothParams['queryParams'].board,
        subject: bothParams['queryParams'].subject,
        medium: bothParams['queryParams'].medium,
        gradeLevel: bothParams['queryParams'].gradeLevel
      },
      limit: this.pageLimit,
      offset: (this.pageNumber - 1) * (this.pageLimit),
      query: _.toString(bothParams['queryParams'].query),
      sort_by: this.sort
    };
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0021,
    };
    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        const allContent= this.workSpaceService.getAllContent(data, this.isQuestionSetEnabled);
        if (allContent.length > 0) {
          this.publishedContent = allContent;
          this.totalCount = data.result.count;
          this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
          const constantData = this.config.appConfig.WORKSPACE.Published.constantData;
          const metaData = this.config.appConfig.WORKSPACE.Published.metaData;
          const dynamicFields = this.config.appConfig.WORKSPACE.Published.dynamicFields;
          this.publishedContent = this.workSpaceService.getDataForCard(allContent, constantData, dynamicFields, metaData);
          this.showLoader = false;
        } else {
          this.showError = false;
          this.showLoader = false;
          this.noResult = true;
          this.noResultMessage = {
            'messageText': 'messages.stmsg.m0022'
          };
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0013);
      }
    );
  }
  /**
    * This method launch the content editior
  */
  contentClick(param, content) {
    this.contentMimeType = content.metaData.mimeType;
    if (param.data && param.data.originData) {
      const originData = JSON.parse(param.data.originData);
      if (originData.copyType === 'shallow') {
        const errMsg = (this.resourceService.messages.emsg.m1414).replace('{instance}', originData.organisation[0]);
        this.toasterService.error(errMsg);
        return;
      }
    }
    if (param.action.eventName === 'delete') {
      this.currentContentId = param.data.metaData.identifier;
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
      this.showCollectionLoader = false;
    } else {
      this.workSpaceService.navigateToContent(param.data.metaData, this.state);
    }
  }

  /**
  * This method checks whether deleting content is linked to any collections, if linked to collection displays collection list pop modal.
  */
  public checkLinkedCollections(modal) {
    if (!_.isUndefined(modal)) {
      this.deleteModal = modal;
    }
    this.showCollectionLoader = false;
    if (this.contentMimeType === 'application/vnd.ekstep.content-collection') {
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

            _.forEach(collections, collection => {
              const obj = _.pick(collection, ['contentType', 'board', 'medium', 'name', 'gradeLevel', 'subject', 'channel']);
              obj['channel'] = channelMapping[obj.channel];
              this.collectionData.push(obj);
          });

          this.headers = {
             type: 'Type',
             name: 'Name',
             subject: 'Subject',
             grade: 'Grade',
             medium: 'Medium',
             board: 'Board',
             channel: 'Tenant Name'
             };
             if (!_.isUndefined(this.deleteModal)) {
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
  * This method deletes content using the content id.
  */
  public deleteContent(contentIds) {
        this.showLoader = true;
        this.loaderMessage = {
          'loaderMessage': this.resourceService.messages.stmsg.m0034,
        };
        this.delete(contentIds).subscribe(
          (data: ServerResponse) => {
            this.showLoader = false;
            this.publishedContent = this.removeContent(this.publishedContent, contentIds);
            if (this.publishedContent.length === 0) {
              this.fetchPublishedContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
            }
            this.toasterService.success(this.resourceService.messages.smsg.m0006);
          },
          (err: ServerResponse) => {
            this.showLoader = false;
            this.toasterService.success(this.resourceService.messages.fmsg.m0022);
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
    this.route.navigate(['workspace/content/published', this.pageNumber], { queryParams: this.queryParams });
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
