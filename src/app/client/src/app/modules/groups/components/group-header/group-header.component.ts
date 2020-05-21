import { Component, OnInit, Input } from '@angular/core';
import { NavigationHelperService } from '@sunbird/shared';

@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent implements OnInit {
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
