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
  constructor(public groupService: GroupsService, public router: Router, public resourceService: ResourceService) {}

  ngOnInit() {
    this.getMyGroupList();
  }
  async getMyGroupList() {
    this.groupList = await this.groupService.getAllGroups();
  }

  public updateGroupList($event: any) {
    this.showGroupCreateForm = false;
    this.groupList.push($event);
  }

  public showCreateFormModal() {
    this.showGroupCreateForm = true;
  }

  public navigateToDetailPage(groupId) {
    this.router.navigate(['groups/view', groupId]);
  }
}
