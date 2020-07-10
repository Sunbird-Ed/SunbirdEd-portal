import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { Injectable, EventEmitter } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { IGroup, IGroupSearchRequest, IGroupUpdate, IGroupMember, IGroupCard, IMember } from '../../interfaces';
import * as _ from 'lodash-es';
import { UserService } from '@sunbird/core';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';


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
    private resourceService: ResourceService,
    private telemetryService: TelemetryService,
    private navigationhelperService: NavigationHelperService
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
    member.title = _.get(member, 'name') || _.get(member, 'username') || _.get(member, 'userName');
    member.initial = _.get(member, 'title[0]') || 'D';
    member.identifier = _.get(member, 'userId') || _.get(member, 'identifier');
    member.isAdmin = _.get(member, 'role') === 'admin';
    member.isCreator = _.get(member, 'userId') === _.get(member, 'createdBy');
    member.isSelf = (this.userService.userid === _.get(member, 'userId')) || (this.userService.userid === _.get(member, 'identifier'));
    member.isMenu = _.get(this.groupData, 'isAdmin') && !(member.isSelf || member.isCreator);
    member.title = member.isSelf ? `${member.title}(${this.resourceService.frmelmnts.lbl.you})` : member.title;

    return member;
  }

  addGroupFields(group) {
    group.isCreator = _.get(group, 'createdBy') === this.userService.userid;
    group.isAdmin = group.isCreator ? true : _.get(group, 'memberRole') === 'admin';
    group.initial = _.get(group, 'name[0]');
    return group;
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
    this._groupData = this.addGroupFields(group);
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

  addTelemetry(eid: string, routeData) {

    const interactData = {
      context: {
        env: _.get(routeData, 'data.telemetry.env'),
        cdata: []
      },
      edata: {
        id: eid,
        type: 'click',
        pageid: _.get(routeData, 'data.telemetry.pageid'),
      }
    };

    if (_.get(routeData, 'params.groupId')) {
      interactData['object'] = {
        id: _.get(routeData, 'params.groupId'),
        type: 'Group',
        ver: '1.0',
      };
    }
    this.telemetryService.interact(interactData);
  }

  getImpressionObject(routeData, url): IImpressionEventInput {

    const impressionObj = {
      context: {
        env: _.get(routeData, 'data.telemetry.env')
      },
      edata: {
        type: _.get(routeData, 'data.telemetry.type'),
        pageid: _.get(routeData, 'data.telemetry.pageid'),
        subtype: _.get(routeData, 'data.telemetry.subtype'),
        uri: url,
        duration: this.navigationhelperService.getPageLoadTime()
      },
    };

    if (_.get(routeData, 'params.groupId')) {
      impressionObj['object'] = {
        id: _.get(routeData, 'params.groupId'),
        type: 'Group',
        ver: '1.0',
      };
    }
    return impressionObj;
  }
}
