import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../services';
import { IGroupMemberConfig, IGroupCard, ADD_ACTIVITY_TO_GROUP, COURSES, IGroupMember  } from '../../interfaces';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
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
  members: IGroupMember [] = [];

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
    private telemetryService: TelemetryService,
    private navigationhelperService: NavigationHelperService,
  ) {
    this.groupService = groupService;
  }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.getGroupData();
    this.groupService.closeForm.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getGroupData();
    });
    this.setTelemetryImpression();
  }

  setTelemetryImpression () {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.router.url,
        duration: this.navigationhelperService.getPageLoadTime()
      },
      object: {
        id: _.get(this.activatedRoute, 'snapshot.params.groupId'),
        type: 'Group',
        ver: '1.0',
      }
    };
  }


  getGroupData() {
    this.groupService.getGroupById(this.groupId, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe(groupData => {
      this.groupService.groupData = groupData;
      this.groupData = groupData;
      this.members = this.groupService.addFieldsToMember(this.groupData.members);
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
