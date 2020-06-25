import { Component } from '@angular/core';

@Component({
  selector: 'app-group-workspace',
  templateUrl: './group-workspace.component.html',
  styleUrls: ['./group-workspace.component.scss']
})
export class GroupWorkspaceComponent {
  showModal = false;
  showActivityList = false;
  HideAddActivity = true;
  showFilters = false;

  constructor() {
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
    this.showFilters = true;
  }
}
