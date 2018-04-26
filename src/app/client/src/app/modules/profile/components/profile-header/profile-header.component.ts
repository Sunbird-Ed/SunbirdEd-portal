import { ProfileService } from './../../services/';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  userProfile: IUserProfile;
  constructor(public resourceService: ResourceService, public userService: UserService, public activatedRoute: ActivatedRoute,
    public permissionService: PermissionService, public toasterService: ToasterService, public router: Router,
    public profileService: ProfileService, config: ConfigService) {
    this.config = config;
  }

  ngOnInit() {
    this.admin = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = this.userService.userProfile;
        }
      });
  }
  updateAvatar(image) {
    if (image[0] && image[0].name.match(/.(png|jpg|jpeg)$/i) && image[0].size < 4000000) {
      const formData = new FormData();
      formData.append('file', image[0]);
      formData.append('container', 'user/' + this.userService.userid);
      this.profileService.updateAvatar(formData).subscribe(
        results => {
          this.toasterService.success(this.resourceService.messages.smsg.m0018);
          this.router.navigate(['/profile']);
        },
        err => {
          this.toasterService.error(err.params.errmsg);
        }
      );
    } else if (image[0] && !(image[0].name.match(/.(png|jpg|jpeg)$/i) && image[0].size < 4000000)) {
      this.toasterService.error(this.resourceService.messages.imsg.m0005);
      this.router.navigate(['/profile']);
    } else {
      console.log('image', image);
      this.router.navigate(['/profile']);
    }
  }

}
