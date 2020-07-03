import { IGroupMember } from './../../interfaces/group';
import { membersList, existingMembersList } from './add-member.component.spec.data';
import { ToasterService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IGroupMemberConfig } from '../../interfaces';
import * as _ from 'lodash-es';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  config: IGroupMemberConfig = {
    showMemberCount: false,
    showSearchBox: false,
    showAddMemberButton: false,
    showMemberMenu: false
  };

  config1 = {size: 'small', isBold: true, isSelectable: false, view: 'horizontal'};
  showLoad = false;
  showUser = false;
  isInvalidUser = false;
  members = membersList;
  existingMembers = existingMembersList;
  memberId: string;
  member: IGroupMember;
  showMemberPopup = false;
  groupId;

  constructor( private activatedRoute: ActivatedRoute, private groupService: GroupsService, private toasterService: ToasterService) {}

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
  }

  verifyMember() {
    this.showLoad = true;
    setTimeout(() => {
        this.member = _.find(this.members, {identifier: this.memberId}) || {};
        this.showLoad = false;
        this.isInvalidUser = _.isEmpty(this.member);
        this.showUser = !this.isInvalidUser;
    }, 1000);
  }

  addMemberToGroup() {
    const existing = _.find(this.existingMembers, {identifier: this.memberId});
    if (existing) {
      this.toasterService.error('User is already added to group');
      this.showUser = false;
    } else {
      const member = [{memberId: this.member.identifier, role: 'member'}];
      this.groupService.addMemberById(this.groupId, member).subscribe(response => {
        this.existingMembers.push(this.member);
        this.toasterService.success(` member was added successfully`);
      }, err => {
          this.toasterService.error('Unable to add member to group.Please try again later...');
      });
    }

  }

  isMemberPopup(visibility: boolean = false) {
    this.showMemberPopup = visibility;
  }
}
