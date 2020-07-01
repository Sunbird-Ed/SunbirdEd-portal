import { IGroupMember } from './../../interfaces/group';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { CsModule } from '@project-sunbird/client-services';



@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groupCservice: any;
  public membersData = new EventEmitter<IGroupMember[]>();
  private _groupData;
  private _members;
  constructor(private csLibInitializerService: CsLibInitializerService) {
      if (!CsModule.instance.isInitialised) {
        this.csLibInitializerService.initializeCs();
      }
      this.groupCservice = CsModule.instance.groupService;
    }

  createGroup(groupData) {
    return this.groupCservice.create(groupData);
  }

  getUserGroups(filters) {
    return this.groupCservice.search(filters);
  }

  getGroupById(groupId: string) {
    return this.groupCservice.getById(groupId);
  }

  deleteGroupById (groupId: string) {
    return this.groupCservice.deleteById(groupId);
  }

  addMemberById( groupId: string, members) {
    return this.groupCservice.addMembers(groupId, {members: members});
  }

  updateGroup(groupId: string, groupData: {}) {
    return this.groupCservice.updateById(groupId, groupData);
  }

  emitMembersData(members: IGroupMember[]) {
    this._members = members;
    this.membersData.emit(members);
  }

  set groupData(groupData) {
    this._groupData = groupData;
  }

  get groupMembers() {
    return this._members;
  }

  get groupData() {
    return this._groupData;
  }
}
