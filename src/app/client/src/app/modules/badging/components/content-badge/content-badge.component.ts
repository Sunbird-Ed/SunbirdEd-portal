import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { UserService, BadgesService } from '@sunbird/core';
import { ContentBadgeService } from './../../services';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

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
  public badge: object;
  public allBadgeList: any;
  public badgeInteractEdata: IInteractEventEdata;
  public cancelBadgeInteractEdata: IInteractEventEdata;
  public assignBadgeInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public userService: UserService,
    public badgeService: BadgesService, public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute, public contentBadgeService: ContentBadgeService) { }

  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.userRoles = user.userProfile.userRoles;
          this.getBadgeDetails();
        }
      });
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.collectionId;
    });
    this.setInteractEventData();
  }

  public getBadgeDetails() {

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
      this.allBadgeList = _.differenceBy(response.result.badges, this.data, 'badgeId');
    }, (err) => {
      if (err && err.error && err.error.params) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0080);
      }
    });
  }
  public setBadge(Badge) {
    this.badge = Badge;
  }
  public assignBadge(badge) {
    this.showBadgeAssingModel = false;
    const req = {
      'issuerId': badge.issuerId,
      'badgeId': badge.badgeId,
      'recipientId': this.contentId,
      'recipientType': 'content'
    };
    this.contentBadgeService.addBadge(req).subscribe((response) => {
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
  setInteractEventData() {
    this.badgeInteractEdata = {
      id: 'add-content-badge',
      type: 'click',
      pageid: 'content-badge'
    };
    this.cancelBadgeInteractEdata = {
      id: 'cancel-badge',
      type: 'click',
      pageid: 'content-badge'
    };
    this.assignBadgeInteractEdata = {
      id: 'assign-badge',
      type: 'click',
      pageid: 'content-badge'
    };
    this.telemetryInteractObject = {
      id: '',
      type: 'badge',
      ver: '1.0'
    };
  }
}
