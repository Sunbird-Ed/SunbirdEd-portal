import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';

import { UserService, PermissionService, CoursesService, TelemetryService,IStartEventInput } from '@sunbird/core';
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
  public telemetryService: TelemetryService;
  /**
   * constructor
   */
  constructor(userService: UserService,
    permissionService: PermissionService, resourceService: ResourceService,
    courseService: CoursesService, telemetryService: TelemetryService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.courseService = courseService;
    this.telemetryService = telemetryService;
    userService.initialize();
    permissionService.initialize();
    resourceService.initialize();
    courseService.initialize();
    setTimeout(() => {
      this.telemetryService.initialize();
      console.log("telemtry data ",this.telemetryService.telemetry);
      let startEventInput:IStartEventInput = {
        'env': 'dev',
        'objectId': '123456',
        'objectType': 'announcement',
        'objectVersion': '1.0',
        'contentType': 'announcement',
        'pageId': 'p1',
        'mode': 'dev',
      }
      this.telemetryService.startTelemetry(startEventInput);
    }, 3000);

  }
}
