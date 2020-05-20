import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  sbcards = [
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    },
    {
      title: 'Group Name 123',
      subject: 'Social Science',
      class: 'Class 8',
      medium: 'Hindi',
      board: 'CBSE',
      type: 'Book'
    }
  ];
  showGroupCreateForm;
  public groupList: any;
  constructor(public groupService: GroupsService) {}

  ngOnInit() {
    this.getMyGroupList();
  }
  async getMyGroupList() {
    this.groupList = await this.groupService.getAllGroups();
  }
}
