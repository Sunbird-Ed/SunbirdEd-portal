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
}
