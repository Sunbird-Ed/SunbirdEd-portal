import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService, SearchService } from '@sunbird/core';
import { ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
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
    const actions = {
      profileSummary: 'profile/summary/edit',
      jobProfile: 'profile/experience/add',
      address: 'profile/address/add',
      education: 'profile/education/add',
      location: 'profile/additionalInfo/edit',
      dob: 'profile/additionalInfo/edit',
      subject: 'profile/additionalInfo/edit',
      grade: 'profile/additionalInfo/edit',
      gender: 'profile/additionalInfo/edit',
      lastName: 'profile/additionalInfo/edit',
      email: 'profile/additionalInfo/edit',
      phone: 'profile/additionalInfo/edit',
      language: 'profile/additionalInfo/edit'
    };
    this.router.navigate([actions[field]]);
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
