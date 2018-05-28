import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService, SearchService, PlayerService } from '@sunbird/core';
import { ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService } from '../../../../modules/shared';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MyContributions } from '../../interfaces';
import * as _ from 'lodash';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Contains roles
   */
  workSpaceRole: Array<string>;
  /**
   * Contains loader message to display
   */
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'Loading profile ...'
  };
  /**
   * Contains list of contributions
   */
  contributions: Array<MyContributions>;
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService, public toasterService: ToasterService,
    public userService: UserService, public configService: ConfigService, public router: Router,
    public searchService: SearchService, private playerService: PlayerService) { }
  /**
   * This method is used to fetch user profile details
   */
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.getMyContent();
        }
      });
    this.workSpaceRole = this.configService.rolesConfig.headerDropdownRoles.workSpaceRole;
  }
  /**
   * This method is used to update user actions
   */
  updateAction(field) {
    if (field === 'avatar') {
      $('#iconImageInput').click();
    } else {
      const actions = this.configService.appConfig.PROFILE.profileField;
      this.router.navigate([actions[field]]);
    }
  }
  /**
   * This method is used to get user content
   */
  getMyContent(): void {
    // First check local storage
    const response = this.searchService.searchedContentList;
    if (response && response.count) {
      this.contributions = response.content;
    } else {
      // Make search api call
      const searchParams = {
        status: ['Live'],
        contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
        params: { lastUpdatedOn: 'desc' }
      };
      this.searchService.searchContentByUserId(searchParams).subscribe(
        (data: ServerResponse) => {
          this.contributions = data.result.content;
        },
        (err: ServerResponse) => {
        }
      );
    }
  }
  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      this.router.navigate([authroles.url]);
    }
  }
  onClcikContributions(content) {
    this.playerService.playContent(content);
  }
}
