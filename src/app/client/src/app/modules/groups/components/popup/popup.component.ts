import { GroupsService } from './../../services';
import { ResourceService } from '@sunbird/shared';
import { IGroupCard } from './../../interfaces/group';
import { Component, Input, EventEmitter, Output, ViewChild, HostListener } from '@angular/core';

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

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
   this.modal.deny();
  }

  constructor(public resourceService: ResourceService, private groupService: GroupsService) {
    this.groupService.emitMenuVisibility('activate');
  }

  emitEvent(value) {
    const event = this.handleEvent.emit({name: this.modalName, action: value});
    this.modal.close();
  }
}
