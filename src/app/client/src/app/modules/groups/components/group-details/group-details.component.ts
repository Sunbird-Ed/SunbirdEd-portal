import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../services';

import { ADD_ACTIVITY_TO_GROUP, MY_GROUPS, COURSES } from '../routerLinks';
import { IGroupMemberConfig } from '../../interfaces';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('addActivityModal') addActivityModal;
  groupData;
  showModal = false;
  private groupId: string;
  public unsubscribe$ = new Subject<void>();
  showActivityList = false;
  showFilters = false;

  config: IGroupMemberConfig = {
    showMemberCount: true,
    showSearchBox: true,
    showAddMemberButton: true,
    showMemberMenu: true
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private toasterService: ToasterService,
    private router: Router,
    public resourceService: ResourceService,
  ) {
    this.groupService = groupService;
  }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.getGroupData();
  }

  getGroupData() {
    this.groupService.getGroupById(this.groupId, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      this.groupService.groupData = groupData;
      this.groupData = groupData;
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m002);
    });
  }

  toggleActivityModal(visibility = false) {
    this.showModal = visibility;
  }

  filterList() {
    this.showFilters = true;
  }

  handleNextClick(event) {
    this.toggleActivityModal(false);
    this.addActivityModal.deny();
    this.router.navigate([`${ADD_ACTIVITY_TO_GROUP}/${COURSES}`, 1], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    /* istanbul ignore else */
    if (this.showModal && this.addActivityModal.deny) {
      this.addActivityModal.deny();
    }
  }
}
