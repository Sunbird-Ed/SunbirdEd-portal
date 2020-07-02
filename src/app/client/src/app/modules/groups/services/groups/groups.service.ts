import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { IGroup, IGroupId, IGroupSearchRequest, IGroupUpdate } from '../../interfaces';



@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groupCservice: any;
  private _groupsList;
  constructor(private csLibInitializerService: CsLibInitializerService) {
      if (!CsModule.instance.isInitialised) {
        this.csLibInitializerService.initializeCs();
      }
      this.groupCservice = CsModule.instance.groupService;
  }

  createGroup(groupData: IGroup) {
    return this.groupCservice.create(groupData);
  }

  updateGroup(groupId: IGroupId, updateRequest: IGroupUpdate) {
    return this.groupCservice.updateById(groupId, updateRequest);
  }

  searchUserGroups(request: IGroupSearchRequest) {
    return this.groupCservice.search(request);
  }

  getGroupById(groupId: string) {
    return this.groupCservice.getById(groupId);
  }

  deleteGroupById (groupId: string) {
    return this.groupCservice.deleteById(groupId);
  }

  addMemberById(memberId: string, groupId: string) {
    return this.groupCservice.addMemberById(memberId, groupId);
  }

  set groups(list) {
    this._groupsList = list;
  }
  get groups() {
    return this._groupsList;
  }
}
