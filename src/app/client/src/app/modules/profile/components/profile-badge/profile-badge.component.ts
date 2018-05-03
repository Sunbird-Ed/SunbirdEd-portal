import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData } from '@sunbird/shared';
import { UserService, BadgesService } from '@sunbird/core';
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
  viewMore = true;
  defaultLimit = 3;
  limit = 3; // config
  badgeData: any;
  badgeArray: any;
  profileBadge: any;
  constructor(public resourceService: ResourceService, public userService: UserService,
    public badgeService: BadgesService) { }

  ngOnInit() {
    this.getBadgeData();
  }
  getBadgeData() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
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
  toggle(lim) {
    if (lim === true) {
      this.limit = this.badgeArray.length;
      this.viewMore = false;
    } else {
      this.viewMore = true;
      this.limit = 3;
    }
  }
}
