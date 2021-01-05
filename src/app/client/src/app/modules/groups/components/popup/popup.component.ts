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

  @Input() title: string;
  @Input() msg: string;
  @Input() name: string;

  @Input() type: acceptTnc;

  @Output() handleGroupTnc = new EventEmitter();
  @Output() handleEvent = new EventEmitter();

  @ViewChild('modal', {static: false}) modal;
  @ViewChild('tncModal', {static: false}) tncModal;

  channel: string;
  acceptTncType = acceptTnc;
  checked = false;
  url = document.location.origin;

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
    const event = this.handleEvent.emit({name: this.name, action: value});
    this.modal.deny();
  }

  acceptGroupTnc() {
    this.tncModal.deny();
    this.handleGroupTnc.emit({type: this.type});
  }

  closeModal() {
    this.tncModal.deny();
    this.handleGroupTnc.emit();
  }
}
