import { GroupEntityStatus } from '@project-sunbird/client-services/models/group';
import { actions } from './../../interfaces/group';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, ViewChild, Input, Renderer2, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { MY_GROUPS, GROUP_DETAILS, IGroupCard, EDIT_GROUP } from './../../interfaces';
import { GroupsService } from '../../services';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@sunbird/core';
@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent implements OnInit, OnDestroy {
  dropdownContent = true;
  @ViewChild('modal') modal;
  @Input() groupData: IGroupCard;
  @Output() handleFtuModal = new EventEmitter();
  showModal = false;
  showEditModal: boolean;
  creator: string;
  showLeaveGroupModal = false;
  showLoader = false;
  public title: string;
  public msg: string;
  public name: string;
  private unsubscribe$ = new Subject<void>();

  constructor(private renderer: Renderer2, public resourceService: ResourceService, private router: Router,
    private groupService: GroupsService, private navigationHelperService: NavigationHelperService, private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1 && e.target['id'] !== 'group-actions') {
        this.dropdownContent = true;
      }
    });
  }

  ngOnInit () {
    this.creator = _.capitalize(_.get(_.find(this.groupData['members'], {userId: this.groupData['createdBy']}), 'name'));
    this.groupService.showMenu.subscribe(data => {
      this.dropdownContent = data !== 'group';
    });
    this.groupService.showActivateModal.subscribe((data: {name: string, eventName: string}) => {
      this.toggleModal(true, data.name, data.eventName);
    });

    this.groupService.updateEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((status: GroupEntityStatus) => {
      this.groupData.active = this.groupService.updateGroupStatus(this.groupData, status);
    });
  }

  navigateToPreviousPage() {
    setTimeout(() => {
      this.showLoader = false;
      this.goBack();
    }, 1500);
  }

  editGroup() {
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(this.groupData, 'id'), EDIT_GROUP]);
  }

  goBack() {
    this.navigationHelperService.goBack();
  }

  dropdownMenu() {
    this.dropdownContent = !this.dropdownContent;
  }

  toggleFtuModal(visibility: boolean = false) {
    this.handleFtuModal.emit(visibility);
  }

  addTelemetry(id, extra?) {
    this.groupService.addTelemetry({id, extra}, this.activatedRoute.snapshot, [], _.get(this.groupData, 'id'));
  }

  toggleModal(visibility = false, name?: string, eventName?: string) {
    this.showModal = visibility;
    this.groupService.emitMenuVisibility('group');
    this.name = name;
    switch (name) {
      case actions.DELETE:
        this.addTelemetry('delete-group', {status: _.get(this.groupData, 'status')});
        this.assignModalStrings(this.resourceService.frmelmnts.lbl.deleteGroup, this.resourceService.messages.imsg.m0082, '{groupName}');
        break;
      case actions.DEACTIVATE:
        this.addTelemetry('deactivate-group', {status: _.get(this.groupData, 'status')});
        this.assignModalStrings(this.resourceService.frmelmnts.lbl.deactivategrpques, this.resourceService.frmelmnts.msg.deactivategrpmsg);
        break;
      case actions.ACTIVATE:
        this.addTelemetry((eventName ? eventName : 'activate-group-menu'), {status: _.get(this.groupData, 'status')});
        this.assignModalStrings(this.resourceService.frmelmnts.lbl.activategrpques, this.resourceService.frmelmnts.msg.activategrppopup);
        break;
    }
  }


  assignModalStrings(title, msg, replaceStr?) {
    this.title = title;
    this.msg = replaceStr ? msg.replace(replaceStr, this.groupData.name) : msg;
  }

  handleEvent(event: {name: string, action?: boolean}) {
    this.showModal = false;
    this.showLoader = event.action;
    if (!event.action) {
      this.addTelemetry(`cancel-${event.name}-group`, {status: _.get(this.groupData, 'status')})
      return;
    }
    switch (event.name) {
      case actions.DELETE:
        this.deleteGroup();
        break;
      case actions.DEACTIVATE:
        this.deActivateGroup();
        break;
      case actions.ACTIVATE:
        this.activateGroup();
        break;
    }
  }

  leaveGroup() {
    this.showLoader = true;
    /* istanbul ignore else */
    if (!this.groupService.isCurrentUserCreator) {
      this.groupService.removeMembers(this.groupData.id, [this.userService.userid])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(resp => {
          this.showLoader = false;
          this.toasterService.success(this.resourceService.messages.smsg.leaveGroup);
          this.goBack();
        }, error => {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.emsg.leaveGroup);
        });
    }
    // TODO: leave group API integration and add telemetry
  }

  deleteGroup() {
      this.groupService.deleteGroupById(_.get(this.groupData, 'id')).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        this.addTelemetry('confirm-delete-group', {status: 'inactive', prevstatus: _.get(this.groupData, 'status')});
        this.toasterService.success(this.resourceService.messages.smsg.m002);
        this.navigateToPreviousPage();
      }, err => {
        this.addTelemetry('confirm-delete-group', {status: _.get(this.groupData, 'status')});
        this.toasterService.error(this.resourceService.messages.emsg.m003);
        this.navigateToPreviousPage();
      });
  }

  deActivateGroup() {
    this.groupService.deActivateGroupById(_.get(this.groupData, 'id')).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.addTelemetry('confirm-deactivate-group', {status: 'suspended', prevstatus: _.get(this.groupData, 'status')});
      this.toasterService.success(this.resourceService.frmelmnts.msg.deactivategrpsuccess);
      this.showLoader = false;
      this.groupData.active = this.groupService.updateGroupStatus(this.groupData, GroupEntityStatus.SUSPENDED);
      this.groupService.emitUpdateEvent(GroupEntityStatus.SUSPENDED);
    }, err => {
      this.addTelemetry('confirm-deactivate-group', {status: _.get(this.groupData, 'status')});
      this.showLoader = false;
      this.toasterService.error(this.resourceService.frmelmnts.msg.deactivategrpfailed);
    });
  }

  activateGroup() {
    this.groupService.activateGroupById(_.get(this.groupData, 'id')).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.addTelemetry('confirm-activate-group', {status: 'active', prevstatus: _.get(this.groupData, 'status')});
      this.toasterService.success(this.resourceService.frmelmnts.msg.activategrpsuccess);
      this.showLoader = false;
      this.groupData.active = this.groupService.updateGroupStatus(this.groupData, GroupEntityStatus.ACTIVE);
      this.groupService.emitUpdateEvent(GroupEntityStatus.ACTIVE);
    }, err => {
      this.addTelemetry('confirm-activate-group', {status: _.get(this.groupData, 'status')});
      this.showLoader = false;
      this.toasterService.error(this.resourceService.frmelmnts.msg.activategrpfailed);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
