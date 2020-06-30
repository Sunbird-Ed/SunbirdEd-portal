import { ToasterService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IGroupMemberConfig, IGroupMember } from '../../interfaces';
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

  config1 = {size: 'medium', isBold: false, isSelectable: false, view: 'horizontal'};
  showLoad = false;
  showUser = false;
  isInvalidUser = false;

  members: IGroupMember[] = [
    { identifier: 'S3W2E', initial: 'S', title: 'Swetha', isAdmin: false, isMenu: false, indexOfMember: 1, isCreator: true },
    { identifier: 'R73EE', initial: 'R', title: 'Ritesh', isAdmin: false, isMenu: true, indexOfMember: 5, isCreator: false },
    { identifier: 'K6Y6Y', initial: 'K', title: 'Kirthan', isAdmin: false, isMenu: true, indexOfMember: 7, isCreator: false },
    { identifier: 'P1we', initial: 'P', title: 'Paul Walker', isAdmin: false, isMenu: true, indexOfMember: 5, isCreator: false },
    { identifier: 'Rkicsn', initial: 'R', title: 'Robert Downey', isAdmin: true, isMenu: true, indexOfMember: 7, isCreator: true }
  ];

  existingMembers: IGroupMember[] = [
    { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true },
  ];

  memberId: string;
  member: IGroupMember;
  groupId;
  // config= {size: 'small', isBold:true, isSelectable:false, view:"horizontal"}

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
      this.groupService.addMemberById(this.memberId, this.groupId).subscribe(response => {
        console.log('resposnsnee', response);
        this.existingMembers.push(this.member);
        this.groupService.emitMembersData(this.existingMembers);
        this.toasterService.success(`${this.member.title} was added successfully`);
      }, err => {
          this.toasterService.error('Unable to add member to group.Please try again later...');
      });
    }

  }
}
