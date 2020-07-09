import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable, EventEmitter } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { IGroup, IGroupSearchRequest, IGroupUpdate, IGroupMember, IGroupCard, IMember } from '../../interfaces';
import * as _ from 'lodash-es';
import { UserService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groupCservice: any;
  private _groupData: IGroupCard;
  public membersList = new EventEmitter();
  public closeForm = new EventEmitter();

  constructor(
    private csLibInitializerService: CsLibInitializerService,
    private userService: UserService,
    private resourceService: ResourceService
  ) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.groupCservice = CsModule.instance.groupService;
  }

  addFieldsToMember(members): IGroupMember[] {
    const membersList = members.map((item, index) => _.extend(this.addFields(item), { indexOfMember: index }));
    return _.orderBy(membersList, ['isSelf', 'isAdmin', item => _.toLower(item.name)], ['desc', 'desc', 'asc']);
  }

  addFields(member): IGroupMember {
    member.title = member.name || member.userName;
    member.initial = member.title[0];
    member.identifier = member.userId || member.identifier;
    member.isAdmin = member.role === 'admin';
    member.isCreator = member.userId === member.createdBy;
    member.isSelf = this.userService.userid === member.identifier;
    member.isMenu = _.get(this.groupData, 'isAdmin') && !(member.isSelf || member.isCreator);
    member.title = member.isSelf ? `${member.title}(${this.resourceService.frmelmnts.lbl.you})` : member.title;

    return member;
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

  getGroupById(groupId: string, includeMembers?: boolean, includeActivities?: boolean) {
    return this.groupCservice.getById(groupId, { includeMembers, includeActivities });
  }

  deleteGroupById(groupId: string) {
    return this.groupCservice.deleteById(groupId);
  }

  addMemberById(groupId: string, members: IMember) {
    return this.groupCservice.addMembers(groupId, members);
  }

  set groupData(group: IGroupCard) {
    this._groupData = group;
  }

  get groupData() {
    return this._groupData;
  }

  emitCloseForm() {
    this.closeForm.emit();
  }

  emitMembers(members: IGroupMember[]) {
    this.membersList.emit(members);
  }
}
