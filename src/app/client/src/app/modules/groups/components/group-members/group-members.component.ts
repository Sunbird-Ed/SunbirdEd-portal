import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ADD_MEMBER, GROUP_DETAILS, MY_GROUPS } from './../routerLinks';

export interface IGroupMemberConfig {
  showMemberCount: boolean;
  showSearchBox: boolean;
  showAddMemberButton: boolean;
  showMemberMenu: boolean;
}

export interface IGroupMember {
  identifier: string;
  initial: string;
  title: string;
  isAdmin: boolean;
  isMenu: boolean;
  indexOfMember: number;
  isCreator: boolean;
}

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {
  @ViewChild('searchInputBox') searchInputBox: ElementRef;
  @Input() config: IGroupMemberConfig = {
    showMemberCount: true,
    showSearchBox: true,
    showAddMemberButton: true,
    showMemberMenu: true
  };
  @Input() members: IGroupMember[] = [
    { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true },
    { identifier: '2', initial: 'P', title: 'Paul Walker', isAdmin: false, isMenu: true, indexOfMember: 5, isCreator: false },
    { identifier: '6', initial: 'R', title: 'Robert Downey', isAdmin: true, isMenu: true, indexOfMember: 7, isCreator: true }
  ];
  showMenu = false;
  showModal = false;
  showSearchResults = false;
  memberListToShow = [];
  memberAction: string;
  searchQuery = '';
  selectedMember = {};
  private unsubscribe$ = new Subject<void>();
  groupId;
  memberCardConfig = { size: 'small', isBold: false, isSelectable: false, view: 'horizontal' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.memberListToShow = _.cloneDeep(this.members);
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');

    /* istanbul ignore else */
    if (!this.config.showMemberMenu) {
      this.memberListToShow.forEach(item => item.isMenu = false);
    }

    fromEvent(document, 'click')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(item => {
        if (this.showMenu) {
          this.showMenu = false;
        }
      });
  }

  getMenuData(event, member) {
    this.showMenu = !this.showMenu;
    this.selectedMember = member;
    event.event.stopImmediatePropagation();
  }

  search(searchKey: string) {
    if (searchKey.trim().length > 2) {
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
