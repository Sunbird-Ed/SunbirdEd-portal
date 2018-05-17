import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { UserService, BadgesService } from '@sunbird/core';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-badge',
  templateUrl: './content-badge.component.html',
  styleUrls: ['./content-badge.component.css']
})
export class ContentBadgeComponent implements OnInit {
  showBadgeAssingModel: boolean;
  @Input() data: Array<object>;
  public contentId: string;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * all user role
   */
  private userRoles: Array<string> = [];
  public clickedBadge: string;
  public allBadgeList: any;
  constructor(public resourceService: ResourceService, public userService: UserService,
    public badgeService: BadgesService, public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getBadgeDetails();
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.collectionId;
    });
  }

  public getBadgeDetails() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.userRoles = user.userProfile.userRoles;
        }
      });
    const req = {
      request: {
        filters: {
          'issuerList': [],
          'rootOrgId': this.userProfile.rootOrgId,
          'roles': this.userRoles,
          'type': 'content',
        }
      }
    };
    this.badgeService.getAllBadgeList(req).subscribe((response) => {
      if (response && response.responseCode === 'OK') {
        this.allBadgeList = _.differenceBy(response.result.badges, this.data, 'badgeId');
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0078);
      }
    });
  }
  public getBadgeName(badgeName) {
    this.clickedBadge = badgeName;
  }
  public assignBadge(badge) {
    this.showBadgeAssingModel = false;
    const req = {
      'issuerId': badge.issuerId,
      'badgeId': badge.badgeId,
      'recipientId': this.contentId,
      'recipientType': 'content'
    };
    this.badgeService.addBadge(req).subscribe((response) => {
      if (this.data === undefined) {
        this.data = [];
      }
      this.data.push(badge);
      this.allBadgeList = this.allBadgeList.filter((badges) => {
        return badges.badgeId !== badge.badgeId;
      });
      this.toasterService.success(this.resourceService.messages.smsg.m0044);
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0079);
    });
  }
}
