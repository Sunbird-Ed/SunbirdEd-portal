import { UserService, TncService } from '@sunbird/core';
import { IGroupCard, GROUP_DETAILS, MY_GROUPS, CREATE_GROUP, acceptTnc } from './../../interfaces';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { GroupsService } from '../../services';
import { ResourceService, LayoutService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { CsGroupSearchCriteria } from '@project-fmps/client-services/services/group/interface';
import { SELECT_CREATE_GROUP, PAGE_LOADED, SELECT_GROUP } from '../../interfaces/telemetryConstants';
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
  showTncModal = false;
  selectedType: acceptTnc = acceptTnc.ALL;
  selectedGroup: {};
  isTncAccepted = true;
  isContentLoaded = new EventEmitter();
  public SELECT_CREATE_GROUP = SELECT_CREATE_GROUP;

  constructor(public groupService: GroupsService,
    public router: Router,
    public resourceService: ResourceService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private toasterService: ToasterService,
    private tncService: TncService,
    private navigationhelperService: NavigationHelperService,
    ) { }

  ngOnInit() {
    this.showModal = !localStorage.getItem('login_ftu_groups');
    this.initLayout();
    this.getLatestTnc();
    this.getMyGroupList();
    this.setTelemetryImpression({type: PAGE_LOADED});
    this.groupService.closeForm.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getMyGroupList();
    });
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
    const request: CsGroupSearchCriteria = {filters: {userId: this.userService.userid}};
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
      this.checkUserAcceptedTnc();
    }, (err) => {
      this.isLoader = false;
      this.groupsList = [];
    });
  }

  checkUserAcceptedTnc() {
    const accepted = this.groupService.isUserAcceptedTnc();
    if (accepted) {
      this.isTncUpdatedAfterAcceptance(accepted);
    } else {
      this.showTncModal = this.groupsList.length > 0;
    }
  }

  getLatestTnc() {
    this.tncService.getGroupsTnc().subscribe(data => {
      this.groupService.groupsTncDetails = _.get(data, 'result.response');
    });
  }

  /**
   * @param  {boolean} accepted
   * @description - It will check if the tnc is updated which was previously accepted
   */
  isTncUpdatedAfterAcceptance(accepted: boolean) {
    if (accepted) {
      this.showTncModal =  this.groupService.isTncUpdated() ? this.groupsList.length > 0 : false;
    }
  }

  public showCreateFormModal() {
    this.router.navigate([`${MY_GROUPS}/${CREATE_GROUP}`]);
  }

  public navigateToDetailPage(event) {

    (_.get(event, 'data.status') === 'suspended') ?
    this.addTelemetry('suspended-group-card', _.get(event, 'data.id')) :
    this.addTelemetryWithData('group-card', { type: SELECT_GROUP}, _.get(event, 'data.id'));

    this.selectedType = acceptTnc.GROUP;
    this.selectedGroup = event.data;
    this.showTncModal = _.get(event, 'data.visited') === false;

    if (!this.showTncModal) {
      this.navigate(event);
    }
  }

  navigate(event) {
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(event, 'data.id')]);
  }

  showFtuPopup() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
    localStorage.setItem('login_ftu_groups', 'login_user');
  }

  addTelemetry (id, groupId?, extra?) {
    const selectedGroup = _.find(this.groupsList, {id: groupId});
    const obj = selectedGroup ? {id: groupId, type: 'group', ver: '1.0'} : {};
    const extras = extra ? extra : {status: _.get(selectedGroup, 'status')};
    this.groupService.addTelemetry({id, extra: extras}, this.activatedRoute.snapshot, [], groupId, obj);
  }

   /**
   * @description - To set the telemetry Intract event data
   * @param  {} edata? - it's an object to specify the type and subtype of edata
   */
  addTelemetryWithData (id, edata, groupId?, extra?) {
    const selectedGroup = _.find(this.groupsList, {id: groupId});
    const obj = selectedGroup ? {id: groupId, type: 'group', ver: '1.0'} : {};
    const extras = extra ? extra : {status: _.get(selectedGroup, 'status')};
    this.groupService.addTelemetry({id, extra: extras, edata: edata}, this.activatedRoute.snapshot, [], groupId, obj);
  }

  setTelemetryImpression(edata?) {
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url, edata);
  }

  handleGroupTnc(event?: {type: string}) {
    if (event) {
      switch (event.type) {
        case acceptTnc.ALL:
          this.addTelemetry('accept-all-group-tnc', _.get(this.selectedGroup, 'id'));
          this.acceptAllGroupsTnc();
          break;
        case acceptTnc.GROUP:
          this.addTelemetry('accept-group-tnc',  _.get(this.selectedGroup, 'id'));
          this.acceptGroupTnc();
          break;
      }
    } else {
      this.showTncModal = false;
    }
  }

  acceptGroupTnc() {
    const request = {
      userId: this.userService.userid,
      groups: [{
        groupId: _.get(this.selectedGroup, 'id'),
        visited: true
      }]
    };

    this.groupService.updateGroupGuidelines(request)
    .subscribe(data => {
      this.showTncModal = false;
      this.addTelemetry('success-accept-group-tnc', _.get(this.selectedGroup, 'id'),
      { status: _.get(this.selectedGroup, 'status'), tncver: _.get(this.groupService.latestTnc, 'value.latestVersion')}
      );
      this.navigate({data: this.selectedGroup});
    }, err => {
      this.showTncModal = false;
    });
  }

  acceptAllGroupsTnc() {
    const groupIds = _.map(this.groupsList, group => {
      group.visited = true;
      return {
        groupId: group.id,
        visited: true
      };
    });

    const groupUpdateRequest = {
      userId: this.userService.userid,
      groups: groupIds
    };

    const userProfileUpdateRequest = {
      request: {
        tncType: _.get(this.groupService.latestTnc, 'field'),
        version:  _.get(this.groupService.latestTnc, 'value.latestVersion')
      }
    };

    if (!_.isEmpty(_.get(this.userService.userProfile, 'managedBy'))) {
      userProfileUpdateRequest.request['userId'] = this.userService.userid;
    }

    this.userService.acceptTermsAndConditions(userProfileUpdateRequest).pipe(
      takeUntil(this.unsubscribe$),
      map((data) => {
        return this.groupService.updateGroupGuidelines(groupUpdateRequest);
      }),
    ).subscribe((result) => {
      this.addTelemetry('success-accept-all-group-tnc', _.get(this.selectedGroup, 'id'),
      { status: _.get(this.selectedGroup, 'status'), tncver: _.get(this.groupService.latestTnc, 'value.latestVersion') }
      );
      this.toasterService.success(this.resourceService.frmelmnts.msg.guidelinesacceptsuccess);
      this.showTncModal = false;
      this.isTncAccepted = true;
      if (this.groupsList.length > 0) {
        this.reload();
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.frmelmnts.msg.guidelinesacceptfailed);
      this.showTncModal = true;
      this.isTncAccepted = false;
    });
  }

  reload() {
    this.userService.getUserData(this.userService.userid).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.groupService.userData = _.get(data, 'result.response');
      this.getMyGroupList();
    });
  }

  goBack() {
    this.navigationhelperService.goBack();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
