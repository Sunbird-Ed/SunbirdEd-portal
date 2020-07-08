import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IGroupMemberConfig, IGroupMember, ADD_MEMBER, GROUP_DETAILS, MY_GROUPS } from '../../interfaces';
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
  showKebabMenu = false;
  showModal = false;
  showSearchResults = false;
  memberListToShow: IGroupMember[] = [];
  memberAction: string;
  searchQuery = '';
  selectedMember: IGroupMember;
  private unsubscribe$ = new Subject<void>();
  groupId;
  memberCardConfig = { size: 'small', isBold: false, isSelectable: false, view: 'horizontal' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    private groupsService: GroupsService
  ) { }

  ngOnInit() {

    const groupData = this.groupsService.groupData;
    this.members = this.groupsService.addFieldsToMember(groupData.members);
    this.memberListToShow = this.members;
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');

    this.memberListToShow.forEach(item => item.isMenu =
      ((groupData.createdBy === item.userId) ? false : this.config.showMemberMenu));

    fromEvent(document, 'click')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(item => {
        if (this.showKebabMenu) {
          this.showKebabMenu = false;
        }
      });

      this.groupsService.membersList.subscribe(members => {
        this.memberListToShow = members;
      });
  }

  getMenuData(event, member) {
    this.showKebabMenu = !this.showKebabMenu;
    this.selectedMember = member;
    event.event.stopImmediatePropagation();
  }

  search(searchKey: string) {
    if (searchKey.trim().length) {
      this.showSearchResults = true;
      this.memberListToShow = this.members.filter(item => _.toLower(item.title).includes(searchKey));
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
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, this.groupId, ADD_MEMBER]);
  }

  onModalClose() {
    this.showModal = false;
    // Handle Telemetry
  }

  onActionConfirm() {
    // Perform member action
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
