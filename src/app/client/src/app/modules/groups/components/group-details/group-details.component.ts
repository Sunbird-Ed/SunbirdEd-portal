import { UserService } from '@sunbird/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../services';
import { IGroupMemberConfig, IGroupCard, ADD_ACTIVITY_TO_GROUP, COURSES, IGroupMember } from '../../interfaces';
import { IImpressionEventInput } from '@sunbird/telemetry';
@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('addActivityModal') addActivityModal;
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
  ) {
    this.groupService = groupService;
  }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.getGroupData();
    this.groupService.closeForm.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getGroupData();
    });
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
  }

  getGroupData() {
    this.isLoader = true;
    this.groupService.getGroupById(this.groupId, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      const user = _.find(_.get(groupData, 'members'), (m) => _.get(m, 'userId') === this.userService.userid);
        if (!user || _.get(groupData, 'status') === 'inactive') {
          this.groupService.goBack();
        }
        this.groupService.groupData = groupData;
        this.groupData = this.groupService.addGroupFields(groupData);
        this.members = this.groupService.addFieldsToMember(this.groupData.members);
        this.isAdmin = this.groupService.isCurrentUserAdmin;
        this.isLoader = false;
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

  handleNextClick(event) {
    this.toggleActivityModal(false);
    this.addActivityModal.deny();
    this.router.navigate([`${ADD_ACTIVITY_TO_GROUP}/${COURSES}`, 1], { relativeTo: this.activatedRoute });
  }


  addTelemetry (id) {
    this.groupService.addTelemetry(id, this.activatedRoute.snapshot, []);
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
