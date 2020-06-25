import { Component, Renderer2 } from '@angular/core';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';

@Component({
  selector: 'app-group-workspace',
  templateUrl: './group-workspace.component.html',
  styleUrls: ['./group-workspace.component.scss']
})
export class GroupWorkspaceComponent {
  showModal = false;
  showActivityList = false;
  HideAddActivity = true;
  showFilters: boolean = false;
 
  constructor(private renderer: Renderer2, public resourceService: ResourceService,
    private navigationHelperService: NavigationHelperService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1) {
        this.closeModal();
      }
     });
  }
  addActivity() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
  ActivitiesList() {
    this.showActivityList = true;
    this.closeModal();
    this.HideAddActivity = false;
  }
  filterList() {
    this.showFilters = !this.showFilters;
  }
}
