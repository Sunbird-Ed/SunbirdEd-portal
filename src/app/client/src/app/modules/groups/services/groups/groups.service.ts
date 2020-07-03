import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { IGroup } from '../../interfaces';



@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groupCservice: any;

  constructor(private csLibInitializerService: CsLibInitializerService) {
      if (!CsModule.instance.isInitialised) {
        this.csLibInitializerService.initializeCs();
      }
      this.groupCservice = CsModule.instance.groupService;
  }

  createGroup({name, description}: IGroup) {
    return this.groupCservice.create(name, description);
  }

  getAllGroups() {
    return this.groupCservice.getAll();
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
}
