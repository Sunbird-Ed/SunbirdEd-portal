import { Router } from '@angular/router';
import { Component, ViewChild, Input, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { MY_GROUPS, CREATE_GROUP, GROUP_DETAILS, IGroupCard } from './../../interfaces';
import { GroupsService } from '../../services';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent implements OnInit, OnDestroy {
  dropdownContent = true;
  @ViewChild('modal') modal;
  @Input() groupData: IGroupCard;
  showModal = false;
  showEditModal: boolean;
  creator: string;
  showMemberPopup = false;
  showLeaveGroupModal = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private renderer: Renderer2, public resourceService: ResourceService, private router: Router,
    private groupService: GroupsService, private navigationHelperService: NavigationHelperService, private toasterService: ToasterService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1 && e.target['id'] !== 'group-actions') {
        this.dropdownContent = true;
        this.showModal = false;
      }
    });
  }

  ngOnInit() {
    this.creator = this.groupData['isAdmin'] ? this.resourceService.frmelmnts.lbl.you :
      _.find(this.groupData['members'], { createdBy: this.groupData['createdBy'] }).name;
  }

  toggleModal(visibility = false) {
    this.showModal = visibility;
  }

  deleteGroup() {
    this.toggleModal(false);
    setTimeout(() => {
      this.groupService.deleteGroupById(_.get(this.groupData, 'id')).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        this.toasterService.success(this.resourceService.messages.smsg.m002);
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m003);
      });
      this.goBack();
    });
  }

  editGroup() {
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, _.get(this.groupData, 'id'), CREATE_GROUP]);
  }

  goBack() {
    this.navigationHelperService.goBack();
  }
  dropdownMenu() {
    this.dropdownContent = !this.dropdownContent;
  }

  toggleFtuModal(visibility: boolean = false) {
    this.showMemberPopup = visibility;
  }

  leaveGroup() {
    // TODO: leave group API integration and add telemetry
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
