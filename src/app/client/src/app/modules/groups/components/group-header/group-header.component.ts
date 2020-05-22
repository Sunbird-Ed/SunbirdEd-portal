import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NavigationHelperService, ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent {
  @Input() pastMembersList;
  @Input() groupData;
  modalName: string;
  showModal = false;
  constructor(private navigationHelperService: NavigationHelperService,
    public resourceService: ResourceService) { }

  goBack() {
    this.navigationHelperService.goBack();
  }

  showPastMembers() {
    this.showModal = true;
    this.modalName = 'showPastMembers';
  }

  deleteGroup() {
    this.showModal = true;
    this.modalName = 'deleteGroup';
  }

  closeModal() {
    this.showModal = false;
  }

}
