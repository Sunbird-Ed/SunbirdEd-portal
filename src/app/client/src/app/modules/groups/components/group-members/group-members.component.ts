import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ADD_MEMBER, GROUP_DETAILS, MY_GROUPS } from './../routerLinks';
import { IGroupMember, IGroupMemberConfig } from '../../interfaces';
import { GroupsService } from '../../services';



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
  @Input() members: IGroupMember[] = [];
  showMenu = false;
  showModal = false;
  showSearchResults = false;
  @Input() memberListToShow = [];
  memberAction: string;
  searchQuery = '';
  selectedMember = {};
  private unsubscribe$ = new Subject<void>();
  groupId;
  memberCardConfig = { size: 'small', isBold: false, isSelectable: false, view: 'horizontal' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    private cdr: ChangeDetectorRef,
    private groupsService: GroupsService
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
      this.groupsService.membersData.subscribe(response => {
        this.memberListToShow = response;
      });
  }

  getMenuData(event) {
    this.showMenu = !this.showMenu;
    this.selectedMember = event.data;
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
