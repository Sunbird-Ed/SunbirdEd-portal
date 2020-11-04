import { UserService } from '@sunbird/core';
import { IGroupSearchRequest, IGroupCard, GROUP_DETAILS, MY_GROUPS, CREATE_GROUP } from './../../interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupsService } from '../../services';
import { ResourceService, LayoutService } from '@sunbird/shared';
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
  groupsList: IGroupCard[] = [];
  public showModal = false;
  private unsubscribe$ = new Subject<void>();
  telemetryImpression: IImpressionEventInput;
  isLoader = true;
  layoutConfiguration;
  constructor(public groupService: GroupsService,
    public router: Router,
    public resourceService: ResourceService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService
    ) { }

  ngOnInit() {
    this.initLayout();
    this.showModal = !localStorage.getItem('login_ftu_groups');
    this.getMyGroupList();
    this.groupService.closeForm.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getMyGroupList();
    });
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
    pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
    if (layoutConfig != null) {
      this.layoutConfiguration = layoutConfig.layout;
    }
   });
  }


  getMyGroupList() {
    this.isLoader = true;
    this.groupsList = [];
    const request: IGroupSearchRequest = {filters: {userId: this.userService.userid}};
    this.groupService.searchUserGroups(request).pipe(takeUntil(this.unsubscribe$)).subscribe(groups => {
      this.groupService.groupListCount = groups.length;
      this.isLoader = false;
      groups = this.groupService.addGroupPaletteList(groups || []);
      _.forEach(groups, (group) => {
        if (group) {
          group = this.groupService.addGroupFields(group);
          this.groupsList.push(group);
        }
      });
    }, (err) => {
      this.isLoader = false;
      this.groupsList = [];
    });
  }

  public showCreateFormModal() {
    this.router.navigate([`${MY_GROUPS}/${CREATE_GROUP}`]);
  }

  public navigateToDetailPage(event) {
    this.addTelemetry('group-card', _.get(event, 'data.id'));
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(event, 'data.id')]);
  }

  showFtuPopup() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
    localStorage.setItem('login_ftu_groups', 'login_user');
  }

  addTelemetry (id, groupId?) {
    this.groupService.addTelemetry(id, this.activatedRoute.snapshot, [], groupId);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
