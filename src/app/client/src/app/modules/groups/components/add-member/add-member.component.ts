import { takeUntil } from 'rxjs/operators';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { IGroupMember } from '../../interfaces';
import { GroupsService } from '../../services';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  showModal = false;
  instance: string;
  membersList = [];
  groupData;
  showLoader = false;
  isVerifiedUser = false;
  memberId: string;
  config = {size: 'small', isBold: true, isSelectable: false, view: 'horizontal'};
  isInvalidUser = false;
  verifiedMember: {};
  public unsubscribe$ = new Subject<void>();
  @Output() members = new EventEmitter<any>();

  constructor(public resourceService: ResourceService, private groupsService: GroupsService,
    private userService: UserService, private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.groupData = this.groupsService.groupData;
    this.addFieldsToMember();
    this.instance = _.upperCase(this.resourceService.instance);
  }

  addFieldsToMember() {
    this.membersList = [];
   _.forEach(_.get(this.groupData, 'members'), (member) => {
    member = this.addFields(member);
    this.membersList.push(member);
   });
   this.groupsService.emitMembers(this.membersList);
  }

  addFields(member) {
    member.title = member.name || member.userName;
    member.initial = member.title[0];
    member.identifier = member.userId || member.identifier;
    member.isAdmin = member.role === 'admin';
    member.isCreator = member.userId === this.groupData.createdBy;
    return member;
  }

  reset() {
    this.showLoader = false;
    this.isInvalidUser = false;
    this.isVerifiedUser = false;
  }

  resetValue() {
    this.memberId = '';
    this.showLoader = false;
    this.isInvalidUser = false;
    this.isVerifiedUser = false;
  }

  verifyMember() {
    this.showLoader = true;
    if (!this.isExistingMember()) {
      this.userService.getUserData(this.memberId).subscribe(member => {
        const user = this.addFields(_.get(member, 'result.response'));
        this.verifiedMember = _.pick(user, ['title', 'initial', 'identifier', 'isAdmin', 'isCreator']);
        this.showLoader = false;
        this.isVerifiedUser = true;
      }, err => {
        this.isInvalidUser = true;
        this.showLoader = false;
      });
    }
  }

  isExistingMember() {
    const isExisting = _.find(this.membersList, {userId:  this.memberId});
    if (isExisting) {
      this.showLoader = false;
      this.isVerifiedUser = false;
      this.memberId = '';
      this.toasterService.error(this.resourceService.messages.emsg.m007);
      return true;
    }
    return false;
  }

  addMemberToGroup() {
    if (!this.isExistingMember()) {
    const member = [{userId: this.memberId, role: 'member'}];
    this.groupsService.addMemberById(this.groupData.id, member).subscribe(response => {
      this.getUpdatedGroupData();
      this.toasterService.success((this.resourceService.messages.smsg.m004).replace('{memberName}', this.verifiedMember['title']));
      if (!_.isEmpty(response.errors)) {
        this.toasterService.error((this.resourceService.messages.emsg.m006).replace('{name}', _.get(response, 'errors')));
      }
    }, err => {
      this.toasterService.error((this.resourceService.messages.emsg.m006).replace('{name}', this.verifiedMember['title']));
    });
  }
  }

  getUpdatedGroupData() {
    this.groupsService.getGroupById(this.groupData.id, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      this.groupsService.groupData = groupData;
      this.groupData = groupData;
      this.addFieldsToMember();
    }, err => {
      this.membersList.push(this.verifiedMember);
    });
  }
}
