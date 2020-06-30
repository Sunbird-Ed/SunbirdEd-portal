import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { GroupsService } from '../../services';
import { Subject } from 'rxjs';
import { IGroupMember } from '../../interfaces';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  groupData;
  showModal = false;
  private groupId: string;
  public unsubscribe$ = new Subject<void>();
  showActivityList = false;
  HideAddActivity = true;
  showFilters = false;
  members: IGroupMember[] = [
    { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true }
  ];

  constructor(private activatedRoute: ActivatedRoute, private groupsService: GroupsService,
    public resourceService: ResourceService, private toasterService: ToasterService,
    private navigationHelperService: NavigationHelperService) {
    this.groupsService = groupsService;
  }
  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    // this.groupsService.membersData.subscribe(response => {
    //   this.members = response;
    // });

    // if (!this.members) {
      this.getGroupData();
    // }
  }

  getGroupData() {
    this.groupsService.getGroupById(this.groupId).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      console.log('resposnsnee', groupData);
      this.groupData = groupData;
      this.members = _.get(groupData, 'members');
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m002);
      this.navigationHelperService.goBack();
    });
  }

  toggleActivityModal(visibility = false) {
    this.showModal = visibility;
  }

  ActivitiesList() {
    this.showActivityList = true;
    this.toggleActivityModal(false);
    this.HideAddActivity = false;
  }
  filterList() {
    this.showFilters = true;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
