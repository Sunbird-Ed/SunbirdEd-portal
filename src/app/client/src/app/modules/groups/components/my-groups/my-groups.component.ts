import { GROUP_DETAILS, MY_GROUPS, CREATE_GROUP } from './../routerLinks';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { existingMembersList } from '../add-member/add-member.component.spec.data';
@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  showGroupCreateForm = false;
  public groupList = [];
  public showModal = false;
  currentUser = existingMembersList[0];
  showForm = false;

  constructor(public groupService: GroupsService, public router: Router, public resourceService: ResourceService) {
  }

  ngOnInit() {
    this.showModal = !localStorage.getItem('login_ftu_groups');
    this.getMyGroupList();
  }

  async getMyGroupList() {
    const request = {filters: {memberId: this.currentUser.identifier}, sort_by: 'desc', limit: 30, offset: 5 };
    this.groupService.getUserGroups(request).subscribe(data => {
      this.groupService.groupData = data;
      this.groupList = data;
    });
  }

  public showCreateFormModal() {
    this.showForm = true;
    this.router.navigate([`${MY_GROUPS}/${CREATE_GROUP}`]);
  }

  public navigateToDetailPage(event) {
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(event, 'data.id')]);
  }

  showFtuPopup() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
    localStorage.setItem('login_ftu_groups', 'login_user');
  }

}
