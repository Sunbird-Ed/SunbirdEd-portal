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
  /**
   * Reference of Input annotation
   */
  @Input() field: string;
  /**
   * Contains text to show/hide
   */
  options: Array<string>;
  /**
   * Reference of User Profile interface
   */
  userProfile: any;
  /**
   * Contains visibility type - public/private
   */
  visibility: 'private' | 'public';
  /**
   * Boolean value to show/hide loader
   */
  loader = false;
  constructor(public userService: UserService, public profileService: ProfileService, public resourceService: ResourceService,
    public toasterService: ToasterService, public configService: ConfigService) { }
  /**
 * This method is used to fetch user profile details
 */
  ngOnInit() {
    this.options = this.configService.appConfig.PROFILE.options;
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = this.userService.userProfile;
          this.visibility = this.userProfile.profileVisibility[this.field] ? 'private' : 'public';
        }
      });
    this.userProfile = this.userService.userProfile;
  }
  /**
   * This method is used to update profile visibility
   */
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
      this.toasterService.success(this.resourceService.messages.smsg.m0040);
    },
      err => {
        this.loader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0048);
      });
  }
}
