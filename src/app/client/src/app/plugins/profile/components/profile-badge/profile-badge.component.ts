import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData } from '../../../../modules/shared';
import { UserService, BadgesService } from '../../../../modules/core/services';
import * as _ from 'lodash';

@Component({
  selector: 'app-profile-badge',
  templateUrl: './profile-badge.component.html',
  styleUrls: ['./profile-badge.component.css']
})
export class ProfileBadgeComponent implements OnInit {
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Booloean value to hide/show awards
   */
  viewMore = true;
  /**
   * Contains default limit to show awards
   */
  defaultLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
  /**
   * Used to store limit to show/hide awards
   */
  limit = this.defaultLimit;
  /**
   * Contains array of badges
   */
  badgeArray: any = [];
  constructor(public resourceService: ResourceService, public userService: UserService,
    public badgeService: BadgesService, public configService: ConfigService) { }
  /**
   * This method is used to call getBadgeData method
   */
  ngOnInit() {
    this.getBadgeData();
  }
  /**
   * This method is used to fetch detailed badge data
   */
  getBadgeData() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err && user.userProfile.badgeAssertions) {
          this.userProfile = user.userProfile;
          const badgeList = [];
          _.each(this.userProfile.badgeAssertions, (badge) => {
            badgeList.push(badge['badgeId']);
          });
          const req = {
            request: {
              filters: {
                'badgeList': badgeList,
                'type': 'user',
                'rootOrgId': this.userProfile.rootOrgId
              }
            }
          };
          this.badgeArray = [];
          this.badgeService.getDetailedBadgeAssertions(req, this.userProfile.badgeAssertions).subscribe((detailedAssertion) => {
            if (detailedAssertion) {
              this.badgeArray.push(detailedAssertion);
            }
          });
        }
      });
  }
  /**
   * This method is used to show/hide ViewMore based on the limit
   */
  toggle(viewMore) {
    if (viewMore === true) {
      this.limit = this.badgeArray.length;
      this.viewMore = false;
    } else {
      this.viewMore = true;
      this.limit = this.defaultLimit;
    }
  }
}
