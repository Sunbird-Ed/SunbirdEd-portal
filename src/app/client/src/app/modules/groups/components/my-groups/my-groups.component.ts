import { GROUP_DETAILS, MY_GROUPS, CREATE_EDIT_GROUP } from './../routerLinks';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
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
    this.showModal = !localStorage.getItem('login_ftu_groups');
    this.getMyGroupList();
  }

  async getMyGroupList() {
    this.groupService.getAllGroups().subscribe(data => {
      this.groupList = data;
    });
  }

  public showCreateFormModal() {
    this.router.navigate([`${MY_GROUPS}/${CREATE_EDIT_GROUP}`]);
  }

  public navigateToDetailPage(event) {
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(event, 'data.identifier')]);
  }

  showFtuPopup() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
    localStorage.setItem('login_ftu_groups', 'login_user');
  }

}
