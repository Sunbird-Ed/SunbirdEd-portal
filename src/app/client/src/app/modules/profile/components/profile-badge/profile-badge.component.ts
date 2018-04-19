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
  badgeData: any;
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
          this.badgeService.getAllBadgeList(req).subscribe((badge) => {
            if (badge) {
              this.badgeData = badge.result;
            }
          });
        }
      });
  }
}
