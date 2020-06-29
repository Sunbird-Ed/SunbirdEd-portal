import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output, Renderer2 } from '@angular/core';
import { ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { MY_GROUPS, CREATE_EDIT_GROUP } from '../routerLinks';
import { GroupsService } from '../../services';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent {
  showDeleteModal;
  showPastMemberModal;
  dropdownContent = true;
  @ViewChild('modal') modal;
  @Input() modalName: string;
  @Output() modalClosed = new EventEmitter();
  @Input() pastMembersList;
  @Input() groupData: string;
  showModal = false;
  showEditModal: boolean;
  constructor(private renderer: Renderer2, public resourceService: ResourceService, private router: Router,
    private groupService: GroupsService, private navigationHelperService: NavigationHelperService, private toasterService: ToasterService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1 && e.target['id'] !== 'group-actions') {
        this.dropdownContent = true;
        this.showModal = false;
      }
     });
  }

  isShowModal() {
    this.showModal = !this.showModal;
  }

  deleteGroup() {
    this.isShowModal();
    setTimeout(() => {
      this.groupService.deleteGroupById(_.get(this.groupData, 'identifier')).subscribe(data => {
        this.toasterService.success(this.resourceService.messages.smsg.m002);
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m003);
      });
      this.goBack();
    });
  }

  editGroup() {
    this.router.navigate([`${MY_GROUPS}/${CREATE_EDIT_GROUP}`]);
  }

  goBack() {
    this.navigationHelperService.goBack();
  }

  dropdownMenu() {
    this.dropdownContent = !this.dropdownContent;
  }
}
