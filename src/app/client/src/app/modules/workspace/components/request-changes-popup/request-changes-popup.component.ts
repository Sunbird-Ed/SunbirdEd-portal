import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ContentService } from '@sunbird/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse, RouterNavigationService,
NavigationHelperService } from '@sunbird/shared';
/**
 * This component displays the checklist for request changes for reviewer and
 * calls the reject API to reject the content
 */
@Component({
  selector: 'app-request-changes-popup',
  templateUrl: './request-changes-popup.component.html',
  styleUrls: ['./request-changes-popup.component.css']
})
export class RequestChangesPopupComponent implements OnInit {
  @ViewChild('modal') modal;
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
	 */
  constructor(route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    configService: ConfigService,
    routerNavigationService: RouterNavigationService,
    contentService: ContentService, public navigationHelperService: NavigationHelperService) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.configService = configService;
    this.routerNavigationService = routerNavigationService;
    this.contentService = contentService;
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
    if (this.reasons && this.reasons.length > 0 && this.comment && _.trim(this.comment).length > 0) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  /**
   * This method builds the request body and call the reject API.
   */
  submitRequestChanges() {
    this.isDisabled = true;
    const requestBody = {
      request: {
        content: {
          rejectReasons: this.reasons,
          rejectComment: _.trim(this.comment)
        }
      }
    };
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.REJECT}/${this.contentId}`,
      data: requestBody
    };
    this.contentService.post(option).subscribe(response => {
      this.modal.deny();
      this.toasterService.success(this.resourceService.messages.smsg.m0005);
      if (this.closeUrl.url.includes('flagreviewer')) {
        this.route.navigate(['workspace/content/flagreviewer/1']);
      } else {
        this.route.navigate(['workspace/content/upForReview/1']);
      }
    }, (err) => {
      this.modal.deny();
      this.toasterService.error(this.resourceService.messages.fmsg.m0020);
      this.redirect();
    });
  }

  /**
   * Method to redirect to parent url
   */
  redirect() {
    this.modal.deny();
    this.route.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  /**
   * This method helps to get the content id from activated route
   */
  ngOnInit() {
    this.activatedRoute.parent.params.subscribe((params) => {
      this.contentId = params.contentId;
    });
    this.closeUrl = this.navigationHelperService.getPreviousUrl();
  }
}
