import { Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { CsGroupAddActivitiesRequest, CsGroupRemoveActivitiesRequest, CsGroupUpdateActivitiesRequest, CsGroupUpdateMembersRequest } from '@project-sunbird/client-services/services/group/interface';
import { UserService, LearnerService } from '@sunbird/core';
import { NavigationHelperService, ResourceService, ConfigService } from '@sunbird/shared';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry'; 
import * as _ from 'lodash-es';
import { IGroup, IGroupCard, IGroupMember, IGroupSearchRequest, IGroupUpdate, IMember, MY_GROUPS } from '../../interfaces';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { GroupMemberRole } from '@project-sunbird/client-services/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groupCservice: any;
  private userCservice: any;
  private _groupData: IGroupCard;
  public isCurrentUserAdmin = false;
  public isCurrentUserCreator = false;
  public membersList = new EventEmitter();
  public closeForm = new EventEmitter();

  constructor(
    private csLibInitializerService: CsLibInitializerService,
    private userService: UserService,
    private resourceService: ResourceService,
    private telemetryService: TelemetryService,
    private navigationhelperService: NavigationHelperService,
    private router: Router,
    private configService: ConfigService,
    private learnerService: LearnerService
  ) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.groupCservice = CsModule.instance.groupService;
    this.userCservice = CsModule.instance.userService;
  }

  addFieldsToMember(members): IGroupMember[] {
    this.setCurrentUserRole(members);
    if (members) {
      const membersList = members.map((item, index) => _.extend(this.addFields(item), { indexOfMember: index }));
      return this.sortMembers(membersList);
    }
    return [];
  }

  sortMembers(members) {
    members.sort((a, b) => {
      if (b.userId === this.userService.userid) {
        return 1;
      } else if (a.userId === this.userService.userid) {
        return -1;
      }
      if (b.role === GroupMemberRole.ADMIN && a.role === GroupMemberRole.MEMBER) {
        return 1;
      } else if (b.role === GroupMemberRole.MEMBER && a.role === GroupMemberRole.ADMIN) {
        return -1;
      }
      return a.name.localeCompare(b.name);
    });

    return members;
  }

  setCurrentUserRole(members) {
    const currentUser = members.find(item => item.userId === this.userService.userid);
    this.isCurrentUserAdmin = _.get(currentUser, 'role') === 'admin';
    this.isCurrentUserCreator = _.get(currentUser, 'userId') === _.get(currentUser, 'createdBy');
  }

  addFields(member): IGroupMember {
    member.title = _.capitalize(member.name || member.userName);
    member.initial = _.get(member, 'title[0]');
    member.identifier = _.get(member, 'userId') || _.get(member, 'identifier');
    member.isAdmin = _.get(member, 'role') === 'admin';
    member.isCreator = _.get(member, 'userId') === _.get(member, 'createdBy');
    member.isSelf = (this.userService.userid === _.get(member, 'userId')) || (this.userService.userid === _.get(member, 'identifier'));
    member.title = member.isSelf ? `${member.title} (${this.resourceService.frmelmnts.lbl.you})` : member.title;
    member.isMenu = member.isAdmin && !(member.isSelf || member.isCreator);

    if (this.isCurrentUserCreator) {
      member.isMenu = !member.isSelf;
    } else if (this.isCurrentUserAdmin) {
      member.isMenu = (member.isSelf || member.isCreator) ? false : true;
    } else {
      member.isMenu = false;
    }

    return member;
  }

  addGroupFields(group) {
    const currentUser = _.find(_.get(group, 'members'), (m) => _.get(m, 'userId') === this.userService.userid);
    group.isCreator = _.get(group, 'createdBy') === this.userService.userid;
    group.isAdmin = group.isCreator ? true :
    (currentUser ? _.isEqual(_.get(currentUser, 'role'), 'admin') :
    _.isEqual(_.get(group, 'memberRole'), 'admin'));
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

  updateMembers(groupId: string, updateMembersRequest: CsGroupUpdateMembersRequest) {
    return this.groupCservice.updateMembers(groupId, updateMembersRequest);
  }

  removeMembers(groupId: string, userIds: string[]) {
    return this.groupCservice.removeMembers(groupId, { userIds });
  }

  addActivities(groupId: string, addActivitiesRequest: CsGroupAddActivitiesRequest) {
    return this.groupCservice.addActivities(groupId, addActivitiesRequest);
  }

  updateActivities(groupId: string, updateActivitiesRequest: CsGroupUpdateActivitiesRequest) {
    return this.groupCservice.updateActivities(groupId, updateActivitiesRequest);
  }

  removeActivities(groupId: string, removeActivitiesRequest: CsGroupRemoveActivitiesRequest) {
    return this.groupCservice.removeActivities(groupId, removeActivitiesRequest);
  }

  getUserData(memberId: string, captchaToken: string = '') {
    return this.userCservice.checkUserExists({key: 'userName', value: memberId}, captchaToken);
  }

  getActivity(groupId, activity) {
    return this.groupCservice.activityService.getDataAggregation(groupId, activity);
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

  goBack() {
    if (this.navigationhelperService['_history'].length <= 1) {
      this.router.navigate([MY_GROUPS]);
    } else {
      this.navigationhelperService.goBack();
    }
  }

  addGroupPaletteList(groupList: []) {

    const bgColors = ['#FFDFD9', '#FFD6EB', '#DAD4FF', '#DAFFD8', '#C2E2E9', '#FFE59B', '#C2ECE6', '#FFDFC7', '#D4F386', '#E1E1E1'];
    const titleColors = ['#EA2E52', '#FD59B3', '#635CDC', '#218432', '#07718A', '#8D6A00', '#149D88', '#AD632D', '#709511', '#666666'];

    _.forEach(groupList, group => {
      group.cardBgColor = bgColors[Math.floor(
        Math.random() * bgColors.length)];
      group.cardTitleColor = titleColors[Math.floor(
        Math.random() * titleColors.length)];
    });

    return groupList || [];
    }


  addTelemetry(eid: string, routeData, cdata, groupId?: string) {

    const interactData = {
      context: {
        env: _.get(routeData, 'data.telemetry.env'),
        cdata: cdata
      },
      edata: {
        id: eid,
        type: 'click',
        pageid: _.get(routeData, 'data.telemetry.pageid'),
      }
    };

    if (_.get(routeData, 'params.groupId') || groupId) {
      interactData['object'] = {
        id: _.get(routeData, 'params.groupId') || groupId,
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

  getRecaptchaSettings() {
    const systemSetting = {
      url: this.configService.urlConFig.URLS.SYSTEM_SETTING.GOOGLE_RECAPTCHA
    };
    return this.learnerService.get(systemSetting);
  }
}
