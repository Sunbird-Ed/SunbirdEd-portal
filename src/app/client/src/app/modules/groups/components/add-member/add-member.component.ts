import { ResourceService } from'@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { IGroupMember } from '../../interfaces';
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  constructor(public resourceService: ResourceService) {
  }
  showModal = false;
  instance: string;
  member: IGroupMember;
  public  membersList = [
    {identifier: '1', initial: 'A', title: 'Abc', isAdmin: false,  isMenu: false, indexOfMember: 1}
  ];
  config = {size: 'small', isBold: true, isSelectable: false, view: 'horizontal'};

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }
}
