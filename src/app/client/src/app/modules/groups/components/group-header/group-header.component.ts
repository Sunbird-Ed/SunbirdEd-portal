import { UserService } from '@sunbird/core';
import { Router } from '@angular/router';
import { Component, ViewChild, Input, EventEmitter, Output, Renderer2, OnInit } from '@angular/core';
import { ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { MY_GROUPS, CREATE_GROUP, GROUP_DETAILS } from '../routerLinks';
import { GroupsService } from '../../services';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent implements OnInit {
  showDeleteModal;
  showPastMemberModal;
  dropdownContent = true;
  @ViewChild('modal') modal;
  @Input() modalName: string;
  @Output() modalClosed = new EventEmitter();
  @Input() groupData: {};
  showModal = false;
  showEditModal: boolean;
  creator: string;
  showMemberPopup = false;
  constructor(private renderer: Renderer2, public resourceService: ResourceService, private router: Router,
    private groupService: GroupsService, private navigationHelperService: NavigationHelperService, private toasterService: ToasterService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1 && e.target['id'] !== 'group-actions') {
        this.dropdownContent = true;
        this.showModal = false;
      }
     });
  }

  ngOnInit () {
    this.creator = this.groupData['isAdmin'] ? 'You' : _.find(this.groupData['members'], {createdBy: this.groupData['createdBy']}).name;
  }

  toggleModal(visibility = false) {
    this.showModal = visibility;
  }

  deleteGroup() {
    this.toggleModal(false);
    setTimeout(() => {
      this.groupService.deleteGroupById(_.get(this.groupData, 'id')).subscribe(data => {
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

  isMemberPopup(visibility: boolean = false) {
    this.showMemberPopup = visibility;
  }
}
