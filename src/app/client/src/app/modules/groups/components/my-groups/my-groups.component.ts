import { GROUP_DETAILS, MY_GROUPS, CREATE_EDIT_GROUP } from './../routerLinks';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  showGroupCreateForm = false;
  public groupList = [];
  public showModal = false;
  constructor(public groupService: GroupsService, public router: Router, public resourceService: ResourceService) {
    }

  ngOnInit() {
    this.getMyGroupList();
  }
  async getMyGroupList() {
    this.groupService.getAllGroups().subscribe(data => {
      console.log('dstaattata', data);
      this.groupList = data;
    });
  }

  public updateGroupList($event: any) {
    this.showGroupCreateForm = false;
    this.groupList.push($event);
  }

  public showCreateFormModal() {
    this.router.navigate([`${MY_GROUPS}/${CREATE_EDIT_GROUP}`]);
  }

  public navigateToDetailPage(event) {
    console.log('cbnfgbjgp', event);
    // this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, groupId]);
  }

  showFtuPopup() {
    this.showModal = !this.showModal;
  }

  closeModal(event) {
    this.showModal = false;
  }

}
