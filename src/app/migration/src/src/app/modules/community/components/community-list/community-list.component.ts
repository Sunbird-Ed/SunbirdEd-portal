import { CoreModule , PermissionService, ResourceService, UserService} from '@core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.css']
})
export class CommunityListComponent implements OnInit {

  constructor(public userService: UserService, public resourceService: ResourceService, public permissionService: PermissionService) { }

  ngOnInit() {
  }
}
