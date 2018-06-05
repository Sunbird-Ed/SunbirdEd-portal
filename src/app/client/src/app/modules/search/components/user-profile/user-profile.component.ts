import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { UserSearchService } from './../../services';
import { BadgesService, BreadcrumbsService, LearnerService, UserService } from '@sunbird/core';
import * as _ from 'lodash';
import { IImpressionEventInput } from '@sunbird/telemetry';

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
  descriptionReadMore = true;
  skillViewMore = true;
  skillLimit = 4;
  defaultLimit = 4;
  loggedInUserId: string;
  disableEndorsementButton = false;
  /**
   * Booloean value to hide/show awards
   */
  badgeViewMore = true;
  /**
	 * Contains announcement details returned from API or object called from
   * announcement service
	 */
  userDetails: any;

  showLoader = true;
  showError = false;

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
   * To pass dynamic breadcrumb data.
   */
  public breadcrumbsService: BreadcrumbsService;
  router: Router;

  /**
   * To call API
   */
  public learnerService: LearnerService;
  /**
   * To get url, app configs
   */
  public configService: ConfigService;
  /**
  * To get user profile of logged-in user
  */
  public userService: UserService;
  /**
   * Contains default limit to show awards
   */
  badgeDefaultLimit: number;
  /**
   * Used to store limit to show/hide awards
   */
  badgeLimit: number;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
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
  * @param {BreadcrumbsService} breadcrumbsService Reference of BreadcrumbsService
  * @param {LearnerService} learnerService Reference of LearnerService
  * @param {ConfigService} config Reference of ConfigService
  * @param {UserService} userService Reference of contentService
  */
  constructor(userSearchService: UserSearchService,
    public route: Router,
    badgesService: BadgesService,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService,
    breadcrumbsService: BreadcrumbsService,
    learnerService: LearnerService,
    configService: ConfigService,
    userService: UserService,
    router: Router) {
    this.userSearchService = userSearchService;
    this.badgesService = badgesService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
    this.breadcrumbsService = breadcrumbsService;
    this.learnerService = learnerService;
    this.configService = configService;
    this.userService = userService;
    this.badgeDefaultLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
    this.badgeLimit = this.badgeDefaultLimit;
  }

  /**
   * This method fetches the user data
	 */
  populateUserProfile() {
    this.showLoader = true;
    const option = { userId: this.userId };
    this.userSearchService.getUserById(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.userDetails = apiResponse.result.response;
        this.formatEndorsementList();
        this.breadcrumbsService.setBreadcrumbs([{ label: this.userDetails.firstName, url: '' }]);
        this.populateBadgeDescription();
        this.showLoader = false;
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
        this.showError = true;
      }
    );
  }

  /**
   * This method helps to show the endorsement button
	 */
  formatEndorsementList() {
    if (this.userDetails && this.userDetails.skills && this.userDetails.skills.length) {
      _.each(this.userDetails.skills, (skill) => {
        if (skill.endorsersList) {
          const userIds = _.map(skill.endorsersList, 'userId');
          skill.isEndorsable = _.includes(userIds, this.loggedInUserId);
        }
      });
    }
  }

  /**
   * This method submits the clicked endorsement
	 */
  submitEndorsement(skillName) {
    this.disableEndorsementButton = true;
    const requestBody = {
      request: {
        skillName: [skillName],
        endorsedUserId: this.userId
      }
    };
    const option = {
      url: this.configService.urlConFig.URLS.USER.ADD_SKILLS,
      data: requestBody
    };
    this.learnerService.post(option).subscribe(response => {
      _.each(this.userDetails.skills, (skill) => {
        if (skill.skillName === skillName) {
          skill.isEndorsable = true;
          skill.endorsementcount = skill.endorsementcount + 1;
        }
      });
      this.disableEndorsementButton = false;
      this.toasterService.success(this.resourceService.messages.smsg.m0043);
    }, (err) => {
      this.disableEndorsementButton = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  /**
   * This method fetches the badge details with the badge id and
   * populates with the user details object
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
      this.userDetails.badgeArray = [];
      this.badgesService.getDetailedBadgeAssertions(req, this.userDetails.badgeAssertions).subscribe((detailedAssertion) => {
        if (detailedAssertion) {
          this.userDetails.badgeArray.push(detailedAssertion);
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
      this.skillLimit = 4;
      this.skillViewMore = true;
    }
  }

  ngOnInit() {
    this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.loggedInUserId = userdata.userProfile.userId;
        this.activatedRoute.params.subscribe(params => {
          this.userId = params.userId;
          this.populateUserProfile();
          this.telemetryImpression = {
            context: {
              env: this.activatedRoute.snapshot.data.telemetry.env
            },
            object: {
              id: this.userId,
              type: 'user',
              ver: '1.0'
            },
            edata: {
              type: this.activatedRoute.snapshot.data.telemetry.type,
              pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
              uri: this.route.url,
              subtype: this.activatedRoute.snapshot.data.telemetry.subtype
            }
          };
        });
        this.queryParams = this.activatedRoute.snapshot.queryParams;
      }
    });
  }
  /**
   * This method is used to show/hide ViewMore based on the limit
   */
  badgeToggle(viewMore) {
    if (viewMore === true) {
      this.badgeLimit = this.userDetails.badgeArray.length;
      this.badgeViewMore = false;
    } else {
      this.badgeViewMore = true;
      this.badgeLimit = this.defaultLimit;
    }
  }
}
