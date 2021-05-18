import { GroupEntityStatus, CsGroup } from '@project-sunbird/client-services/models/group';
import { UserService } from '@sunbird/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, LayoutService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../services';
import { IGroupMemberConfig, IGroupCard, IGroupMember, ADD_ACTIVITY_CONTENT_TYPES } from '../../interfaces';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { ADD_ACTIVITY, PAGE_LOADED} from '../../interfaces/telemetryConstants';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('addActivityModal', {static: false}) addActivityModal;
  groupData: IGroupCard;
  showModal = false;
  private groupId: string;
  public unsubscribe$ = new Subject<void>();
  showActivityList = false;
  showFilters = false;
  telemetryImpression: IImpressionEventInput;
  members: IGroupMember[] = [];
  isLoader = true;
  isAdmin = false;
  layoutConfiguration: any;
  activityList;
  showMemberPopup = false;
  public ADD_ACTIVITY = ADD_ACTIVITY;

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
    private userService: UserService,
    public layoutService: LayoutService
  ) {
    this.groupService = groupService;
  }

  ngOnInit() {
    this.initLayout();
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.getGroupData();
    this.groupService.closeForm.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getGroupData();
    });

    this.groupService.updateEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((status: GroupEntityStatus) => {
      this.groupData.active = this.groupService.updateGroupStatus(this.groupData, status);
    });
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url, {type: PAGE_LOADED});
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

  getGroupData() {
    this.isLoader = true;
    this.groupService.getGroupById(this.groupId, true, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe((groupData: CsGroup) => {
      const user = _.find(_.get(groupData, 'members'), (m) => _.get(m, 'userId') === this.userService.userid);
        if (!user || _.get(groupData, 'status') === 'inactive') {
          this.groupService.goBack();
        }
        this.groupService.groupData = groupData;
        this.groupData = this.groupService.addGroupFields(groupData);
        this.members = this.groupService.addFieldsToMember(this.groupData.members);
        this.isAdmin = this.groupService.isCurrentUserAdmin;
        this.isLoader = false;
        const response = this.groupService.groupContentsByActivityType(false, groupData);
        this.showActivityList = response.showList;
        this.activityList = response.activities;
    }, err => {
      this.isLoader = false;
      this.groupService.goBack();
      this.toasterService.error(this.resourceService.messages.emsg.m002);
    });
  }

  toggleActivityModal(visibility = false) {
    this.showModal = visibility;
  }

  filterList() {
    this.showFilters = true;
  }

  navigateToAddActivity() {
   this.router.navigate([`${ADD_ACTIVITY_CONTENT_TYPES}`], {
     relativeTo: this.activatedRoute,
     queryParams: {
       groupName: _.get(this.groupData, 'name'),
       createdBy: _.capitalize(_.get(_.find(this.groupData['members'], {userId: this.groupData['createdBy']}), 'name'))
     }
    });
  }

 /**
   * @description - To set the telemetry Intract event data
   * @param  {} edata? - it's an object to specify the type and subtype of edata
   */
  addTelemetry (id, extra?, edata?) {
    this.groupService.addTelemetry({id, extra, edata}, this.activatedRoute.snapshot, [], this.groupId);
  }

  toggleFtuModal(visibility: boolean = false) {
    this.showMemberPopup = visibility;
  }

  handleEvent() {
    this.groupService.emitActivateEvent('activate', 'activate-group' );
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
