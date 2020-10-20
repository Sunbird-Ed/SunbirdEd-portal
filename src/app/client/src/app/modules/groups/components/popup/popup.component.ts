import { GroupsService } from './../../services';
import { ResourceService } from '@sunbird/shared';
import { IGroupCard } from './../../interfaces/group';
import { Component, Input, EventEmitter, Output, ViewChild, HostListener } from '@angular/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-modal',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  @Input() modalTitle: string;
  @Input() modalMsg: string;
  @Input() modalName: string;
  @Input() groupData: IGroupCard;
  @Output() handleEvent = new EventEmitter();
  @ViewChild('modal') modal;
  @Input() showTncModal: boolean;
  @Input() showGroupActionsModal: boolean;
  @Output() handleGroupTnc = new EventEmitter();
  channel: string;
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
   this.modal.deny();
  }

  constructor(public resourceService: ResourceService, private groupService: GroupsService) {
    this.groupService.emitMenuVisibility('activate');
    this.channel = _.upperCase(this.resourceService.instance);
  }

  emitEvent(value) {
    const event = this.handleEvent.emit({name: this.modalName, action: value});
    this.modal.close();
  }

  acceptGroupTnc() {
    this.showTncModal = false;
    this.modal.close();
    this.handleGroupTnc.emit();
  }
}
