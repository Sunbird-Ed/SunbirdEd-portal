import { ResourceService } from '@sunbird/shared';
import { IGroupCard } from './../../interfaces/group';
import { Component, Input, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';

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

  constructor(public resourceService: ResourceService) {}

  emitEvent(name?) {
    if (name) {
      this.handleEvent.emit(name);
      this.modal.close();
    } else {
      this.modal.close();
      this.handleEvent.emit();
    }
  }
}
