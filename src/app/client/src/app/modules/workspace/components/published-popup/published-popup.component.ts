import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { ContentService, UserService } from '@sunbird/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse,
  RouterNavigationService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { WorkSpaceService, ReviewCommentsService } from './../../services';
/**
 * This component displays the checklist for publish content for reviewer and
 * calls the Publish API to publish the content
 */
@Component({
  selector: 'app-published-popup',
  templateUrl: './published-popup.component.html'
})
export class PublishedPopupComponent implements OnInit {
  @ViewChild('modal') modal;
  @ViewChildren('inputFields') inputFields;
  /**
   * Total number of items on checklist
   */
  totalItemCount: Number;
  /**
   * User id
   */
  userId: string;
  /**
   * To navigate to other pages
   */
  route: Router;
  /**
   * Content id which will be rejected
   */
  contentId: string;
  /**
   * Typed comment
   */
  comment: string;
  /**
   * Checked reasons
   */
  reasons = [];
  /**
   * Flag to enable/disable request changes button
   */
  isDisabled = true;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to parent component
   */
  private activatedRoute: ActivatedRoute;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
     * reference of UtilService.
     */
  public utilService: UtilService;
  /**
   * To navigate back to parent component
   */
  public routerNavigationService: RouterNavigationService;
  /**
   * To get url, app configs
   */
  public configService: ConfigService;
  /**
   * reference of ContentService.
   */
  public contentService: ContentService;
  /**
   * Checklist config
   */
  checkListData: any;
  /**
   * To close url
  */
  closeUrl: any;
  showDefaultConfig = false;
  showloader = true;
  publishCheckListData: any;
  showModal = false;
  /**
  * To get user profile of logged-in user
  */
  public userService: UserService;

 /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of RequestChangesPopupComponent class
	 *
   * @param {Router} route Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {ConfigService} config Reference of ConfigService
   * @param {ContentService} contentService Reference of contentService
   * @param {UserService} userService Reference of contentService
	 */
  constructor(route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    configService: ConfigService,
    routerNavigationService: RouterNavigationService,
    contentService: ContentService,
    userService: UserService,
    public navigationHelperService: NavigationHelperService,
    public workSpaceService: WorkSpaceService, public reviewCommentsService: ReviewCommentsService, utilService: UtilService) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.configService = configService;
    this.routerNavigationService = routerNavigationService;
    this.contentService = contentService;
    this.userService = userService;
    this.utilService = utilService;
    this.checkListData = this.configService.appConfig.CHECK_LIST_CONFIG;
  }

  /**
   * This method pushes all the checked reason into a array
   */
  createCheckedArray(checkedItem) {
    if (checkedItem && (_.indexOf(this.reasons, checkedItem) === -1)) {
      this.reasons.push(checkedItem);
    } else if (checkedItem && (_.indexOf(this.reasons, checkedItem) !== -1)) {
      this.reasons.splice(_.indexOf(this.reasons, checkedItem), 1);
    }
    this.validateModal();
  }

  /**
   * This method checks whether the length of comments is greater than zero.
   * It also checks whether a reject reason is checked.
   * If both the validation is passed it enables the request changes button
   */
  validateModal() {
    if ((this.inputFields && this.inputFields.length === this.reasons.length) || this.showDefaultConfig) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  /**
   * This method builds the request body and call the publish API.
   */
  submitPublishChanges() {
    this.isDisabled = true;
    const requestBody = {
      request: {
        content: {
          publishChecklist: this.reasons,
          lastPublishedBy: this.userId
        }
      }
    };
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.PUBLISH}/${this.contentId}`,
      data: requestBody
    };
    this.contentService.post(option).subscribe(response => {
      this.toasterService.success(this.resourceService.messages.smsg.m0004);
      this.modal.deny();
      this.deleteReviewComments();
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0019);
      this.modal.deny();
      this.redirect();
    });
  }
  navigateToWorkspace() {
    if (this.closeUrl.url.includes('flagreviewer')) {
      this.route.navigate(['workspace/content/flagreviewer/1']);
    } else {
      this.route.navigate(['workspace/content/upForReview/1']);
    }
  }
  deleteReviewComments() {
    if (this.contentId !== _.get(this.reviewCommentsService.contextDetails, 'contentId')) { // if stageId not fetched, throw error
      this.navigateToWorkspace();
      return ;
    }
    const requestBody = {
      request: {
        contextDetails: {
          contentId: _.get(this.reviewCommentsService.contextDetails, 'contentId'),
          contentVer: _.get(this.reviewCommentsService.contextDetails, 'contentVer'),
          contentType: _.get(this.reviewCommentsService.contextDetails, 'contentType')
        }
      }
    };
    this.reviewCommentsService.deleteComment(requestBody)
    .subscribe((res) => this.navigateToWorkspace(),
    (err) => this.navigateToWorkspace());
  }
  /**
   * Method to redirect to parent url
   */
  redirect() {
    this.route.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  getCheckListConfig() {
    this.showDefaultConfig = false;
    const formServiceInputParams = {
      formType: 'content',
      formAction: 'publish',
      subType: 'resource'
    };
    this.workSpaceService.getFormData(formServiceInputParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.form) {
          this.showModal = true;
          this.showloader = false;
          this.publishCheckListData = data.result.form.data.fields[0];
          const language = localStorage.getItem('portalLanguage') || this.configService.constants.DEFAULT_LANGUAGE;
          this.publishCheckListData = this.utilService.updateDataWithI18n(this.publishCheckListData, language);
        } else {
          this.showModal = true;
          this.showloader = false;
          this.showDefaultConfig = true;
          this.validateModal();
        }
      },
      (err: ServerResponse) => {
        this.closeModalAfterError();
      }
    );
  }

  /**
   * This method helps to get the user id from user service and content id from activated route
   */
  ngOnInit() {
    this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.activatedRoute.parent.params.subscribe((params) => {
          this.contentId = params.contentId;
          this.getCheckListConfig();
        });
      }
    });
    this.closeUrl = this.navigationHelperService.getPreviousUrl();
  }

  closeModalAfterError() {
    this.showModal = false;
    this.showloader = false;
    this.toasterService.error(this.resourceService.messages.emsg.m0005);
    this.redirect();
  }
}
