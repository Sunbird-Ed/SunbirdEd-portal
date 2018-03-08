import { Component } from '@angular/core';
import { UserService, CoursesService } from '@sunbird/core';
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
  constructor(public userService: UserService, public courseService: CoursesService) {
    userService.initialize();
    courseService.initialize();
  }
}
