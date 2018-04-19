import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { UserSearchService } from './../../services';

/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  /**
	 * Contains unique announcement id
	 */
  userId: string;

  queryParams: any;

  /**
	 * Contains page number of outbox list
	 */
  pageNumber = 1;
  descriptionReadMore = false;
  skillViewMore = true;
  skillLimit = 4;

  /**
	 * Contains announcement details returned from API or object called from
   * announcement service
	 */
  userDetails: any;

  showLoader = true;


  /**
   * To make get announcement by id
   */
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
    routerNavigationService: RouterNavigationService) {
    this.userSearchService = userSearchService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
  }

  populateUserProfile () {
    this.showLoader = true;
    if (this.userSearchService.userDetailsObject === undefined) {
      const option = { userId: this.userId };

      this.userSearchService.getUserById(option).subscribe(
        (apiResponse: ServerResponse) => {
          this.userDetails = apiResponse.result.response;
          this.showLoader = false;
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          this.showLoader = false;
        }
      );
    } else {
      this.userDetails = this.userSearchService.userDetailsObject;
      this.showLoader = false;
    }
  }


  /**
   * This method sets the annmouncementId and pagenumber from
   * activated route
	 */
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params.userId;
      this.populateUserProfile();
    });
    this.queryParams = this.activatedRoute.snapshot.queryParams;
  }



    toggle(lim) {
      console.log(lim);
      if (lim === true) {
       // this.skillLimit = this.userProfile.skills.length;
        this.skillViewMore = false;
      } else {
        this.skillViewMore = true;
        this.skillLimit = 4;
      }
    }
}


