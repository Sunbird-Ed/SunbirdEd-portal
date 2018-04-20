import { Component, OnInit, Input } from '@angular/core';
import { UserService, PermissionService } from '@sunbird/core';
import { ProfileService } from './../../services';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';
@Component({
  selector: 'app-profile-visibility',
  templateUrl: './profile-visibility.component.html',
  styleUrls: ['./profile-visibility.component.css']
})
export class ProfileVisibilityComponent implements OnInit {
  @Input() field: string;
  isOpen: any;
  options = [{
    text: 'Hide this from everyone',
    value: 'private'
  },
  {
    text: 'Show this to all',
    value: 'public'
  }];
  userProfile: any;
  profileVisibility: any;
  visibility: 'private' | 'public';
  loader = false;
  constructor(public userService: UserService, public profileService: ProfileService, public resourceService: ResourceService,
    public toasterService: ToasterService) { }

  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = this.userService.userProfile;
          this.visibility = this.userProfile.profileVisibility[this.field] ? 'private' : 'public';
        }
    });
    this.userProfile = this.userService.userProfile;
  }
  setProfileFieldLabel(value) {
    const req = {};
    if (this.visibility === value) {
      return;
    }
    this.loader = true;
    req[value] = [this.field];
    this.profileService.updateProfileFieldVisibility(req).subscribe(res => {
      this.loader = false;
      this.visibility = value;
      // toaster suc
      this.toasterService.success(this.resourceService.messages.smsg.m0040);
    },
    err => {
      this.loader = false;
      // toaster err
      // this.toasterService.error(err.error.params.errmsg);
    });
  }
}
