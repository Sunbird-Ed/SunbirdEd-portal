import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';

import { UserService, PermissionService, CoursesService } from '@sunbird/core';
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
export class AppComponent {
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
     courseService: CoursesService) {
      this.resourceService = resourceService;
      this.permissionService = permissionService;
      this.userService = userService;
      this.courseService = courseService;
      userService.initialize();
      permissionService.initialize();
      resourceService.initialize();
      courseService.initialize();
  }
}
