import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupMemberRole } from '@project-sunbird/client-services/models/group';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ADD_MEMBER, GROUP_DETAILS, IGroupMember, IGroupMemberConfig, MY_GROUPS } from '../../interfaces';
import { IGroup } from '../../interfaces/group';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit, OnDestroy {
  @ViewChild('searchInputBox') searchInputBox: ElementRef;
  @Input() config: IGroupMemberConfig = {
    showMemberCount: false,
    showSearchBox: false,
    showAddMemberButton: false,
    showMemberMenu: false
  };
  @Input() members: IGroupMember[] = [];
  @Input() groupData: IGroup;
  currentUser;
  showKebabMenu = false;
  showModal = false;
  showSearchResults = false;
  memberListToShow: IGroupMember[] = [];
  memberAction: string;
  searchQuery = '';
  selectedMember: IGroupMember;
  private unsubscribe$ = new Subject<void>();
  groupId;
  showLoader = false;
  memberCardConfig = { size: 'small', isBold: false, isSelectable: false, view: 'horizontal' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    private groupsService: GroupsService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.members = this.groupsService.addFieldsToMember(_.get(this.groupData, 'members'));
    this.memberListToShow = _.cloneDeep(this.members);
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.hideMemberMenu();

    fromEvent(document, 'click')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(item => {
        if (this.showKebabMenu) {
          this.showKebabMenu = false;
          this.addTelemetry('member-card-menu-close');
        }
      });
    this.groupsService.showLoader.subscribe(showLoader => {
      this.showLoader = showLoader;
    });

    this.groupsService.membersList.subscribe(members => {
      this.memberListToShow = members;
      this.hideMemberMenu();
    });
  }

  hideMemberMenu() {
    /* istanbul ignore else */
    if (!this.config.showMemberMenu) {
      this.memberListToShow.forEach(item => item.isMenu = false);
    }
  }

  getMenuData(event, member) {
    this.showKebabMenu = !this.showKebabMenu;
    this.showKebabMenu ? this.addTelemetry('member-card-menu-show') : this.addTelemetry('member-card-menu-close');
    this.selectedMember = member;
    event.event.stopImmediatePropagation();
  }

  search(searchKey: string) {
    if (searchKey.trim().length) {
      this.showSearchResults = true;
      this.memberListToShow = this.members.filter(item => _.toLower(item.title).includes(searchKey));
      this.addTelemetry('group-member-search-input', { query: searchKey });
    } else {
      this.showSearchResults = false;
      this.memberListToShow = _.cloneDeep(this.members);
    }
  }

  openModal(action: string) {
    this.showModal = !this.showModal;
    this.memberAction = action;
  }

  addMember() {
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(this.groupData, 'id') || this.groupId, ADD_MEMBER]);
  }

  onModalClose() {
    this.showModal = false;
    // Handle Telemetry
  }

  getUpdatedGroupData() {
    this.groupsService.getGroupById(this.groupData.id, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      this.groupsService.groupData = groupData;
      this.groupData = groupData;
      this.memberListToShow = this.groupsService.addFieldsToMember(_.get(groupData, 'members'));
    });
  }

  onActionConfirm(event: any) {
    /* istanbul ignore else */
    if (event.action) {
      switch (event.action) {
        case 'promoteAsAdmin':
          this.promoteMember(event.data);
          break;
        case 'removeFromGroup':
          this.removeMember(event.data);
          break;
        case 'dismissAsAdmin':
          this.dismissRole(event.data);
          break;
      }
    }
  }

  promoteMember(data) {
    this.showLoader = true;
    const memberReq = {
      members: [{
        userId: _.get(data, 'userId'),
        role: GroupMemberRole.ADMIN
      }]
    };
    this.groupsService.updateMembers(this.groupId, memberReq).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.showLoader = false;
      this.getUpdatedGroupData();
      this.toasterService.success(_.replace(this.resourceService.messages.smsg.promoteAsAdmin, '{memberName}', _.get(data, 'name')));
    }, error => {
      this.showLoader = false;
      this.toasterService.error(_.replace(this.resourceService.messages.emsg.promoteAsAdmin, '{memberName}', _.get(data, 'name')));
    });
  }

  removeMember(data) {
    this.showLoader = true;
    this.groupsService.removeMembers(this.groupId, [_.get(data, 'userId')]).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.showLoader = false;
      this.getUpdatedGroupData();
      this.toasterService.success(_.replace(this.resourceService.messages.smsg.removeMember, '{memberName}', _.get(data, 'name')));
    }, error => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.removeMember);
    });
  }

  dismissRole(data) {
    this.showLoader = true;
    const req = {
      members: [{
        userId: _.get(data, 'userId'),
        role: GroupMemberRole.MEMBER
      }]
    };
    this.groupsService.updateMembers(this.groupId, req).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.showLoader = false;
      this.getUpdatedGroupData();
      this.toasterService.success(_.replace(this.resourceService.messages.smsg.dissmissAsAdmin, '{memberName}', _.get(data, 'name')));
    }, error => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.dissmissAsAdmin);
    });
  }

  addTelemetry(id, extra?) {
    this.groupsService.addTelemetry(id, this.activatedRoute.snapshot, [], this.groupId, extra);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
