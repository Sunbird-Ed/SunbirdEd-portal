import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workspaceclass } from '../../classes/workspaceclass';
import { SearchService , UserService} from '@sunbird/core';
import { ServerResponse, PaginationService } from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
export interface IContext {
    data: string;
}
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
/**
 * The draft component search for all the drafts
*/

@Component({
    selector: 'app-draft',
    templateUrl: './draft.component.html',
    styleUrls: ['./draft.component.css']
})
export class DraftComponent extends Workspaceclass implements OnInit {

    @ViewChild('modalTemplate')
    public modalTemplate: ModalTemplate<IContext, string, string>;

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
    drafList: Array<any> = [];

    /**
     * To show / hide loader
    */
    showLoader = true;

    /**
      * For showing pagination on draft list
    */
    private paginationService: PaginationService;

    /**
      * Refrence of UserService
    */
    private userService: UserService;

    /**
       * Contains page limit of inbox list
    */
    pageLimit = 9;

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
      * Constructor to create injected service(s) object
      Default method of Draft Component class
      * @param {SearchService} SearchService Reference of SearchService
      * @param {UserService} UserService Reference of UserService
      * @param {Router} route Reference of Router
      * @param {PaginationService} paginationService Reference of PaginationService
      * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
    */
    constructor(public modalService: SuiModalService, public searchService: SearchService,
        public workSpaceService: WorkSpaceService,
        paginationService: PaginationService,
        activatedRoute: ActivatedRoute,
        route: Router, userService: UserService) {
        super(searchService, workSpaceService);
        this.paginationService = paginationService;
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.userService = userService;
    }
    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.pageNumber = Number(params.pageNumber);
            this.fetchDrafts();
        });
    }
    /**
     * This method sets the make an api call to get all drafts with page No and offset
     */
    fetchDrafts() {
        const searchParams = {
            status: ['Draft'],
            contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
            mimeType: ['application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.content-collection'],
            pageNumber: this.pageNumber,
            limit: this.pageLimit,
            userId: this.userService._userid,
            params: { lastUpdatedOn: 'desc' }
        };
        this.search(searchParams).subscribe(
            (data: ServerResponse) => {
                if (data.result.count && data.result.content) {
                    this.drafList = data.result.content;
                    this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
                    _.forEach(this.drafList, (item, key) => {
                        const action = {
                            right: {
                                displayType: 'icon',
                                classes: 'trash large icon',
                                actionType: 'delete',
                                clickable: true
                            }
                        };
                        this.drafList[key].action = action;

                    });
                    this.showLoader = false;
                }
            },
            (err: ServerResponse) => {
                this.showLoader = false;
            }
        );
    }
    deleteDraft(param) {
        if (param.type === 'delete') {
            this.deleteConfirmModal(param.contentId);
        }
    }
    public deleteConfirmModal(contentIds, dynamicContent: string = 'Are you sure to delete this content?') {
        const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);
        config.isClosable = true;
        config.context = { data: dynamicContent };
        config.size = 'mini';
        this.modalService
            .open(config)
            .onApprove(result => {
                this.delete(contentIds).subscribe(
                    (data: ServerResponse) => {
                        if (data.responseCode === 'OK') {
                            this.drafList = this.removeContent(this.drafList, contentIds);
                        }
                    },
                    (err: ServerResponse) => {
                        this.showLoader = false;
                    }
                );
            })
            .onDeny(result => {
                console.log('deny callback');
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
        this.route.navigate(['workspace/content/draft', this.pageNumber]);
    }
}
