import { Router } from '@angular/router';
import { CsModule } from '@project-sunbird/client-services';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';

import * as _ from 'lodash-es';
@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  public groupList: any;
  public groupData;
  groupsList = [
    {
      'identifier': 'do_1130152710033489921159',
      'name': 'Class 5B',
      'description': 'Class 5B - CBSE - English - Math',
      'objectType': 'Class',
      'status': 'Live',
      'versionKey': '1588778384610',
      'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
      'framework': 'tpd',
      'board': 'CBSE',
      'subject': [
        'Math'
      ],
      'gradeLevel': [
        'Grade 5'
      ],
      'medium': [
        'English'
      ],
      'createdOn': '2020-05-06T15:16:38.655+0000',
      'lastUpdatedOn': '2020-05-06T15:19:44.610+0000',
      'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8'
    },
    {
      'identifier': 'do_1130152710033489921153',
      'name': 'Class 6',
      'description': 'Class 5B - CBSE - English - Math',
      'objectType': 'Class',
      'status': 'Live',
      'versionKey': '1588778384610',
      'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
      'framework': 'tpd',
      'board': 'CBSE',
      'subject': [
        'Math'
      ],
      'gradeLevel': [
        'Grade 5'
      ],
      'medium': [
        'English'
      ],
      'createdOn': '2020-05-06T15:16:38.655+0000',
      'lastUpdatedOn': '2020-05-06T15:19:44.610+0000',
      'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8'
    }
  ];


  constructor(public groupService: GroupsService, private router: Router) {}
  ngOnInit() {
    this.getMyGroupList();
  }
  async getMyGroupList() {
    this.groupList = await this.groupService.getAllGroups();
  }

  getGroupData(event) {
    this.groupData = event.data;
    this.router.navigate(['groups/', event.data.identifier]);
  }

  addGroupToList(event) {
    this.groupsList.push(event);
  }
}
