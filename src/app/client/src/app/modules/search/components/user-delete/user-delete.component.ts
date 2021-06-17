import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule , Router } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { UserSearchService } from './../../services';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html'
})
export class UserDeleteComponent implements OnInit, OnDestroy {
   @ViewChild('modal') modal;

  userId: string;

  /**
	 * Contains page number of outbox list
	 */
  pageNumber = 1;

  userDetails: any;

  private userSearchService: UserSearchService;

  /**
   * To send activatedRoute.snapshot to routerNavigationService
   */
  public activatedRoute: ActivatedRoute;

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
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {UserSearchService} userSearchService Reference of UserSearchService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
	 */
  constructor(userSearchService: UserSearchService,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService , public route: Router) {
    this.userSearchService = userSearchService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
  }

  deleteUser(): void {
    const option = { userId: this.userId };
    this.userSearchService.deleteUser(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0029);
        this.redirect();
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.redirect();
      }
    );
  }

  /**
   * This method helps to redirect to the parent component
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect(): void {
    this.route.navigate(['../../'], {relativeTo: this.activatedRoute});
  }

  setUserDetails() {
    if (this.userSearchService.userDetailsObject === undefined ||
      this.userSearchService.userDetailsObject.id !== this.userId) {
      const option = { userId: this.userId };
      this.userSearchService.getUserById(option).subscribe(
        (apiResponse: ServerResponse) => {
          this.userDetails = apiResponse.result.response;
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          this.redirect();
        }
      );
    } else {
      this.userDetails = this.userSearchService.userDetailsObject;
    }
  }

  /**
   * This method sets the annmouncementId and pagenumber from
   * activated route
	 */
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params.userId;
    });
    this.setUserDetails();
  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}

