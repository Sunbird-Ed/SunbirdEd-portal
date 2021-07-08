import { delay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { CsGroupAddActivitiesRequest, CsGroupRemoveActivitiesRequest,
CsGroupSearchCriteria, CsGroupUpdateActivitiesRequest, CsGroupUpdateMembersRequest,
  CsGroupUpdateGroupGuidelinesRequest,
  CsGroupSupportedActivitiesFormField
} from '@project-sunbird/client-services/services/group/interface';
import { UserService, LearnerService, TncService } from '@sunbird/core';
import { NavigationHelperService, ResourceService, ConfigService } from '@sunbird/shared';
import { IImpressionEventInput, TelemetryService, IInteractEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IGroupCard, IGroupMember, IGroupUpdate, IMember, MY_GROUPS } from '../../interfaces';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { CsGroup, GroupEntityStatus } from '@project-sunbird/client-services/models';

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
  public showLoader = new EventEmitter();
  public showMenu = new EventEmitter();
  public showActivateModal = new EventEmitter();
  public updateEvent = new EventEmitter();
  public _groupListCount: number;
  private _groupsTnc;
  private _userData;

  constructor(
    private csLibInitializerService: CsLibInitializerService,
    private userService: UserService,
    private resourceService: ResourceService,
    private telemetryService: TelemetryService,
    private navigationhelperService: NavigationHelperService,
    private router: Router,
    private configService: ConfigService,
    private learnerService: LearnerService,
    private tncService: TncService
  ) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.groupCservice = CsModule.instance.groupService;
    this.userCservice = CsModule.instance.userService;
    this._userData = this.userService.userProfile;
  }

  addFieldsToMember(members): IGroupMember[] {
    if (members) {
      this.setCurrentUserRole(members);
      const membersList = members.map((item, index) => _.extend(this.addFields(item), { indexOfMember: index }));
     return _.orderBy(membersList, ['isSelf', 'isAdmin', item => _.toLower(item.title)], ['desc', 'desc', 'asc']);
    }
    return [];
  }

  setCurrentUserRole(members) {
    const currentUser = members.find(item => item.userId === this.userService.userid);
    this.isCurrentUserAdmin = _.get(currentUser, 'role') === 'admin';
    this.isCurrentUserCreator = _.get(this.userService, 'userid') === _.get(this.groupData, 'createdBy');
  }

  addFields(member): IGroupMember {
    member.title = _.capitalize(member.name || member.userName);
    member.initial = _.get(member, 'title[0]');
    member.identifier = _.get(member, 'userId') || _.get(member, 'identifier');
    member.isAdmin = _.get(member, 'role') === 'admin';
    member.isCreator = _.get(this.groupData, 'createdBy') === _.get(member, 'userId');
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

  createGroup(groupData: IGroupCard) {
    return this.groupCservice.create(groupData);
  }

  updateGroup(groupId: string, updateRequest: IGroupUpdate) {
    return this.groupCservice.updateById(groupId, updateRequest);
  }

  searchUserGroups(request: CsGroupSearchCriteria) {
    return this.groupCservice.search(request);
  }

  // To get groupData from csService
  getGroupById(groupId: string, includeMembers?: boolean, includeActivities?: boolean, groupActivities?: boolean) {
    const groupData = this.groupCservice.getById(groupId, { includeMembers, includeActivities, groupActivities });
    return groupData;
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

  getUserData(memberId: string, captchaToken: object = {}) {
    return this.userCservice.checkUserExists({key: 'userName', value: memberId}, captchaToken);
  }

getActivity(groupId, activity, mergeGroup, leafNodesCount?) {
    return this.groupCservice.activityService.getDataAggregation(groupId, activity, mergeGroup, leafNodesCount);
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

  emitShowLoader(value) {
    this.showLoader.emit(value);
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
    const titleColors = ['#870D24', '#920251', '#2F27B9', '#218432', '#07718A', '#5C4500', '#0C554A', '#6D3E1C', '#374809', '#666666'];

    _.forEach(groupList, group => {
      group.cardBgColor = bgColors[Math.floor(
        Math.random() * bgColors.length)];
      group.cardTitleColor = titleColors[Math.floor(
        Math.random() * titleColors.length)];
    });

    return groupList || [];
    }


  addTelemetry(eid: {id: string, extra?: {}, edata?: {type: string, subtype?: string}}, routeData, cdata, groupId?, obj?) {
    const id = _.get(routeData, 'params.groupId') || groupId;
    // Overridding the default edata properties if user is passing
    const  type = (_.defaults({}, eid.edata, {type: 'click'})).type;
    const interactData: IInteractEventInput = {
      context: {
        env: _.get(routeData, 'data.telemetry.env'),
        cdata: cdata
      },
      edata: {
        id: eid.id,
        type: type,
        pageid: _.get(routeData, 'data.telemetry.pageid'),
      }
    };

    if (eid.edata) {
      interactData.edata.subtype = eid.edata.subtype;
    }
    if (!_.isEmpty(eid.extra)) {
      interactData.edata.extra = eid.extra;
    }

    if (id) {
      interactData.context.cdata.push({id: id, type: 'Group'});
    }

    if (obj) {
      interactData['object'] = obj;
    }
    this.telemetryService.interact(interactData);

  }

  getImpressionObject(routeData, url, edata?): IImpressionEventInput {
    // Overridding the default edata properties if user is passing
    const type = (_.defaults({},  edata, { type: _.get(routeData, 'data.telemetry.type')})).type;
    const subtype = (_.defaults({},  edata, { subtype: _.get(routeData, 'data.telemetry.subtype')})).subtype;
    const impressionObj = {
      context: {
        env: _.get(routeData, 'data.telemetry.env')
      },
      edata: {
        type: type,
        pageid: _.get(routeData, 'data.telemetry.pageid'),
        subtype: subtype,
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

  emitMenuVisibility(visibility) {
    this.showMenu.emit(visibility);
  }

  getSupportedActivityList() {
    return this.groupCservice.getSupportedActivities();
  }

  set groupListCount (count) {
    this._groupListCount = count;
  }

  get groupListCount () {
    return this._groupListCount;
  }

  getSelectedLanguageStrings(activity: CsGroupSupportedActivitiesFormField) {
    this.resourceService.languageSelected$.pipe(delay(600)).subscribe(item => {
      if (!_.isEmpty(activity) ) {
            if (activity.translations) {
              _.find(JSON.parse(activity.translations), (value, key) => {
                if (item.value === key) {
                  activity.title = value;
                }
            });
          }
      }
    });
    return activity;
  }

  groupContentsByActivityType (showList, groupData) {
    const activitiesGrouped = _.get(groupData, 'activitiesGrouped');
    if (activitiesGrouped) {

        const activityList = activitiesGrouped.reduce((acc, activityGroup) => {
          activityGroup = this.getSelectedLanguageStrings(activityGroup);

              acc[activityGroup.title] = activityGroup.items.map((i) => {
                const activity = {
                  ...i.activityInfo,
                  type: i.type,
                  cardImg: _.get(i, 'activityInfo.appIcon') || this.configService.appConfig.assetsPath.book,
                };
                return activity;
              });
              showList = !showList ? Object.values(acc).length > 0 : showList;
              return acc;

        }, {});
        Object.keys(activityList).forEach(key => activityList[key].length <= 0 && delete activityList[key]);
        return { showList, activities: activityList };
    }
    return { showList, activities: activitiesGrouped || {} };
}

  emitActivateEvent(name, eventName) {
    this.showActivateModal.emit({name, eventName});
  }

  deActivateGroupById(groupId: string) {
    return this.groupCservice.suspendById(groupId);
  }

  activateGroupById(groupId: string) {
    return this.groupCservice.reactivateById(groupId);
  }

  emitUpdateEvent(value) {
    this.updateEvent.emit(value);
  }

  updateGroupStatus(group: CsGroup, status: GroupEntityStatus) {
    group.status = status;
    return group.isActive();
  }

  isUserAcceptedTnc() {
      const userTncAccepted = _.get(this._userData, 'allTncAccepted');
      return this._userData ? (!_.isEmpty(userTncAccepted) && !_.isEmpty(_.get(userTncAccepted, 'groupsTnc'))) : true;
  }

  set groupsTncDetails (groupsTnc) {
    groupsTnc.value = (typeof groupsTnc.value === 'string') ? JSON.parse(groupsTnc.value) : groupsTnc.value;

    this._groupsTnc = groupsTnc;
  }

  get latestTnc() {
    return this._groupsTnc;
  }

  set userData(user) {
    this._userData = user;
  }

  isTncUpdated() {
    return _.get(this._userData, 'allTncAccepted.groupsTnc.version') < _.get(this._groupsTnc, 'value.latestVersion');
  }

  updateGroupGuidelines(request: CsGroupUpdateGroupGuidelinesRequest) {
  return this.groupCservice.updateGroupGuidelines(request);
  }

  getDashletData(courseHeirarchyData, aggData) {
    return this.groupCservice.activityService.getDataForDashlets(courseHeirarchyData, aggData);
  }
}
