import { ProfileService } from './../../services/';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent implements OnInit {
  /**
* Admin Dashboard access roles
*/
  admin: Array<string>;
  /**
 * reference of config service.
 */
  public config: ConfigService;
  /**
* Contains action performed - add/edit/view
*/
  action: string;
  /**
  * Stores actions that are allowed
  */
  allowedAction = ['update'];
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  constructor(public resourceService: ResourceService, public userService: UserService,
    public permissionService: PermissionService, public toasterService: ToasterService,
    public profileService: ProfileService, config: ConfigService) {
    this.config = config;
  }
  /**
   * This method is used to fetch user profile details
   */
  ngOnInit() {
    this.admin = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
  }
  /**
   * This method calls profile service to update profile picture of the user
   */
  updateAvatar(image) {
    if (image[0] && image[0].name.match(/.(png|jpg|jpeg)$/i) && image[0].size < 4000000) {
      const formData = new FormData();
      formData.append('file', image[0]);
      formData.append('container', 'user/' + this.userService.userid);
      this.profileService.updateAvatar(formData).subscribe(
        results => {
          this.toasterService.success(this.resourceService.messages.smsg.m0018);
        },
        err => {
          this.toasterService.error(err.params.errmsg);
        }
      );
    } else if (image[0] && !(image[0].name.match(/.(png|jpg|jpeg)$/i) && image[0].size < 4000000)) {
      this.toasterService.error(this.resourceService.messages.imsg.m0005);
    }
  }

}
