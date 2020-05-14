import { Component, OnInit } from '@angular/core';
import {CsModule} from '@project-sunbird/client-services';
@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  groupService;
  constructor() {
    this.groupService = CsModule.instance.groupService;
  }

  ngOnInit() {
    this.createGroup();
  }

  async createGroup() {
   const groupData =  await this.groupService.create('Test Group', 'ICSE', 'English', 'Class 8', 'English').toPromise();
   console.log('groupDatattata', groupData);
  }
}
