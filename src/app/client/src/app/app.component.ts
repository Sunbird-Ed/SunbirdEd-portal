import { ResourceService, IUserData, IUserProfile } from '@sunbird/shared';
import { Component, HostListener, OnInit } from '@angular/core';
import { UserService, PermissionService, CoursesService, TelemetryService, TenantService } from '@sunbird/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
/**
 * main app component
 *
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /**
   * user profile details.
   */
  userProfile: IUserProfile;
  /**
   * reference of TenantService.
   */
  public tenantService: TenantService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of config service.
   */
  public permissionService: PermissionService;
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  public courseService: CoursesService;
  /**
   * constructor
   */
  constructor(userService: UserService,
    permissionService: PermissionService, resourceService: ResourceService,
    courseService: CoursesService, tenantService: TenantService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.courseService = courseService;
    this.tenantService = tenantService;
  }

  /**
   * dispatch telemetry window unload event before browser closes
   * @param  event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    document.dispatchEvent(new CustomEvent('TelemetryEvent', { detail: { name: 'window:unload' } }));
  }

  ngOnInit() {
    this.resourceService.initialize();
    if (this.userService.userid && this.userService.sessionId) {
      this.userService.initialize();
      this.permissionService.initialize();
      this.courseService.initialize();
    }

    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.tenantService.getTenantInfo(user.userProfile.rootOrg.slug);
          this.tenantService.tenantData$.subscribe(
            data => {
              if (data && !data.err) {
                document.title = data.tenantData.titleName;
                document.querySelector('link[rel*=\'icon\']').setAttribute('href', data.tenantData.favicon);
              }
            }
          );
        }
      });
  }
}
