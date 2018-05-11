import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService, SearchService } from '@sunbird/core';
import { ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService } from '../../../../modules/shared';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  userProfile: IUserProfile;
  workSpaceRole: Array<string>;
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'Loading profile ...'
  };
  contributions: any;
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService, public toasterService: ToasterService,
    public userService: UserService, public configService: ConfigService, public router: Router,
    public searchService: SearchService) { }

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
  updateAction(field) {
    if (field === 'avatar') {
      $('#iconImageInput').click();
    } else {
      const actions = this.configService.appConfig.PROFILE.profileField;
      this.router.navigate([actions[field]]);
    }
  }
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
}
