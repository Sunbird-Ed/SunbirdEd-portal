import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

/**
 * The Workspace side  component shows the sidebar for workspace
 */
@Component({
  selector: 'app-workspacesidebar',
  templateUrl: './workspacesidebar.component.html',
  styleUrls: ['./workspacesidebar.component.css']
})
export class WorkspacesidebarComponent implements OnInit {

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
  * Constructor to create injected service(s) object
  *
  * Default method of DeleteComponent class

  * @param {ResourceService} resourceService Reference of ResourceService
 */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
  }

}
