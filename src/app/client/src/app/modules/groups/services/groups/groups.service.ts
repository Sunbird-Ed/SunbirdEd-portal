import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable, EventEmitter } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { IGroup, IGroupSearchRequest, IGroupUpdate } from '../../interfaces';



@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groupCservice: any;
  private _groupData;
  public membersList = new EventEmitter();
  constructor(private csLibInitializerService: CsLibInitializerService) {
      if (!CsModule.instance.isInitialised) {
        this.csLibInitializerService.initializeCs();
      }
      this.groupCservice = CsModule.instance.groupService;
  }

  createGroup(groupData: IGroup) {
    return this.groupCservice.create(groupData);
  }

  updateGroup(groupId: string, updateRequest: IGroupUpdate) {
    return this.groupCservice.updateById(groupId, updateRequest);
  }

  searchUserGroups(request: IGroupSearchRequest) {
    return this.groupCservice.search(request);
  }

  getGroupById(groupId: string, includeMembers?: boolean) {
    return this.groupCservice.getById(groupId, {includeMembers});
  }

  deleteGroupById (groupId: string) {
    return this.groupCservice.deleteById(groupId);
  }

  addMemberById(groupId: string, members) {
    return this.groupCservice.addMembers(groupId, {members});
  }

  set groupData(list) {
    this._groupData = list;
  }

  get groupData() {
    return this._groupData;
  }

  emitMembers(members) {
    this.membersList.emit(members);
  }
}
