import {takeUntil} from 'rxjs/operators';
import { Subscription ,  Subject } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { UserService, BadgesService } from '@sunbird/core';
import { ContentBadgeService } from './../../services';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-assign-badges-content',
  templateUrl: './assign-badges-content.component.html',
  styleUrls: ['./assign-badges-content.component.css']
})
export class AssignBadgesContentComponent implements OnInit, OnDestroy {
  showBadgeAssingModel: boolean;
  @Input() data: Array<object>;
  public contentId: string;
  userDataSubscription: Subscription;
  public unsubscribe = new Subject<void>();
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
    this.userDataSubscription = this.userService.userData$.subscribe(
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
    this.badgeService.getAllBadgeList(req).pipe(
    takeUntil(this.unsubscribe))
    .subscribe((response) => {
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
    this.contentBadgeService.addBadge(req).pipe(
    takeUntil(this.unsubscribe))
    .subscribe((response) => {
      if (this.data === undefined) {
        this.data = [];
      }
      this.data.push(badge);
      this.allBadgeList = this.allBadgeList.filter((badges) => {
        return badges.badgeId !== badge.badgeId;
      });
      this.contentBadgeService.setAssignBadge(badge);
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

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
      }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}





