import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-workspace',
  templateUrl: './group-workspace.component.html',
  styleUrls: ['./group-workspace.component.scss']
})
export class GroupWorkspaceComponent {
  showModal = false;
  modalName: string;
  addActivity() {
    this.showModal = true;
    this.modalName = 'addActivity';
  }
  closeModal() {
    this.showModal = false;
  }
}
