import { debounceTime, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService } from '@sunbird/core';
import {
    ServerResponse, PaginationService, ConfigService, ToasterService, IPagination,
    ResourceService, IContents, ILoaderMessage, INoResultMessage, ICard, NavigationHelperService
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import * as _ from 'lodash-es';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';

/**
 * The draft component search for all the drafts
*/

@Component({
    selector: 'app-draft',
    templateUrl: './draft.component.html'
})
export class DraftComponent extends WorkSpace implements OnInit, AfterViewInit {

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
     * Contains static data of popup like header label , submit button label etc
    */
    lockInfoPopupContent: object = {headerTitle: ''};

    /**
     * Contains list of published course(s) of logged-in user
    */
    draftList: Array<ICard> = [];

    /**
     * To show / hide loader
    */
    showLoader = true;

    /**
     * lock popup data for locked contents
    */
    lockPopupData: object;

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
     * To show content locked modal
    */
    showLockedContentModal = false;

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

    private telemetryInteractObject: IInteractEventObject ;
    /**
     * inviewLogs
    */
    inviewLogs = [];
    /**
     * telemetryImpression
    */
    telemetryImpression: IImpressionEventInput;

    queryParams: object;

    query: string;
    sort: object;
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
        config: ConfigService, public navigationhelperService: NavigationHelperService) {
        super(searchService, workSpaceService, userService);
        this.paginationService = paginationService;
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.toasterService = toasterService;
        this.resourceService = resourceService;
        this.config = config;
        this.state = 'draft';
        this.loaderMessage = {
            'loaderMessage': this.resourceService.messages.stmsg.m0011,
        };
    }
    ngOnInit() {
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
              this.fetchDrafts(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);
            });
    }
    /**
     * This method sets the make an api call to get all drafts with page No and offset
     */
    fetchDrafts(limit: number, pageNumber: number, bothParams?: object) {
        this.showLoader = true;
        this.pageNumber = pageNumber;
        this.pageLimit = limit;
        this.draftList = [];
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
        const searchParams = {
            filters: {
                status: ['Draft', 'FlagDraft'],
                createdBy: this.userService.userid,
                primaryCategory: _.get(bothParams, 'queryParams.primaryCategory') || this.config.appConfig.WORKSPACE.primaryCategory,
                mimeType: this.config.appConfig.WORKSPACE.mimeType,
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
        this.searchContentWithLockStatus(searchParams).subscribe(
            (data: ServerResponse) => {
                if (data.result.count && data.result.content && data.result.content.length > 0) {
                    this.totalCount = data.result.count;
                    this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
                    const constantData = this.config.appConfig.WORKSPACE.Draft.constantData;
                    const metaData = this.config.appConfig.WORKSPACE.Draft.metaData;
                    const dynamicFields = this.config.appConfig.WORKSPACE.Draft.dynamicFields;
                    this.draftList = this.workSpaceService.getDataForCard(data.result.content, constantData, dynamicFields, metaData);
                    this.showLoader = false;
                } else {
                    this.showError = false;
                    this.noResult = true;
                    this.showLoader = false;
                    this.noResultMessage = {
                        'messageText': 'messages.stmsg.m0125'
                    };
                }
            },
            (err: ServerResponse) => {
                this.showLoader = false;
                this.noResult = false;
                this.showError = true;
                this.toasterService.error(this.resourceService.messages.fmsg.m0006);
            }
        );
    }
    /**
     * This method launch the content editior
    */
    contentClick(param) {
        if (_.size(param.data.lockInfo) && this.userService.userid !== param.data.lockInfo.createdBy) {
            this.lockPopupData = param.data;
            this.showLockedContentModal = true;
        } else {
            if (param.action.eventName === 'delete') {
                this.telemetryInteractObject = {
                    id: param.data.metaData.identifier,
                    type: param.data.metaData.contentType,
                    ver: '1.0'
                };
                this.deleteConfirmModal(param.data.metaData.identifier);
            } else {
                this.workSpaceService.navigateToContent(param.data.metaData, this.state);
            }
        }
    }

    public onCloseLockInfoPopup () {
        this.showLockedContentModal = false;
    }

    public deleteConfirmModal(contentIds) {
        const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
        config.isClosable = false;
        config.size = 'small';
        config.transitionDuration = 0;
        config.mustScroll = true;
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
                        this.draftList = this.removeContent(this.draftList, contentIds);
                        // after delete if current page results are zero
                        if (this.draftList.length === 0) {
                            this.fetchDrafts(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber);
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
        this.route.navigate(['workspace/content/draft', this.pageNumber], { queryParams: this.queryParams });
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
                    uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.activatedRoute.snapshot.params.pageNumber,
                    visits: this.inviewLogs,
                    duration: this.navigationhelperService.getPageLoadTime()
                }
            };
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
