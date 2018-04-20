import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { UserSearchService } from './../../services';
import { BadgesService } from '@sunbird/core';
import * as _ from 'lodash';

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
   * Reference of BadgesService
   */
  private badgesService: BadgesService;

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
    badgesService: BadgesService,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService) {
    this.userSearchService = userSearchService;
    this.badgesService = badgesService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
  }

  /**
   * This method fetches the user data
	 */
  populateUserProfile() {
    this.showLoader = true;
    if (this.userSearchService.userDetailsObject === undefined) {
      const option = { userId: this.userId };
      this.userSearchService.getUserById(option).subscribe(
        (apiResponse: ServerResponse) => {
          this.userDetails = apiResponse.result.response;
          this.populateBadgeDescription();
          this.showLoader = false;
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          this.showLoader = false;
        }
      );
    } else {
      this.userDetails = this.userSearchService.userDetailsObject;
      this.populateBadgeDescription();
      this.showLoader = false;
    }
  }

  /**
   * This method fetches the badge details with the badge id and
   * populates with the userdetails object
	 */
  populateBadgeDescription() {
    const badgeList = [];
    if (this.userDetails.badgeAssertions && this.userDetails.badgeAssertions.length > 0) {
      _.each(this.userDetails.badgeAssertions, (badge) => {
        badgeList.push(badge['badgeId']);
      });
      const req = {
        request: {
          filters: {
            'badgeList': badgeList,
            'type': 'user',
            'rootOrgId': this.userDetails.rootOrgId
          }
        }
      };
      this.badgesService.getAllBadgeList(req).subscribe((badge) => {
        if (badge) {
          this.userDetails.badgeArray = badge.result.badges;
        }
      });
    }
  }

  /**
   * This method helps to toggle the skills div
	 */
  toggle(lim) {
    if (lim === true) {
      this.skillViewMore = false;
    } else {
      this.skillViewMore = true;
      this.skillLimit = 4;
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params.userId;
      this.populateUserProfile();
    });
    this.queryParams = this.activatedRoute.snapshot.queryParams;
  }
}
