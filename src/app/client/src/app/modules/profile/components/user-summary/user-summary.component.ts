import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.css']
})
export class UserSummaryComponent implements OnInit {
  readMore = false;
  userProfile: IUserProfile;
  privateProfileFields = true;
  action: string;
  editSummury: string;
  allowedAction = ['edit'];
  constructor(public resourceService: ResourceService, public permissionService: PermissionService,
    public userService: UserService, public profileService: ProfileService, public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute, private router: Router) { }

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
      } else if ( params.section && params.section === 'summary' &&
      this.allowedAction.indexOf(params.action) === -1 ) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
  }
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

}
