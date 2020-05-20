import { NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent implements OnInit {
  showDeleteModal;
  showPastMemberModal;
  @Input() pastMembersList;
  @Input() groupData;
  modalName: string;
  showModal = false;
  constructor(private navigationHelperService: NavigationHelperService) { }

  ngOnInit() {
  }

  goBack() {
    this.navigationHelperService.goBack();
  }

  deleteGroup(event) {
    this.modalName = 'deleteGroup';
    this.showModal = true;
  }

  showPastMembers() {
    this.showModal = true;
    this.modalName = 'showPastMembers';
  }

  closeModal() {
    this.showModal = false;
  }
}
