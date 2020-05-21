import { groupMockData } from './group-workspace.component.spec.data';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-group-workspace',
  templateUrl: './group-workspace.component.html',
  styleUrls: ['./group-workspace.component.scss']
})
export class GroupWorkspaceComponent implements OnInit {

  private groupId: string;
  public membersList: Array<{}> = [];
  private _membersList: Array<{}> = groupMockData.membersList;
  public groupData: {} = {};
  public selectedMember: {} = {};
  public memberQuery: string;
  public noResultMsg: string;
  public showMenu: Boolean = false;
  public showModal: Boolean = false;
  public modalName: string;
  public pastMembersList: Array<{}> = groupMockData.pastMembersList;

  constructor(private activatedRoute: ActivatedRoute, private groupService: GroupsService) {
    this.groupService = groupService;
 }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.membersList = this._membersList;
    this.getGroupData();
  }

  searchMembers() {
    const data = _.map(this._membersList, (member) => {
        if (_.includes(_.lowerCase(member.title), _.lowerCase(this.memberQuery))) {
          return member;
        }
    });
    this.membersList = _.compact(data);
    this.noResultMsg = _.isEmpty(this.membersList) ? 'No member found' : '';
  }

  clearMemberSearch() {
    this.membersList = this._membersList;
    this.memberQuery = '';
  }

  getMenuData(event) {
    this.selectedMember = _.find(this.membersList, {identifier: _.get(event, 'data.identifier')});
    this.showMenu = _.isEqual(_.get(this.selectedMember, 'identifier'), _.get(event, 'data.identifier'));
  }

  openModal(name) {
    this.showModal = true;
    this.modalName = name;
  }

  closeModal() {
    this.showModal = false;
  }

  handleMember(event) {
    this.showMenu = false;
    switch (event.data.modalName) {
      case 'Remove': {
        this.membersList = this.getHandledMember(false, event.data.identifier, true);
        this._membersList = this.membersList;
        this.noResultMsg = _.isEmpty(this.membersList) ? 'No member found' : '';
        break;
      }
      case 'Promote': {
      this.getHandledMember(true, event.data.identifier);
        break;
      }
      case 'Dismiss' : {
        this.getHandledMember(false, event.data.identifier);
        break;
      }
    }
  }

  getHandledMember(isAdmin, id, isRemove?) {
   const data = _.map(this.membersList, member => {
      if (member.identifier === id && !isRemove) {
        member.isAdmin = isAdmin;
      } else if (member.identifier === id) {
        this.pastMembersList.push(member);
      } else {
        return member;
      }
    });
    return _.compact(data);
  }

 async getGroupData() {
   this.groupData = await this.groupService.getGroupById(this.groupId).catch(error => {});
   this.groupData = _.isEmpty(this.groupData) ? {name: 'G1'} : this.groupData;
  }

}
