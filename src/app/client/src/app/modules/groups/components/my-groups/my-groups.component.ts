import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  public groupList: any;
  constructor(public groupService: GroupsService) {}

  ngOnInit() {
    this.getMyGroupList();
  }
  async getMyGroupList() {
    this.groupList = await this.groupService.getAllGroups();
  }
}
