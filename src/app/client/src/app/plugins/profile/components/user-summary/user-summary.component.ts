import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.css']
})
export class UserSummaryComponent implements OnInit {
  /**
   * Boolean value to show/hide readMore
   */
  readMore = false;
  /**
   * Reference to User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Boolean value for profile visibility
   */
  privateProfileFields = true;
  /**
   * Contains edit action
   */
  action: string;
  /**
   * Used to bind data
   */
  editSummury: string;
  /**
   * Contains array of actions
   */
  allowedAction = ['edit'];
  editSummuryIntractEdata: IInteractEventEdata;
  saveSummuryIntractEdata: IInteractEventEdata;
  editCloseSummuryIntractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public permissionService: PermissionService,
    public userService: UserService, public profileService: ProfileService, public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute, private router: Router) { }
  /**
   * This method invokes user service to fetch user summary data
   * Also used to assign action
   */
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.editSummury = this.userProfile.profileSummary;
        }
      });
    this.userProfile = this.userService.userProfile;
    this.activatedRoute.params.subscribe(params => {
      if (params.section && params.section === 'summary' &&
        this.allowedAction.indexOf(params.action) > -1) {
        this.action = params.action;
      } else if (params.section && params.section === 'summary' &&
        this.allowedAction.indexOf(params.action) === -1) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
    this.setInteractEventData();
  }
  /**
   * This method is used to edit user summary details
   */
  editDetails(editedSummury) {
    this.action = 'view';
    const req = {
      profileSummary: editedSummury
    };
    this.profileService.updateProfile(req).subscribe(res => {
      this.router.navigate(['/profile']);
      // toaster suc
      this.toasterService.success(this.resourceService.messages.smsg.m0019);
    },
      err => {
        // toaster err
      });
  }
  setInteractEventData() {
    this.editSummuryIntractEdata = {
      id: 'profile-update-summary',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveSummuryIntractEdata = {
      id: 'profile-save-summary',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editCloseSummuryIntractEdata = {
      id: 'profile-close-edit-summary',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject =  {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }
}
