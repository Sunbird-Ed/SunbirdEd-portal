import { UserService } from '@sunbird/core';
import { IGroupSearchRequest, IGroupCard, IGroup } from './../../interfaces';
import { GROUP_DETAILS, MY_GROUPS, CREATE_GROUP } from './../routerLinks';
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
  public groupList: IGroupCard[] = [];
  public showModal = false;
  constructor(public groupService: GroupsService, public router: Router, public resourceService: ResourceService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.showModal = !localStorage.getItem('login_ftu_groups');
    this.getMyGroupList();
  }

  getMyGroupList() {
    const request: IGroupSearchRequest = {filters: {userId: this.userService.userid}};
    this.groupService.searchUserGroups(request).subscribe(data => {
      this.addGroupPropertiesForCC(data);
    });
  }

  addGroupPropertiesForCC(groups) {
    _.forEach(groups, (group) => {
      if (group) {
        group.isAdmin = group.createdBy === this.userService.userid;
        group.initial = group.name[0];
        this.groupList.push(group);
      }
    });
    this.groupService.groups = this.groupList;
  }

  public showCreateFormModal() {
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
