import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { UserService, PermissionService, SearchService } from '@sunbird/core';
import { ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { state, style, animate, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  animations: [
    trigger('scrollAnimation', [
      state('show', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class ProfilePageComponent implements OnInit {
  userProfile: IUserProfile;
  workSpaceRole: Array<string>;
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'Loading profile ...'
  };
  contributions: any;
  state = 'hide';
  constructor(public resourceService: ResourceService, public el: ElementRef,
    public permissionService: PermissionService, public toasterService: ToasterService,
    public userService: UserService, public configService: ConfigService, public router: Router,
    public searchService: SearchService) { }
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop;
    const scrollPosition = window.pageYOffset;

    if (scrollPosition >= componentPosition) {
      this.state = 'show';
    } else {
      this.state = 'hide';
    }

  }

  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.getMyContent();
        } else if (user && user.err) {
          // this.toasterService.error('Something went wrong, please try again later...');
        }
      });
    this.workSpaceRole = this.configService.rolesConfig.headerDropdownRoles.workSpaceRole;
  }
  updateAction(field) {
    console.log(field);
    const actions = {
      profileSummary: 'profile/summary/edit',
      jobProfile: 'profile/experience/add',
      address: 'profile/address/add',
      education: 'profile/education/add',
      location: 'profile/additionalInfo/edit',
      dob: 'profile/additionalInfo/edit',
      subject: 'profile/additionalInfo/edit',
      grade: 'profile/additionalInfo/edit'
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
