import { GroupsService } from './../../services';
import { ResourceService } from '@sunbird/shared';
import { acceptTnc, IGroupCard } from './../../interfaces/group';
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
  @Input() latestTnc;
  @Input() type: acceptTnc;
  @Input() showTncModal: boolean;
  @Input() showGroupActionsModal: boolean;

  @Output() handleGroupTnc = new EventEmitter();
  @Output() handleEvent = new EventEmitter();

  @ViewChild('modal') modal;
  @ViewChild('tncModal') tncModal;

  channel: string;
  acceptTncType = acceptTnc;
  checked = false;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.modal) {
      this.modal.deny();
    } else if (this.tncModal) {
      this.tncModal.deny();
    }
  }

  constructor(public resourceService: ResourceService, private groupService: GroupsService) {
    this.groupService.emitMenuVisibility('activate');
    this.channel = _.upperCase(this.resourceService.instance);
  }

  emitEvent(value) {
    const event = this.handleEvent.emit({name: this.modalName, action: value});
    this.modal.deny();
  }

  acceptGroupTnc() {
    this.showTncModal = false;
    this.closeModal();
    this.handleGroupTnc.emit({type: this.type, data: this.groupData});
  }

  closeModal() {
    this.tncModal.deny();
    this.handleGroupTnc.emit();
  }
}
