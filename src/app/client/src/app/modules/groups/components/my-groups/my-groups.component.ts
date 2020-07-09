import { UserService } from '@sunbird/core';
import { IGroupSearchRequest, IGroupCard, GROUP_DETAILS, MY_GROUPS, CREATE_GROUP } from './../../interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupsService } from '../../services';
import { ResourceService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit, OnDestroy {
  showGroupCreateForm = false;
  public groupList: {adminGroups: IGroupCard[], memberGroups: IGroupCard[]} = {adminGroups: [], memberGroups: []};
  public showModal = false;
  private unsubscribe$ = new Subject<void>();
  telemetryImpression: IImpressionEventInput;

  constructor(public groupService: GroupsService,
    public router: Router,
    public resourceService: ResourceService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.showModal = !localStorage.getItem('login_ftu_groups');
    this.getMyGroupList();
    this.groupService.closeForm.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getMyGroupList();
    });
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
  }


  getMyGroupList() {
    this.groupList = {adminGroups: [], memberGroups: []};
    const request: IGroupSearchRequest = {filters: {userId: this.userService.userid}};
    this.groupService.searchUserGroups(request).pipe(takeUntil(this.unsubscribe$)).subscribe(groups => {
      _.forEach(groups, (group) => {
        if (group) {
          group.isCreator = group['createdBy'] === this.userService.userid;
          group.isAdmin = group.isCreator ? true : _.get(group, 'memberRole') === 'admin';
          group.initial = group.name[0];
          group.isAdmin ? this.groupList.adminGroups.push(group) : this.groupList.memberGroups.push(group);
        }
      });
      _.orderBy(this.groupList.adminGroups, 'createdOn');
      _.orderBy(this.groupList.memberGroups, 'createdOn');
    }, (err) => {
      this.groupList = {adminGroups: [], memberGroups: []};
    });
  }

  public showCreateFormModal() {
    this.router.navigate([`${MY_GROUPS}/${CREATE_GROUP}`]);
  }

  public navigateToDetailPage(event) {
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(event, 'data.id')]);
  }

  showFtuPopup() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
    localStorage.setItem('login_ftu_groups', 'login_user');
  }

  addTelemetry (id) {
    this.groupService.addTelemetry(id, this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
