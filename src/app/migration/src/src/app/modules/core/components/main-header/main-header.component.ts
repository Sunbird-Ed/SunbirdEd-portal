import { UserService, PermissionService } from './../../services';
// import * as roleConfig from './../../../config/roles.config.json';
import { Component, OnInit } from '@angular/core';
import { ConfigService, ResourceService} from '@sunbird/shared';
@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})

export class MainHeaderComponent implements OnInit {
  userid: string;
  userProfile: object;
  orgLogo: any;
  isOpen: any;
  userRoles: any;
  roleconFig = this.config.rolesConfig;
  workSpaceRole = this.roleconFig.headerDropdownRoles.workSpaceRole;
  adminDashboard = this.roleconFig.headerDropdownRoles.adminDashboard;
  announcementRole = this.roleconFig.headerDropdownRoles.announcementRole;
  myActivityRole = this.roleconFig.headerDropdownRoles.myActivityRole;
  orgSetupRole = this.roleconFig.headerDropdownRoles.orgSetupRole;
  constructor(public config: ConfigService,
    public resourceService: ResourceService,
    public permissionService: PermissionService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.userService.userData$.subscribe(
      user => {
        if (user) {
          if (!user.err) {
            this.userProfile = user.userProfile;
          } else if (user.err) {

          }
        } else {

        }
      }
    );
  }
  logout () {
    window.document.location.replace('/logout');
  }
}
